import assert from 'node:assert/strict';
import test from 'node:test';
import { unwrapPrintedToolCall } from './repair-4a-tool-response.mjs';

const tool = 'output_everything_here';
const patch = [{ op: 'replace', path: '/示例', value: '分行\n保留字面量 \\n 和引号 "' }];
const response = `思考第一行\n思考第二行\n\n正文\n<UpdateVariable>\n<JSONPatch>\n${JSON.stringify(patch, null, 2)}\n</JSONPatch>\n</UpdateVariable>`;
const wrap = calls => `<tool_calls>\n${JSON.stringify(calls)}</tool_calls>`;
const ownCall = { name: tool, arguments: { content: response } };
const omitFinalBracket = input => input.replace(']</tool_calls>', '\n</tool_calls>');

test('decodes standard arguments without changing escaped data in the patch', () => {
    assert.equal(unwrapPrintedToolCall(wrap([ownCall]), tool), response);
});

test('decodes mixed escaped and raw line breaks plus unescaped JSONPatch quotes', () => {
    const rendered = JSON.stringify(response)
        .replace(String.raw`第二行\n\n正文`, '第二行\n\n正文')
        .replace(String.raw`\"op\"`, '"op"');
    const input = `<tool_calls>\n[{"name":"${tool}","arguments":{"content":${rendered}}}]</tool_calls>`;
    assert.throws(() => JSON.parse(input.slice(12, -13)));
    const decoded = unwrapPrintedToolCall(input, tool);
    assert.equal(decoded, response);
    assert.deepEqual(JSON.parse(decoded.match(/<JSONPatch>([\s\S]*?)<\/JSONPatch>/)[1]), patch);
    assert.equal(unwrapPrintedToolCall(omitFinalBracket(input), tool), response);
});

test('leaves foreign calls, mixed calls, incomplete envelopes, and invalid patches alone', () => {
    const foreign = { ...ownCall, name: 'external_tool' };
    assert.equal(unwrapPrintedToolCall(wrap([foreign]), tool), null);
    assert.equal(unwrapPrintedToolCall(wrap([ownCall, foreign]), tool), null);
    assert.equal(unwrapPrintedToolCall(omitFinalBracket(wrap([foreign])), tool), null);
    assert.equal(unwrapPrintedToolCall(omitFinalBracket(wrap([ownCall, foreign])), tool), null);
    assert.equal(unwrapPrintedToolCall(wrap([ownCall]).slice(0, -4), tool), null);
    assert.equal(unwrapPrintedToolCall(wrap([ownCall]).replace('}}]</tool_calls>', '}</tool_calls>'), tool), null);
    const invalid = `<tool_calls>[{"name":"${tool}","arguments":{"content":"<UpdateVariable>\n<JSONPatch>[invalid]</JSONPatch></UpdateVariable>"}}]</tool_calls>`;
    assert.equal(unwrapPrintedToolCall(invalid, tool), null);
});
