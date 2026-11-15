const CampusInteractions = z.object({
  点赞: z.array(z.string().catch('')).catch([]).transform(names =>
    [...new Set(names.map(name => name.trim()).filter(Boolean))].slice(-6)
  ),
  互动: z.array(z.object({
    用户: z.string().optional().catch(undefined),
    内容: z.string().optional().catch(undefined),
    角色: z.string().optional().catch(undefined),
    评论: z.string().optional().catch(undefined),
  }).catch({}).transform(comment => ({
    用户: comment.用户?.trim() || comment.角色?.trim() || '',
    内容: Array.from(comment.内容?.trim() || comment.评论?.trim() || '').slice(0, 40).join(''),
  }))).catch([]).transform(comments =>
    comments.filter(comment => comment.用户 && comment.内容).slice(-3)
  ),
});

const CampusPost = z.object({
  标识: z.string().prefault(''),
  日期: z.string().prefault(''),
  渠道: z.enum(['公告', '班群', '来信', '趣事', '八卦', '余波', '朋友圈']).prefault('公告'),
  来源: z.string().prefault(''),
  标题: z.string().prefault(''),
  摘要: z.string().prefault(''),
  状态: z.enum(['有效', '已更正', '已结束', '已撤销']).prefault('有效'),
  活动标识: z.string().optional(),
  确认开始: z.string().optional(),
  确认结束: z.string().optional(),
  ...CampusInteractions.shape,
});

export const Schema = z.object({
  // 初始变量一律为空/0/false：不同开场白的时间、地点、在场角色不同，
  // 由第一轮 AI 依据开场白与玩家设定补齐，之后按 变量更新规则 推进。
  世界: z.object({
    起始年份: z.string().prefault(''),      // 开局设定写入，如 '2020'；学期/毕业按此推算
    日期: z.string().prefault(''),
    星期: z.string().prefault(''),
    时间段: z.string().prefault(''),
    天气: z.string().prefault(''),
    当前位置: z.string().prefault(''),
    所在区域: z.string().prefault(''),   // 校园 | 周边 | 城区 | 家 | 其他
    私密程度: z.string().prefault(''),   // 公开 | 半私密 | 独处
  }).prefault({}),

  剧情: z.object({
    推进节奏: z.string().prefault(''),
    当前事件: z.string().prefault(''),
    当前nsfw: z.coerce.boolean().prefault(false),
    事件冷却: z.coerce.number().transform(v => _.clamp(v, 0, 5)).prefault(0),
    上次焦点角色: z.string().prefault(''),
    校园活动: z.string().prefault(''),
    学期: z.string().prefault(''),       // 高二上 | 高二下 | 暑假 | 高三上 | 高三下 | 已毕业
  }).prefault({}),

  校园: z.object({
    有效公告: z.array(CampusPost).transform(posts => posts.slice(-3)).prefault([]),
    动态流: z.array(CampusPost).transform(posts => posts.slice(-6)).prefault([]),
    日程: z.record(z.string(), z.object({
      状态: z.enum(['已确认', '已结束', '已撤销']),
      开始: z.string().optional(),
      结束: z.string().optional(),
    })).prefault({}),
    // Keep the field readable until the first MVU update migrates the snapshot.
    消息: z.array(CampusPost).optional(),
  }).prefault({}),

  苏晓樯: z.object({
    是否在场: z.coerce.boolean().prefault(false),
    好感度: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(0),
    关系阶段: z.string().prefault(''),
    NSFW: z.coerce.boolean().prefault(false),
    当前上装: z.string().prefault(''),
    当前下装: z.string().prefault(''),
    所在位置: z.string().prefault(''),
    动作: z.string().prefault(''),
    心情: z.string().prefault(''),
    内心独白: z.string().prefault(''),
  }).prefault({}),

  温书语: z.object({
    是否在场: z.coerce.boolean().prefault(false),
    好感度: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(0),
    关系阶段: z.string().prefault(''),
    NSFW: z.coerce.boolean().prefault(false),
    当前上装: z.string().prefault(''),
    当前下装: z.string().prefault(''),
    所在位置: z.string().prefault(''),
    动作: z.string().prefault(''),
    心情: z.string().prefault(''),
    内心独白: z.string().prefault(''),
  }).prefault({}),

  沈幼楚: z.object({
    是否在场: z.coerce.boolean().prefault(false),
    好感度: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(0),
    信任度: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(0),
    触发家庭话题: z.coerce.boolean().prefault(false),
    关系阶段: z.string().prefault(''),
    NSFW: z.coerce.boolean().prefault(false),
    当前上装: z.string().prefault(''),
    当前下装: z.string().prefault(''),
    所在位置: z.string().prefault(''),
    动作: z.string().prefault(''),
    心情: z.string().prefault(''),
    内心独白: z.string().prefault(''),
  }).prefault({}),

  凌知夏: z.object({
    是否在场: z.coerce.boolean().prefault(false),
    好感度: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(0),
    关系阶段: z.string().prefault(''),
    NSFW: z.coerce.boolean().prefault(false),
    当前上装: z.string().prefault(''),
    当前下装: z.string().prefault(''),
    所在位置: z.string().prefault(''),
    动作: z.string().prefault(''),
    心情: z.string().prefault(''),
    内心独白: z.string().prefault(''),
  }).prefault({}),

  慕佳芊: z.object({
    是否在场: z.coerce.boolean().prefault(false),
    好感度: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(0),
    关系阶段: z.string().prefault(''),
    NSFW: z.coerce.boolean().prefault(false),
    当前上装: z.string().prefault(''),
    当前下装: z.string().prefault(''),
    所在位置: z.string().prefault(''),
    动作: z.string().prefault(''),
    心情: z.string().prefault(''),
    内心独白: z.string().prefault(''),
  }).prefault({}),

  陈芷汀: z.object({
    是否在场: z.coerce.boolean().prefault(false),
    好感度: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(0),
    关系阶段: z.string().prefault(''),
    NSFW: z.coerce.boolean().prefault(false),
    当前上装: z.string().prefault(''),
    当前下装: z.string().prefault(''),
    所在位置: z.string().prefault(''),
    动作: z.string().prefault(''),
    心情: z.string().prefault(''),
    内心独白: z.string().prefault(''),
  }).prefault({}),

  虞淑婉: z.object({
    是否在场: z.coerce.boolean().prefault(false),
    好感度: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(0),
    关系阶段: z.string().prefault(''),
    NSFW: z.coerce.boolean().prefault(false),
    当前上装: z.string().prefault(''),
    当前下装: z.string().prefault(''),
    所在位置: z.string().prefault(''),
    动作: z.string().prefault(''),
    心情: z.string().prefault(''),
    内心独白: z.string().prefault(''),
  }).prefault({}),

  主角: z.object({
    姓名: z.string().prefault(''),
    年龄: z.string().prefault(''),
    性别: z.string().prefault(''),
    班级: z.string().prefault(''),
    当前位置: z.string().prefault(''),
    外貌: z.string().prefault(''),
    性格: z.string().prefault(''),
    擅长与学业: z.string().prefault(''),
    家庭背景: z.string().prefault(''),
    重要物品: z.array(z.object({
      名称: z.string(),
      描述: z.string(),
    })).prefault([]),
  }).prefault({}),
}).prefault({});

export type Schema = z.output<typeof Schema>;
