import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

function recallTimestamps(text) {
    return [...String(text || '').matchAll(/\b(\d{4})[-/](\d{1,2})[-/](\d{1,2})(?:[ T]+(\d{1,2}):(\d{2}))?/g)]
        .flatMap(([, y, mo, d, h, mi]) => {
            const fields = [y, mo, d, h ?? 0, mi ?? 0].map(Number);
            const [year, month, day, hour, minute] = fields;
            const date = new Date(Date.UTC(year, month - 1, day, hour, minute));
            if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day || hour > 23 || minute > 59) return [];
            return [{ minutes: date.getTime() / 60000, timed: h !== undefined }];
        });
}

function recallRangeEnd(text) {
    const dates = recallTimestamps(text);
    if (dates.length > 1) return dates.at(-1);
    const start = dates[0];
    if (!start) return undefined;
    const clocks = [...String(text).matchAll(/\b(\d{1,2}):(\d{2})\b/g)];
    if (clocks.length < 2) return start;
    const [, h, m] = clocks.at(-1);
    if (Number(h) > 23 || Number(m) > 59) return undefined;
    const end = Math.floor(start.minutes / 1440) * 1440 + Number(h) * 60 + Number(m);
    return { minutes: end + (end < start.minutes ? 1440 : 0), timed: true };
}

function directRecallCandidates(indexText, tableData) {
    const chronicle = Object.values(tableData || {}).find(sheet => ['纪要表', '总结表'].includes(sheet?.name));
    const [header, ...rows] = Array.isArray(chronicle?.content) ? chronicle.content : [];
    const columns = Array.isArray(header) ? header : [];
    const idColumn = columns.indexOf('编码索引');
    const timeColumn = columns.indexOf('时间跨度');
    const times = new Map(rows.filter(Array.isArray).map(row => [String(row[idColumn] || '').trim(), row[timeColumn]]));
    const text = String(indexText || '');
    if (/^\s*\|\s*编码索引\s*\|\s*时间跨度\s*\|\s*概(?:览|要)\s*\|/m.test(text)) {
        return [...text.matchAll(/^\s*\|\s*(AM\d+)\s*\|([^|\r\n]*)\|/gm)].map(([, id, time]) => [id, time || times.get(id)]);
    }
    if (text.startsWith('## 表格: 纪要索引\nColumns: 概要, 编码索引\n')) {
        return [...text.matchAll(/^- \[\d+\] [^\r\n]* \| 编码索引: (AM\d+)\s*$/gm)].map(([, id]) => [id, times.get(id)]);
    }
    return !text.trim() && idColumn >= 0 && rows.length === 0 ? [] : null;
}

function describeRecallTime(current, event) {
    if (!current?.timed || !event?.timed || current.minutes < event.minutes) return ['unknown', '记不清时间'];
    const delta = current.minutes - event.minutes;
    const sameDay = Math.floor(current.minutes / 1440) === Math.floor(event.minutes / 1440);
    const display = `${Math.floor(delta / 60) % 24}h${delta % 60}m`;
    if (sameDay) return delta <= 120 ? ['now', `${delta}m`] : ['today', display];
    const group = [[7200, 'days'], [30240, 'weeks'], [86400, 'months'], [259200, 'seasons'], [2628000, 'years']]
        .find(([max]) => delta <= max)?.[1] ?? 'old';
    return [group, `${Math.floor(delta / 1440)}d${display}`];
}

export function makeDirectRecall({ enabled, task, limit, indexText, tableData, userMessage, lastPlotContent }) {
    const max = Number(limit);
    if (!enabled || !Number.isSafeInteger(max) || max < 1) return null;
    const tags = [task.extractTags, task.extractInjectTags].join(',').toLowerCase().split(',').map(tag => tag.trim()).filter(Boolean);
    const isTimeRecall = tags.length > 0 && tags.every(tag => tag === 'recall') && task.promptGroup?.some(segment => {
        const content = segment?.content;
        return typeof content === 'string' && content.includes('{zhaohui}') && content.includes('<recall>') && content.includes('diff_min');
    });
    if (!isTimeRecall) return null;
    const candidates = directRecallCandidates(indexText, tableData);
    if (candidates === null) return null;
    const rows = new Map(candidates);
    if (rows.size > max) return null;

    const events = [...rows].map(([id, time]) => [id, recallRangeEnd(time)]);
    const clock = recallTimestamps(userMessage).find(x => x.timed)
        ?? recallTimestamps(lastPlotContent).filter(x => x.timed).at(-1)
        ?? events.reduce((latest, [, event]) => event?.timed && (!latest || event.minutes > latest.minutes) ? event : latest, undefined);
    const groups = new Map();
    for (const [id, event] of events) {
        const [group, display] = describeRecallTime(clock, event);
        if (!groups.has(group)) groups.set(group, []);
        groups.get(group).push(`${id} | ${display}`);
    }
    const body = ['now', 'today', 'days', 'weeks', 'months', 'seasons', 'years', 'old', 'unknown']
        .filter(group => groups.has(group)).map(group => `${group} =\n${groups.get(group).join('\n')}`).join('\n');
    return `<recall>\n${body}\n</recall>`;
}

