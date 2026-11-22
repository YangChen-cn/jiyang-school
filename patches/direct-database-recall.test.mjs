import assert from 'node:assert/strict';
import test from 'node:test';
import { makeDirectRecall } from './direct-database-recall.mjs';

const task = { extractTags: 'recall', promptGroup: [{ content: '{zhaohui} <recall> diff_min' }] };
const index = rows => ['<已发生的事件概览>', '| 编码索引 | 时间跨度 | 概览 |', '|---|---|---|', ...rows, '</已发生的事件概览>'].join('\n');
const oneRow = '| AM0001 | 2024-09-14 23:50 至 00:10 | 主题提到 AM9999 |';
const options = { enabled: true, task, limit: 30, indexText: index([oneRow]), userMessage: '现在是 2024-09-15 02:10' };

test('uses eligible index entries and follows the time grouping of the preset', () => {
    assert.equal(makeDirectRecall(options), '<recall>\nnow =\nAM0001 | 120m\n</recall>');
    assert.equal(makeDirectRecall({ ...options, userMessage: '2024-09-16 00:00' }), '<recall>\ndays =\nAM0001 | 0d23h50m\n</recall>');
    const fallback = '## 表格: 纪要索引\nColumns: 概要, 编码索引\n- [0] 概要: 测试 | 编码索引: AM0001\n';
    const tableData = { sheet: { name: '纪要表', content: [['编码索引', '时间跨度'], ['AM0001', '2024-09-15 00:10']] } };
    assert.equal(makeDirectRecall({ ...options, indexText: fallback, tableData }), makeDirectRecall(options));
});

test('short-circuits at the configured maximum and returns an empty recall for a confirmed empty index', () => {
    const rows = Array.from({ length: 31 }, (_, i) => `| AM${1000 + i} | 2024-09-15 09:30 | 概览 |`);
    const atLimit = makeDirectRecall({ ...options, indexText: index(rows.slice(0, 30)) });
    assert.equal(atLimit.match(/AM\d+/g).length, 30);
    assert.equal(makeDirectRecall({ ...options, indexText: index(rows) }), null);
    assert.equal(makeDirectRecall({ ...options, indexText: index([]) }), '<recall>\n\n</recall>');
    assert.equal(makeDirectRecall({ ...options, indexText: '', tableData: { sheet: { name: '纪要表', content: [['编码索引']] } } }), '<recall>\n\n</recall>');
});

test('keeps the existing request path for disabled, unrelated or unrecognized tasks', () => {
    assert.equal(makeDirectRecall({ ...options, enabled: false }), null);
    assert.equal(makeDirectRecall({ ...options, limit: 0 }), null);
    assert.equal(makeDirectRecall({ ...options, indexText: '未知索引内容' }), null);
    assert.equal(makeDirectRecall({ ...options, task: { ...task, extractTags: 'recall,plan' } }), null);
    assert.equal(makeDirectRecall({ ...options, task: { extractTags: 'recall', promptGroup: [{ content: '其他召回预设' }] } }), null);
});
