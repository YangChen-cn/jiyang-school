#!/usr/bin/env node
/**
 * 将 DLC 世界书源条目（世界书内容与 tavern-cards-state.json 元数据）同步嵌入
 * 脚本/多功能悬浮球.js 的 JY_DLC_MANIFEST_BEGIN/END 区间，保证打包卡与实时注入单源一致。
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const statePath = path.join(root, 'tavern-cards-state.json');
const playerPath = path.join(here, '多功能悬浮球.js');

const DLC_KEYS = [
  ['世界观', '[DLC]灵气复苏总纲与异象日程'],
  ['世界观', '[DLC]境界描述'],
  ['世界观', '[DLC]破境判定'],
  ['世界观', '[DLC]华夏修行界与隐世宗门世家'],
  ['事件', '[DLC]老鹰山灵脉与古宗秘藏'],
  ['角色', '云清晏_基础信息'],
  ['角色', '云清晏_性格调色盘'],
  ['NSFW指导', '云清晏_NSFW指导'],
];

const state = JSON.parse(fs.readFileSync(statePath, 'utf8'));
const manifestEntries = DLC_KEYS.map(([group, comment]) => {
  const leaf = state?.entryManifest?.[group]?.[comment];
  if (!leaf || !leaf.path) {
    throw new Error(`[生成DLC] tavern-cards-state.json 缺少 ${group}.${comment}`);
  }
  const fullPath = path.join(root, leaf.path);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`[生成DLC] 找不到源文件: ${leaf.path}`);
  }
  return {
    name: comment,
    enabled: true,
    strategy: leaf.strategy || { type: 'constant' },
    position: leaf.position || { type: 'after_character_definition', role: 'system', depth: 0, order: 100 },
    content: fs.readFileSync(fullPath, 'utf8'),
    probability: 100,
    recursion: { prevent_incoming: true, prevent_outgoing: true, delay_until: null },
    effect: { sticky: null, cooldown: null, delay: null },
  };
});

const playerSrc = fs.readFileSync(playerPath, 'utf8');
const pattern = /(\/\*\s*JY_DLC_MANIFEST_BEGIN\s*\*\/)\s*[\s\S]*?(\s*\/\*\s*JY_DLC_MANIFEST_END\s*\*\/)/;
if (!pattern.test(playerSrc)) {
  console.warn('[生成DLC] 多功能悬浮球.js 尚未包含 JY_DLC_MANIFEST_BEGIN/END 锚点，跳过写入');
  process.exit(0);
}

const payload = `const DLC_ENTRIES = ${JSON.stringify(manifestEntries)};`;
const nextSrc = playerSrc.replace(pattern, (_, head, tail) => `${head}\n  ${payload}\n  ${tail.trimStart()}`);
fs.writeFileSync(playerPath, nextSrc, 'utf8');
console.log(`[生成DLC] 已同步 ${manifestEntries.length} 条 DLC 世界书条目到 脚本/多功能悬浮球.js`);