export function patchDatabaseRecall(source) {
    const replace = (before, after) => {
        if (source.split(before).length !== 2) throw new Error(`数据库脚本结构不匹配：${before.trim().split('\n')[0]}`);
        source = source.replace(before, () => after);
    };
    const taskFunction = '    async function executeSinglePlotTask_ACU(task, sharedContext, runtimeOptions = {}) {';
    const helpers = [recallTimestamps, recallRangeEnd, directRecallCandidates, describeRecallTime, makeDirectRecall];
    const runtime = helpers.map(helper => helper.toString().split('\n').map(line => line ? `    ${line}` : '').join('\n')).join('\n\n');
    replace(taskFunction, `${runtime}

    const DIRECT_RECALL_KEY_ACU = SCRIPT_ID_PREFIX_ACU + '_directRecall';
    function isDirectRecallEnabled_ACU() {
        return getConfigStorage_ACU().getItem(DIRECT_RECALL_KEY_ACU) !== 'false';
    }

${taskFunction}`);

    replace('        let outlineTableContent = \'\';\n        try {', '        let outlineTableContent = \'\';\n        let directRecallIndex = \'\';\n        try {');
    for (const expression of ['summaryIndexWorldbookContent', 'summaryIndexResult.content']) {
        const line = `outlineTableContent = ${expression};`;
        replace(line, `directRecallIndex = outlineTableContent = ${expression};`);
    }
    replace('            allTablesJson: currentJsonTableData_ACU,\n        };\n    }\n    async function renderPlotTaskMessages_ACU',
        '            allTablesJson: currentJsonTableData_ACU,\n            directRecallIndex,\n        };\n    }\n    async function renderPlotTaskMessages_ACU');
    replace('            const messages = await renderPlotTaskMessages_ACU(normalizedTask, taskSharedContext, runtimeOptions);\n            checkPlotAbortRequested_ACU();\n            if (!messages.length) {',
        `            const localRecall = makeDirectRecall({
                enabled: isDirectRecallEnabled_ACU(),
                task: normalizedTask,
                limit: sharedContext.plotSettings?.recallCount,
                indexText: sharedContext.directRecallIndex,
                tableData: sharedContext.allTablesJson,
                userMessage: sharedContext.userMessage,
                lastPlotContent: sharedContext.lastPlotContent,
            });
            const messages = localRecall === null ? await renderPlotTaskMessages_ACU(normalizedTask, taskSharedContext, runtimeOptions) : [];
            checkPlotAbortRequested_ACU();
            if (localRecall === null && !messages.length) {`);
    replace("            let rawResponse = '';\n            let lastErrorMessage = '';\n            for (let attemptIndex = 0; attemptIndex < maxRetries; attemptIndex++) {",
        "            let rawResponse = localRecall ?? '';\n            let lastErrorMessage = '';\n            for (let attemptIndex = 0; localRecall === null && attemptIndex < maxRetries; attemptIndex++) {");

    replace('            const management = usePlotPresetManagement();\n            const devOptions = useDevOptions();',
        `            const management = usePlotPresetManagement();
            const devOptions = useDevOptions();
            const directRecallEnabled = ref(isDirectRecallEnabled_ACU());
            function setDirectRecallEnabled(enabled) {
                getConfigStorage_ACU().setItem(DIRECT_RECALL_KEY_ACU, enabled);
                directRecallEnabled.value = enabled;
            }`);
    replace('onImportFile, refreshAll, get plotCopy() { return plotCopy; }, AcuBadge,',
        'onImportFile, refreshAll, directRecallEnabled, setDirectRecallEnabled, get plotCopy() { return plotCopy; }, AcuToggle, AcuBadge,');
    replace('\t\t\tcreateVNode($setup["PlotPresetDrawer"], {', `			createVNode($setup["AcuFormRow"], {
				label: "少量纪要直接召回",
				hint: "时间召回的有效纪要不超过当前预设上限时，直接注入全部可选纪要，省一次召回请求。"
			}, {
				default: withCtx(() => [createVNode($setup["AcuToggle"], {
					label: "少量纪要直接召回",
					"model-value": $setup.directRecallEnabled,
					"onUpdate:modelValue": $setup.setDirectRecallEnabled
				}, null, 8, ["model-value"])]),
				_: 1
			}),
			createVNode($setup["PlotPresetDrawer"], {`);
    return source;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
    const [input, output] = process.argv.slice(2);
    if (!input || !output) throw new Error('用法：node direct-database-recall.mjs 原版数据库.js 修复版数据库.js');
    await writeFile(output, patchDatabaseRecall(await readFile(input, 'utf8')), { flag: 'wx' });
}
