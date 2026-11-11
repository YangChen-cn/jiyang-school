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

const out = [
  IMPORT_LINE,
  '',
  '// 本文件由 脚本/生成Zod.mjs 从根目录 schema.ts 生成，请勿手工编辑。',
  '// 当前 Zod schema 只影响变量面板的类型提示/校验回写；registerMvuSchema 不会拦截 MVU 的写入。',
  src,
  '',
  '',
  '$(() => {',
  '  registerMvuSchema(Schema);',
  '});',
  '',
].join('\n');

fs.writeFileSync(outPath, out, 'utf8');
console.log(`[生成Zod] 已生成 ${path.relative(root, outPath)}（schema.ts ${before} 字符 -> Zod.txt ${out.length} 字符）`);
