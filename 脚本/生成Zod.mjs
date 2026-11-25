#!/usr/bin/env node
/**
 * 生成 脚本/Zod.txt。
 *
 * 唯一事实源是仓库根目录的 schema.ts；本脚本只做一层包装：
 *   1) 加上 mvu_zod 的 registerMvuSchema 动态导入（卡内运行时从 CDN 加载）；
 *   2) 去掉仅供 TypeScript 类型系统的 `export type ...` 行；
 *   3) 末尾注册 Schema。
 *
 * 用法：node 脚本/生成Zod.mjs
 * recompile.sh 在构建前会自动调用本脚本；不要手工编辑 脚本/Zod.txt。
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const schemaPath = path.join(root, 'schema.ts');
const outPath = path.join(here, 'Zod.txt');

const IMPORT_LINE = "import { registerMvuSchema } from 'https://testingcf.jsdelivr.net/gh/StageDog/tavern_resource/dist/util/mvu_zod.js';";

if (!fs.existsSync(schemaPath)) {
  console.error(`[生成Zod] 找不到 schema.ts: ${schemaPath}`);
  process.exit(1);
}

let src = fs.readFileSync(schemaPath, 'utf8');
const before = src.length;

// mvu_zod 的 registerMvuSchema 只需要运行时 Schema 对象；类型导出是 TS 语法，不能出现在运行时脚本里。
src = src.replace(/^export type\s+[\s\S]*?;\s*$/gm, '');
// 允许 schema.ts 顶部出现 TS 的 import 行（当前没有）；运行时脚本里不需要，直接剔除。
src = src.replace(/^import\s+.*?;\s*$/gm, '');
src = src.trimEnd();

if (!/^export const Schema\s*=\s*z\.object\(/m.test(src)) {
  console.error('[生成Zod] schema.ts 必须以 `export const Schema = z.object(` 开头');
  process.exit(1);
}

const campusHelpers = ['校园时间.js', '校园消息.js']
  .map(file => fs.readFileSync(path.join(here, file), 'utf8').trimEnd()).join('\n\n');
const relationship = fs.readFileSync(path.join(here, '关系节奏.js'), 'utf8').trimEnd();
const periods = JSON.parse(fs.readFileSync(path.join(root, '数据/学期.json'), 'utf8'));
const periodDates = periods.map(({ id, start, end }) => ({ id, start, end }));
const activityIds = periods.flatMap(period => (period.activities || []).map(activity => activity.id));

const out = [
  IMPORT_LINE,
  '',
  '// 本文件由 脚本/生成Zod.mjs 从根目录 schema.ts 生成，请勿手工编辑。',
  '// 当前 Zod schema 只影响变量面板的类型提示/校验回写；registerMvuSchema 不会拦截 MVU 的写入。',
  src,
  campusHelpers,
  relationship,
  `const periodDates = ${JSON.stringify(periodDates)};`,
  `const activityIds = ${JSON.stringify(activityIds)};`,
  '',
  '',
  '$(async () => {',
  '  registerMvuSchema(Schema);',
  '  const niananSchema = Schema.unwrap().shape.许念安;',
  "  await waitGlobalInitialized('Mvu');",
  '  eventOn(Mvu.events.VARIABLE_UPDATE_STARTED, ({ stat_data }) => {',
  '    if (stat_data) stat_data.许念安 ??= niananSchema.parse({});',
  '  });',
  '  eventOn(Mvu.events.VARIABLE_UPDATE_ENDED, (variables, before) => {',
  '    limitRelationshipGains(variables?.stat_data, before?.stat_data);',
  '  });',
  '  eventOn(Mvu.events.BEFORE_MESSAGE_UPDATE, ({ variables }) => {',
  '    const state = variables?.stat_data;',
  '    if (state) {',
  '      const character = niananSchema.safeParse(state.许念安 ?? {});',
  '      if (character.success) state.许念安 = character.data;',
  '    }',
  '    // MVU carries old fields forward. Retire these keys on the newly written floor only.',
  '    delete state?.凌知夏;',
  '    delete state?.云清晏?.已入班;',
  '    delete state?.剧情?.当日关系增量;',
  '    delete state?.剧情?.重大情感申请;',
  '    delete state?.剧情?.已结算重大情感事件;',
  '    delete state?.剧情?.推进节奏;',
  '    delete state?.剧情?.事件冷却;',
  '    delete state?.剧情?.上次焦点角色;',
  "    const period = campusPeriod(periodDates, state?.世界?.日期, campusYear(state?.世界?.起始年份), state?.剧情?.学期);",
  '    if (period && state.剧情) state.剧情.学期 = period.id;',
  '    if (state?.剧情?.灵气复苏?.已开启) {',
  '      const toMs = (raw) => {',
  '        const m = String(raw || \'\').trim().match(/^(\\d{4})[-/年.](\\d{1,2})[-/月.](\\d{1,2})/);',
  '        return m ? Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3])) : null;',
  '      };',
  '      const ori = toMs(state.剧情.灵气复苏.开启日期) ?? toMs(state?.世界?.日期);',
  '      const cur = toMs(state?.世界?.日期) ?? ori;',
  '      if (ori !== null && cur !== null) {',
  '        const d = Math.max(0, Math.floor((cur - ori) / 86400000));',
  "        state.剧情.灵气复苏.阶段 = d < 10 ? '微兆潜龙期' : d < 25 ? '古武抬头期' : d < 45 ? '龙眼破禁期' : d < 90 ? '潜龙秘序期' : '百宗出山期';",
  '      }',
  '    }',
  '    if (state?.主角) {',
  '      const age = campusAgeAt(state.主角.出生日期, state.世界?.日期);',
  "      if (age !== null) state.主角.年龄 = `${age}岁`;",
  '      state.主角.班级 = campusPlayerClass(state.主角.班级, period?.id);',
  '    }',
  '    if (!state?.校园) return;',
  '    state.校园 = normalizeCampus(state.校园, state.世界?.日期, activityIds);',
  '    for (const post of [...state.校园.有效公告, ...state.校园.动态流]) {',
  '      if (Array.isArray(post.点赞) || Array.isArray(post.互动)) {',
  '        Object.assign(post, CampusInteractions.parse(post));',
  '      }',
  '    }',
  '  });',
  '});',
  '',
].join('\n');

fs.writeFileSync(outPath, out, 'utf8');
console.log(`[生成Zod] 已生成 ${path.relative(root, outPath)}（schema.ts ${before} 字符 -> Zod.txt ${out.length} 字符）`);
