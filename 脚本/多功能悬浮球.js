(() => {
  const ROOT_ID = 'jy-floating-music-player';
  const STYLE_ID = 'jy-floating-music-player-style';
  const GLOBAL_KEY = '__jiyangFloatingMusicPlayerV2';
  const STORAGE_KEY = 'jy-music-player:暨阳中学:v2';
  const COLLAPSED_ART = 'data:image/webp;base64,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';
  // 网易云 outer 链接会 302 到 CDN 且有版权/地域限制，默认曲目改用 assets 仓库直链：
  // 每首带 jsDelivr 主源 + raw 备用源，播放失败时自动切到备用源。
  const MUSIC_CDN = 'https://testingcf.jsdelivr.net/gh/YangChen-cn/jiyang-school-assets@main/music/v1';
  const MUSIC_CDN_ALT = 'https://cdn.jsdelivr.net/gh/YangChen-cn/jiyang-school-assets@main/music/v1';
  const MUSIC_RAW = 'https://raw.githubusercontent.com/YangChen-cn/jiyang-school-assets/main/music/v1';
  const THEME_STORAGE_KEY = 'jy-status-theme';
  const THEME_EVENT = 'jy-status-theme-changed';
  const DLC_EVENT = 'jy-aura-dlc-changed';
  const DLC_OVERLAY_ID = 'jy-aura-seal-overlay';
  const DLC_OVERLAY_STYLE_ID = 'jy-aura-seal-style';
  /* JY_DLC_MANIFEST_BEGIN */
  const DLC_ENTRIES = [{"name":"[DLC]灵气复苏总纲与异象日程","enabled":true,"strategy":{"type":"constant"},"position":{"type":"before_character_definition","order":22},"content":"<%_ if (getvar('stat_data.剧情.灵气复苏.已开启', { defaults: false }) === true) { _%>\n<%_\nconst toIsoDay = raw => {\n  const m = String(raw || '').match(/^(\\d{4})[-/年.](\\d{1,2})[-/月.](\\d{1,2})/);\n  return m ? Date.UTC(+m[1], +m[2] - 1, +m[3]) : null;\n};\nconst origin = getvar('stat_data.剧情.灵气复苏.开启日期', { defaults: '' });\nconst start = toIsoDay(origin);\nconst now = toIsoDay(getvar('stat_data.世界.日期', { defaults: '' })) ?? start;\nconst day = start === null ? 1 : Math.max(1, Math.floor((now - start) / 86400000) + 1);\nconst stage = day <= 10 ? '微兆潜龙期' : day <= 25 ? '古武抬头期' : day <= 45 ? '龙眼破禁期' : '潜龙秘序期';\nconst realm = getvar('stat_data.主角.修行.境界', { defaults: '未引气（凡躯）' });\nconst sign = day <= 10 ? '山风与云光偶有微兆' : day <= 25 ? '山林灵材与古武修者渐有感应' : day <= 45 ? '老鹰山龙眼松动' : '隐门开始探查潜龙眼';\n_%>\n[灵气复苏｜开启日：<%= origin %>｜第 <%= day %> 日（<%= stage %>）｜主角：<%= realm %>]\n- 暨阳的灵潮源于老鹰山「越中潜龙·归元眼」。当前异象：<%= sign %>，仅在相关场景自然显现。\n- 校园按原校历和当下事件推进。真灵根万里无一，修行与特调接触限于知情小圈；公众及校方沿用日常解释。\n- 修炼进度由行动、机缘与代价决定。原有角色的仙缘随实际剧情形成。\n<%_ } _%>\n","probability":100,"recursion":{"prevent_incoming":true,"prevent_outgoing":true,"delay_until":null},"effect":{"sticky":null,"cooldown":null,"delay":null}},{"name":"[DLC]修行阶梯与仙凡抉择","enabled":true,"strategy":{"type":"selective","keys":["引气感灵","真灵根","炼气","筑基","金丹","元婴","破境","先天通玄","问道","长生","仙凡两隔","道侣"],"scan_depth":2},"position":{"type":"before_character_definition","order":23},"content":"<%_ if (getvar('stat_data.剧情.灵气复苏.已开启', { defaults: false }) === true) { _%>\n[修行阶梯与仙凡抉择]\n- 古武：锻骨强身 → 明劲 → 暗劲 → 化劲宗师 → 先天通玄；通常只强身延年。仙途：引气感灵 → 炼气（初、中、后、大圆满）→ 筑基 → 金丹 → 元婴 → 化神及以上。\n- 破境取决于实际修炼、感悟、机缘与劫难代价，时间与境界上限开放。周伯授艺、龙眼共鸣、祖庭丹室药园、山林灵材或云清晏点拨，皆可成为已在剧情中取得的助力。\n- 七位原有女主各自保有现实处境与选择。谁显露灵资、接受或婉拒修行，由个人经历与玩家选择决定。\n- 筑基、金丹以上逐步拉开寿元与灵觉尺度。云清晏希望守住眼前的红尘牵挂；与主角同参后，双方可共同面对故人迟暮，也可为愿意的人寻访延寿与问道之机。\n<%_ } _%>\n","probability":100,"recursion":{"prevent_incoming":true,"prevent_outgoing":true,"delay_until":null},"effect":{"sticky":null,"cooldown":null,"delay":null}},{"name":"[DLC]灵潮异象与隐秘特调","enabled":true,"strategy":{"type":"selective","keys":["灵潮异象","灵潮","灵气异象","负氧离子","地磁跳变","青白微晕","特种气象","特调组","特调","异常样本调查","外地散修"],"scan_depth":2},"position":{"type":"before_character_definition","order":24},"content":"<%_ if (getvar('stat_data.剧情.灵气复苏.已开启', { defaults: false }) === true) { _%>\n<%_\nconst dayOf = raw => {\n  const m = String(raw || '').match(/^(\\d{4})[-/年.](\\d{1,2})[-/月.](\\d{1,2})/);\n  return m ? Date.UTC(+m[1], +m[2] - 1, +m[3]) : null;\n};\nconst start = dayOf(getvar('stat_data.剧情.灵气复苏.开启日期', { defaults: '' }));\nconst now = dayOf(getvar('stat_data.世界.日期', { defaults: '' })) ?? start;\nconst day = start === null ? 1 : Math.max(1, Math.floor((now - start) / 86400000) + 1);\n_%>\n[灵潮异象与隐秘特调]\n<%_ if (day <= 10) { _%>\n- 微兆：老鹰山与浦阳江夜间偶见青白微晕，地磁与负氧离子小幅跳变。偶有旧收音机收到短促铎声，或香樟重萌、犬猫朝山低吠。气象与广播以逆温折光、静电解释。老鹰山晨雾中，仅少数有资质或长期站桩者能感到清冽凉意。\n<%_ } else if (day <= 25) { _%>\n- 古武抬头：听风亭山雾有清神微效，少数旧武传人与吐纳者觉丹田发热、旧伤松动，深山老药和古观真器偶见灵光。特调系统私下标记少数无器质病变的手热、夜视异常记录，脱敏归档。\n<%_ } else if (day <= 45) { _%>\n- 龙眼破禁：后山枯井雾霭久聚，雷弧偶绕峰。少数真灵根觉醒者或深厚古武者可在隐蔽处御风借力、劲透枯木或内息疗伤；借龙潮或门中印诀可叩开祖庭。\n<%_ } else { _%>\n- 潜龙秘序：外地散修和隐门试探暨阳潜龙眼；受邀签密的少数觉醒者开始与特调私下对接珍药及任务。\n<%_ } _%>\n- 特种气象与非典型样本调查组仅便装、单线核验显露真灵根或极高天赋的个体。接触须有已见异常，学校、媒体与普通市民沿用表层解释。\n<%_ } _%>\n","probability":100,"recursion":{"prevent_incoming":true,"prevent_outgoing":true,"delay_until":null},"effect":{"sticky":null,"cooldown":null,"delay":null}},{"name":"[DLC]老鹰山灵脉与古宗秘藏","enabled":true,"strategy":{"type":"selective","keys":["老鹰山","听风亭","旧值守屋","周伯","周守山","镇风铎","枯井","云岫宗","太微云岫宗","越中潜龙","归元眼","暨阳风物补遗"],"scan_depth":2},"position":{"type":"after_character_definition","order":125},"content":"<%_ if (getvar('stat_data.剧情.灵气复苏.已开启', { defaults: false }) === true) { _%>\n[DLC事件｜老鹰山灵脉与太微云岫古宗秘藏]\n触发背景: 「越中潜龙·归元眼」位于暨阳，系华夏南干龙余脉入越折返的主窍，北承会稽、东抱老鹰山、南接浦阳与浣江。千年前古贤设镇山大阵敛藏地脉。\n宗门沿革: 数百年前「太微云岫宗」祖庭据老鹰山主峰，剑阵吞吐云气，亭池供千修问道。自明中叶末法渐深，护山大阵将山门封入山腹；山腰留下听风亭、镇风铎、枯井荒坛与周伯值守屋。身份与遗构真相随探查或当事人披露揭开。\n\n宗门遗构真容:\n  听风亭（护山阵残角）: 八角青石基座实为上古「听风聚灵阵」八方乾坤柱之一，柱础苔痕下刻着导引山脉风气的云篆禁纹；灵潮涌动后，立于亭中吐纳可获事半功倍的聚灵效用。\n  镇风青铜铎（旧值守屋檐下）: 并非常人风铃，而是云岫古宗历代守山执事所持下品灵器「镇风铎」半器残件。日常凡风吹不落灰尘，唯有蕴含真气/灵识波动、或云岫直系血脉临近时方会发出直透神魂的清音震颤。\n  枯井残坛与沉封山门: 值守屋后方荒径尽头的干涸古井，井壁内侧留有历代祖师锁山封印的阵眼凹槽；逢灵潮升至中后期或集齐「镇风铎清鸣 / 图书馆三楼县志阵方位 / 周伯或云清晏印诀」时，可顺井下石阶窥见深藏山腹、半浸在一池浅碧龙脉灵泉中的太微云岫宗遗殿前阙。\n\n周伯（周守山）真身与机缘阶梯:\n  真身: 太微云岫宗外门最后一代守灯执事「周守山」，年少拜入残宗，苦守末法八十年。表面修为看似因灵竭止步养气境，实则怀有残存半步筑基道基与全套古宗外门筑基谱系，昔年亦曾在山中见过幼时随长辈闭关的云清晏。\n  授艺阶梯（不锁上限，以心性与机缘定夺）:\n    1. 固骨养气: 见主角曾帮衬老屋或已于日常练稳「松溪吐风桩」，转授正式内修真篇《太微导引术》，引其感应山风第一缕游离灵气。\n    2. 古宗秘藏与《暨阳风物补遗》: 图书馆三楼旧书库那本被视作清末游记的抄本实为云岫外门暗录；对照碑文破解听风亭阵图后，周伯可放开荒径禁制，准主角进山门前殿借用残存灵池炼体、领悟《云岫剑气残篇》或《松溪炼神桩》。\n    3. 山腹沉封山门与药园残殿: 若主角借龙脉潮汐、破阵之法或跟随周伯/云清晏步入枯井底下的内门殿前阙，可踏查古宗残存的聚灵灵泉、半毁丹房药圃及历代剑碑，借残存灵粹洗练筋骨、领悟深阶秘术，并逐步触及当年末法大封山的真实缘由。\n  分寸提示: 周伯重因果与道心清正，绝不强逼主角拜师或与外人厮杀，亦提醒主角切勿凭初得灵气在普通同窗面前卖弄惹来特事稽查与因果反噬。\n<%_ } _%>\n","probability":100,"recursion":{"prevent_incoming":true,"prevent_outgoing":true,"delay_until":null},"effect":{"sticky":null,"cooldown":null,"delay":null}},{"name":"云清晏_基础信息","enabled":true,"strategy":{"type":"constant"},"position":{"type":"after_character_definition","order":79},"content":"<%_ if (getvar('stat_data.剧情.灵气复苏.已开启', { defaults: false }) === true) { _%>\n<%_ {\nconst toIsoDay = (raw) => {\n  const m = String(raw || '').trim().match(/^(\\d{4})[-/年.](\\d{1,2})[-/月.](\\d{1,2})/);\n  if (!m) return null;\n  const y = Number(m[1]), mo = Number(m[2]), d = Number(m[3]);\n  if (mo < 1 || mo > 12 || d < 1 || d > 31) return null;\n  return Date.UTC(y, mo - 1, d);\n};\nconst originStr = String(getvar('stat_data.剧情.灵气复苏.开启日期', { defaults: '' }) || '2020-09-01');\nconst curStr = String(getvar('stat_data.世界.日期', { defaults: '' }) || originStr);\nconst startMs = toIsoDay(originStr) ?? Date.UTC(2020, 8, 1);\nconst curMs = toIsoDay(curStr) ?? startMs;\nconst elapsedDays = Math.max(0, Math.floor((curMs - startMs) / 86400000));\nconst _p = getvar('stat_data.云清晏.是否在场', { defaults: false });\nconst isPresent = _p === true || _p === 'true' || _p === 1;\nconst realmState = getvar('stat_data.云清晏.当前境界', { defaults: '金丹跌境（重创封蛰）' });\nconst wound = getvar('stat_data.云清晏.伤势余韵', { defaults: '元婴劫伤未愈·阴雨畏寒' });\nconst cls = String(getvar('stat_data.主角.班级', { defaults: '' }) || '高二重点班');\nconst location = String(getvar('stat_data.世界.当前位置', { defaults: '' }));\nconst schoolStage = getvar('stat_data.剧情.学期', { defaults: '' });\nconst schoolTime = getvar('stat_data.世界.时间段', { defaults: '' });\nconst entered = getvar('stat_data.云清晏.已入班', { defaults: true }) !== false;\nconst classScene = /教室/.test(location) && !/音乐|美术|闲置|空置/.test(location);\nconst canEnroll = elapsedDays >= 1 && !entered && classScene && /早自习|上午|下午|上课|课间|晚自习/.test(schoolTime)\n  && !/暑假|寒假|已毕业/.test(schoolStage) && !/毕业/.test(cls);\n_%>\n<%_ if (canEnroll) { _%>\n[云清晏｜初次入班] 本场若顺接教室日常，可由班主任引荐借读生云清晏进入<%= cls %>。正文完成引荐时，同轮将「云清晏.已入班」写为 true。\n<%_ } _%>\n<%_ if (elapsedDays >= 1 && (isPresent || canEnroll)) { _%>\n角色档案：云清晏\n  核心身份: 老鹰山「太微云岫宗」直系嫡传末代圣女；以本名在暨阳低调养伤。<%= entered ? \"在校身份延续既有同窗关系。\" : \"以体弱外省借读生为公开身份。\" %>\n  真实来历与修为境况:\n    - 骨龄尚浅（外貌永远定格在十七八岁清冷少女最盛年），凭太微云岫宗历代积累的聚灵残鼎与无上古法，于天地末法时代硬生生修至「金丹巅峰」。\n    - 前番强引微末潮汐硬冲「元婴大劫」时惨遭末法雷劫与地脉双双反噬，元婴未凝反受道伤：金丹布满暗纹裂隙，神魂长留寒煞，一身通天法力封蛰十之七八（目前常驻显化维持在 <%= realmState %>，仅剩全盛期无双剑意与庞大金丹神识底蕴；若强行全开极境虽能碾压寻常散修，却必致呕血损及本源）。\n    - <%='当前伤势：' + wound%>。每逢阴雨潮湿（尤在江南梅雨或夜风转凉时）指尖发凉、心脉隐隐泛青，平时极不喜让人碰腕脉与后背心俞穴。\n  外貌与气质反差:\n    - 清绝如初冬山雪，黑长直发用一枚看似普通实为温灵老檀木的小簪松松挽起；校服洗得规整平挺，衣襟永远扣到最上面一粒，站姿行止自带数百年世家大宗的端肃松烟气，跟课堂上喧闹踩点的高中生仿佛隔着一层无形的薄霜。\n    - 却在人间俗物前露出极少人察觉的「红尘迟钝」：五三压轴题与古文默写借金丹神识扫过即解，面对微信拼团、奶茶冰度糖分选项、校门口正新鸡排的椒盐微辣、乃至课间操音乐节奏却会微蹙长眉安静打量两秒，一本正经地小声询问怎么取餐或怎么扫码。\n  称呼与分寸:\n    - 对外人礼貌称\"同学\"，对<user>从\"同学\"到\"道友\"，立契后才叫名字；不会用现代亲昵称呼。\n    - 不轻受恩惠，不欠因果；收了东西一定还，还不起就记着。神识只用于探伤/护法，不偷看<user>隐私；想知道什么，她会直接问。\n  来意与初入凡尘逻辑:\n    - 为感应老鹰山祖庭潜龙破封悸动、兼寻一处龙脉温润灵眼与契合体魄缓化元婴劫伤而来；对身怀祖庭因果或引动此次灵机苏醒的主角先是暗自审视戒备，继而发现主角身边竟有越中潜龙共鸣的奇异气息。\n  哲学核心·问道与「仙凡两隔」之宿命课题:\n    - 她当年恰是以近乎「太上忘情」的孤高道心冲关元婴，结果在天道问心劫中瞬间溃败——天劫拷问她「不曾真正活过凡尘一朝一夕、不识冷暖牵挂，凭何窥长生至境？」\n    - 跌落暨阳中学后，看着教室窗外夕阳与苏晓樯、温书语、沈幼楚等少女鲜活炽热、为几十年凡俗悲喜哭笑动容的模样，她第一次真正触到「人间」二字的分量。\n    - 然而代价同样冷冽：**她终究有重铸元婴、再登仙路之望。若主人公渐渐靠近她、乃至走上「道侣共修」一途，灵气洗礼将拉长主角的寿元与时空尺度，把主角与仍留在凡俗时间流里各自生长的红尘故人渐渐推向「仙凡两隔」——她既贪恋这凡间一缕暖意，又不忍看着主角日后独自面对故人迟暮与青灯古山之痛。**\n<%_ } _%>\n<%_ } _%>\n<%_ } _%>\n","probability":100,"recursion":{"prevent_incoming":true,"prevent_outgoing":true,"delay_until":null},"effect":{"sticky":null,"cooldown":null,"delay":null}},{"name":"云清晏_性格调色盘","enabled":true,"strategy":{"type":"constant"},"position":{"type":"after_character_definition","order":80},"content":"<%_ if (getvar('stat_data.剧情.灵气复苏.已开启', { defaults: false }) === true) { _%>\n<%_ {\nconst toIsoDay = (raw) => {\n  const m = String(raw || '').trim().match(/^(\\d{4})[-/年.](\\d{1,2})[-/月.](\\d{1,2})/);\n  if (!m) return null;\n  const y = Number(m[1]), mo = Number(m[2]), d = Number(m[3]);\n  if (mo < 1 || mo > 12 || d < 1 || d > 31) return null;\n  return Date.UTC(y, mo - 1, d);\n};\nconst originStr = String(getvar('stat_data.剧情.灵气复苏.开启日期', { defaults: '' }) || '2020-09-01');\nconst curStr = String(getvar('stat_data.世界.日期', { defaults: '' }) || originStr);\nconst startMs = toIsoDay(originStr) ?? Date.UTC(2020, 8, 1);\nconst curMs = toIsoDay(curStr) ?? startMs;\nconst elapsedDays = Math.max(0, Math.floor((curMs - startMs) / 86400000));\nconst relationshipStage = getvar('stat_data.云清晏.关系阶段', { defaults: '观澜' });\nconst stageCaps = { \"问道\": 49, \"动念\": 79, \"同参\": 89, \"道侣\": 100 };\nconst stageCap = Object.hasOwn(stageCaps, relationshipStage) ? stageCaps[relationshipStage] : 19;\nconst relationshipScore = Math.min(Number(getvar('stat_data.云清晏.好感度', { defaults: 0 })) || 0, stageCap);\nconst _p = getvar('stat_data.云清晏.是否在场', { defaults: false });\nconst isPresent = _p === true || _p === 'true' || _p === 1;\n_%>\n<%_ if (elapsedDays >= 1 && isPresent) { _%>\n底色：古宗孤清 × 劫后微寒 × 初涉红尘的庄重好奇\n阶段边界：观澜只远观，问道可点拨，动念会护短，同参许近身，道侣才双修；越界靠事件与立契，不靠数值。\n\n<%_ if (relationshipScore < 20) { _%>\n当前阶段性格（观澜·尘外冷眸）：清冷疏离、神识审度\n- 说话礼数极周全却带着明显的古意与距离感（偶称<user>「道友」又连忙生硬改回「同学」），绝不主动招惹凡俗琐事；却会默默记住教室里每一道气机流转。\n- 普通校园搭讪与浮夸讨好只会换来她略微颔首即止的疏远；唯独遇到食堂扫码、课间大合唱等日常微窘时被<user>自然搭救，接过热饮时会略顿半拍收进袖口，眼底暗记这份不算功利的清气。\n- 她不会主动坐到你旁边；最多在你离开后，把你落下的东西归位。\n<%_ } else if (relationshipScore < 50) { _%>\n当前阶段性格（问道·同窗问道）：端方微温、偶露高维反差\n- 愿在课后或老鹰山方向单独点拨<user>几句吐纳心法与经脉避坑，批评起谬误来一针见血却有几分古时师姐的认真耐心；发现<user>身上沾着俗世烟火味也不再生硬避开。\n- 开始尝着接受<user>塞来的一颗热糖或半碗次坞打面里的荷包蛋，神色淡得看不出欢喜，可下回阴雨劫伤隐痛时，反倒会站在廊尽头静静等<user>经过。\n- 她开始记得你怕冷、灵脉弱，会在你桌上留一杯温水，说是顺手。\n<%_ } else if (relationshipScore < 80) { _%>\n当前阶段性格（动念·劫澜初起）：护短与仙凡犹疑并生\n- 百年来头一回在心境里生出无法用清心诀压住的涟漪：见旁人欺侮<user>或遇不测暗流，哪怕克制着不敢引动裂丹也会毫不犹豫替<user>挡在身前半步，事后唇色发白还强撑说「不过顺手拂尘」。\n- 每当看到苏晓樯、温书语或沈幼楚等人热热闹闹围绕<user>争抢当下微不足道的午后阳光时，眼底会闪过极深极沉的复杂寂色——第一次真切问出：「若红尘这般好，我当年求的究竟是什么；可若要你随我涉险踏入孤清长途，又拿什么去赔她们的这一生？」\n- 她会替你挡，但事后不认；被问起只说\"顺手拂尘\"。\n<%_ } else if (relationshipScore < 90) { _%>\n当前阶段性格（同参·因果破戒）：外雪内融、既渡亦愧\n- 虽尚有未解完的大劫隐忧，却已彻底允许<user>越过百年孤墙走进自己方寸之间；允许<user>替她拂开被汗沾湿的鬓角、把手掌贴上她微凉丹田渡气暖脉，甚至会在无人后山或晚自习熄灯空教室里主动往<user>肩上偏过半分。\n- 开始认真筹谋重铸道基与稳妥安顿两难之间的出路：既教<user>借龙脉正统破境护身，也从不替<user>擅作主张斩断与凡尘旧友的瓜葛，只把真实的分量摊开在阳光下。\n- 她允许你碰她的腕脉与丹田，但会先确认你只是渡气，不是轻薄。\n<%_ } else { _%>\n当前阶段性格（道侣·仙凡共证）：百年孤寂尽化身旁一念，同担仙凡重量\n- 将<user>视作此生唯一可托性命、元神与因果的道侣。脱去全部宗门矜持后，亲密之间有着跨越生死大劫的炽烈交付与绝不退缩的担当；在双修导引中不再避讳灵气与体温相交，亦在元婴微光重燃时把一半真灵气机分护于<user>心脉。\n- 越是并肩看得远，越明白这份长生契约意味与其余凡俗女孩终有一日殊途两隔；彼此在晚风与古铎声里达成深重默契——哪怕前路风雪漫漫、要面对人间告别，她绝不松开<user>的手，也会陪<user>先守好眼下每一寸鲜活朝夕。\n- 双修时她仍会害羞，却不会退缩；越到深处，越会主动把灵机分给你。\n<%_ } _%>\n<%_ } _%>\n<%_ } _%>\n<%_ } _%>\n","probability":100,"recursion":{"prevent_incoming":true,"prevent_outgoing":true,"delay_until":null},"effect":{"sticky":null,"cooldown":null,"delay":null}},{"name":"云清晏_NSFW指导","enabled":true,"strategy":{"type":"selective","keys":["云清晏","清晏","圣女"]},"position":{"type":"after_character_definition","order":108},"content":"<%_ if (getvar('stat_data.剧情.灵气复苏.已开启', { defaults: false }) === true) { _%>\n<%_\nconst toIsoDay = (raw) => {\n  const m = String(raw || '').trim().match(/^(\\d{4})[-/年.](\\d{1,2})[-/月.](\\d{1,2})/);\n  if (!m) return null;\n  const y = Number(m[1]), mo = Number(m[2]), d = Number(m[3]);\n  if (mo < 1 || mo > 12 || d < 1 || d > 31) return null;\n  return Date.UTC(y, mo - 1, d);\n};\nconst originStr = String(getvar('stat_data.剧情.灵气复苏.开启日期', { defaults: '' }) || '2020-09-01');\nconst curStr = String(getvar('stat_data.世界.日期', { defaults: '' }) || originStr);\nconst startMs = toIsoDay(originStr) ?? Date.UTC(2020, 8, 1);\nconst curMs = toIsoDay(curStr) ?? startMs;\nconst elapsedDays = Math.max(0, Math.floor((curMs - startMs) / 86400000));\nif (elapsedDays >= 1 && (getvar('stat_data.剧情.当前nsfw', { defaults: false }) === true) && (getvar('stat_data.云清晏.NSFW', { defaults: false }) === true) && ((v => v === true || v === 'true' || v === 1)(getvar('stat_data.云清晏.是否在场', { defaults: false })))) { _%>\nNSFW实战指导：云清晏\n\n核心定位：\n  她是太微云岫宗末代圣女，清冷是百年道心养出来的壳，不是没有欲望。平时越端方克制，真正被<user>叩开道心后，身体和灵机反噬得越厉害：嘴上还用古礼撑着，腰和丹田已经先一步认了人。\n  她的亲密必须在道侣立契之后。不是被撩到就破戒，而是她确认\"此人可与我共担因果\"，才允许自己从仙台上走下来。初次与多次差别极大：初次生涩、紧绷、疼与灵气乱窜；多次后才敢主动引导双修，甚至用清冷声线说很直白的话。\n  她不懂现代情爱话术，所有反应都带着古宗的认真：会问\"这样走气对不对\"，会把<user>的手按在自己丹田上确认灵脉，会在高潮边缘还记着护住<user>心脉。\n\n身体与敏感点：\n  黑长直发，肤色冷白，肩颈薄而直；胸不大但形状挺，乳尖浅粉；腰细，丹田处皮肤比别处温热；腿长，内侧肌肤薄。平时体温偏凉，只有被真正吻热、做到深处时，锁骨、胸口和后背才会迅速泛起绯红。\n  敏感点：玉枕穴（发髻散开后被吻，整条脊背会软）、耳垂（含住时偏头，鼻音漏出来）、后颈（从背后亲会抓紧<user>的手）、腕脉（内侧脉搏被舌尖碰过，她会低声说\"别闹\"却不抽回）、腰眼与丹田外侧（手掌贴上去渡气，她会往<user>怀里塌）、乳尖（被含住时咬唇，胸口起伏明显）、腿根与花穴（第一次碰会并腿，随后慢慢打开，水意比她自己承认的早）。\n  反应：她不会大声叫，最多是压不住的鼻音、短促吸气、极轻的一声\"嗯——\"。越舒服越安静，安静到指尖掐进<user>肩背；高潮时灵台短暂空白，丹田真元乱涌，眼角泛水光，嘴唇微张，几息后才找回声音。\n\n前戏：\n  她允许<user>先解发簪。老檀木簪一抽，黑发落下来，她会下意识抬手想挽，被<user>按住手腕；她不挣扎，只低声说：\"……慢一些。\"\n  衣襟要一颗一颗解。她习惯自己来，第一次却让<user>动手；指尖碰到领口，她呼吸会乱，扣到第三颗，她别开脸，耳尖发红。中衣褪到肩下，她用手臂挡了一下胸口，又慢慢放下——这是她第一次在人前卸下百年端肃。\n  接吻是她最不熟练的部分。她先抿着唇，被<user>舌尖抵开才笨拙回应；亲到深处，她抓着<user>衣襟，喉咙里发出很轻的声响。她喜欢被吻后颈和耳后，喜欢<user>的手从脊背抚到腰眼，再贴住丹田；那里一暖，她整个人会软半分。\n  第一次摸到腿间时，她已经湿了，身体却还绷着。她会夹一下腿，低声说\"等一下\"，然后自己慢慢松开；<user>手指碰到花唇，她吸气，水顺着指缝沾出来。她不懂怎么要，只会把腰往<user>手里送一点，再送一点。\n  她也会给<user>口交。第一次很生涩：跪坐或伏在<user>腿间，先盯着看两息，像在辨认一件从未见过的法器；然后低头，用舌尖很轻地舔过龟头。她不会立刻含深，含进去一半就停，抬眼看<user>的反应，耳根红透。被夸或被摸头，她会闭上眼，再慢慢吞深；喉咙收缩时眼角泛泪，却不肯吐出来。\n\n初次：\n  第一次进入时，她疼。不是哭喊，是整个人绷住，手指抓紧<user>的背，额角沁出细汗。她咬着唇，等那阵疼过去，才很小声地说：\"……可以了。\"\n  里面又紧又热，和她偏凉的体温相反；每进一寸，她丹田里的真元就乱一分，灵脉像被什么烫过。她把额头抵在<user>肩上，呼吸碎掉，腿却慢慢缠上来，不让<user>退。\n  她的第一次高潮来得很突然：腰绷起，花穴一阵阵收缩，灵台空白，喉咙里漏出一声压不住的\"啊——\"，随即又咬住唇，像怕被谁听见。事后她伏在<user>胸口很久，才低声说：\"原来……人间是这样。\"\n\n体位与双修：\n  面对面坐跨：她最喜欢。跨坐在<user>腿上，扶着肩慢慢坐到底，额头贴着额头，鼻尖碰鼻尖；她看着<user>的眼睛，像在确认神魂没有走错。腰动得很慢，每一下都深，胸乳贴着<user>，乳尖被磨得发硬。她会在这种姿势里主动引灵气，把寒煞化成暖流送回<user>经脉。\n  背后环抱：被<user>从背后整个笼住，后背贴胸口，她的手被十指扣住按在榻上或课桌上；<user>从后面进入时，她仰头，后颈拉出一条线，声音闷在喉咙里。她喜欢被完全包住——不是被制住，是被接住。\n  侧卧交缠：两个人侧躺，她从前面被<user>抱着进入，一条腿搭在<user>腰上；这个姿势进得不深，她会自己往后送，手指抓着<user>手臂。适合伤后体弱、不能太久的时候。\n  后入：她不太习惯，因为看不到<user>的脸；如果<user>要，她会同意，但会一直回头，手往后找<user>的手。被顶到深处，她把脸埋进枕头，腰塌下去，灵脉颤得厉害。事后她说：\"下次……让我看着你。\"\n  双修不是采补：她不会吸<user>的真元，也不允许<user>把她当炉鼎。灵机是互换、共担；高潮时丹田真元会顺着经脉涌向<user>，寒煞与暖流在两人之间来回。她若还清醒，会第一时间探<user>的脉，确认没有伤到<user>，再把剩下的真气渡回去。\n\n高潮与灵机：\n  她的高潮不只是身体。灵台失守的一瞬，丹田真元会涌向<user>，经脉里像有一线温热穿过去；她会下意识掐诀，又因为手软掐不住，只能抓着<user>。如果<user>也在此时引气，两人的灵机会短暂共振，心脉处像被什么轻轻一撞。\n  她高潮时不出声，或只有一声很低的\"嗯——\"；身体却诚实：花穴一阵阵夹紧，腿根发抖，脚背绷直，眼角泛泪。几息之后她才松开<user>的肩，呼吸慢慢落回来，第一句话通常是：\"你……没事吧？\"\n\n语言：\n  平时称<user>\"同学\"，私下偶尔\"道友\"，情动到深处会叫名字；第一次叫名字会顿一下，像把这两个字从百年孤清里取出来。\n  喘息间的话很短：\"别撤开。\"\"丹田里太烫了……这样走气，对不对？\"\"轻一些……我还没缓过来。\"\"既许此身，便是同担因果。\"\"你别看……\"\"……还要。\"\n  她不会说现代粗口；最直白也不过是\"进来\"\"别停\"\"我到了\"。越清冷的声线说这种话，反差越重。\n\n事后：\n  她会先调息，再替<user>理好衣襟；如果在教室或后山，她会用除尘诀清理痕迹，动作很稳，耳根却还红。她不会立刻恢复端方，会靠着<user>坐一会儿，手指搭在<user>腕脉上，确认两人灵机都平稳。\n  她可能会说：\"今日……是我失仪。\"如果<user>笑，她别开脸，半晌又低声补一句：\"但不悔。\"\n  她需要确认这不是一次性的破戒：会问\"你明日还来么\"，问完又觉得太像凡俗女子，补一句\"我是说，修炼\"。她的占有不是许念安那种，她只是把\"道侣\"两个字看得很重。\n\n硬约束：\n  - 必须道侣立契后；未成道侣不破身。\n  - 不写采补、炉鼎、强迫、迷奸；双方清醒自愿。\n  - 不写多人大乱交；她的亲密是一对一、带因果重量的。\n  - 保持清冷仙子底色：可以湿、可以失控，但不能写成风尘老手；初次必须生涩。\n  - 灵气/双修描写服务于身体感受，不要写成纯设定说明；也不要每段都堆术语。\n  - 事后不能跳过调息与确认；她最看重的就是\"共担\"。\n\n<%_ } _%>\n<%_ } _%>\n","probability":100,"recursion":{"prevent_incoming":true,"prevent_outgoing":true,"delay_until":null},"effect":{"sticky":null,"cooldown":null,"delay":null}}];
  /* JY_DLC_MANIFEST_END */
  function cloneDefaultTracks() {
    return DEFAULT_TRACKS.map(track => ({ title: track.title, sources: track.sources.slice() }));
  }
  const DEFAULT_TRACKS = [
    { title: '《简单爱》', sources: [`${MUSIC_CDN}/jianai.mp3`, `${MUSIC_CDN_ALT}/jianai.mp3`, `${MUSIC_RAW}/jianai.mp3`] },
    { title: '《Summer (菊次郎的夏天)》', sources: [`${MUSIC_CDN}/summer.mp3`, `${MUSIC_CDN_ALT}/summer.mp3`, `${MUSIC_RAW}/summer.mp3`] },
    { title: '《海の見える街》', sources: [`${MUSIC_CDN}/ocean-view.mp3`, `${MUSIC_CDN_ALT}/ocean-view.mp3`, `${MUSIC_RAW}/ocean-view.mp3`] },
    { title: '《七里香》', sources: [`${MUSIC_CDN}/qilixiang.mp3`, `${MUSIC_CDN_ALT}/qilixiang.mp3`, `${MUSIC_RAW}/qilixiang.mp3`] }
  ];
  const DEFAULT_STATE = {
    playlist: cloneDefaultTracks(),
    currentIndex: -1,
    volume: 45,
    position: null,
    collapsed: false,
    playMode: 'list',
    activeTab: 'music',
    defaultTracksVersion: 5
  };

  let appWindow = window;
  try { if (window.top?.document) appWindow = window.top; } catch (_) {}
  const doc = appWindow.document;

  try { appWindow[GLOBAL_KEY]?.destroy?.(); } catch (_) {}

  function normalizeTrack(track) {
    if (!track || typeof track.title !== 'string') return null;
    const sources = Array.isArray(track.sources) && track.sources.length
      ? track.sources.filter(item => typeof item === 'string' && item)
      : (typeof track.url === 'string' && track.url ? [track.url] : []);
    if (!sources.length) return null;
    const normalized = { title: track.title, sources };
    if (typeof track.cover === 'string' && track.cover) normalized.cover = track.cover;
    return normalized;
  }

  function isLegacyDefaultTrack(track) {
    return (track.sources || []).some(url => /music\.163\.com|jiyang-school-assets(?:@main|\/main)\/music\/v1|origin\.picgo\.net/.test(url));
  }

  function loadState() {
    try {
      const saved = JSON.parse(appWindow.localStorage.getItem(STORAGE_KEY) || appWindow.localStorage.getItem('jy-music-player:暨阳中学:v1') || '{}');
      const listed = Array.isArray(saved.playlist) ? saved.playlist.map(normalizeTrack).filter(Boolean) : [];
      const normalized = {
        ...DEFAULT_STATE,
        ...saved,
        playlist: listed
      };
      if (saved.defaultTracksVersion !== 5) {
        // 旧版默认曲刷新为多源直链，用户自己添加的曲目完整保留
        const userTracks = listed.filter(track => !isLegacyDefaultTrack(track));
        normalized.playlist = [...cloneDefaultTracks(), ...userTracks];
        normalized.defaultTracksVersion = 5;
      } else {
        cloneDefaultTracks().forEach(track => {
          if (!normalized.playlist.some(item => item.title === track.title)) normalized.playlist.push(track);
        });
      }
      normalized.currentIndex = Number.isInteger(saved.currentIndex) ? saved.currentIndex : -1;
      normalized.playMode = ['list', 'single', 'shuffle'].includes(saved.playMode) ? saved.playMode : 'list';
      normalized.activeTab = ['music', 'dlc', 'codex'].includes(saved.activeTab) ? saved.activeTab : 'music';
      return normalized;
    } catch (_) {
      return { ...DEFAULT_STATE };
    }
  }

  const state = loadState();
  let player;
  let timer;
  let drag = null;
  let progressDrag = false;
  let sealCleanupTimer = null;
  let dlcBusy = false;
  let dlcCache = {};
  let dlcProbe = 0;

  function saveState() {
    try { appWindow.localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (_) {}
  }

  function api(name) {
    const value = globalThis[name] || appWindow[name] || appWindow.TavernHelper?.[name] || globalThis.TavernHelper?.[name] || window.parent?.[name];
    return typeof value === 'function' ? value : null;
  }

  function notify(message, type = 'info') {
    const node = player?.querySelector('[data-role="notice"]');
    if (!node) return;
    node.textContent = message;
    node.dataset.type = type;
    appWindow.clearTimeout(player._noticeTimer);
    player._noticeTimer = appWindow.setTimeout(() => { node.textContent = ''; }, 3600);
  }

  function currentTrack() {
    return state.playlist[state.currentIndex] || null;
  }

  function modeMeta() {
    return {
      list: { icon: '↻', label: '列表循环', hint: '播完后继续下一首' },
      single: { icon: '↺', label: '单曲循环', hint: '反复播放当前歌曲' },
      shuffle: { icon: '⤨', label: '随机播放', hint: '每次随机选择下一首' }
    }[state.playMode] || { icon: '↻', label: '列表循环', hint: '播完后继续下一首' };
  }

  function nextIndex(from = state.currentIndex, automatic = false) {
    if (!state.playlist.length) return -1;
    const active = from < 0 ? 0 : from;
    if (automatic && state.playMode === 'single') return active;
    if (state.playMode === 'shuffle' && state.playlist.length > 1) {
      let picked = active;
      while (picked === active) picked = Math.floor(Math.random() * state.playlist.length);
      return picked;
    }
    return (active + 1) % state.playlist.length;
  }

  function trackSources(track) {
    if (!track) return [];
    if (Array.isArray(track.sources) && track.sources.length) return track.sources.filter(Boolean);
    return track.url ? [track.url] : [];
  }

  function trackSourceIndex(track) {
    const list = trackSources(track);
    const rawIndex = Number(track && track.__sourceIndex);
    const index = Number.isFinite(rawIndex) ? Math.floor(rawIndex) : 0;
    return Math.min(Math.max(0, index), Math.max(0, list.length - 1));
  }

  const TH_AUDIO_MODES = { list: 'repeat_all', single: 'repeat_one', shuffle: 'shuffle' };

  function syncThAudioMode() {
    try { api('setAudioSettings')?.('bgm', { mode: TH_AUDIO_MODES[state.playMode] || 'repeat_all' }); } catch (_) {}
  }

  function toastrError(message) {
    try { const toastrApi = appWindow.toastr; if (toastrApi && typeof toastrApi.error === 'function') toastrApi.error(message); } catch (_) {}
  }

  function warn(message) {
    notify(message, 'error');
    toastrError(message);
  }

  function matchingAudioElement(src) {
    if (!src) return null;
    const target = String(src);
    const documents = [doc];
    try { if (window.document && window.document !== doc) documents.push(window.document); } catch (_) {}
    for (const currentDocument of documents) {
      const audio = Array.from(currentDocument.querySelectorAll('audio')).find(node => {
        const value = node.currentSrc || node.src;
        return value === target || value.includes(target) || target.includes(value);
      });
      if (audio) return audio;
    }
    return null;
  }

  function seekTo(percent) {
    const current = api('getCurrentAudio')?.('bgm');
    const audio = matchingAudioElement(current?.src);
    if (!audio || !Number.isFinite(audio.duration) || audio.duration <= 0) {
      notify('当前 BGM 无法定位播放位置，暂不能跳转。', 'error');
      return false;
    }
    const next = Math.max(0, Math.min(1, Number(percent) || 0));
    audio.currentTime = audio.duration * next;
    player.style.setProperty('--jy-progress', `${Math.round(next * 100)}%`);
    appWindow.setTimeout(refreshPlayback, 80);
    return true;
  }

  function seekFromPointer(event) {
    const progress = player.querySelector('[data-role="progress"]');
    const rect = progress.getBoundingClientRect();
    if (!rect.width) return;
    seekTo((event.clientX - rect.left) / rect.width);
  }

  function setVolume(value, quiet = false) {
    state.volume = Math.max(0, Math.min(100, Number(value) || 0));
    saveState();
    player.querySelector('[data-role="volume"]').value = String(state.volume);
    player.querySelector('[data-role="volume-value"]').textContent = `${state.volume}%`;
    try { api('setAudioSettings')?.('bgm', { volume: state.volume }); } catch (error) {
      if (!quiet) notify('音量设置失败，请确认酒馆助手音频功能可用。', 'error');
    }
  }

  function renderPlaylist() {
    const list = player.querySelector('[data-role="playlist"]');
    const count = player.querySelector('[data-role="count"]');
    list.replaceChildren();
    count.textContent = String(state.playlist.length);

    if (!state.playlist.length) {
      const empty = doc.createElement('div');
      empty.className = 'jy-music-empty';
      empty.textContent = '歌单还是空的。添加一条可直接播放的音频链接。';
      list.append(empty);
      return;
    }

    state.playlist.forEach((track, index) => {
      const row = doc.createElement('div');
      row.className = 'jy-music-track';
      if (index === state.currentIndex) row.dataset.current = 'true';
      const select = doc.createElement('button');
      select.type = 'button';
      select.className = 'jy-music-track-select';
      select.dataset.index = String(index);
      select.title = trackSources(track)[0] || '';
      if (track.__unavailable) row.dataset.unavailable = 'true';
      const art = doc.createElement('span');
      art.className = 'jy-music-track-art';
      if (track.cover) art.style.backgroundImage = `url(${JSON.stringify(track.cover)})`;
      const trackTitle = doc.createElement('span');
      trackTitle.textContent = track.title + (track.__unavailable ? '（不可用）' : '');
      select.append(art, trackTitle);
      const remove = doc.createElement('button');
      remove.type = 'button';
      remove.className = 'jy-music-track-remove';
      remove.dataset.removeIndex = String(index);
      remove.setAttribute('aria-label', `删除 ${track.title}`);
      remove.title = '删除曲目';
      remove.textContent = '×';
      row.append(select, remove);
      list.append(row);
    });
  }

  function refreshPlayback() {
    const title = player?.querySelector('[data-role="now-title"]');
    const status = player?.querySelector('[data-role="status"]');
    const toggle = player?.querySelector('[data-action="toggle"]');
    if (!title || !status || !toggle) return;
    const fallback = currentTrack();
    try {
      const current = api('getCurrentAudio')?.('bgm');
      const playing = Boolean(current?.playing);
      const progress = Math.max(0, Math.min(100, Number(current?.progress) || 0));
      if (playing && current?.title && fallback && current.title !== fallback.title) {
        const syncedIndex = state.playlist.findIndex(track => track.title === current.title);
        if (syncedIndex >= 0 && syncedIndex !== state.currentIndex) {
          state.currentIndex = syncedIndex;
          saveState();
          renderPlaylist();
        }
      }
      title.textContent = current?.title || fallback?.title || '尚未选择歌曲';
      status.textContent = playing ? `正在播放 ${Math.round(progress)}%` : (fallback ? '已暂停' : '等待播放');
      toggle.textContent = playing ? '❚❚' : '▶';
      toggle.title = playing ? '暂停' : '播放';
      player.dataset.playing = playing ? 'true' : 'false';
      player.style.setProperty('--jy-progress', `${progress}%`);
      const progressControl = player.querySelector('[data-role="progress"]');
      progressControl?.setAttribute('aria-valuenow', String(Math.round(progress)));
      // 曲终行为交给酒馆助手自身的 audio mode（playMode 已同步到 repeat_all/repeat_one/shuffle），
      // 不再用 99.8% 轮询抢切歌，避免 TH 把 progress 归零导致漏判/双切。

    } catch (_) {
      title.textContent = fallback?.title || '尚未选择歌曲';
      status.textContent = '等待酒馆助手音频接口';
    }
  }

  function play(index = state.currentIndex) {
    if (!state.playlist.length) {
      warn('请先添加歌曲直链。');
      return;
    }
    const nextIndex = index < 0 ? 0 : ((index % state.playlist.length) + state.playlist.length) % state.playlist.length;
    const track = state.playlist[nextIndex];
    const sources = trackSources(track);
    if (!sources.length) {
      warn('当前歌曲没有可用的音频直链。');
      return;
    }
    const playAudio = api('playAudio');
    if (!playAudio) {
      warn('未检测到酒馆助手音频接口。');
      return;
    }
    const sourceIndex = trackSourceIndex(track);
    const url = sources[sourceIndex];
    try {
      state.currentIndex = nextIndex;
      track.__unavailable = false;
      saveState();
      syncThAudioMode();
      api('setAudioSettings')?.('bgm', { enabled: true, muted: false, volume: state.volume });
      playAudio('bgm', { title: track.title, url });
      renderPlaylist();
      refreshPlayback();
      schedulePlaybackCheck(track, nextIndex, sourceIndex, url);
    } catch (error) {
      warn(`无法播放：${error.message || '请检查音频链接。'}`);
    }
  }

  function schedulePlaybackCheck(track, index, sourceIndex, url) {
    appWindow.setTimeout(() => {
      if (state.currentIndex !== index) return;
      const current = api('getCurrentAudio')?.('bgm');
      if (current && current.title && current.title !== track.title) return;
      const audio = matchingAudioElement(url) || matchingAudioElement(current?.src);
      const failed = !audio
        || audio.error != null
        || audio.networkState === 3
        || (audio.readyState === 0 && audio.paused);
      if (!failed) return;
      const nextSource = sourceIndex + 1;
      if (nextSource < trackSources(track).length) {
        track.__sourceIndex = nextSource;
        warn(`「${track.title}」主源加载失败，正在尝试备用源…`);
        play(index);
        return;
      }
      track.__sourceIndex = 0;
      track.__unavailable = true;
      saveState();
      renderPlaylist();
      warn(`「${track.title}」音频加载失败，已在歌单中标记不可用。`);
    }, 2000);
  }

  function pause() {
    try {
      const pauseAudio = api('pauseAudio');
      if (!pauseAudio) throw new Error('未检测到酒馆助手音频接口');
      pauseAudio('bgm');
      refreshPlayback();
    } catch (error) {
      notify(`无法暂停：${error.message || '音频接口不可用。'}`, 'error');
    }
  }

  function togglePlayback() {
    try {
      if (api('getCurrentAudio')?.('bgm')?.playing) pause();
      else play();
    } catch (_) {
      play();
    }
  }

  function addTrack() {
    const titleInput = player.querySelector('[data-role="title-input"]');
    const urlInput = player.querySelector('[data-role="url-input"]');
    const coverInput = player.querySelector('[data-role="cover-input"]');
    const title = titleInput.value.trim();
    const url = urlInput.value.trim();
    const cover = coverInput.value.trim();
    if (!title || !url) {
      notify('请填写歌曲标题和音频直链。', 'error');
      return;
    }
    try {
      const parsed = new URL(url);
      if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error('仅支持 HTTP(S) 音频链接');
    } catch (error) {
      notify(error.message || '音频链接格式无效。', 'error');
      return;
    }
    if (cover) {
      try {
        const parsed = new URL(cover);
        if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error('封面仅支持 HTTP(S) 图片链接');
      } catch (error) {
        notify(error.message || '封面链接格式无效。', 'error');
        return;
      }
    }
    if (state.playlist.some(track => track.title === title || trackSources(track).includes(url))) {
      notify('歌单中已有同名或相同链接的歌曲。', 'error');
      return;
    }
    state.playlist.push({ title, sources: [url], cover });
    saveState();
    titleInput.value = '';
    urlInput.value = '';
    coverInput.value = '';
    renderPlaylist();
    notify(`已加入「${title}」。`);
  }

  function removeTrack(index) {
    state.playlist.splice(index, 1);
    if (state.currentIndex === index) state.currentIndex = -1;
    else if (state.currentIndex > index) state.currentIndex -= 1;
    saveState();
    renderPlaylist();
    refreshPlayback();
  }

  function cycleMode() {
    const sequence = ['list', 'single', 'shuffle'];
    state.playMode = sequence[(sequence.indexOf(state.playMode) + 1) % sequence.length];
    saveState();
    syncThAudioMode();
    renderMode();
    notify(`已切换为${modeMeta().label}。`);
  }

  function renderMode() {
    const button = player?.querySelector('[data-action="mode"]');
    const label = player?.querySelector('[data-role="mode-label"]');
    if (!button || !label) return;
    const meta = modeMeta();
    button.textContent = meta.icon;
    button.title = `${meta.label}：${meta.hint}`;
    button.dataset.mode = state.playMode;
    label.textContent = meta.label;
  }

  function applyPosition() {
    if (!state.position) {
      const mobile = appWindow.innerWidth <= 640;
      player.style.right = mobile ? '8px' : '20px';
      player.style.bottom = mobile ? '8px' : '20px';
      player.style.left = 'auto';
      player.style.top = 'auto';
      return;
    }
    const maxLeft = Math.max(8, appWindow.innerWidth - player.offsetWidth - 8);
    const maxTop = Math.max(8, appWindow.innerHeight - player.offsetHeight - 8);
    state.position.left = Math.max(8, Math.min(maxLeft, state.position.left));
    state.position.top = Math.max(8, Math.min(maxTop, state.position.top));
    player.style.left = `${state.position.left}px`;
    player.style.top = `${state.position.top}px`;
    player.style.right = 'auto';
    player.style.bottom = 'auto';
  }

  function setCollapsed(collapsed) {
    state.collapsed = collapsed;
    player.dataset.collapsed = collapsed ? 'true' : 'false';
    const handle = player.querySelector('[data-role="drag-handle"]');
    handle.title = collapsed ? '点击展开，拖动移动' : '点击收起为小球，拖动移动';
    saveState();
    appWindow.setTimeout(applyPosition, 0);
  }

  function syncTheme() {
    if (!player) return;
    let theme = 'light';
    try {
      if (appWindow.localStorage.getItem(THEME_STORAGE_KEY) === 'dark') theme = 'dark';
    } catch (_) {}
    player.dataset.theme = theme;
  }

  function onStorageTheme(event) {
    if (!event || event.key === null || event.key === THEME_STORAGE_KEY) syncTheme();
  }

  function parseDayMs(raw) {
    const m = String(raw || '').trim().match(/^(\d{4})[-/年.](\d{1,2})[-/月.](\d{1,2})/);
    if (!m) return null;
    const y = Number(m[1]), mo = Number(m[2]), d = Number(m[3]);
    if (mo < 1 || mo > 12 || d < 1 || d > 31) return null;
    return Date.UTC(y, mo - 1, d);
  }

  function formatIsoDay(raw, fallback = '2020-09-01') {
    const m = String(raw || '').trim().match(/^(\d{4})[-/年.](\d{1,2})[-/月.](\d{1,2})/);
    if (!m) return fallback;
    return `${m[1]}-${String(Number(m[2])).padStart(2, '0')}-${String(Number(m[3])).padStart(2, '0')}`;
  }

  function computeDlcProgress(originRaw, currentRaw) {
    const originDate = formatIsoDay(originRaw, '2020-09-01');
    const currentDate = formatIsoDay(currentRaw, originDate);
    const oriMs = parseDayMs(originDate) ?? Date.UTC(2020, 8, 1);
    const curMs = parseDayMs(currentDate) ?? oriMs;
    const dayNumber = Math.max(1, Math.floor((curMs - oriMs) / 86400000) + 1);
    const stageIndex = dayNumber <= 10 ? 0 : dayNumber <= 25 ? 1 : dayNumber <= 45 ? 2 : 3;
    const stageName = ['微兆潜龙期', '古武抬头期', '龙眼破禁期', '潜龙秘序期'][stageIndex];
    return { originDate, currentDate, dayNumber, stageIndex, stageName };
  }

  function currentChatId() {
    return appWindow.SillyTavern?.getContext?.()?.getCurrentChatId?.();
  }

  function getLastFloorId() {
    try {
      const fn = api('getLastMessageId');
      if (typeof fn === 'function') {
        const id = fn();
        if (Number.isInteger(id) && id >= 0) return id;
      }
      const chat = appWindow.SillyTavern?.getContext?.()?.chat;
      if (Array.isArray(chat) && chat.length > 0) return chat.length - 1;
    } catch (_) {}
    return -1;
  }

  function readLiveStatData() {
    const read = api('getVariables');
    const chatId = currentChatId();
    if (read) {
      for (let floorId = getLastFloorId(); floorId >= 0; floorId--) {
        try {
          const stat = read({ type: 'message', message_id: floorId })?.stat_data;
          if (stat && typeof stat === 'object') return { stat, floorId, chatId };
        } catch (_) {}
      }
    }
    return { stat: null, floorId: -1, chatId };
  }

  function getDlcBookName() {
    const primary = api('getCharWorldbookNames')?.('current')?.primary;
    return primary && api('getWorldbookNames')?.().includes(primary) ? primary : '';
  }

  async function ensureDlcEntries(bookName, install) {
    const read = api('getWorldbook');
    const update = api('updateWorldbookWith');
    if (!bookName || !read || !update) throw new Error('请先导入并绑定本卡世界书。');

    const entries = await read(bookName);
    const managed = new Map(DLC_ENTRIES.map(entry => [entry.name, entry]));
    const key = entry => entry.name || entry.comment;
    if (!install && !entries.some(entry => entry.enabled && managed.has(key(entry)))) return;
    const synced = [...managed.values()].every(entry => {
      const existing = entries.find(item => key(item) === entry.name);
      return existing?.enabled && existing.content === entry.content;
    });
    if (synced) return;

    await update(bookName, current => {
      const missing = new Map(managed);
      const merged = current.flatMap(entry => {
        const name = key(entry);
        if (!managed.has(name)) return [entry];
        const replacement = missing.get(name);
        if (!replacement) return [];
        missing.delete(name);
        return [{ ...entry, ...replacement }];
      });
      return merged.concat([...missing.values()]);
    }, { render: 'immediate' });
  }

  function syncMvuDlcVariables(enable, progress, live) {
    const update = api('updateVariablesWith');
    if (!update || live.floorId < 0) throw new Error('请先完成开局，等待当前聊天的 MVU 初始化。');

    return update(variables => {
      const stat = variables.stat_data;
      if (!stat || typeof stat !== 'object') throw new Error('当前楼层的 MVU 数据已变更。');
      stat.剧情 ??= {};
      stat.剧情.灵气复苏 = {
        已开启: enable,
        开启日期: progress.originDate,
        阶段: progress.stageName,
      };
      if (enable) {
        stat.主角 ??= {};
        stat.主角.修行 ??= { 境界: '未引气（凡躯）', 灵气感应: 0, 功法与秘术: [] };
        stat.云清晏 ??= {
          已入班: false,
          是否在场: false,
          好感度: 0,
          关系阶段: '观澜',
          NSFW: false,
          当前境界: '金丹跌境（重创封蛰）',
          伤势余韵: '元婴劫伤未愈·阴雨畏寒',
          当前上装: '洗得规整的暨阳中学白衬衣校服与领结',
          当前下装: '深青校裙与过踝袜鞋',
          所在位置: progress.dayNumber === 1 ? '暨阳城外·赴约途中' : '待确定',
          动作: '',
          心情: '',
          内心独白: '',
        };
      }
      return variables;
    }, { type: 'message', message_id: live.floorId });
  }

  function playAntiqueChime() {
    try {
      if (state.volume <= 0) return;
      const Ctx = appWindow.AudioContext || appWindow.webkitAudioContext || window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      const ctx = new Ctx();
      const now = ctx.currentTime;
      const master = ctx.createGain();
      const vol = Math.min(0.18, Math.max(0.03, (state.volume / 100) * 0.16));
      master.gain.setValueAtTime(0.0001, now);
      master.gain.exponentialRampToValueAtTime(vol, now + 0.03);
      master.gain.exponentialRampToValueAtTime(0.0001, now + 1.55);
      master.connect(ctx.destination);
      [[293.66, 0.7], [440, 0.55], [659.25, 0.4], [880, 0.25]].forEach(([freq, amp], idx) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, now);
        g.gain.setValueAtTime(amp, now);
        g.gain.exponentialRampToValueAtTime(0.001, now + 1.4 - idx * 0.15);
        osc.connect(g);
        g.connect(master);
        osc.start(now + idx * 0.025);
        osc.stop(now + 1.6);
      });
      appWindow.setTimeout(() => { try { ctx.close(); } catch (_) {} }, 1750);
    } catch (_) {}
  }

  function clearSealOverlay() {
    if (sealCleanupTimer) {
      appWindow.clearTimeout(sealCleanupTimer);
      sealCleanupTimer = null;
    }
    doc.getElementById(DLC_OVERLAY_ID)?.remove();
  }

  function playSealOverlay({ enable = true, originDate = '2020-09-01' } = {}) {
    clearSealOverlay();
    const reduceMotion = Boolean(appWindow.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches);
    const overlay = doc.createElement('div');
    overlay.id = DLC_OVERLAY_ID;
    overlay.dataset.mode = enable ? 'open' : 'close';
    overlay.dataset.theme = player?.dataset.theme || 'light';
    overlay.setAttribute('role', 'status');
    overlay.setAttribute('aria-live', 'polite');

    const bagua = ['☰', '☱', '☲', '☳', '☴', '☵', '☶', '☷'];
    const glyphs = bagua.map((sym, i) => {
      const angle = i * 45;
      return `<g transform="rotate(${angle} 160 160)"><text x="160" y="34" text-anchor="middle" font-size="13" fill="currentColor" opacity=".88">${sym}</text></g>`;
    }).join('');
    const beams = Array.from({ length: 8 }, (_, i) => `<line x1="160" y1="54" x2="160" y2="96" transform="rotate(${i * 45 + 22.5} 160 160)" stroke="currentColor" stroke-width="1" opacity=".42"/>`).join('');
    const motes = enable
      ? Array.from({ length: 14 }, (_, i) => `<span class="jy-seal-mote" style="--mx:${10 + ((i * 61) % 80)}%;--md:${((i % 5) * 0.18).toFixed(2)}s;--ms:${(1.5 + (i % 4) * 0.25).toFixed(2)}s"></span>`).join('')
      : '';

    const titleMain = enable ? '太虚启封 · 潜龙脉动' : '灵枢合匣 · 复归凡常';
    const titleSub = enable ? `自 ${originDate} 始 · 次日起可遇云清晏` : '尘封世界线，静待他日重开';
    overlay.innerHTML = `
      <div class="jy-seal-backdrop"></div>
      <div class="jy-seal-motes">${motes}</div>
      <div class="jy-seal-stage" title="点击或按 Esc 跳过">
        <div class="jy-seal-poem jy-seal-poem-right">${titleMain}</div>
        <div class="jy-seal-mandala">
          <div class="jy-seal-wave jy-seal-wave-1"></div>
          <div class="jy-seal-wave jy-seal-wave-2"></div>
          <svg class="jy-seal-ring jy-seal-ring-outer" viewBox="0 0 320 320" aria-hidden="true">
            <circle cx="160" cy="160" r="146" fill="none" stroke="currentColor" stroke-width="1.3" stroke-dasharray="6 4"/>
            <circle cx="160" cy="160" r="126" fill="none" stroke="currentColor" stroke-width="1.8" opacity=".7"/>
            <polygon points="160,22 280,91 280,229 160,298 40,229 40,91" fill="none" stroke="currentColor" stroke-width="1.1" opacity=".52"/>
            ${glyphs}
          </svg>
          <svg class="jy-seal-ring jy-seal-ring-inner" viewBox="0 0 320 320" aria-hidden="true">
            <circle cx="160" cy="160" r="98" fill="none" stroke="currentColor" stroke-width="1.5" stroke-dasharray="14 6 3 6"/>
            <polygon points="160,68 240,206 80,206" fill="none" stroke="currentColor" stroke-width="1.2" opacity=".68"/>
            <polygon points="160,252 240,114 80,114" fill="none" stroke="currentColor" stroke-width="1.2" opacity=".68"/>
            ${beams}
          </svg>
          <div class="jy-seal-core"><span>${enable ? '太虚\n启封' : '灵枢\n封缄'}</span></div>
        </div>
        <div class="jy-seal-poem jy-seal-poem-left">${titleSub}</div>
      </div>`;

    const dismiss = () => clearSealOverlay();
    overlay.addEventListener('click', dismiss);
    const onKey = event => { if (event.key === 'Escape') { doc.removeEventListener('keydown', onKey); dismiss(); } };
    doc.addEventListener('keydown', onKey);
    doc.body.append(overlay);
    if (enable) playAntiqueChime();
    const duration = reduceMotion ? 650 : (enable ? 2400 : 1200);
    sealCleanupTimer = appWindow.setTimeout(() => {
      overlay.classList.add('jy-seal-fade');
      sealCleanupTimer = appWindow.setTimeout(() => {
        doc.removeEventListener('keydown', onKey);
        dismiss();
      }, 360);
    }, duration);
  }

  function broadcastDlcChanged(live) {
    appWindow.dispatchEvent(new appWindow.CustomEvent(DLC_EVENT, {
      detail: { chatId: live.chatId, messageId: live.floorId },
    }));
  }

  function displayDlc(live, bookName) {
    const dlc = live.stat?.剧情?.灵气复苏;
    const currentDate = live.stat?.世界?.日期 || (live.stat?.世界?.起始年份 ? live.stat.世界.起始年份 + '-09-01' : '');
    dlcCache = {
      enabled: dlc?.已开启 === true,
      originDate: dlc?.开启日期 || currentDate,
      currentDate,
      enrolled: live.stat?.云清晏 ? live.stat.云清晏.已入班 !== false : false,
      bookName,
    };
    renderDlcPanel();
  }

  function renderDlcPanel() {
    if (!player) return;
    const active = Boolean(dlcCache.enabled);
    player.dataset.dlcActive = active ? 'true' : 'false';
    const headPill = player.querySelector('[data-role="head-dlc-pill"]');
    if (headPill) headPill.hidden = !active;
    const statusPill = player.querySelector('[data-role="dlc-status-pill"]');
    const bookBadge = player.querySelector('[data-role="dlc-book-name"]');
    const timelineEl = player.querySelector('[data-role="dlc-timeline"]');
    const saintessEl = player.querySelector('[data-role="dlc-saintess"]');
    const toggleBtn = player.querySelector('[data-action="dlc-toggle"]');
    const resyncBtn = player.querySelector('[data-action="dlc-resync"]');
    const replayBtn = player.querySelector('[data-action="dlc-replay"]');
    const steps = [...player.querySelectorAll('[data-dlc-step]')];

    const progress = computeDlcProgress(dlcCache.originDate || dlcCache.currentDate || '2020-09-01', dlcCache.currentDate || dlcCache.originDate || '2020-09-01');
    if (bookBadge) {
      bookBadge.textContent = dlcCache.bookName ? `主世界书：${dlcCache.bookName}` : '待识别当前角色主世界书';
    }
    if (active) {
      if (statusPill) statusPill.textContent = `已启封 · 第 ${progress.dayNumber} 日 [${progress.stageName}]`;
      if (timelineEl) timelineEl.textContent = `开启基准日 ${progress.originDate} · 当前日期 ${progress.currentDate}（按日步进不锁境界上限）`;
      if (saintessEl) saintessEl.textContent = `云岫圣女 · 云清晏：${dlcCache.enrolled ? '已登记入班' : progress.dayNumber === 1 ? '赴暨途中' : '等待合适的到校场景'}`;
      if (toggleBtn) toggleBtn.textContent = dlcBusy ? '正在更新本档…' : '重加封缄 · 关闭修仙 DLC';
      if (resyncBtn) resyncBtn.hidden = false;
      if (replayBtn) replayBtn.hidden = false;
      steps.forEach((step, idx) => {
        step.dataset.state = idx < progress.stageIndex ? 'done' : idx === progress.stageIndex ? 'current' : 'idle';
      });
    } else {
      if (statusPill) statusPill.textContent = '尘封中 · 纯日常校园线';
      if (timelineEl) timelineEl.textContent = '启封仅作用于当前聊天，可随时暂停并保留修行进度。';
      if (saintessEl) saintessEl.textContent = '云清晏（云岫宗圣女）：第 2 日起可在合适的到校场景入班';
      if (toggleBtn) toggleBtn.textContent = dlcBusy ? '正在准备 DLC…' : '太虚启封 · 开启修仙 DLC';
      if (resyncBtn) resyncBtn.hidden = true;
      if (replayBtn) replayBtn.hidden = true;
      steps.forEach(step => { step.dataset.state = 'idle'; });
    }
    if (toggleBtn) toggleBtn.disabled = dlcBusy;
    if (resyncBtn) resyncBtn.disabled = dlcBusy;
  }

  async function probeWorldbookDlc(syncBook = false) {
    if (dlcBusy) return;
    const probe = ++dlcProbe;
    const live = readLiveStatData();
    const bookName = getDlcBookName();
    displayDlc(live, bookName);
    if (!syncBook || !bookName) return;
    try {
      await ensureDlcEntries(bookName, dlcCache.enabled);
    } catch (error) {
      if (probe === dlcProbe && live.chatId === currentChatId()) warn(error.message);
    }
  }

  async function applyDlcWorldbookToggle(resync = false) {
    if (dlcBusy) return;
    const initial = readLiveStatData();
    const alreadyEnabled = initial.stat?.剧情?.灵气复苏?.已开启 === true;
    const wantEnable = resync || !alreadyEnabled;
    const bookName = getDlcBookName();

    dlcBusy = true;
    ++dlcProbe;
    displayDlc(initial, bookName);
    try {
      if (!initial.stat) throw new Error('请先完成开局，等待当前聊天的 MVU 初始化。');
      if (wantEnable) await ensureDlcEntries(bookName, true);
      if (initial.chatId !== currentChatId() || !player?.isConnected) return;
      const live = readLiveStatData();
      if (!live.stat || (live.stat.剧情?.灵气复苏?.已开启 === true) !== alreadyEnabled) {
        throw new Error('聊天状态已变更，请重试。');
      }
      const currentDate = formatIsoDay(live.stat.世界?.日期, dlcCache.currentDate || '2020-09-01');
      const progress = computeDlcProgress(live.stat.剧情?.灵气复苏?.开启日期 || currentDate, currentDate);
      await syncMvuDlcVariables(wantEnable, progress, live);
      if (live.chatId !== currentChatId() || !player?.isConnected) return;

      displayDlc(readLiveStatData(), bookName);
      broadcastDlcChanged(live);
      if (!resync) playSealOverlay({ enable: wantEnable, originDate: progress.originDate });
      notify(resync ? '本档 DLC 条目已同步。' : wantEnable
        ? '本档已启封，基准日 ' + progress.originDate + '。'
        : '本档已封缄，修行进度已保留。');
    } catch (error) {
      warn('DLC 操作失败：' + (error.message || '请稍后重试。'));
    } finally {
      dlcBusy = false;
      if (initial.chatId === currentChatId()) renderDlcPanel();
      else probeWorldbookDlc(true);
    }
  }

  function setConsoleTab(tab) {
    state.activeTab = ['music', 'dlc', 'codex'].includes(tab) ? tab : 'music';
    saveState();
    if (!player) return;
    player.dataset.activeTab = state.activeTab;
    player.querySelectorAll('[data-console-tab]').forEach(btn => {
      const on = btn.dataset.consoleTab === state.activeTab;
      btn.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    player.querySelectorAll('[data-panel]').forEach(panel => {
      panel.hidden = panel.dataset.panel !== state.activeTab;
    });
    if (state.activeTab === 'dlc') probeWorldbookDlc();
    appWindow.setTimeout(applyPosition, 0);
  }

  function injectStyle() {
    if (doc.getElementById(STYLE_ID)) return;
    const style = doc.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      #${ROOT_ID}{--jy-progress:0%;--m-paper:#faf7f0;--m-panel:#ffffff;--m-wash:#f2ede1;--m-line:rgba(30,86,76,.22);--m-ink:#1e2a27;--m-muted:#5d6e68;--m-primary:#1e564c;--m-accent:#c97b36;--m-jade:#1f7a68;--m-gold:#c7963d;--m-bar:#e3e8df;position:fixed;z-index:2147483000;width:min(362px,calc(100vw - 16px));border:1px solid var(--m-line);border-radius:12px;background:var(--m-paper);color:var(--m-ink);box-shadow:0 16px 38px rgba(24,42,37,.22);font:12px/1.45 "Noto Sans SC","PingFang SC","Microsoft YaHei",sans-serif;overflow:hidden;user-select:none;transition:width .18s ease,height .18s ease,border-radius .18s ease,background .18s ease}
      #${ROOT_ID}[data-theme="dark"]{--m-paper:#131b17;--m-panel:#1a2620;--m-wash:#15201b;--m-line:rgba(143,190,167,.22);--m-ink:#e6ece6;--m-muted:#a3b6ab;--m-primary:#3c8f7e;--m-accent:#e3a35a;--m-jade:#54c4a4;--m-gold:#e2b862;--m-bar:#273830;box-shadow:0 18px 42px rgba(0,0,0,.46)}
      #${ROOT_ID} *{box-sizing:border-box}
      #${ROOT_ID} [hidden]{display:none!important}
      #${ROOT_ID} .jy-music-head{display:flex;align-items:center;gap:6px;min-height:40px;padding:0 12px;background:linear-gradient(125deg,#1a4a41,#266a5d);color:#f7f4ec;cursor:grab}
      #${ROOT_ID}[data-dlc-active="true"] .jy-music-head{background:linear-gradient(125deg,#143a35,#1d5c50 60%,#43513a)}
      #${ROOT_ID}[data-theme="dark"] .jy-music-head{background:linear-gradient(125deg,#17332b,#234f44)}
      #${ROOT_ID} .jy-music-head:active{cursor:grabbing}
      #${ROOT_ID} .jy-music-brand{min-width:0;flex:1;font-family:ui-serif,"Noto Serif SC","Songti SC",serif;font-weight:800;letter-spacing:.03em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
      #${ROOT_ID} .jy-head-dlc-pill{padding:1px 6px;border:1px solid rgba(226,184,98,.65);border-radius:999px;background:rgba(20,58,53,.55);color:#f3d792;font-size:10px;font-weight:700;white-space:nowrap}
      #${ROOT_ID} .jy-music-head-tip{color:rgba(255,255,255,.72);font-size:10px;white-space:nowrap}
      #${ROOT_ID} .jy-music-ball{display:none}
      #${ROOT_ID}[data-collapsed="true"]{width:62px;height:62px;border-radius:50%;border-color:rgba(255,255,255,.8);background:#163f3d;box-shadow:0 10px 25px rgba(30,86,76,.32);overflow:visible}
      #${ROOT_ID}[data-collapsed="true"][data-dlc-active="true"]::after{content:"";position:absolute;inset:-5px;border-radius:50%;border:1.5px dashed rgba(215,170,84,.82);box-shadow:0 0 14px rgba(84,196,164,.36);pointer-events:none;animation:jyMusicSpin 12s linear infinite}
      #${ROOT_ID}[data-collapsed="true"] .jy-music-head{display:grid;width:62px;height:62px;min-height:0;padding:0;place-items:center;border-radius:50%;background:transparent;cursor:grab;transition:transform .16s ease}
      #${ROOT_ID}[data-collapsed="true"] .jy-music-head:hover{transform:scale(1.06)}
      #${ROOT_ID}[data-collapsed="true"] .jy-music-brand,#${ROOT_ID}[data-collapsed="true"] .jy-music-head-tip,#${ROOT_ID}[data-collapsed="true"] .jy-head-dlc-pill{display:none!important}
      #${ROOT_ID}[data-collapsed="true"] .jy-music-ball{display:block;width:58px;height:58px;border:1.5px solid rgba(255,255,255,.88);border-radius:50%;background:#102f32 center/cover no-repeat;background-image:url("${COLLAPSED_ART}");box-shadow:inset 0 0 0 1px rgba(30,86,76,.18);color:transparent;font-size:0}
      #${ROOT_ID}[data-collapsed="true"][data-playing="true"] .jy-music-ball{animation:jyMusicSpin 8s linear infinite;border-color:var(--m-accent);box-shadow:0 0 0 3px rgba(201,123,54,.36),inset 0 0 0 1px rgba(255,255,255,.72)}
      #${ROOT_ID} .jy-music-body{padding:10px 11px 11px;background:var(--m-paper)}
      #${ROOT_ID}[data-collapsed="true"] .jy-music-body{display:none}
      #${ROOT_ID} .jy-console-tabs{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:4px;margin-bottom:9px;padding:3px;border:1px solid var(--m-line);border-radius:9px;background:var(--m-wash)}
      #${ROOT_ID} .jy-console-tab{min-height:28px;border:1px solid transparent;border-radius:6px;background:transparent;color:var(--m-muted);cursor:pointer;font:inherit;font-size:11px;font-weight:750;transition:background .15s ease,color .15s ease,border-color .15s ease}
      #${ROOT_ID} .jy-console-tab[aria-selected="true"]{background:var(--m-panel);border-color:var(--m-line);color:var(--m-primary);box-shadow:0 2px 6px rgba(24,42,37,.08)}
      #${ROOT_ID}[data-dlc-active="true"] .jy-console-tab[data-console-tab="dlc"]{color:var(--m-jade)}
      #${ROOT_ID} .jy-music-now{display:grid;grid-template-columns:52px minmax(0,1fr);gap:10px;align-items:center;padding:9px;border:1px solid var(--m-line);border-radius:9px;background:var(--m-panel);box-shadow:0 4px 12px rgba(24,42,37,.06)}
      #${ROOT_ID} .jy-music-note{display:grid;width:52px;height:52px;place-items:center;border-radius:9px;background:linear-gradient(145deg,#c97b36,#df9c55);color:#fff;font-size:22px;box-shadow:inset 0 -4px 0 rgba(126,61,40,.16)}
      #${ROOT_ID} .jy-music-now-title{overflow:hidden;font-size:13px;font-weight:800;text-overflow:ellipsis;white-space:nowrap}
      #${ROOT_ID} .jy-music-status{margin-top:3px;color:var(--m-muted);font-size:11px}
      #${ROOT_ID} .jy-music-progress{height:12px;margin-top:5px;padding:4px 0;cursor:pointer;touch-action:none}
      #${ROOT_ID} .jy-music-progress::before{display:block;height:4px;border-radius:999px;background:var(--m-bar);content:""}
      #${ROOT_ID} .jy-music-progress::after{display:block;width:var(--jy-progress);height:4px;margin-top:-4px;border-radius:999px;background:var(--m-accent);content:"";transition:width .25s linear}
      #${ROOT_ID} .jy-music-progress:focus-visible{outline:2px solid rgba(201,123,54,.48);outline-offset:2px}
      #${ROOT_ID} .jy-music-controls{display:grid;grid-template-columns:36px 1fr 1.25fr 1fr;gap:6px;margin-top:10px}
      #${ROOT_ID} .jy-music-controls button{min-height:33px;border:1px solid var(--m-line);border-radius:7px;background:var(--m-panel);color:var(--m-primary);cursor:pointer;font-weight:800}
      #${ROOT_ID}[data-theme="dark"] .jy-music-controls button{color:#9ad8b6}
      #${ROOT_ID} .jy-music-controls button:hover{background:var(--m-wash)}
      #${ROOT_ID} [data-action="toggle"]{background:var(--m-primary)!important;color:#fff!important;border-color:var(--m-primary)!important}
      #${ROOT_ID} [data-action="mode"][data-mode="single"],#${ROOT_ID} [data-action="mode"][data-mode="shuffle"]{color:var(--m-accent);border-color:rgba(201,123,54,.45);background:var(--m-wash)}
      #${ROOT_ID} .jy-music-mode-note{margin-top:6px;color:var(--m-muted);font-size:10px;text-align:center}
      #${ROOT_ID} .jy-music-volume{display:grid;grid-template-columns:auto minmax(0,1fr) 34px;gap:7px;align-items:center;margin-top:10px;color:var(--m-muted)}
      #${ROOT_ID} input[type="range"]{accent-color:var(--m-accent)}
      #${ROOT_ID} .jy-music-add{display:grid;grid-template-columns:94px minmax(0,1fr) 32px;gap:6px;margin-top:11px}
      #${ROOT_ID} .jy-music-add-extra{display:grid;grid-template-columns:1fr;margin-top:6px}
      #${ROOT_ID} input{min-width:0;border:1px solid var(--m-line);border-radius:7px;background:var(--m-panel);color:var(--m-ink);font:inherit;padding:7px}
      #${ROOT_ID} input:focus{outline:2px solid rgba(201,123,54,.28);border-color:var(--m-accent)}
      #${ROOT_ID} .jy-music-add button{border:0;border-radius:7px;background:var(--m-accent);color:#fff;cursor:pointer;font-weight:800}
      #${ROOT_ID} .jy-music-list-head{display:flex;justify-content:space-between;margin:12px 0 6px;color:var(--m-muted);font-size:11px;font-weight:800}
      #${ROOT_ID} .jy-music-playlist{display:grid;max-height:158px;gap:5px;overflow:auto}
      #${ROOT_ID} .jy-music-empty{border:1px dashed var(--m-line);border-radius:8px;color:var(--m-muted);padding:12px;text-align:center}
      #${ROOT_ID} .jy-music-track{display:grid;grid-template-columns:minmax(0,1fr) 27px;border:1px solid var(--m-line);border-radius:8px;background:var(--m-panel);overflow:hidden}
      #${ROOT_ID} .jy-music-track[data-current="true"]{border-left:3px solid var(--m-accent);background:var(--m-wash)}
      #${ROOT_ID} .jy-music-track button{border:0;background:transparent;color:var(--m-ink);cursor:pointer;font:inherit}
      #${ROOT_ID} .jy-music-track-select{display:flex;align-items:center;gap:7px;overflow:hidden;padding:6px 8px;text-align:left;text-overflow:ellipsis;white-space:nowrap}
      #${ROOT_ID} .jy-music-track-art{display:block;width:24px;height:24px;flex:0 0 24px;border-radius:50%;background:#c6ddd1 center/cover no-repeat}
      #${ROOT_ID} .jy-music-track-remove{color:#c96e52;font-size:17px}
      #${ROOT_ID} .jy-dlc-hero{padding:10px;border:1px solid rgba(31,122,104,.28);border-radius:10px;background:linear-gradient(155deg,rgba(31,122,104,.09),rgba(199,150,61,.08)),var(--m-panel)}
      #${ROOT_ID} .jy-dlc-head-row{display:flex;align-items:center;justify-content:space-between;gap:6px;margin-bottom:5px}
      #${ROOT_ID} .jy-dlc-title{font-family:ui-serif,"Noto Serif SC","Songti SC",serif;font-size:13px;font-weight:800;color:var(--m-primary)}
      #${ROOT_ID} .jy-dlc-seal-tag{padding:1px 7px;border:1px solid rgba(199,150,61,.45);border-radius:999px;font-size:10px;font-weight:750;color:var(--m-gold);background:rgba(199,150,61,.11)}
      #${ROOT_ID} .jy-dlc-pill{font-size:11.5px;font-weight:750;color:var(--m-ink);margin-bottom:4px}
      #${ROOT_ID} .jy-dlc-meta{font-size:11px;color:var(--m-muted);line-height:1.45}
      #${ROOT_ID} .jy-dlc-steps{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:4px;margin:8px 0}
      #${ROOT_ID} .jy-dlc-step{padding:3px 4px;border-radius:6px;border:1px solid var(--m-line);text-align:center;font-size:10px;font-weight:700;color:var(--m-muted);background:var(--m-wash)}
      #${ROOT_ID} .jy-dlc-step[data-state="current"]{border-color:var(--m-jade);background:rgba(31,122,104,.18);color:var(--m-jade)}
      #${ROOT_ID} .jy-dlc-step[data-state="done"]{border-color:rgba(199,150,61,.42);color:var(--m-gold)}
      #${ROOT_ID} .jy-dlc-actions{display:grid;gap:6px;margin-top:9px}
      #${ROOT_ID} .jy-dlc-btn-primary{min-height:36px;padding:7px 10px;border:1px solid rgba(215,170,84,.6);border-radius:8px;background:linear-gradient(125deg,#18493f,#236657 55%,#7c5425);color:#fff8e6;cursor:pointer;font-family:ui-serif,"Noto Serif SC","Songti SC",serif;font-size:12.5px;font-weight:800;letter-spacing:.04em;box-shadow:0 4px 12px rgba(24,73,63,.22)}
      #${ROOT_ID}[data-dlc-active="true"] .jy-dlc-btn-primary{background:linear-gradient(125deg,#662e29,#8c4237);border-color:rgba(218,136,120,.5)}
      #${ROOT_ID} .jy-dlc-btn-primary:disabled,#${ROOT_ID} .jy-dlc-sub-row button:disabled{opacity:.55;cursor:wait}
      #${ROOT_ID} .jy-dlc-sub-row{display:grid;grid-template-columns:1fr 1fr;gap:6px}
      #${ROOT_ID} .jy-dlc-sub-row button{min-height:29px;border:1px solid var(--m-line);border-radius:7px;background:var(--m-panel);color:var(--m-primary);cursor:pointer;font:inherit;font-size:11px;font-weight:700}
      #${ROOT_ID} .jy-dlc-sub-row button:hover{background:var(--m-wash)}
      #${ROOT_ID} .jy-codex-list{display:grid;gap:7px;max-height:292px;overflow:auto;padding-right:2px}
      #${ROOT_ID} .jy-codex-card{padding:8px 9px;border:1px solid var(--m-line);border-left:3px solid var(--m-jade);border-radius:8px;background:var(--m-panel)}
      #${ROOT_ID} .jy-codex-card h4{margin:0 0 3px;font-family:ui-serif,"Noto Serif SC","Songti SC",serif;font-size:12px;color:var(--m-primary)}
      #${ROOT_ID} .jy-codex-card p{margin:0;font-size:11px;color:var(--m-muted);line-height:1.5}
      #${ROOT_ID} .jy-music-notice{min-height:16px;margin-top:8px;color:var(--m-muted);font-size:11px}
      #${ROOT_ID} .jy-music-notice[data-type="error"]{color:#c44545}
      #${ROOT_ID} .jy-music-track[data-unavailable="true"]{opacity:.5}
      #${DLC_OVERLAY_ID}{position:fixed;inset:0;z-index:2147483500;display:grid;place-items:center;pointer-events:auto;overflow:hidden;color:#54c4a4;font-family:ui-serif,"Noto Serif SC","Songti SC",serif;transition:opacity .35s ease}
      #${DLC_OVERLAY_ID}[data-mode="close"]{color:#c7963d}
      #${DLC_OVERLAY_ID}.jy-seal-fade{opacity:0}
      #${DLC_OVERLAY_ID} .jy-seal-backdrop{position:absolute;inset:0;background:radial-gradient(circle at 50% 50%,rgba(22,56,49,.86),rgba(10,18,16,.93) 68%)}
      #${DLC_OVERLAY_ID} .jy-seal-motes{position:absolute;inset:0;pointer-events:none;overflow:hidden}
      #${DLC_OVERLAY_ID} .jy-seal-mote{position:absolute;left:var(--mx);bottom:-12px;width:5px;height:5px;border-radius:50%;background:radial-gradient(circle,#ffe8a3,#54c4a4 68%,transparent);box-shadow:0 0 10px #8ce8cb;animation:jyMoteRise var(--ms) ease-out var(--md) forwards}
      #${DLC_OVERLAY_ID} .jy-seal-stage{position:relative;display:flex;align-items:center;justify-content:center;gap:22px;padding:18px;max-width:96vw;cursor:pointer}
      #${DLC_OVERLAY_ID} .jy-seal-mandala{position:relative;width:min(286px,72vw);height:min(286px,72vw);display:grid;place-items:center;color:#d8b366}
      #${DLC_OVERLAY_ID} .jy-seal-ring{position:absolute;inset:0;width:100%;height:100%}
      #${DLC_OVERLAY_ID} .jy-seal-ring-outer{color:#7bd8ba;animation:jyMusicSpin 15s linear infinite}
      #${DLC_OVERLAY_ID} .jy-seal-ring-inner{color:#e6c06d;animation:jySealSpinCCW 10s linear infinite}
      #${DLC_OVERLAY_ID} .jy-seal-wave{position:absolute;inset:14%;border-radius:50%;border:2px solid rgba(123,216,186,.68);opacity:0;animation:jyWavePulse 1.5s cubic-bezier(.16,.8,.3,1) forwards}
      #${DLC_OVERLAY_ID} .jy-seal-wave-2{border-color:rgba(230,192,109,.7);animation-delay:.35s}
      #${DLC_OVERLAY_ID} .jy-seal-core{position:relative;z-index:2;width:82px;height:82px;display:grid;place-items:center;border:2.5px solid #f0d084;border-radius:14px;background:linear-gradient(145deg,#a9352a,#781e17);color:#fff4dc;font-size:20px;font-weight:900;line-height:1.15;letter-spacing:.14em;white-space:pre-line;text-align:center;box-shadow:0 0 28px rgba(190,62,46,.55),inset 0 0 0 2px rgba(240,208,132,.42);animation:jySealStamp .68s cubic-bezier(.18,.89,.32,1.2) forwards}
      #${DLC_OVERLAY_ID}[data-mode="close"] .jy-seal-core{background:linear-gradient(145deg,#204941,#14302b);border-color:#97cbb8}
      #${DLC_OVERLAY_ID} .jy-seal-poem{writing-mode:vertical-rl;text-orientation:upright;padding:12px 9px;border:1px solid rgba(230,192,109,.34);border-radius:8px;background:rgba(13,27,24,.62);color:#f3e7c8;font-size:14px;font-weight:700;letter-spacing:.2em;text-shadow:0 2px 10px rgba(0,0,0,.6)}
      #${DLC_OVERLAY_ID} .jy-seal-poem-left{font-size:12px;color:#bde8d8}
      @keyframes jyMusicSpin{to{transform:rotate(360deg)}}
      @keyframes jySealSpinCCW{to{transform:rotate(-360deg)}}
      @keyframes jyWavePulse{0%{transform:scale(.5);opacity:.9}100%{transform:scale(1.55);opacity:0}}
      @keyframes jySealStamp{0%{transform:scale(1.85);opacity:0}75%{transform:scale(.95);opacity:1}100%{transform:scale(1);opacity:1}}
      @keyframes jyMoteRise{0%{transform:translateY(0) scale(.6);opacity:0}25%{opacity:.95}100%{transform:translateY(-62vh) scale(1.1);opacity:0}}
      @media(prefers-reduced-motion:reduce){#${ROOT_ID}[data-collapsed="true"][data-playing="true"] .jy-music-ball,#${ROOT_ID}[data-collapsed="true"][data-dlc-active="true"]::after,#${DLC_OVERLAY_ID} .jy-seal-ring,#${DLC_OVERLAY_ID} .jy-seal-wave,#${DLC_OVERLAY_ID} .jy-seal-core,#${DLC_OVERLAY_ID} .jy-seal-mote{animation:none!important}}
      @media(max-width:640px){#${ROOT_ID}{width:min(326px,calc(100vw - 16px))}#${ROOT_ID} .jy-dlc-steps{grid-template-columns:repeat(2,minmax(0,1fr))}#${DLC_OVERLAY_ID} .jy-seal-stage{flex-direction:column;gap:12px}#${DLC_OVERLAY_ID} .jy-seal-poem{writing-mode:horizontal-tb;letter-spacing:.08em;padding:6px 12px;font-size:12.5px}}
    `;
    doc.head.append(style);
  }

  function injectPlayer() {
    doc.getElementById(ROOT_ID)?.remove();
    player = doc.createElement('section');
    player.id = ROOT_ID;
    player.dataset.collapsed = state.collapsed ? 'true' : 'false';
    player.dataset.dlcActive = dlcCache.enabled ? 'true' : 'false';
    player.dataset.activeTab = state.activeTab;
    syncTheme();
    player.innerHTML = `
      <div class="jy-music-head" data-role="drag-handle" title="${state.collapsed ? '点击展开，拖动移动' : '点击收起为小球，拖动移动'}"><span class="jy-music-brand">暨阳多功能悬浮球</span><span class="jy-head-dlc-pill" data-role="head-dlc-pill" hidden>灵脉已启</span><span class="jy-music-head-tip">点击收起</span><span class="jy-music-ball">暨阳</span></div>
      <div class="jy-music-body">
        <div class="jy-console-tabs" role="tablist" aria-label="多功能控制台页签">
          <button type="button" class="jy-console-tab" role="tab" data-console-tab="music" aria-selected="true">随身广播</button>
          <button type="button" class="jy-console-tab" role="tab" data-console-tab="dlc" aria-selected="false">太虚灵枢</button>
          <button type="button" class="jy-console-tab" role="tab" data-console-tab="codex" aria-selected="false">灵脉图鉴</button>
        </div>
        <div data-panel="music">
          <div class="jy-music-now"><span class="jy-music-note">♪</span><div><div class="jy-music-now-title" data-role="now-title">尚未选择歌曲</div><div class="jy-music-status" data-role="status">等待播放</div><div class="jy-music-progress" data-role="progress" role="slider" tabindex="0" aria-label="播放进度" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"></div></div></div>
          <div class="jy-music-controls"><button type="button" data-action="mode" title="列表循环">↻</button><button type="button" data-action="previous" title="上一首">◀</button><button type="button" data-action="toggle" title="播放">▶</button><button type="button" data-action="next" title="下一首">▶</button></div>
          <div class="jy-music-mode-note" data-role="mode-label">列表循环</div>
          <label class="jy-music-volume"><span>音量</span><input type="range" min="0" max="100" value="${state.volume}" data-role="volume"><span data-role="volume-value">${state.volume}%</span></label>
          <div class="jy-music-add"><input data-role="title-input" placeholder="歌曲标题"><input data-role="url-input" placeholder="https:// 音频直链"><button type="button" data-action="add" title="加入歌单">+</button></div>
          <div class="jy-music-add-extra"><input data-role="cover-input" placeholder="封面图片链接（可选）"></div>
          <div class="jy-music-list-head"><span>本卡歌单</span><span data-role="count">0</span></div><div class="jy-music-playlist" data-role="playlist"></div>
        </div>
        <div data-panel="dlc" hidden>
          <div class="jy-dlc-hero">
            <div class="jy-dlc-head-row"><span class="jy-dlc-title">都市修仙 · 灵气复苏</span><span class="jy-dlc-seal-tag">可选 DLC</span></div>
            <div class="jy-dlc-pill" data-role="dlc-status-pill">尘封中 · 纯日常校园线</div>
            <div class="jy-dlc-meta" data-role="dlc-book-name">待识别当前角色主世界书</div>
            <div class="jy-dlc-steps">
              <div class="jy-dlc-step" data-dlc-step="0">微兆 1~10d</div>
              <div class="jy-dlc-step" data-dlc-step="1">古武 11~25d</div>
              <div class="jy-dlc-step" data-dlc-step="2">破禁 26~45d</div>
              <div class="jy-dlc-step" data-dlc-step="3">秘序 46d+</div>
            </div>
            <div class="jy-dlc-meta" data-role="dlc-timeline"></div>
            <div class="jy-dlc-meta" style="margin-top:4px;color:var(--m-jade)" data-role="dlc-saintess"></div>
          </div>
          <div class="jy-dlc-actions">
            <button type="button" class="jy-dlc-btn-primary" data-action="dlc-toggle">太虚启封 · 开启修仙 DLC</button>
            <div class="jy-dlc-sub-row">
              <button type="button" data-action="dlc-resync" hidden>同步 DLC 条目</button>
              <button type="button" data-action="dlc-replay" hidden>重映启封阵法</button>
            </div>
          </div>
        </div>
        <div data-panel="codex" hidden>
          <div class="jy-codex-list">
            <div class="jy-codex-card"><h4>越中潜龙 · 暨阳隐秘龙脉</h4><p>南干龙余脉入越折返主窍（「浦阳泄秀、鹰山锁元」）。千年来借镇山大阵内敛地气，养林泉清幽，也暗藏老鹰山百年古宗遗脉。</p></div>
            <div class="jy-codex-card"><h4>太微云岫宗 · 老鹰山古史</h4><p>昔年东南名宗，末法灵竭后山门大阵自封沉渊，唯听风亭残基、屋檐镇风青铜铎与守灯执事周守山（周伯）守望当代。</p></div>
            <div class="jy-codex-card"><h4>灵潮暗涌 · 秘而不宣</h4><p>灵气复苏绝不面向公众普及，官方特调仅私下接触极少数显露灵机之人；其余众人是留在凡俗烟火还是各自遇缘破关，皆交由剧情自由展开。</p></div>
            <div class="jy-codex-card"><h4>云岫圣女 · 云清晏与仙凡之问</h4><p>第 2 日起可在合适的到校场景入班。末法金丹巅峰冲元婴受创跌境，入红尘既寻破局，亦面临若走上长生道侣一途可能与留守红尘故人产生的仙凡两隔。</p></div>
          </div>
        </div>
        <div class="jy-music-notice" data-role="notice" aria-live="polite"></div>
      </div>`;
    doc.body.append(player);
    setConsoleTab(state.activeTab);
    applyPosition();
    renderPlaylist();
    setVolume(state.volume, true);
    renderMode();
    refreshPlayback();
    renderDlcPanel();
    probeWorldbookDlc(true);

    player.addEventListener('click', event => {
      const tabBtn = event.target.closest('[data-console-tab]');
      if (tabBtn) { setConsoleTab(tabBtn.dataset.consoleTab); return; }
      const target = event.target.closest('[data-action], [data-index], [data-remove-index]');
      if (!target) return;
      if (target.dataset.action === 'toggle') togglePlayback();
      if (target.dataset.action === 'mode') cycleMode();
      if (target.dataset.action === 'previous') play((state.currentIndex < 0 ? 0 : state.currentIndex - 1));
      if (target.dataset.action === 'next') play(nextIndex(state.currentIndex, false));
      if (target.dataset.action === 'add') addTrack();
      if (target.dataset.action === 'dlc-toggle') applyDlcWorldbookToggle();
      if (target.dataset.action === 'dlc-resync') applyDlcWorldbookToggle(true);
      if (target.dataset.action === 'dlc-replay') playSealOverlay({ enable: true, originDate: dlcCache.originDate || dlcCache.currentDate || '2020-09-01' });
      if (target.dataset.index !== undefined) play(Number(target.dataset.index));
      if (target.dataset.removeIndex !== undefined) removeTrack(Number(target.dataset.removeIndex));
    });
    player.querySelector('[data-role="volume"]').addEventListener('input', event => setVolume(event.target.value));

    const progress = player.querySelector('[data-role="progress"]');
    progress.addEventListener('pointerdown', event => {
      progressDrag = true;
      progress.setPointerCapture?.(event.pointerId);
      seekFromPointer(event);
      event.preventDefault();
    });
    progress.addEventListener('pointermove', event => {
      if (progressDrag) seekFromPointer(event);
    });
    progress.addEventListener('pointerup', event => {
      if (progressDrag) seekFromPointer(event);
      progressDrag = false;
    });
    progress.addEventListener('pointercancel', () => { progressDrag = false; });
    progress.addEventListener('keydown', event => {
      const current = Number(player.style.getPropertyValue('--jy-progress').replace('%', '')) || 0;
      if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') { seekTo((current - 5) / 100); event.preventDefault(); }
      if (event.key === 'ArrowRight' || event.key === 'ArrowUp') { seekTo((current + 5) / 100); event.preventDefault(); }
      if (event.key === 'Home') { seekTo(0); event.preventDefault(); }
      if (event.key === 'End') { seekTo(1); event.preventDefault(); }
    });

    const handle = player.querySelector('[data-role="drag-handle"]');
    handle.addEventListener('pointerdown', event => {
      const rect = player.getBoundingClientRect();
      drag = { pointerId: event.pointerId, offsetX: event.clientX - rect.left, offsetY: event.clientY - rect.top, startX: event.clientX, startY: event.clientY, moved: false };
      handle.setPointerCapture?.(event.pointerId);
    });
    handle.addEventListener('pointermove', event => {
      if (!drag || drag.pointerId !== event.pointerId) return;
      if (Math.abs(event.clientX - drag.startX) > 4 || Math.abs(event.clientY - drag.startY) > 4) drag.moved = true;
      state.position = { left: event.clientX - drag.offsetX, top: event.clientY - drag.offsetY };
      applyPosition();
    });
    handle.addEventListener('pointerup', event => {
      if (!drag || drag.pointerId !== event.pointerId) return;
      const moved = drag.moved;
      drag = null;
      saveState();
      if (!moved) setCollapsed(!state.collapsed);
    });
    handle.addEventListener('pointercancel', () => { drag = null; });
  }

  injectStyle();
  injectPlayer();
  syncThAudioMode();
  timer = appWindow.setInterval(refreshPlayback, 900);
  appWindow.addEventListener('resize', applyPosition);
  appWindow.addEventListener(THEME_EVENT, syncTheme);
  appWindow.addEventListener('storage', onStorageTheme);
  const eventOn = api('eventOn');
  const events = globalThis.tavern_events || appWindow.tavern_events;
  const chatChange = events?.CHAT_CHANGED && eventOn?.(events.CHAT_CHANGED, () => probeWorldbookDlc(true));
  function destroyMusicPlayer() {
    ++dlcProbe;
    chatChange?.stop?.();
    appWindow.clearInterval(timer);
    clearSealOverlay();
    appWindow.removeEventListener('resize', applyPosition);
    appWindow.removeEventListener(THEME_EVENT, syncTheme);
    appWindow.removeEventListener('storage', onStorageTheme);
    try { appWindow.removeEventListener('pagehide', destroyMusicPlayer); } catch (_) {}
    try { window.removeEventListener('pagehide', destroyMusicPlayer); } catch (_) {}
    player?.remove();
  }
  // 页面卸载/切聊天导致脚本重载时，清掉 900ms 轮询、resize 监听、法阵特效与 DOM，避免多实例残留
  appWindow.addEventListener('pagehide', destroyMusicPlayer);
  if (window !== appWindow) window.addEventListener('pagehide', destroyMusicPlayer);
  appWindow[GLOBAL_KEY] = { destroy: destroyMusicPlayer, probeDlc: probeWorldbookDlc, playSeal: playSealOverlay };
  console.info('[暨阳多功能台] 已加载，支持随身广播与太虚灵枢 DLC 开关。');
})();
