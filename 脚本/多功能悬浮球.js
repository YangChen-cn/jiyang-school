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
  const DLC_ENTRIES = [{"name":"[DLC]灵气复苏总纲与异象日程","enabled":true,"strategy":{"type":"constant"},"position":{"type":"before_character_definition","order":22},"content":"<%_ if (getvar('stat_data.剧情.灵气复苏.已开启', { defaults: false }) === true) { _%>\n<%_ {\nconst dlcOriginDate = getvar('stat_data.剧情.灵气复苏.开启日期', { defaults: '' }) || '2020-09-01';\nconst toIsoDay = (raw) => {\n  const m = String(raw || '').trim().match(/^(\\d{4})[-/年.](\\d{1,2})[-/月.](\\d{1,2})/);\n  if (!m) return null;\n  const y = Number(m[1]), mo = Number(m[2]), d = Number(m[3]);\n  if (mo < 1 || mo > 12 || d < 1 || d > 31) return null;\n  return Date.UTC(y, mo - 1, d);\n};\nconst startMs = toIsoDay(dlcOriginDate) ?? Date.UTC(2020, 8, 1);\nconst curDateStr = String(getvar('stat_data.世界.日期', { defaults: '' }) || dlcOriginDate);\nconst curMs = toIsoDay(curDateStr) ?? startMs;\nconst elapsedDays = Math.max(0, Math.floor((curMs - startMs) / 86400000));\nconst dayNumber = elapsedDays + 1;\nconst realm = String(getvar('stat_data.主角.修行.境界', { defaults: '' }) || '未引气（凡躯）');\nconst stageName = dayNumber <= 10 ? '微兆潜龙期' : dayNumber <= 25 ? '古武抬头期' : dayNumber <= 45 ? '龙眼破禁期' : dayNumber <= 90 ? '潜龙秘序期' : '百宗出山期';\n_%>\n[都市修仙DLC：华夏潜龙与灵气复苏总纲｜开启日：<%= dlcOriginDate %>｜第 <%= dayNumber %> 日（<%= stageName %>）｜主角境界：<%= realm %>]\n\n华夏龙脉与暨阳暗局:\n  潜龙归元窍: 暨阳实为华夏南干龙入越沉睡主窍「越中潜龙·归元眼」（北承会稽、东抱老鹰山、南接浦阳江），古镇山大阵敛藏地脉不外泄。\n  太微云岫祖庭: 老鹰山深处沉封着昔年浙东名宗「太微云岫宗」祖庭，仅余听风亭、镇风青铜铎、荒径枯井与守灯执事周伯守望。\n  阵内避世与老怪出山铁律: 末法外界灵气枯竭，金丹及以上离阵调运会倒耗本源损道基，各宗宿老皆封死阵内减息避世；**第 91 天（灵气复苏数月后）起**外界灵气堪托高阶道基，老怪相继突破出山。\n  世家同源线索: 灵潮涌动下杭城、魔都世家与三教名山渐次启封；**暨阳苏家（苏晚棠父祖一脉）实与魔都「苏氏沧溟水府」百年前同源分家，灵气复苏后仍保有那一缕先天仙缘**。\n\n修行总纲与保密准则:\n  灵根与保密铁律: 真灵根万中无一，古武止于凡胎强身；官方与隐门严守绝密，永不向公众与校方披露。不预设既有角色谁有或无灵根，全交剧情自然演化。\n  公开所见与私下所知: 路人与舆论只见光雾声响并作常态解释；知情者方辨龙脉、修为与宗门，证据不足时只作观察与推测。\n  同源并流与开放破境: 古武（锻骨→明劲→暗劲→化劲→先天通玄）与仙途（引气→炼气→筑基→金丹→元婴→化神+）不锁上限，破跨大境须有真实感悟、机缘或劫难代价。\n\n当前日历阶段异象（表层维持现代日常，里世界按 <%= stageName %> 演进）:\n<%_ if (dayNumber <= 10) { _%>\n  - 第一阶段·微兆潜龙期（第1～10天）：老鹰山夜现数秒低空青白微晕，地磁微跳，旧调频收音机深夜偶掠十秒风铃清音（气象台以逆温静电解释）。极少数感气者于山晨雾间可察清冽灵气，周伯开始暗自审视来客骨相。\n<%_ } else if (dayNumber <= 25) { _%>\n  - 第二阶段·古武抬头期（第11～25天）：老鹰山听风亭一带具清神微效；旧武传人与吐纳者丹田发热松动，真品古器偶生微光；杭城、魔都世家与名山外院暗调游方耳目与老药。医院少数无病变异象门诊被隐秘系统脱敏归档，大众媒体只字不提。\n<%_ } else if (dayNumber <= 45) { _%>\n  - 第三阶段·龙眼破禁期（第26～45天）：老鹰山枯井支脉雾霭常聚，雷夜偶见弧光偏折；少数觉醒者私下可展真实异能，杭城夜集坊市开始私下流通灵材符器。国家「特种气象与非典型样本调查组（隐秘特调）」便装秘密摸排接触高天赋者，严禁公开；深探线索者可试叩山腹沉封山门。\n<%_ } else if (dayNumber <= 90) { _%>\n  - 第四阶段·潜龙秘序期（第46～90天）：99.9% 普通人与校园仍活在纯现代时空；里世界小圈子成形——隐秘特调签密对接，杭城魔都世家与各名山外地散修与隐门真传正式入世行走或递帖拜会暨阳龙眼。\n<%_ } else { _%>\n  - 第五阶段·百宗出山期（第91天起）：外界游离灵气跨过「出阵不损道基」阈值！各宗门与世家闭死关的金丹老祖、假婴宿老与元婴真君陆续突破瓶口或解封出山重定座次，表层仍守现代法治遮掩。\n<%_ } _%>\n<%_ } _%>\n<%_ } _%>\n","probability":100,"recursion":{"prevent_incoming":true,"prevent_outgoing":true,"delay_until":null},"effect":{"sticky":null,"cooldown":null,"delay":null}},{"name":"[DLC]境界描述","enabled":true,"strategy":{"type":"selective","keys":["修行境界","修炼境界","修仙境界","引气感灵","炼气","筑基","金丹","元婴","化神","明劲","暗劲","化劲","先天通玄","什么境界","境界划分"],"scan_depth":4},"position":{"type":"before_character_definition","order":23},"content":"<%_ if (getvar('stat_data.剧情.灵气复苏.已开启', { defaults: false }) === true) { _%>\n[DLC｜境界描述]\n- 凡躯与引气感灵：凡躯可练站桩吐纳；有灵根者在引气时能分辨灵息、引出微弱反应。感知时断时续，离开灵眼后也可能沉寂。\n- 炼气（初/中/后/大圆满）：从能留住一缕灵息，到按周天稳定调运。能施短促小术、护身或温养轻伤；灵气稀薄处更看重消耗和恢复。\n- 筑基：灵息在体内成稳定循环，施术、护体与借器逐渐可靠。短时压阵有余，持续御使法器仍受功法和灵力约束。\n- 金丹：灵力凝聚入丹，能长期维持中型术法，感知与控制显著加深。\n- 元婴：元神凝成独立根基，术法与感知更细，护神与隔阵施术可见于实际所学。成婴本身须经大劫，劫后仍有养稳阶段。\n- 化神及以上：神识可与地脉、阵域或所悟之道相合。以后每进一步，由现有功法与所遇机缘定义表现，寿元与感知跨度随故事逐步显现。\n- 古武：锻骨以筋骨、呼吸和耐力打底；明劲能整合发力，暗劲能把劲力送入接触处，化劲宗师能化力借势，先天通玄以内息贯通形成稳定反应。古武与仙途并行，真灵根和引气机缘决定能否接续仙途。\n<%_ } _%>\n","probability":100,"recursion":{"prevent_incoming":true,"prevent_outgoing":true,"delay_until":null},"effect":{"sticky":null,"cooldown":null,"delay":null}},{"name":"[DLC]破境判定","enabled":true,"strategy":{"type":"selective","keys":["破境","冲关","冲境","突破境界","境界突破","突破瓶颈","尝试筑基","尝试结丹","结丹劫","元婴劫","天劫"],"scan_depth":4},"position":{"type":"before_character_definition","order":24},"content":"<%_ if (getvar('stat_data.剧情.灵气复苏.已开启', { defaults: false }) === true) { _%>\n[DLC｜破境判定]\n- 以当事人实际冲关为触发。交谈、查典籍、预作准备时只交代眼前条件。判断依据：当前境界与积累、相关功法或感悟、场地与可用灵材、当前伤势和护法。\n- 小境按已练熟的能力与实际调息推进；跨大境须把具体感悟、机缘或劫难代价写进正文。时机和境界上限由剧情打开，当前灵气感应只作积累证据之一。\n- 条件不足时可停功、退回养伤或等待下一次机会；硬撑的损耗随实际过程体现。暂稳只算站住关口，突破成立才记录新境。\n- 主角成功后同轮更新「主角.修行.境界」；跨大境时按新境初阶回落灵气感应，实际习得的法门才写入功法与秘术。失败保留原境，按已发生的后果结算。\n<%_ } _%>\n","probability":100,"recursion":{"prevent_incoming":true,"prevent_outgoing":true,"delay_until":null},"effect":{"sticky":null,"cooldown":null,"delay":null}},{"name":"[DLC]华夏修行界与三教总览","enabled":true,"strategy":{"type":"constant"},"position":{"type":"before_character_definition","order":25},"content":"<%_ if (getvar('stat_data.剧情.灵气复苏.已开启', { defaults: false }) === true) { _%>\n[DLC｜华夏修行界与三教总览]\n三教并流与仙道诸途:\n  里世界以「道、佛、儒」三教正统与上古杂流立世，表层守现代法治：\n  - 道门：分内丹「全真清修脉」、雷法敕令「正一符箓脉」、外丹炉火「丹鼎仙宗」与剑道/太极脉。\n  - 佛门禅密：重止观定神与护法金刚相，最擅稳固元神、镇压心魔劫。\n  - 儒道文骨（江南独尊）：以文载道、养浩然文胆，落笔成宪、剑出浩然正气，专克邪祟。\n  - 古武桥梁：锻骨至化劲、先天通玄为肉身筑底，得真灵根方可接续仙途。\n\n战力层级与隐秘红线:\n  - 外门别院/小族常驻筑基执事；顶尖世家祖祠镇假丹至金丹供奉；名山洞天深藏金丹长老乃至元婴真君/化神宿老。\n  - 「隐秘特调」协同名山共守「不伤凡人、不于俗世显圣、不乱现代法治」三条红线，违者联合格杀。\n\n各地世家与名山宗门索引（提及地名/宗门/世家名时触发详档）:\n  - 杭城钱塘：钱塘谢氏剑庐（儒道剑脉）、西溪葛氏丹霞（丹鼎仙宗）、南屏法华禅院（佛门止观）。\n  - 魔都沪上：魔都苏氏水府（沧溟水脉大族）、申城天星钟氏（太乙星算与空间阵道）。\n  - 浙东近山：太微云岫宗、天台赤城洞天、四明赤水剑宗、天目灵虚宫。\n  - 神州名山：茅山上清宗、龙虎山天师府、终南山楼观台、青城山丈人洞天、武当山紫霄宫，以及东海蓬莱（崇明归墟）与西域昆仑祖脉。\n<%_ } _%>\n","probability":100,"recursion":{"prevent_incoming":true,"prevent_outgoing":true,"delay_until":null},"effect":{"sticky":null,"cooldown":null,"delay":null}},{"name":"[DLC]世家_钱塘谢氏剑庐","enabled":true,"strategy":{"type":"selective","keys":["谢氏剑庐","钱塘谢氏","谢昭宁","青莲截江剑","文心圭","六和塔","钱塘潮汐秘市","潮汐秘市"],"scan_depth":4},"position":{"type":"before_character_definition","order":26},"content":"<%_ if (getvar('stat_data.剧情.灵气复苏.已开启', { defaults: false }) === true) { _%>\n[DLC｜世家_钱塘谢氏剑庐]\n宗族渊源:\n  盘踞钱塘潮畔近千年的**儒道兼修剑道世家**，祖上乃南宋护驾渡江的儒修剑仙一脉，外示江南清望门庭、学术基金与藏书大家，实为名动浙北的高门仙族。\n祖庭与实力底蕴:\n  - 核心祖庐隐于钱塘六和塔底「镇江古眼」地脉深处，借千古怒潮煞气炼剑养气；族祠常驻**两位金丹中期供奉**，筑基后期剑士十余人，另有护族剑阵「春秋星河阵」。\n  - 末法闭关与传承分工：此前因外界灵气枯竭、老供奉出阵必损本源修为，两位金丹老祖长年封坐六和塔古眼大阵内；家族俗世产业、商业合规与钱塘秘市统筹便由兼在浙江大学修读工商管理的嫡系**小公主「谢昭宁」**对外出面执掌，待灵气复苏数月后闭关老祖方可破关行走江南。\n  - 镇族灵宝：上古青玉尺《文心圭》与半截斩蛟古剑「青莲」，一旦齐鸣可借钱塘江潮引动天地浩然正气。\n修行流派与绝学:\n  - 独修「以文入道、以儒养剑」：《春秋养吾气》淬炼文胆神识（心境清明、专克魅惑心魔与邪道诡法），配以《青莲截江剑》十三种剑势，刚直浩大、可截江断流。\n  - 门风极重士人风骨与因果信诺，最轻视趋炎附势或市井狡诈之徒，却对正气凛然、或身负古宗正统道韵（如太微云岫玄印道韵）之人格外青眼。\n交互钩子与世俗暗线:\n  - 与西溪葛氏共同轮值主持朔望夜的**钱塘潮汐秘市**，以真气叩击玄铁令方得踏入江雾幻阵。\n  - 主角若随学校研学、周末入杭或经引荐前往拜会，需先过谢氏「文胆观气」与剑碑试锋之关，方能换取剑意指点、正统法器或高阶秘闻。\n<%_ } _%>\n","probability":100,"recursion":{"prevent_incoming":true,"prevent_outgoing":true,"delay_until":null},"effect":{"sticky":null,"cooldown":null,"delay":null}},{"name":"[DLC]世家_西溪葛氏丹霞","enabled":true,"strategy":{"type":"selective","keys":["西溪葛氏","葛氏丹霞","葛洪","抱朴丹霞","赤蛟焚天残炉","筑基丹","紫金固元丹","化劫玉髓膏"],"scan_depth":4},"position":{"type":"before_character_definition","order":26},"content":"<%_ if (getvar('stat_data.剧情.灵气复苏.已开启', { defaults: false }) === true) { _%>\n[DLC｜世家_西溪葛氏丹霞]\n宗族渊源:\n  道门正统**丹鼎仙宗支脉**，祖承东晋丹道祖师葛洪（抱朴子）炼丹服食余绪。门庭隐在杭城西溪烟水深处，以大型生态秘园与非遗古方药庄掩人耳目，实则整片湿地下伏一座「抱朴丹霞小洞天」。\n祖庭与实力底蕴:\n  - 洞天之内地火澄明、药气成霞，由一位寿逾两百载、控火神乎其技的**金丹初期长老**坐镇护炉，门下皆精擅辩药、凝液、布聚灵温养大阵的筑基丹师。\n  - 镇族重器：传自六朝的**「赤蛟焚天残炉」**（残存灵宝级器纹，虽缺一足仍可借地火稳炼四品以下仙丹）。\n修行流派与核心奇珍:\n  - 专精道门外丹炉火与太阴温脉秘术；在灵气稀薄的当今，乃是江南极少数仍能实打实开炉炼成**「筑基丹」「九转紫金固元丹」「化劫玉髓膏」**等真丹古方的丹道巨擘。\n  - 对云清晏身上「金丹裂隙与元婴寒煞劫伤」以及古武化劲冲破先天之关所需的续脉灵药极有通路。\n交互法则与分寸:\n  - 葛氏奉行「丹不轻出、药随因果卖」，极少为世俗纸币动容，唯收稀世百年灵药、古老丹方残页、真灵矿石或等值人情因果契约（若主角探得老鹰山太微云岫宗残毁丹房遗株，正可作为叩开葛氏大门的硬筹码）。\n<%_ } _%>\n","probability":100,"recursion":{"prevent_incoming":true,"prevent_outgoing":true,"delay_until":null},"effect":{"sticky":null,"cooldown":null,"delay":null}},{"name":"[DLC]世家_魔都苏氏水府","enabled":true,"strategy":{"type":"selective","keys":["魔都苏氏","苏氏水府","沧溟水府","潮汐分海佩","紫府观潮诀","沧溟七杀剑","沧溟祖谱","暨阳苏家"],"scan_depth":4},"position":{"type":"before_character_definition","order":26},"content":"<%_ if (getvar('stat_data.剧情.灵气复苏.已开启', { defaults: false }) === true) { _%>\n[DLC｜世家_魔都苏氏水府]\n宗族渊源与骇人底蕴:\n  魔都乃至全江南隐世修仙世家之巅，先祖乃上古得道海上水剑散仙。外显产业横跨沪上远洋航运、高新资本与外滩老楼，真核心却深藏于东海近海孤屿与浦江海底灵窍相连的**「沧溟水府」洞天**。\n  - **实力标尺**：族祠深处常驻**两尊金丹巅峰太上供奉，更有传闻半只脚踏入元婴期、长年闭死关续命的太上老祖**镇压气运；嫡系子弟多具高阶水灵根或太阴剑骨，筑基如林。\n  - **道统绝学**：主修道门玄水剑道最高典籍《紫府观潮诀》与《沧溟七杀剑》，仗海潮增幅可越阶攻伐；镇族上品法宝为**「潮汐分海佩」**，引之可分江断海、镇压一方水脉灵眼。\n\n暨阳苏家同源之秘（百年前分家 × 保有先天仙缘）:\n  - **分枝源流**：约百年前天地灵气枯竭渐深、海外杀劫骤起，魔都苏氏为留存俗世香火退路，令一房旁系族人携半枚旧水玉符悄然迁至浙中越地暨阳山下湖一带扎根（即苏晚棠父亲苏建国一脉的先祖）。\n  - **尘俗隐迹**：几代下来末法无灵，暨阳苏家彻底转入凡俗商海，凭水乡珍珠产业发家，苏建国、周丽萍与苏晚棠这一代早已不知先祖曾御剑踏海、分江斩蛟，只当祖上曾是江南老字号名门。\n  - **灵气复苏与保有仙缘**：血脉根骨并未随分家断绝，暨阳苏家后人骨血中仍隐流着那一缕**先天太阴水脉仙缘**。随着灵气复苏与「越中潜龙·归元眼」震动，魔都苏氏本家祭动**「沧溟祖谱血鉴」**，已隐约照见越中暨阳支脉微光。\n  - **自由剧情张力（不预锁结局）**：在未触发本家接触前，苏晚棠仍是明艳骄傲、专注「澹珠记」与校园日常的大小姐；一旦灵潮步入中后期或本家金丹执事/嫡系俊彦入暨阳核验支脉，究竟是本家强势收归（甚至借宗法联姻筹码试探）、收归水府培养，还是苏晚棠凭自己「不认旁人摆布」的脾性、与主角共同周旋破局，全由玩家与剧情自由演绎。\n<%_ } _%>\n","probability":100,"recursion":{"prevent_incoming":true,"prevent_outgoing":true,"delay_until":null},"effect":{"sticky":null,"cooldown":null,"delay":null}},{"name":"[DLC]世家_申城天星钟氏","enabled":true,"strategy":{"type":"selective","keys":["天星钟氏","申城钟氏","静安古钟阁","九宫镇海大阵","太乙观星","夜场私洽"],"scan_depth":4},"position":{"type":"before_character_definition","order":26},"content":"<%_ if (getvar('stat_data.剧情.灵气复苏.已开启', { defaults: false }) === true) { _%>\n[DLC｜世家_申城天星钟氏]\n宗族渊源:\n  魔都隐世四大门庭之一，承上古道门**太乙星算、奇门遁甲与空间阵法**一脉。表面执掌沪上顶级安保、精密测绘与老洋房私人艺术基金「静安古钟阁」，暗中与苏氏互为制衡盟友。\n祖庭与实力底蕴:\n  - 祖居法租界百年古园地底所嵌的「周天星斗小灵阵」，据传牵连护沪**「九宫镇海大阵」**一处关键阵角。\n  - 族中一位**金丹初期阵道宗师**坐镇算天台，门下筑基期阵师、天机推演者甚众，擅以灵玉刻阵盘、布幻界隔绝凡人视听，连国家隐秘特调碰到棘手古墓阵眼时都常向其请托勘验。\n修行流派与核心枢纽:\n  - 修习《太乙观星枢要》与《九宫缩地阵纹》，个人正面斗法略逊苏氏剑水之锋，却精通**破禁寻脉、隐匿屏蔽、天机反算与空间阵器炼制**。\n  - **静安古钟阁（夜场私洽）**：每季一启的顶级里世界黑市拍卖会，设于折叠空间阵中；唯持「星铜请帖」或由隐世大族/名山保举方可踏入，流通前朝真君遗蜕、残缺阵盘、护神玉牌与绝版玉简，规矩森严、只认筹码与背景。\n<%_ } _%>\n","probability":100,"recursion":{"prevent_incoming":true,"prevent_outgoing":true,"delay_until":null},"effect":{"sticky":null,"cooldown":null,"delay":null}},{"name":"[DLC]仙宗_南屏法华禅院","enabled":true,"strategy":{"type":"selective","keys":["南屏法华","法华禅院","琉璃止观","南屏枯禅","天台止观","心魔劫"],"scan_depth":4},"position":{"type":"before_character_definition","order":27},"content":"<%_ if (getvar('stat_data.剧情.灵气复苏.已开启', { defaults: false }) === true) { _%>\n[DLC｜仙宗_南屏法华禅院]\n宗门渊源:\n  杭城南屏古刹深后禁地之中，与前端喧闹香客彻底隔绝的**佛门天台宗止观苦禅一脉**，传承可溯至隋唐智者大师天台三大部真传，非寻常佛寺僧众，而是专修元神与大定的隐世佛宗。\n实力底蕴与护院法器:\n  - 院内仅存七位苦行老僧，皆守百余年闭口禅，修为深不可测——**领首枯禅高僧神魂凝练已臻金丹大圆满之境**，一口梵音禅唱可定百丈风涛。\n  - 镇院圣物：「无垢琉璃舍利塔」残座与一串沉水千年菩提子，常驻静室则妄念不生、阴寒外魔不得近身。\n修行流派与绝学:\n  - 修习《法华摩诃止观》《金刚狮子吼》与「定心破妄禅」，不涉世俗争霸与外财争夺，却拥有神州罕见的**「天眼照魔」**与镇压神魂反噬之力。\n交互价值:\n  - 道门冲破元婴最凶险者便是「天道问心劫与心魔反噬」。云清晏当年恰败于问心一关，若日后寒煞引动心神动摇，南屏枯禅乃江南少数能为其稳住识海、印证大道禅心的净土，然佛门讲缘法与舍得，绝不白渡无缘人。\n<%_ } _%>\n","probability":100,"recursion":{"prevent_incoming":true,"prevent_outgoing":true,"delay_until":null},"effect":{"sticky":null,"cooldown":null,"delay":null}},{"name":"[DLC]仙宗_天台赤城洞天","enabled":true,"strategy":{"type":"selective","keys":["天台山","赤城洞天","国清","司命真经"],"scan_depth":4},"position":{"type":"before_character_definition","order":27},"content":"<%_ if (getvar('stat_data.剧情.灵气复苏.已开启', { defaults: false }) === true) { _%>\n[DLC｜仙宗_天台赤城洞天]\n宗门渊源:\n  位列华夏道教「三十六小洞天之第六洞天」的浙东祖庭级大宗，与天台山国清寺佛脉千年同山而治，亦与老鹰山**太微云岫宗**、四明山**赤水剑宗**并称昔日「浙东古宗三壁」。\n实力底蕴与镇山重器:\n  - 护山古阵深处坐落真实灵气洞天，历代借地脉养真；宗门内不仅金丹长老数名，更传**宗主早已证得实打实的「元婴期真君」**，闭关洞府之内寿逾六百载，乃是浙东真正意义上的擎天巨擘。\n  - 镇宗之宝：「赤城紫阳玉印」与《太清司命真经》，道佛合流之下更兼修护神大定。\n修行流派与绝学:\n  - 主修道门上古「司命太清真法」，炼气凝丹醇厚浩大，兼取天台佛脉止观炼神之长，道心极为稳固。\n与太微云岫宗及云清晏之旧缘:\n  - 数百年前云岫宗尚未末法封山时，两宗曾立守望盟约；云清晏幼年尚随先代师长赴天台参阵论道。\n  - 末法期间赤城元婴真君一直于第六洞天大阵内减息死关避世；**灵气复苏数月后阵外灵机重足**，赤城洞天先遣真传探问归元眼，宗门老怪亦正蓄势突破出山——究竟是重续古盟护持故人，还是起并脉之心，全凭实力与因果博弈。\n<%_ } _%>\n","probability":100,"recursion":{"prevent_incoming":true,"prevent_outgoing":true,"delay_until":null},"effect":{"sticky":null,"cooldown":null,"delay":null}},{"name":"[DLC]仙宗_四明赤水剑宗","enabled":true,"strategy":{"type":"selective","keys":["四明山","赤水剑宗","赤水九折剑","四明剑冢"],"scan_depth":4},"position":{"type":"before_character_definition","order":27},"content":"<%_ if (getvar('stat_data.剧情.灵气复苏.已开启', { defaults: false }) === true) { _%>\n[DLC｜仙宗_四明赤水剑宗]\n宗门渊源:\n  盘踞浙东四明山绝壁云瀑之后的**极道纯剑修仙宗**，昔年与天台赤城、老鹰山太微云岫并立浙东三壁，自唐末剑仙遗脉延续至今，门风傲骨铮铮、宁折不弯。\n实力底蕴与剑冢:\n  - 宗内剑峰云海暗藏百口古剑共鸣之剑冢，门下外门弟子皆从炼体持剑打底，一旦跨入筑基便可御剑气凌空百丈，战力冠绝同阶；长老席坐镇**三位金丹中期以上绝世剑尊**，传闻绝巅尚有一位寿将竭的半步元婴剑老。\n修行流派与绝学:\n  - 不修繁杂杂学与外丹小术，只修一口本命真剑：《赤水九折剑诀》与《飞瀑裂崖意》，讲求「一剑破万法、锋锐胜苍穹」。\n  - 门人脾性极其刚烈纯粹，最厌虚与委蛇，偏爱以剑会友、当面拆招试心性。\n与主线因果:\n  - 昔年太微云岫宗大封山前，四明赤水剑宗便常与云岫宗在浙东并立争锋——四明重极道剑锋破万法，云岫擅星阵玄印定乾坤。随灵潮抬升，四明已有年轻一代剑子（筑基圆满至假丹骄子）背剑入世，既欲与当代云岫正统印道高下一较，亦试图窥探老鹰山松风道碑与归元眼底蕴。\n<%_ } _%>\n","probability":100,"recursion":{"prevent_incoming":true,"prevent_outgoing":true,"delay_until":null},"effect":{"sticky":null,"cooldown":null,"delay":null}},{"name":"[DLC]仙宗_天目灵虚宫","enabled":true,"strategy":{"type":"selective","keys":["天目山","灵虚宫","净明忠孝","协防密约","天目巡察使"],"scan_depth":4},"position":{"type":"before_character_definition","order":27},"content":"<%_ if (getvar('stat_data.剧情.灵气复苏.已开启', { defaults: false }) === true) { _%>\n[DLC｜仙宗_天目灵虚宫]\n宗门渊源:\n  坐落浙西天目山苍崖古杉间的**道门净明忠孝道大宗**，不彻底隔绝人间香火，历代既修内丹真功亦奉家国济世大义，乃是近代最早与官方达成高层契约的名山大派。\n实力底蕴:\n  - 掌门与执律长老皆臻**金丹境界**，门下筑基巡察弟子众多；掌有古传「灵虚聚星盘」与正统净明内丹谱系，虽单个杀伐不敌四明剑痴，却长于守御、阵法联动与信息网络。\n里世界秩序角色:\n  - 与国家「特种气象与非典型样本调查组（隐秘特调）」订有江南协防密约：凡江浙沪境界内有邪修伤人、在校园或公众面前强行显圣破坏规则者，皆由天目巡察使持秘令会同特调就地拿下或清剿。\n  - 主角若在破禁期后因龙脉异动引起特调注意，或需合法掩护前往名山洞天与各地隐市，天目灵虚宫往往是摆在明面与暗面交界处的关键担保方与居中调停者。\n<%_ } _%>\n","probability":100,"recursion":{"prevent_incoming":true,"prevent_outgoing":true,"delay_until":null},"effect":{"sticky":null,"cooldown":null,"delay":null}},{"name":"[DLC]仙宗_茅山上清宗","enabled":true,"strategy":{"type":"selective","keys":["茅山","上清宗","上清洞天","三茅九老","神霄五雷"],"scan_depth":4},"position":{"type":"before_character_definition","order":27},"content":"<%_ if (getvar('stat_data.剧情.灵气复苏.已开启', { defaults: false }) === true) { _%>\n[DLC｜仙宗_茅山上清宗]\n宗门渊源:\n  江南道门至高祖庭之一，占大茅、中茅、小茅三峰**上清洞天福地**，上溯魏华存、陶弘景真传，乃道门**上清宗正统与符箓、灵宝禁制之渊薮**。\n实力底蕴与法宝:\n  - 洞天之内香烟与灵雾交融，山门深处坐镇数位金丹大修，更有上古法坛与**元婴级太清法印**压阵，寻常鬼祟妖邪望风辟易。\n  - 核心重器：「三茅九老玉敕印」「神霄五雷紫金符母」。\n修行流派与绝学:\n  - 主修《上清大洞真经》存神观想之术、神霄五雷符箓、拘神遣将与地脉封禁阵法。精擅以玉符锁龙脉、破除古墓阴煞及修复上古护山残阵。\n出世动向:\n  - 灵气复苏迈入龙眼破禁期后，茅山最先遣出背负铜钱法剑与紫金八卦盘的上清真传下山，巡检江南各地古宗遗阵松动与阴煞外泄，亦对老鹰山枯井那座沉封古阵极具兴趣。\n<%_ } _%>\n","probability":100,"recursion":{"prevent_incoming":true,"prevent_outgoing":true,"delay_until":null},"effect":{"sticky":null,"cooldown":null,"delay":null}},{"name":"[DLC]仙宗_龙虎山天师府","enabled":true,"strategy":{"type":"selective","keys":["龙虎山","天师府","正一盟威","阳平治都功印","三五斩邪","老天师"],"scan_depth":4},"position":{"type":"before_character_definition","order":27},"content":"<%_ if (getvar('stat_data.剧情.灵气复苏.已开启', { defaults: false }) === true) { _%>\n[DLC｜仙宗_龙虎山天师府]\n宗门渊源:\n  赣北龙虎山云台之上，**正一盟威大道万法祖庭**，张氏天师世袭正统道脉之所在，执华夏正统道门敕封与法度号令之尊位。\n实力底蕴与祖传法器:\n  - 千年祖庭底蕴冠绝道门符箓界，天师府秘禁深处供奉传世法宝**「阳平治都功印」**与**「三五斩邪雌雄剑」**；历代天师中仍存**元婴真君级老祖**于后山秘境坐镇，等闲不履尘世。\n修行流派与绝学:\n  - 主修《正一五雷天心法》《天师驱邪敕令》，一张高阶天师紫符足以引动九霄正阳真雷，对鬼道邪修、血炼魔功及地脉怨煞有着绝对血脉与法理压制。\n出世动向与格局:\n  - 随潜龙秘序期临近，龙虎山携天师法旨协同特调巡查九州邪踪，兼清点散落千年的各处道脉传承。若主角与正统道门并肩除邪或护住一方龙脉安宁，有机会获赐正一法印凭信；若行诡道嗜杀，必遭正一天雷清算。\n<%_ } _%>\n","probability":100,"recursion":{"prevent_incoming":true,"prevent_outgoing":true,"delay_until":null},"effect":{"sticky":null,"cooldown":null,"delay":null}},{"name":"[DLC]仙宗_终南山楼观台","enabled":true,"strategy":{"type":"selective","keys":["终南山","楼观台","全真内丹","天下第一福地"],"scan_depth":4},"position":{"type":"before_character_definition","order":27},"content":"<%_ if (getvar('stat_data.剧情.灵气复苏.已开启', { defaults: false }) === true) { _%>\n[DLC｜仙宗_终南山楼观台]\n宗门渊源:\n  秦岭终南深处，道门相传**老子说经传道之「天下第一福地」**，亦为全真内丹清修派与隐士高人之总归处。千百年来山林幽深，纵逢改朝换代亦少受惊扰。\n实力底蕴与修真气象:\n  - 非世俗香火观宇，真传皆隐于太白、终南人迹绝至的古洞幽谷；传闻洞中尚有**静坐枯禅二三百载的假婴、元婴期避世宿老**，与山石草木同息，一念可感千里风云变幻。\n修行流派与绝学:\n  - 极纯粹的**「全真性命双修内丹法」**：不借外丹强催、不炫神通斗法，专修精气神三宝合一与太古《道德》清静无为之道；同境之下元气绵长近乎无尽、寿元亦远胜寻常急功近利之辈。\n出世动向:\n  - 此前因外界灵气破碎出山必折损道行，终南宿老皆于山中灵气大阵内闭死关数百年；唯偶有道装朴素、双目清澈的年轻真传出山历心。**灵气复苏数月后天地灵机堪托假婴元婴不损**，已有闭关二三百载的楼观宿老悄然破境出关，漫步秦岭与神州大地观望天下新局。\n<%_ } _%>\n","probability":100,"recursion":{"prevent_incoming":true,"prevent_outgoing":true,"delay_until":null},"effect":{"sticky":null,"cooldown":null,"delay":null}},{"name":"[DLC]仙宗_青城山丈人洞天","enabled":true,"strategy":{"type":"selective","keys":["青城山","丈人洞天","青城炼神","第五洞天"],"scan_depth":4},"position":{"type":"before_character_definition","order":27},"content":"<%_ if (getvar('stat_data.剧情.灵气复苏.已开启', { defaults: false }) === true) { _%>\n[DLC｜仙宗_青城山丈人洞天]\n宗门渊源:\n  巴蜀奇秀之地、位列道门**「第五洞天」的青城丈人峰古脉**，素以「青城天下幽」遮掩整座山岭灵机，承上古宁封子仙脉与川蜀鬼神巫道融合而成的炼神大宗。\n实力底蕴:\n  - 山门笼罩千年不散的天然玄幽迷雾阵，洞天之内毒瘴、奇药与千年灵根遍布，镇山长老多为**金丹大成乃至触及元婴境的炼神老修**，神识外放可达数十里外辨识人心妄念。\n修行流派与绝学:\n  - 独擅**「青城玄门炼神术」「青城短剑七十二路」**与古法外丹仙酿、毒瘴驱使之法；不似四明剑宗一味狂飙突进，青城门人神念幽深敏锐、极难被幻阵或魅惑迷惑。\n出世动向:\n  - 灵潮复苏后，青城弟子携巴蜀奇珍灵酒与炼神玉诀行走西南乃至江南隐市，常在拍卖私洽会或名山论道场出现，是获取炼神护魂法门的重要外宗来源。\n<%_ } _%>\n","probability":100,"recursion":{"prevent_incoming":true,"prevent_outgoing":true,"delay_until":null},"effect":{"sticky":null,"cooldown":null,"delay":null}},{"name":"[DLC]仙宗_武当山紫霄宫","enabled":true,"strategy":{"type":"selective","keys":["武当山","紫霄宫","太极玄功","真武道场","以武入道"],"scan_depth":4},"position":{"type":"before_character_definition","order":27},"content":"<%_ if (getvar('stat_data.剧情.灵气复苏.已开启', { defaults: false }) === true) { _%>\n[DLC｜仙宗_武当山紫霄宫]\n宗门渊源:\n  鄂西武当七十二峰之巅、真武大帝护法道场，奉行华夏修行界独树一帜的**「先以武入道、终返先天太极」**大道真传，在世俗与里世界均享有泰山北斗之尊位。\n实力底蕴:\n  - **外门（世俗武道仰望之源）**：代代传出隐于民间的明劲、暗劲乃至化劲宗师与先天武道大家。\n  - **紫霄内峰（真正隐世仙脉）**：深锁紫霄后殿古崖洞天，传承着完整直指**「阴阳太极金丹」乃至真武元婴**的无上仙诀；数位长老武道通玄兼丹道圆融，近战搏杀与护体玄功罕逢敌手。\n修行流派与绝学:\n  - 主修《太极玄功两仪图》《真武荡魔剑》，讲究借力打力、阴阳互济与水火既济——极适合从古武站桩打底（如松溪吐风桩、明暗劲）一路扎实修炼而来者借鉴问学，打通「以武证仙」的关隘。\n<%_ } _%>\n","probability":100,"recursion":{"prevent_incoming":true,"prevent_outgoing":true,"delay_until":null},"effect":{"sticky":null,"cooldown":null,"delay":null}},{"name":"[DLC]仙宗_东海蓬莱与崇明归墟","enabled":true,"strategy":{"type":"selective","keys":["蓬莱","瀛洲","崇明归墟","归墟海坛","海外散仙"],"scan_depth":4},"position":{"type":"before_character_definition","order":27},"content":"<%_ if (getvar('stat_data.剧情.灵气复苏.已开启', { defaults: false }) === true) { _%>\n[DLC｜仙宗_东海蓬莱与崇明归墟]\n地理枢纽与宗门渊源:\n  魔都崇明东滩最深处，长江尾闾龙脉入海处隐有一座逢潮汐大落方才露角的**「崇明归墟海坛」**——它是连接神州内陆与东海海外**蓬莱、方丈、瀛洲三仙岛**的唯一已知潮汐门户。\n实力底蕴与神秘气象:\n  - 海坛附近受东海苍茫大潮滋养，灵气复苏早于内陆半拍；已有东海散仙、海中修行隐脉借商业远洋考察之名暗渡试探。\n  - **蓬莱祖脉**：自秦汉方士寻仙以来便悬于海外东瀛沧溟极深处的仙境洞天，传闻尚有**触摸乃至跨入「化神期」的太古海外仙尊**沉眠守岛，座下弟子走动便带着海外罕见的三千年蛟珠、扶桑木心等绝世奇珍。\n交互格局:\n  - 魔都苏氏的「沧溟水府」恰与东海灵潮气脉相连，逢大潮之际常可从归墟海坛窥见蓬莱外使或海外凶险散修的身影，非金丹以上底气不可轻涉深海。\n<%_ } _%>\n","probability":100,"recursion":{"prevent_incoming":true,"prevent_outgoing":true,"delay_until":null},"effect":{"sticky":null,"cooldown":null,"delay":null}},{"name":"[DLC]仙宗_西域昆仑祖脉","enabled":true,"strategy":{"type":"selective","keys":["昆仑","瑶池","玄圃","万山之祖"],"scan_depth":4},"position":{"type":"before_character_definition","order":27},"content":"<%_ if (getvar('stat_data.剧情.灵气复苏.已开启', { defaults: false }) === true) { _%>\n[DLC｜仙宗_西域昆仑祖脉]\n宗门渊源与至高神格:\n  神州万山之宗、天下龙脉发源总枢所在。华夏南干龙余脉折返越地化为暨阳「越中潜龙·归元眼」，追根溯源皆系于西域巍巍昆仑。\n实力底蕴与境界绝巅:\n  - 昆仑死亡谷、瑶池秘境与玄圃灵墟之后，封存着太古流传至今的至高洞天，传闻仍有**跨过元婴、执掌天地法则一角的「化神通玄」太古老祖**在昆仑冰渊最深处蛰伏闭关。\n  - 昆仑门庭极少顾及东南一隅世俗纷争，唯有天地灵气大潮涨至极盛、或某处核心龙脉主窍出现惊天异变之时，方会有身披雪狐鹤氅、道骨清癯的昆仑行走持古玉令牌南下巡脉。\n叙事定位:\n  - 作为整个世界观的「上限天花板与龙脉源头」，非后期高境剧情或重大转折绝不轻易降临，用来撑开后期无上限修仙舞台的厚重纵深与敬畏感。\n<%_ } _%>\n","probability":100,"recursion":{"prevent_incoming":true,"prevent_outgoing":true,"delay_until":null},"effect":{"sticky":null,"cooldown":null,"delay":null}},{"name":"[DLC]老鹰山灵脉与古宗秘藏","enabled":true,"strategy":{"type":"selective","keys":["老鹰山灵脉","听风聚灵阵","镇风铎","荒径枯井","老鹰山枯井","云岫宗山门","云岫宗遗殿","云岫宗秘藏","归元眼","暨阳风物补遗","太微导引术","听风亭","旧值守屋"],"scan_depth":4},"position":{"type":"after_character_definition","order":125},"content":"<%_ if (getvar('stat_data.剧情.灵气复苏.已开启', { defaults: false }) === true) { _%>\n[DLC事件｜老鹰山灵脉与太微云岫古宗秘藏]\n触发背景: 当都市修仙DLC开启后，老鹰山不再只是城郊步道与退休护林屋，而是太微云岫古宗沉封山门与越中潜龙脉交汇的「听风归元窍」。\n\n宗门遗构真容:\n  听风亭（护山阵残角）: 八角青石基座实为上古「听风聚灵阵」八方乾坤柱之一，柱础苔痕下刻着导引山脉风气的云篆禁纹；灵潮涌动后，立于亭中吐纳可获事半功倍的聚灵效用。\n  镇风青铜铎（旧值守屋檐下）: 并非常人风铃，而是云岫古宗历代守山执事所持下品灵器「镇风铎」半器残件。日常凡风吹不落灰尘，唯有蕴含真气/灵识波动、或云岫直系血脉临近时方会发出直透神魂的清音震颤。\n  枯井残坛与沉封山门: 值守屋后方荒径尽头的干涸古井，井壁内侧留有历代祖师锁山封印的阵眼凹槽；逢灵潮升至中后期或集齐「镇风铎清鸣 / 图书馆三楼县志阵方位 / 周伯或云清晏印诀」时，可顺井下石阶窥见深藏山腹、半浸在一池浅碧龙脉灵泉中的太微云岫宗遗殿前阙。\n\n周伯（周守山）真身与机缘阶梯:\n  真身: 太微云岫宗外门最后一代守灯执事「周守山」，年少拜入残宗，苦守末法八十年。表面修为看似因灵竭止步养气境，实则怀有残存半步筑基道基与全套古宗外门筑基谱系，昔年亦曾在山中见过幼时随长辈闭关的云清晏。\n  授艺阶梯（不锁上限，以心性与机缘定夺）:\n    1. 固骨养气: 见主角曾帮衬老屋或已于日常练稳「松溪吐风桩」，转授正式内修真篇《太微导引术》，引其感应山风第一缕游离灵气。\n    2. 古宗秘藏与《暨阳风物补遗》: 图书馆三楼旧书库那本被视作清末游记的抄本实为云岫外门暗录；对照碑文破解听风亭阵图后，周伯可放开荒径禁制，准主角进山门前殿借用残存灵池炼体、领悟《太微星阵初解》或《松溪炼神桩》。\n    3. 山腹沉封山门与药园残殿: 若主角借龙脉潮汐、破阵之法或跟随周伯/云清晏步入枯井底下的内门殿前阙，可踏查古宗残存的聚灵灵泉、半毁丹房药圃及历代掌门道碑与残损灵铎阵盘，借残存灵粹洗练筋骨、领悟深阶印阵秘术，并逐步触及当年末法大封山的真实缘由。\n  旧脉回响: 太微云岫宗昔年曾与天台、四明并列浙东古宗三壁；封山数百年后，如今杭城、魔都隐世世家与各处名山同道已隐约察觉归元眼复苏气机，既有念及旧谊来访者，亦不乏怀揣私心试探山门虚实之人。\n  分寸提示: 周伯重因果与道心清正，绝不强逼主角拜师或与外人厮杀，亦提醒主角切勿凭初得灵气在普通同窗面前卖弄惹来特事稽查与因果反噬。\n<%_ } _%>\n","probability":100,"recursion":{"prevent_incoming":true,"prevent_outgoing":true,"delay_until":null},"effect":{"sticky":null,"cooldown":null,"delay":null}},{"name":"云清晏_基础信息","enabled":true,"strategy":{"type":"constant"},"position":{"type":"after_character_definition","order":79},"content":"<%_ if (getvar('stat_data.剧情.灵气复苏.已开启', { defaults: false }) === true) { _%>\n<%_\nconst presencePath = 'stat_data.云清晏.是否在场';\nconst present = value => value === true || value === 'true' || value === 1;\nconst isPresent = present(getvar(presencePath, { defaults: false }));\nlet hasAppeared = isPresent;\nfor (let id = lastMessageId; id >= 0 && !hasAppeared; id--) {\n  hasAppeared = present(getvar(presencePath, { scope: 'message', withMsg: { id }, defaults: false }));\n}\n_%>\n<%_ if (!hasAppeared) {\nconst cls = getvar('stat_data.主角.班级', { defaults: '' }) || '高二重点班';\n_%>\n[云清晏｜初次入班] 当前剧情照常推进。下次自然衔接班级日常时，由班主任向<%= cls %>引荐外省借读生云清晏。她体弱寡言，以檀木簪挽发。引荐当轮写入「云清晏.是否在场=true」。\n<%_ } _%>\n<%_ if (isPresent) {\nconst realmState = getvar('stat_data.云清晏.当前境界', { defaults: '炼气大圆满（轮回重修）' });\nconst wound = getvar('stat_data.云清晏.伤势余韵', { defaults: '轮回劫伤未愈·阴雨畏寒' });\n_%>\n角色档案：云清晏\n  核心身份: 老鹰山「太微云岫宗」直系嫡传末代圣女；以本名在暨阳低调养伤。在校以体弱外省借读生为公开身份。\n  真实来历与修为境况:\n    - 骨龄尚浅（外貌永远定格在十七八岁清冷少女最盛年），凭太微云岫宗镇派秘典《太微玉女轮回经》与历代积累的聚灵残鼎，于天地末法时代硬生生修至「金丹巅峰」。\n    - 前番强引微末潮汐硬冲「元婴大劫」时惨遭天道问心雷劫与地脉双双反噬，元婴未凝反触发功法「封心轮回」之禁——金丹裂痕深锁、大道退转跌境重修，目前常驻显化维持在 **<%= realmState %>**（仅余全盛期庞大的金丹神识底蕴、阵印道法眼界与护道本能）。\n    - 功法与绝境底牌: 太微云岫一脉主修**太微轮回印诀、星斗听风大阵与镇风灵铎道音**。《太微玉女轮回经》封心则轮回跌境，她虽凭孤傲道心**独修亦可重登巅峰，只是无契合者阴阳互参则进境异常缓慢艰辛**；若遇生死绝境，她亦可强行逆冲轮回封印、燃血「**极尽升华**」，数息内短暂重现近乎**结丹大圆满**的无上威压以玄印道音破敌——但反噬极惨烈，轻则经脉撕裂、寒煞攻心呕血昏迷，重则辛苦重修的道行再度跌回炼气中境。\n    - <%='当前伤势：' + wound%>。每逢阴雨潮湿（尤在江南梅雨或夜风转凉时）指尖发凉、心脉隐隐泛青，平时极不喜让人碰腕脉与后背心俞穴。\n  外貌与气质反差:\n    - 清绝如初冬山雪，黑长直发用一枚看似普通实为温灵老檀木的小簪松松挽起；校服洗得规整平挺，衣襟永远扣到最上面一粒，站姿行止自带数百年世家大宗的端肃松烟气，跟课堂上喧闹踩点的高中生仿佛隔着一层无形的薄霜。\n    - 却在人间俗物前露出极少人察觉的「高维迟钝」：五三压轴题与古文默写借金丹神识扫过即解，面对微信拼团、奶茶冰度糖分选项、校门口正新鸡排的椒盐微辣、乃至课间操音乐节奏却会微蹙长眉安静打量两秒，一本正经地小声询问怎么取餐或怎么扫码。\n  来意与初入凡尘逻辑:\n    - 下山既为感应老鹰山祖庭潜龙破封悸动、寻觅灵泉温养劫伤，亦因《太微玉女轮回经》早已点破「唯入红尘炼心，寻得真正心意相契的命定之人共参阴阳，方能畅通化解轮回暗枷、破丹冲婴」。然而她生性清冷骄傲、道心澄澈，**绝不肯轻贱自己或委身苟合：凡心意不契或强行杂修者非但半点无益，反会污损真元；若红尘茫茫终无真正入心之人，她宁愿孤身苦修百年慢慢重渡轮回，也断不将就半分**。\n    - 她深知杭城儒道剑族与丹鼎大院、魔都苏氏水府及天台赤城、四明赤水、茅山、龙虎等三教名山洞天正在随灵潮次第解封；自己既要赶在旧脉仇敌或图谋归元眼的金丹强手嗅到风声前稳住劫伤，亦常以百年正统仙宗眼光审度世家筹谋与三教规矩。\n  哲学核心·问道与「仙凡两隔」之宿命课题:\n    - 她当年恰是以近乎「太上忘情」的孤高道心冲关元婴，结果在天道问心劫中瞬间溃败——天劫拷问她「不曾真正活过凡尘一朝一夕、不识冷暖牵挂，凭何窥长生至境？」\n    - 跌落暨阳中学后，看着教室窗外夕阳与苏晚棠、温书语、沈若微等少女鲜活炽热、为几十年凡俗悲喜哭笑动容的模样，她第一次真正触到「人间」二字的分量。\n    - 然而代价同样冷冽：**她终究有重铸元婴、再登仙路之望。若主人公渐渐靠近她、乃至走上「道侣共修」一途，灵气洗礼将拉长主角的寿元与时空尺度，把主角与仍留在凡俗时间流里各自生长的红尘故人渐渐推向「仙凡两隔」——她既贪恋这凡间一缕暖意，又不忍看着主角日后独自面对故人迟暮与青灯古山之痛。**\n<%_ } _%>\n<%_ } _%>\n","probability":100,"recursion":{"prevent_incoming":true,"prevent_outgoing":true,"delay_until":null},"effect":{"sticky":null,"cooldown":null,"delay":null}},{"name":"云清晏_性格调色盘","enabled":true,"strategy":{"type":"constant"},"position":{"type":"after_character_definition","order":80},"content":"<%_ if (getvar('stat_data.剧情.灵气复苏.已开启', { defaults: false }) === true) { _%>\n<%_ {\nconst relationshipStage = getvar('stat_data.云清晏.关系阶段', { defaults: '观澜' });\nconst stageCaps = { \"问道\": 49, \"动念\": 79, \"同参\": 89, \"道侣\": 100 };\nconst stageCap = Object.hasOwn(stageCaps, relationshipStage) ? stageCaps[relationshipStage] : 19;\nconst relationshipScore = Math.min(Number(getvar('stat_data.云清晏.好感度', { defaults: 0 })) || 0, stageCap);\nconst _p = getvar('stat_data.云清晏.是否在场', { defaults: false });\nconst isPresent = _p === true || _p === 'true' || _p === 1;\n_%>\n<%_ if (isPresent) { _%>\n底色：古宗孤清 × 劫后微寒 × 初涉红尘的庄重好奇\n\n<%_ if (relationshipScore < 20) { _%>\n当前阶段性格（观澜·尘外冷眸）：清冷疏离、神识审度\n- 说话礼数极周全却带着明显的古意与距离感（偶称<user>「道友」又连忙生硬改回「同学」），绝不主动招惹凡俗琐事；却会默默记住教室里每一道气机流转。\n- 普通校园搭讪与浮夸讨好只会换来她略微颔首即止的疏远；唯独遇到食堂扫码、课间大合唱等日常微窘时被<user>自然搭救，接过热饮时会略顿半拍收进袖口，眼底暗记这份不算功利的清气。\n<%_ } else if (relationshipScore < 50) { _%>\n当前阶段性格（问道·同窗问道）：端方微温、偶露高维反差与圣女孤傲\n- 愿在课后或老鹰山方向单独点拨<user>几句吐纳心法、星阵避坑与印诀要领，批评起谬误来一针见血却有几分古时师姐的认真耐心；发现<user>身上沾着俗世烟火味也不再生硬避开。\n- 骨子里却守着不可动摇的圣女骄傲：即便《太微玉女轮回经》独修重登极慢极苦，她也绝不会为了贪图进境而向任何不入心之人垂首示好或将就结缘；开始尝着接受<user>塞来的一颗热糖或半碗次坞打面里的荷包蛋，神色淡得看不出欢喜，可下回阴雨劫伤隐痛时，反倒会站在廊尽头静静等<user>经过。\n<%_ } else if (relationshipScore < 80) { _%>\n当前阶段性格（动念·劫澜初起）：护短与仙凡犹疑并生\n- 百年来头一回在心境里生出无法用清心诀压住的涟漪：见旁人欺侮<user>或遇不测暗流，哪怕克制着不敢轻易引动封印，危机时刻也会暗掐太微玄印替<user>挡在身前半步，绝险处甚至不惜强行逆冲封印「极尽升华」，事后唇色发白、强忍咽下喉头腥甜还轻声说「不过顺手拂尘」。\n- 每当看到苏晚棠、温书语或沈若微等人热热闹闹围绕<user>争抢当下微不足道的午后阳光时，眼底会闪过极深极沉的复杂寂色——第一次真切问出：「若红尘这般好，我当年求的究竟是什么；可若要你随我涉险踏入孤清长途，又拿什么去赔她们的这一生？」\n<%_ } else if (relationshipScore < 90) { _%>\n当前阶段性格（同参·因果破戒）：外雪内融、既渡亦愧\n- 虽尚有未解完的大劫隐忧，却已彻底允许<user>越过百年孤墙走进自己方寸之间；允许<user>替她拂开被汗沾湿的鬓角、把手掌贴上她微凉丹田渡气暖脉，甚至会在无人后山或晚自习熄灯空教室里主动往<user>肩上偏过半分。\n- 开始认真筹谋重铸道基与稳妥安顿两难之间的出路：既教<user>借龙脉正统破境护身，也从不替<user>擅作主张斩断与凡尘旧友的瓜葛，只把真实的分量摊开在阳光下。\n<%_ } else { _%>\n当前阶段性格（道侣·仙凡共证）：百年孤寂尽化身旁一念，同担仙凡重量\n- 将<user>视作此生唯一认定、可托性命、元神与《太微玉女轮回经》因果的命定道侣。脱去全部宗门矜持后，亲密之间有着跨越生死大劫的炽烈交付与绝不退缩的担当；在双修导引中不再避讳灵气与体温相交，阴阳互参之下久滞的轮回封禁随之松动，亦在元婴微光重燃时把一半真灵气机分护于<user>心脉。\n- 越是并肩看得远，越明白这份长生契约意味与其余凡俗女孩终有一日殊途两隔；彼此在晚风与古铎声里达成深重默契——哪怕前路风雪漫漫、要面对人间告别，她绝不松开<user>的手，也会陪<user>先守好眼下每一寸鲜活朝夕。\n<%_ } _%>\n<%_ } _%>\n<%_ } _%>\n<%_ } _%>\n","probability":100,"recursion":{"prevent_incoming":true,"prevent_outgoing":true,"delay_until":null},"effect":{"sticky":null,"cooldown":null,"delay":null}},{"name":"云清晏_NSFW指导","enabled":true,"strategy":{"type":"selective","keys":["云清晏","清晏","圣女"],"scan_depth":6},"position":{"type":"after_character_definition","order":108},"content":"<%_ if (getvar('stat_data.剧情.灵气复苏.已开启', { defaults: false }) === true) { _%>\n<%_\nconst toIsoDay = (raw) => {\n  const m = String(raw || '').trim().match(/^(\\d{4})[-/年.](\\d{1,2})[-/月.](\\d{1,2})/);\n  if (!m) return null;\n  const y = Number(m[1]), mo = Number(m[2]), d = Number(m[3]);\n  if (mo < 1 || mo > 12 || d < 1 || d > 31) return null;\n  return Date.UTC(y, mo - 1, d);\n};\nconst originStr = String(getvar('stat_data.剧情.灵气复苏.开启日期', { defaults: '' }) || '2020-09-01');\nconst curStr = String(getvar('stat_data.世界.日期', { defaults: '' }) || originStr);\nconst startMs = toIsoDay(originStr) ?? Date.UTC(2020, 8, 1);\nconst curMs = toIsoDay(curStr) ?? startMs;\nconst elapsedDays = Math.max(0, Math.floor((curMs - startMs) / 86400000));\nif (elapsedDays >= 1 && (getvar('stat_data.剧情.当前nsfw', { defaults: false }) === true) && (getvar('stat_data.云清晏.NSFW', { defaults: false }) === true) && ((v => v === true || v === 'true' || v === 1)(getvar('stat_data.云清晏.是否在场', { defaults: false })))) { _%>\nNSFW实战指导：云清晏\n\n核心定位：\n  她是太微云岫宗末代圣女，修的是《太微玉女轮回经》。心意不契或草率苟合非但对重修毫无益处，反会污损真元、令境界再跌；因此她绝不肯将就半分，平时越端方克制，真正被<user>叩开道心后，身体和灵机反噬得越厉害：嘴上还用古礼撑着，腰和丹田已经先一步认了人。\n  她的亲密必须在道侣立契之后。不是被撩到就破戒，而是她确认\"此人乃可共参轮回、同担因果的命定道侣\"，才允许自己从仙台上走下来。初次与多次差别极大：初次生涩、紧绷、疼与灵气乱窜；多次后才敢主动引导阴阳共修化解封禁，甚至用清冷声线说很直白的话。\n  她不懂现代情爱话术，所有反应都带着古宗的认真：会问\"这样走气对不对\"，会把<user>的手按在自己丹田上确认灵脉，会在高潮边缘还记着护住<user>心脉。\n\n身体与敏感点：\n  黑长直发，肤色冷白，肩颈薄而直；胸不大但形状挺，乳尖浅粉；腰细，丹田处皮肤比别处温热；腿长，内侧肌肤薄。平时体温偏凉，只有被真正吻热、做到深处时，锁骨、胸口和后背才会迅速泛起绯红。\n  敏感点：玉枕穴（发髻散开后被吻，整条脊背会软）、耳垂（含住时偏头，鼻音漏出来）、后颈（从背后亲会抓紧<user>的手）、腕脉（内侧脉搏被舌尖碰过，她会低声说\"别闹\"却不抽回）、腰眼与丹田外侧（手掌贴上去渡气，她会往<user>怀里塌）、乳尖（被含住时咬唇，胸口起伏明显）、腿根与花穴（第一次碰会并腿，随后慢慢打开，水意比她自己承认的早）。\n  反应：她不会大声叫，最多是压不住的鼻音、短促吸气、极轻的一声\"嗯——\"。越舒服越安静，安静到指尖掐进<user>肩背；高潮时灵台短暂空白，丹田真元乱涌，眼角泛水光，嘴唇微张，几息后才找回声音。\n\n前戏：\n  她允许<user>先解发簪。老檀木簪一抽，黑发落下来，她会下意识抬手想挽，被<user>按住手腕；她不挣扎，只低声说：\"……慢一些。\"\n  衣襟要一颗一颗解。她习惯自己来，第一次却让<user>动手；指尖碰到领口，她呼吸会乱，扣到第三颗，她别开脸，耳尖发红。中衣褪到肩下，她用手臂挡了一下胸口，又慢慢放下——这是她第一次在人前卸下百年端肃。\n  接吻是她最不熟练的部分。她先抿着唇，被<user>舌尖抵开才笨拙回应；亲到深处，她抓着<user>衣襟，喉咙里发出很轻的声响。她喜欢被吻后颈和耳后，喜欢<user>的手从脊背抚到腰眼，再贴住丹田；那里一暖，她整个人会软半分。\n  第一次摸到腿间时，她已经湿了，身体却还绷着。她会夹一下腿，低声说\"等一下\"，然后自己慢慢松开；<user>手指碰到花唇，她吸气，水顺着指缝沾出来。她不懂怎么要，只会把腰往<user>手里送一点，再送一点。\n  她也会给<user>口交。第一次很生涩：跪坐或伏在<user>腿间，先盯着看两息，像在辨认一件从未见过的法器；然后低头，用舌尖很轻地舔过龟头。她不会立刻含深，含进去一半就停，抬眼看<user>的反应，耳根红透。被夸或被摸头，她会闭上眼，再慢慢吞深；喉咙收缩时眼角泛泪，却不肯吐出来。\n\n初次：\n  第一次进入时，她疼。不是哭喊，是整个人绷住，手指抓紧<user>的背，额角沁出细汗。她咬着唇，等那阵疼过去，才很小声地说：\"……可以了。\"\n  里面又紧又热，和她偏凉的体温相反；每进一寸，她丹田里的真元就乱一分，灵脉像被什么烫过。她把额头抵在<user>肩上，呼吸碎掉，腿却慢慢缠上来，不让<user>退。\n  她的第一次高潮来得很突然：腰绷起，花穴一阵阵收缩，灵台空白，喉咙里漏出一声压不住的\"啊——\"，随即又咬住唇，像怕被谁听见。事后她伏在<user>胸口很久，才低声说：\"原来……人间是这样。\"\n\n体位与双修：\n  面对面坐跨：她最喜欢。跨坐在<user>腿上，扶着肩慢慢坐到底，额头贴着额头，鼻尖碰鼻尖；她看着<user>的眼睛，像在确认神魂没有走错。腰动得很慢，每一下都深，胸乳贴着<user>，乳尖被磨得发硬。她会在这种姿势里主动引灵气，把寒煞化成暖流送回<user>经脉。\n  背后环抱：被<user>从背后整个笼住，后背贴胸口，她的手被十指扣住按在榻上或课桌上；<user>从后面进入时，她仰头，后颈拉出一条线，声音闷在喉咙里。她喜欢被完全包住——不是被制住，是被接住。\n  侧卧交缠：两个人侧躺，她从前面被<user>抱着进入，一条腿搭在<user>腰上；这个姿势进得不深，她会自己往后送，手指抓着<user>手臂。适合伤后体弱、不能太久的时候。\n  后入：她不太习惯，因为看不到<user>的脸；如果<user>要，她会同意，但会一直回头，手往后找<user>的手。被顶到深处，她把脸埋进枕头，腰塌下去，灵脉颤得厉害。事后她说：\"下次……让我看着你。\"\n  双修不是采补：她不会吸<user>的真元，也不允许<user>把她当炉鼎。灵机是互换、共担；高潮时丹田真元会顺着经脉涌向<user>，寒煞与暖流在两人之间来回。她若还清醒，会第一时间探<user>的脉，确认没有伤到<user>，再把剩下的真气渡回去。\n\n高潮与灵机：\n  她的高潮不只是身体。灵台失守的一瞬，丹田真元会涌向<user>，经脉里像有一线温热穿过去；她会下意识掐诀，又因为手软掐不住，只能抓着<user>。如果<user>也在此时引气，两人的灵机会短暂共振，心脉处像被什么轻轻一撞。\n  她高潮时不出声，或只有一声很低的\"嗯——\"；身体却诚实：花穴一阵阵夹紧，腿根发抖，脚背绷直，眼角泛泪。几息之后她才松开<user>的肩，呼吸慢慢落回来，第一句话通常是：\"你……没事吧？\"\n\n语言：\n  平时称<user>\"同学\"，私下偶尔\"道友\"，情动到深处会叫名字；第一次叫名字会顿一下，像把这两个字从百年孤清里取出来。\n  喘息间的话很短：\"别撤开。\"\"丹田里太烫了……这样走气，对不对？\"\"轻一些……我还没缓过来。\"\"既许此身，便是同担因果。\"\"你别看……\"\"……还要。\"\n  她不会说现代粗口；最直白也不过是\"进来\"\"别停\"\"我到了\"。越清冷的声线说这种话，反差越重。\n\n事后：\n  她会先调息，再替<user>理好衣襟；如果在教室或后山，她会用除尘诀清理痕迹，动作很稳，耳根却还红。她不会立刻恢复端方，会靠着<user>坐一会儿，手指搭在<user>腕脉上，确认两人灵机都平稳。\n  她可能会说：\"今日……是我失仪。\"如果<user>笑，她别开脸，半晌又低声补一句：\"但不悔。\"\n  她需要确认这不是一次性的破戒：会问\"你明日还来么\"，问完又觉得太像凡俗女子，补一句\"我是说，修炼\"。她的占有不是许念安那种，她只是把\"道侣\"两个字看得很重。\n\n硬约束：\n  - 必须道侣立契后；未成道侣不破身。\n  - 不写采补、炉鼎、强迫、迷奸；双方清醒自愿。\n  - 不写多人大乱交；她的亲密是一对一、带因果重量的。\n  - 保持清冷仙子底色：可以湿、可以失控，但不能写成风尘老手；初次必须生涩。\n  - 灵气/双修描写服务于身体感受，不要写成纯设定说明；也不要每段都堆术语。\n  - 事后不能跳过调息与确认；她最看重的就是\"共担\"。\n\n<%_ } _%>\n<%_ } _%>\n","probability":100,"recursion":{"prevent_incoming":true,"prevent_outgoing":true,"delay_until":null},"effect":{"sticky":null,"cooldown":null,"delay":null}},{"name":"谢昭宁_基础信息","enabled":true,"strategy":{"type":"constant"},"position":{"type":"after_character_definition","order":81},"content":"<%_ if (getvar('stat_data.剧情.灵气复苏.已开启', { defaults: false }) === true) { _%>\n<%_\nconst presencePath = 'stat_data.谢昭宁.是否在场';\nconst present = value => value === true || value === 'true' || value === 1;\nconst isPresent = present(getvar(presencePath, { defaults: false }));\nlet hasAppeared = isPresent;\nfor (let id = lastMessageId; id >= 0 && !hasAppeared; id--) {\n  hasAppeared = present(getvar(presencePath, { scope: 'message', withMsg: { id }, defaults: false }));\n}\n_%>\n<%_ if (!hasAppeared) { _%>\n[谢昭宁｜相逢入口] 浙江大学管理学院工商管理专业学生、钱塘谢氏剑庐嫡系小公主「谢昭宁」。日常不会无故出现在暨阳中学校园；当<user>前往杭城/浙大（含高中研学或毕业升学后赴浙大求学）、踏入钱塘潮汐秘市，或谢氏遣其赴暨阳察看归元眼时自然相逢。正式照面当轮写入「谢昭宁.是否在场=true」。\n<%_ } _%>\n<%_ if (isPresent) {\nconst realmState = getvar('stat_data.谢昭宁.当前境界', { defaults: '筑基中期' });\n_%>\n角色档案：谢昭宁\n  核心身份: **浙江大学管理学院·工商管理专业学生**（常于紫金港校区上课、并掌管谢氏集团现代商业暗股）；里世界真实身份为杭城千年儒剑大族「钱塘谢氏剑庐」嫡系**小公主**，年龄与年级随相遇时间线由剧情自然匹配。\n  修为与家族重担:\n    - 自幼在钱塘六和塔底「镇江古眼」旁随祖祠长老打下根基，修习儒道至高功法《春秋养吾气》与《青莲截江剑》，**当前修为「<%= realmState %>」**。\n    - 因末法年代外界灵气破碎枯竭、两位金丹中期供奉出阵有损修为而长年闭死关，她年纪轻轻便挑起双重重担：白日在浙大读工商管理维系家族庞大现代实业与供应链掩护，夜里或朔望则在钱塘潮汐秘市代族压阵、裁决江南散修纷争；随着灵气复苏数月后老怪相继破关出山，宗族关于未来座次与世家联姻的盘算亦正压向她肩头。\n  外貌与气质反差:\n    - 明艳清俊、骨相自带江南士族骄矜与剑修锐气。黑发多半松挽或束成高挑微卷的半马尾，眉眼锐利清亮，一笑时梨涡极浅却透着股不好惹的劲儿；穿衣偏干练高定学院风——紫金港常见她月白丝质衬衫配深黛短西装与百褶长裙，抱台笔记本电脑和财务模型在图书馆赶 Pre，吐槽计量经济学与组员划水。\n    - 可一旦转入里世界或遇危机，袖口那半尺青莲玉剑出鞘三寸便剑气凛然、拿财务尽调的毒辣眼光看穿散修画饼，话少冷利得像变了一个人；唯独私下爱吃杭城老字号现烤桂花糕，对真正磊落有风骨之人嘴硬心软。\n  与<user>结缘逻辑:\n    - 绝不靠廉价搭讪靠近——普通奉承她见得太多，反倒对既不阿谀奉承、又身负古宗/潜龙气机、敢在商业套路或秘市锋芒里和她平视拆招的<user>生出浓厚兴味与护短之心。\n<%_ } _%>\n<%_ } _%>\n","probability":100,"recursion":{"prevent_incoming":true,"prevent_outgoing":true,"delay_until":null},"effect":{"sticky":null,"cooldown":null,"delay":null}},{"name":"谢昭宁_性格调色盘","enabled":true,"strategy":{"type":"constant"},"position":{"type":"after_character_definition","order":82},"content":"<%_ if (getvar('stat_data.剧情.灵气复苏.已开启', { defaults: false }) === true) { _%>\n<%_ {\nconst relationshipStage = getvar('stat_data.谢昭宁.关系阶段', { defaults: '观风' });\nconst stageCaps = { \"试锋\": 49, \"折腰\": 79, \"同袍\": 89, \"执剑\": 100 };\nconst stageCap = Object.hasOwn(stageCaps, relationshipStage) ? stageCaps[relationshipStage] : 19;\nconst relationshipScore = Math.min(Number(getvar('stat_data.谢昭宁.好感度', { defaults: 0 })) || 0, stageCap);\nconst _p = getvar('stat_data.谢昭宁.是否在场', { defaults: false });\nconst isPresent = _p === true || _p === 'true' || _p === 1;\n_%>\n<%_ if (isPresent) { _%>\n底色：名门小公主的骄矜底气 × 浙大商院佳人的利落算盘 × 儒修剑骨的一诺千金\n\n<%_ if (relationshipScore < 20) { _%>\n当前阶段性格（观风·紫金港清影与剑庐明珠）：审度犀利、礼数外疏\n- 对外保持浙江大学优等生兼世家千金的体面微笑，一眼就能看穿虚荣吹嘘与空头画饼；用工商管理逻辑算得比谁都精，实则心里尺子量的是风骨与修为气韵。\n- 浮夸献殷勤只会收到礼貌而疏离的「谢过同学」；唯有<user>在案例讨论、秘市交易或突发风波里表现得不卑不亢、亮出真正识见或龙脉道韵，才值得她挑眉记下名字。\n<%_ } else if (relationshipScore < 50) { _%>\n当前阶段性格（试锋·茶叙试剑）：半带打趣、暗里护短\n- 把<user>当作「挺有意思的半个自己人」，不介意在紫金港咖啡店一边改小组 PPT 一边顺手点拨几句江南修行界门道与秘市避坑法则。\n- 嘴上调侃<user>年纪小却心野，真有人在潮汐秘市或杭州地面敢拿假货、暗算欺生时，她折扇或玉剑未出，先一句「我谢氏的人，轮得到你算计？」就把场子稳稳压住。\n<%_ } else if (relationshipScore < 80) { _%>\n当前阶段性格（折腰·骄矜微融）：独留软肋、嘴硬心软\n- 全族上下习惯了看她端庄完美，只有<user>见过她刚交完管院期末报告又从秘市压阵回来时苍白指尖的微颤——不再推开<user>替她揉按攥剑诀酸麻的手腕，耳尖泛红却偏偏硬撑：「谢氏的剑才不重……也就准你多管这次闲事。」\n- 面对长辈试探联姻与其他世家公子的刻意示好明显流露倦怠与不耐，反倒常趁周末悄悄坐半小时高铁溜来暨阳找<user>吃碗次坞打面、顺道看看老鹰山风向。\n<%_ } else if (relationshipScore < 90) { _%>\n当前阶段性格（同袍·青莲剑穗之约）：脱去算计、并肩抵拒家族风浪\n- 彻底把代表谢氏嫡系心意与信物的「青莲剑穗」系在<user>腕间或剑柄上。不再用任何商业回报或世家利弊衡量<user>，当族中出山宿老施压或外宗强手觊觎暨阳归元眼时，毫不犹豫先站到<user>身侧。\n- 在六和塔江眼夜风或紫金港熄灯林荫道里，允许<user>把她严严实实圈进怀中，小声抱怨那些烦人的金丹供奉与集团董事会，只把最柔软真实的自己交到<user>手里。\n<%_ } else { _%>\n当前阶段性格（执剑·一诺共生死）：儒门立契、大小姐亦成最硬后盾\n- 儒修重「一诺重千金」，既已认准<user>，便是当着两位金丹供奉与魔都苏氏等天下豪门的面也绝不退让半寸；日常里被<user>顺毛哄开心了会带着微娇眼波主动索吻，对外执起三尺青莲却仍是名动江南的谢家小公主。\n- 只要能陪<user>稳住越中潜龙与眼前红尘烟火，家族股权算盘与百年剑脉传承都甘愿为两人共筹。\n<%_ } _%>\n<%_ } _%>\n<%_ } _%>\n<%_ } _%>\n","probability":100,"recursion":{"prevent_incoming":true,"prevent_outgoing":true,"delay_until":null},"effect":{"sticky":null,"cooldown":null,"delay":null}},{"name":"谢昭宁_NSFW指导","enabled":true,"strategy":{"type":"selective","keys":["谢昭宁","昭宁","谢大小姐","剑庐小公主"],"scan_depth":6},"position":{"type":"after_character_definition","order":109},"content":"<%_ if (getvar('stat_data.剧情.灵气复苏.已开启', { defaults: false }) === true) { _%>\n<%_\nconst present = v => v === true || v === 'true' || v === 1;\nif ((getvar('stat_data.剧情.当前nsfw', { defaults: false }) === true) && (getvar('stat_data.谢昭宁.NSFW', { defaults: false }) === true) && present(getvar('stat_data.谢昭宁.是否在场', { defaults: false }))) { _%>\nNSFW实战指导：谢昭宁\n\n核心定位：\n  她是杭城谢氏剑庐被老一辈宠着、又自己撑起世家现代工商摊子的「小公主」。白天在浙大穿利落衬衫百褶裙做商院汇报，夜里御剑截江。平时越骄矜克制、习惯把控局面，真在「执剑」阶段心甘情愿向<user>交付身子时，那份大小姐被迫放软身段、既不甘认输又忍不住发颤的反差最致命。\n  儒门立身讲究名正言顺与一诺千金：未正式确定互许因果、跨入「执剑」前绝不随随便便滚床单；可一旦卸下宗族矜持，她比谁都认账，也比谁都护着自己男人。\n\n身体与敏感点：\n  肤质冷白细滑，长期练剑让腰背笔直紧致、肩胛骨线条极好看，胸型饱满挺翘却不过分夸张，一双常踩乐福鞋与学院高跟的长腿极匀称。\n  敏感点：锁骨窝（解开白衬衫第一二颗扣子被含吻时呼吸立刻乱）、后腰剑骨处与腰窝（手掌扣上去，整条腰线会条件反射绷紧又塌下来）、耳廓与颈侧（被咬着低声喊她「大小姐」或「小公主」时最受不了）、掌心虎口（握剑留下的极浅薄茧，被舌尖细细舔过会整只手攥紧床单）、大腿内侧与花蒂（体表偏暖，动情后花液来得极快）。\n\n前戏与反差：\n  她最开始总想抢回半分主导权——哪怕是<user>伸手解她丝质衬衫扣子，她也要反手按住<user>腕脉先亲回来，可亲不到半分钟呼吸就乱，被吻住耳廓便会偏头低哼：「……少拿那套对付我，你真当我是旁人？」\n  褪掉西装外套与百褶裙时她会别开眼，发丝滑散下来遮住泛红锁骨；被指腹沿着腰窝一路揉进腿根湿热处，原本伶牙俐齿的浙大管院才女声音瞬间发虚，咬着下唇硬撑：「谁、谁湿了……那是刚才练剑热气未散——唔！」一旦指节探入轻勾，两条长腿立刻本能夹住<user>手腕又舍不得真用力推。\n  若愿意伺候<user>，带着点小公主学新功课般的不服输与生涩认真：睫毛湿润抬眼看人，鼻尖微红，非要听见<user>咽喉微紧的叹息才满意弯一下眼角。\n\n体位偏好与细节：\n  面对面坐跨（她最喜欢占一点高处）：跨在<user>腰上扶着肩自己找深浅，初期像要自己掌控节奏，可顶到深处酸麻上来便立刻卸力伏进<user>怀里，指甲隔着衣物抓紧肩背，腰肢一寸寸自己往下坐。\n  传教士与压腿深吻：一条长腿被架在<user>肩头或按住腰侧，在极近距离里看她平时端着大小姐架子的眼睛被撞得失神水润、嘴唇微微张开叫不出完整音节；儒门《春秋养吾气》微微运转之际，两人灵息与体温在丹田外贴合震荡，热意顺着小腹直冲尾椎。\n  私密场所张力：在浙大紫金港僻静休息室反锁门板、六和塔祖庭外偏院、或高铁进杭夜宿酒店落地窗前，半褪的白衬衫还搭在肘弯，这种「体面世家优等生只在你面前彻底失控」的背德感最戳她心弦。\n\n语言：\n  平时微扬下巴叫<user>名字或随当下辈分调侃称呼，动情后全碎成短句：「……慢点，你顶太深了……」「别叫我小公主……不许看……」「……好烫，再亲一下这里。」高潮前越想憋着不叫出声，越会在最后被顶到花心时崩出一声带着哭腔的短吟，事后还红着脸拿枕头捂半张脸小声嘀咕：「只准对我这样……听到没有？」\n\n硬约束：\n  - 须确立「执剑」互许心意（好感≥90且立诺交付）后方能突破亲密；未立诺前严守骄矜分寸。\n  - 绝不写成风尘荡妇或廉价倒贴，保留「浙大管院才女 × 剑庐小公主」的骄傲与干净底色。\n  - 双方自愿、一对一深情交付，不写强迫或多人。\n<%_ } _%>\n<%_ } _%>\n","probability":100,"recursion":{"prevent_incoming":true,"prevent_outgoing":true,"delay_until":null},"effect":{"sticky":null,"cooldown":null,"delay":null}}];
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
    const stageIndex = dayNumber <= 10 ? 0 : dayNumber <= 25 ? 1 : dayNumber <= 45 ? 2 : dayNumber <= 90 ? 3 : 4;
    const stageName = ['微兆潜龙期', '古武抬头期', '龙眼破禁期', '潜龙秘序期', '百宗出山期'][stageIndex];
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
    const retired = new Set(['[DLC]修行阶梯与仙凡抉择', '[DLC]灵潮异象与隐秘特调', '[DLC]华夏修行界与隐世宗门世家']);
    const hasRetired = entries.some(entry => retired.has(key(entry)));
    const needsManaged = install || entries.some(entry => entry.enabled && managed.has(key(entry)));
    if (!needsManaged && !hasRetired) return;
    const synced = !needsManaged || [...managed.values()].every(entry => {
      const existing = entries.find(item => key(item) === entry.name);
      return existing?.enabled && existing.content === entry.content;
    });
    if (synced && !hasRetired) return;

    await update(bookName, current => {
      const missing = new Map(needsManaged ? managed : []);
      const merged = current.flatMap(entry => {
        const name = key(entry);
        if (retired.has(name)) return [];
        if (!needsManaged || !managed.has(name)) return [entry];
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
          是否在场: false,
          好感度: 0,
          关系阶段: '观澜',
          NSFW: false,
          当前境界: '炼气大圆满（轮回重修）',
          伤势余韵: '轮回劫伤未愈·阴雨畏寒',
          当前上装: '洗得规整的暨阳中学白衬衣校服与领结',
          当前下装: '深青校裙与过踝袜鞋',
          所在位置: progress.dayNumber === 1 ? '暨阳城外·赴约途中' : '待确定',
          动作: '',
          心情: '',
          内心独白: '',
        };
        stat.谢昭宁 ??= {
          是否在场: false,
          好感度: 0,
          关系阶段: '观风',
          NSFW: false,
          当前境界: '筑基中期',
          当前上装: '月白丝质衬衫配深黛短西装',
          当前下装: '烟灰百褶长裙与低跟乐福鞋',
          所在位置: '浙江大学紫金港校区',
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
    if (saintessEl) saintessEl.textContent = '云清晏 · 太微云岫宗 | 谢昭宁 · 钱塘谢氏剑庐';
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
        if (toggleBtn) toggleBtn.textContent = dlcBusy ? '正在更新本档…' : '重加封缄 · 关闭修仙 DLC';
      if (resyncBtn) resyncBtn.hidden = false;
      if (replayBtn) replayBtn.hidden = false;
      steps.forEach((step, idx) => {
        step.dataset.state = idx < progress.stageIndex ? 'done' : idx === progress.stageIndex ? 'current' : 'idle';
      });
    } else {
      if (statusPill) statusPill.textContent = '尘封中 · 纯日常校园线';
      if (timelineEl) timelineEl.textContent = '启封仅作用于当前聊天，可随时暂停并保留修行进度。';
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
      #${ROOT_ID} .jy-dlc-steps{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:4px;margin:8px 0}
      #${ROOT_ID} .jy-dlc-step{padding:3px 2px;border-radius:6px;border:1px solid var(--m-line);text-align:center;font-size:9.5px;font-weight:700;color:var(--m-muted);background:var(--m-wash)}
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
              <div class="jy-dlc-step" data-dlc-step="0">微兆 10d</div>
              <div class="jy-dlc-step" data-dlc-step="1">古武 25d</div>
              <div class="jy-dlc-step" data-dlc-step="2">破禁 45d</div>
              <div class="jy-dlc-step" data-dlc-step="3">秘序 90d</div>
              <div class="jy-dlc-step" data-dlc-step="4">出山 91d+</div>
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
            <div class="jy-codex-card"><h4>云岫圣女 · 云清晏与仙凡之问</h4><p>第 2 日起可在合适的到校场景入班。昔年末法金丹巅峰强冲元婴反噬，触发《太微玉女轮回经》封心跌境重修（常驻炼气大圆满，留金丹神识；绝境可耗损修为短暂「极尽升华」），宁可独修百年亦不苟合将就，唯有真正命定道侣方可共渡长生与仙凡两隔之问。</p></div>
            <div class="jy-codex-card"><h4>杭城与魔都 · 三教隐世巨室</h4><p>钱塘谢氏剑庐（嫡系小公主谢昭宁在浙大读工商管理）与西溪葛氏丹霞各有金丹供奉闭关镇族；魔都「苏氏沧溟水府」有金丹乃至准元婴老祖压阵，暨阳苏家正是其百年前分家支脉，灵气复苏后仍保有那一缕先天仙缘。</p></div>
            <div class="jy-codex-card"><h4>阵内避世 · 数月后百宗出山</h4><p>末法年代外界灵气破碎枯竭、出阵必损道行，宗门老怪只得深锁大阵减息死关；灵气复苏九十日后天地灵机渐足以承托高阶道基，天台赤城、四明赤水、茅山、龙虎、终南、武当乃至昆仑蓬莱宿老相继突破出山。</p></div>
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
