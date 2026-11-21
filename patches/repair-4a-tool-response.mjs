import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

// Some responses print the tool invocation as assistant text.
// The malformed variant observed in SillyTavern left JSONPatch quotes unescaped.
const decoder = String.raw`    function unwrapPrintedToolCall(text, toolName) {
        if (!toolName || typeof text !== 'string') return null;
        const envelope = /^\s*<tool_calls>([\s\S]*)<\/tool_calls>\s*$/.exec(text);
        if (!envelope) return null;
        try {
            const calls = JSON.parse(envelope[1]);
            const call = Array.isArray(calls) && calls.length === 1 ? calls[0] : null;
            return call?.name === toolName && typeof call.arguments?.content === 'string'
                ? call.arguments.content : null;
        } catch {
            const single = /^\s*\[\s*\{\s*"name"\s*:\s*"([\w-]+)"\s*,\s*"arguments"\s*:\s*\{\s*"content"\s*:\s*"([\s\S]*)"\s*\}\s*\}\s*\]\s*$/.exec(envelope[1]);
            if (!single || single[1] !== toolName || /"\s*\}\s*\}\s*,\s*\{/.test(single[2])) return null;
            try {
                const content = JSON.parse('"' + single[2].replace(/\\[\s\S]|"/g, token => token === '"' ? '\\"' : token) + '"');
                const update = /<UpdateVariable\s*>([\s\S]*?)<\/UpdateVariable\s*>/i.exec(content);
                const patch = update && /<JSONPatch\s*>([\s\S]*?)<\/JSONPatch\s*>/i.exec(update[1]);
                return patch && Array.isArray(JSON.parse(patch[1])) ? content : null;
            } catch {
                return null;
            }
        }
    }

`;

const streamMethods = String.raw`        readOpenAiText(state, text, finished = false) {
            if (!this.toolName || state.printedCall === null) return text;
            if (state.channel === 'tool') {
                state.printedCall = null;
                return text;
            }
            state.printedCall += text;
            if (!finished && state.printedCall.length <= STREAM_LIMIT) {
                if (state.printedCallStarted) return '';
                const probe = state.printedCall.trimStart();
                const prefix = '<tool_calls>';
                state.printedCallStarted = probe.startsWith(prefix);
                if (state.printedCallStarted || prefix.startsWith(probe)) return '';
            }
            const original = state.printedCall;
            state.printedCall = null;
            const decoded = finished ? unwrapPrintedToolCall(original, this.toolName) : null;
            if (decoded === null) return original;
            state.printedCallDecoded = true;
            this.hit = true;
            return decoded;
        }

`;

export function repairToolResponse(source) {
    if (source.includes('    function unwrapPrintedToolCall(')) return source;
    const replace = (before, after) => {
        if (source.split(before).length !== 2) throw new Error('插件结构已变化，无法应用换行补丁：' + before.trim().split('\n')[0]);
        source = source.replace(before, () => after);
    };

    const normalizer = '    function normalizeOpenAiResponse(parsed, toolName) {';
    replace(normalizer, decoder + normalizer);
    replace('                if (!owned) continue;', `                if (!owned) {
                    const decoded = unwrapPrintedToolCall(message.content, toolName);
                    if (decoded !== null) {
                        message.content = decoded; hit = true; chars += decoded.length;
                        if (!calls.length && reason === 'tool_calls') choice.finish_reason = 'stop';
                    }
                    continue;
                }`);
    replace('this.nextReal = 0; this.meta = {}; this.reason = null;',
        "this.nextReal = 0; this.meta = {}; this.reason = null;\n            this.printedCall = ''; this.printedCallStarted = false;");
    const openAiPayload = '        openAiPayload(chunk) {';
    replace(openAiPayload, streamMethods + openAiPayload);
    replace("                    const text = this.choose(state, 'plain', delta.content);", `                    const text = this.choose(state, 'plain', this.readOpenAiText(state, delta.content));`);
    replace(`                    const flushed = this.flushUnmaskers();
                    if (flushed.content) rewritten.content`, `                    const tailText = this.choose(state, 'plain', this.readOpenAiText(state, '', true));
                    if (tailText) rewritten.content = (rewritten.content || '') + tailText;
                    const flushed = this.flushUnmaskers();
                    if (flushed.content) rewritten.content`);
    replace("                            let tailText = '';",
        "                            let tailText = this.choose(state, 'plain', this.readOpenAiText(state, '', true));");
    replace("const own = [...state.calls.values()].some(entry => entry.kind === 'own');",
        "const own = state.printedCallDecoded || [...state.calls.values()].some(entry => entry.kind === 'own');");
    replace("if (!cancelled && processor.chars > 0 && processor.protocol === 'openai' && !processor.done) {",
        "if (!cancelled && processor.protocol === 'openai' && !processor.done\n                    && (processor.chars > 0 || [...processor.openAi.values()].some(state => state.printedCall))) {");
    return source;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
    const [input, output] = process.argv.slice(2);
    if (!input || !output) throw new Error('用法：node repair-4a-tool-response.mjs 原版脚本.json 修复版脚本.json');
    const script = JSON.parse(await readFile(input, 'utf8'));
    if (script.type !== 'script' || typeof script.content !== 'string') throw new Error('需要一份酒馆助手脚本导出 JSON');
    script.content = repairToolResponse(script.content);
    await writeFile(output, JSON.stringify(script, null, 2) + '\n', { flag: 'wx' });
}
