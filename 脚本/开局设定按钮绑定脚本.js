(function () {
  'use strict';

  var ROOT_SELECTOR = '[data-jy-opening]';
  var GLOBAL_KEY = '__jiyangOpeningSetupControllerV7';
  var ARCHIVE_PREFIX = 'jy-opening-archive:v1:';
  var LEGACY_ENTRY_NAME = '玩家开局设定';
  var WRITE_LEGACY_WORLDBOOK = false; // 旧版把档案写进世界书；新版改为写 MVU 变量，保留代码路径但默认关闭
  var GREETING_NAMES = ['开局设定界面', '开学第一天', '慕佳芊', '苏晚棠', '温书语', '沈若微', '许念安', '陈芷汀', '虞淑婉', '云清晏'];
  var CHARACTER_NAMES = ['苏晚棠', '温书语', '沈若微', '许念安', '慕佳芊', '陈芷汀', '虞淑婉'];
  /* JY_DLC_NAMES_BEGIN */
  var DLC_ENTRY_NAMES = ["[DLC]灵气复苏总纲与异象日程","[DLC]境界描述","[DLC]破境判定","[DLC]华夏修行界与三教总览","[DLC]世家_钱塘谢氏剑庐","[DLC]世家_西溪葛氏丹霞","[DLC]世家_魔都苏氏水府","[DLC]世家_申城天星钟氏","[DLC]仙宗_南屏法华禅院","[DLC]仙宗_天台赤城洞天","[DLC]仙宗_四明赤水剑宗","[DLC]仙宗_天目灵虚宫","[DLC]仙宗_茅山上清宗","[DLC]仙宗_龙虎山天师府","[DLC]仙宗_终南山楼观台","[DLC]仙宗_青城山丈人洞天","[DLC]仙宗_武当山紫霄宫","[DLC]仙宗_东海蓬莱与崇明归墟","[DLC]仙宗_西域昆仑祖脉","[DLC]老鹰山灵脉与古宗秘藏","云清晏_基础信息","云清晏_性格调色盘","云清晏_NSFW指导","谢昭宁_基础信息","谢昭宁_性格调色盘","谢昭宁_NSFW指导"];
  /* JY_DLC_NAMES_END */
  var DEFAULT_FIELDS = {
    '开始年份': '2020',
    '年龄': '18岁',
    '班级或身份': '暨阳中学高二重点班学生'
  };

  var OPENING_TEMPLATES = {
    eagle: {
      title: '山风松溪传薪客',
      offsetYear: 0,
      mmdd: '09-14',
      fields: {
        '班级或身份': '暨阳中学高二重点班走读生',
        '家庭背景': '祖辈曾在老城经营拳馆与药行，如今家里只剩一间临江清静茶室；自幼跟着祖父蹲桩调息，习惯早起绕去老鹰山半山压腿呼吸山风。',
        '擅长与学业': '文化课稳居中上，耐力与定力极佳，晨昏一套「松溪吐风桩」雷打不动。',
        '重要物品': '洗得发白的帆布包、半本祖父手抄《松溪调息要诀》、一枚刻着模糊云纹的老茶饼铁盒。',
        '开局心事': '近来清晨在听风亭收功时，旧值守屋檐下那口常年积灰的铜铎偶会无风轻颤半声，屋后扫落叶的周伯看人的视线也越发沉静难测。',
        '开场地点': '老鹰山 听风亭',
        '开场时段': '清晨（6:15）'
      },
      story: '清晨六点一刻的雾还没从松梢散开，听风亭青石基座上凉得像刚浸过井水。我按祖父教的呼吸吐纳收了最后半式桩功，顺着石阶往旧值守屋那边走——屋檐底下那口青铜铎不知何时极为轻微地荡了一下，连落叶都没有惊动，远处周伯正拿着竹扫帚站在荒径口看过来。',
      action: '理了理被山风吹乱的校服袖口，朝听风亭外那条铺满松针的石径走过去同周伯打声招呼。'
    },
    merchant: {
      title: '越城商门空降生',
      offsetYear: 0,
      mmdd: '09-01',
      fields: {
        '班级或身份': '暨阳中学高二重点班插班生',
        '家庭背景': '家里从店口智造与外贸供应链起家，近期刚把总部与新宅落定御江湾别墅区；原本打算去杭州读私立名校，被家里要求先回暨阳重点班沉心压一压锐气。',
        '擅长与学业': '数理思维与商业直觉俱佳，既看得懂精密机械图，也习惯茶桌商局上的留三分分寸与精准控场。',
        '重要物品': '一块磨去商标的素面机械表、御江湾地下车库备用门禁卡、一张刚办好还没贴照片的学生证。',
        '开局心事': '刚空降进这座盘踞着山下湖珍珠与百强名校生的小城重点班，正想亲眼见识一下传闻里眼高于顶的风云人物和藏在老城水面下的门道。',
        '开场地点': '暨阳路校门口',
        '开场时段': '晨光初露（7:10）'
      },
      story: '七点十分，秋初的日头刚刚越过香樟树冠。黑色轿车滑进校门外百米处的林荫道边稳稳刹停，我推门下车，把没拉到底的校服拉链随手拎上去一截。百米外百年名校的牌匾挂在晨光里，各色校服顺着道口鱼贯而入。',
      action: '把机械表袖口整好，拎着单肩包独自穿过暨阳路斑马线走进教学楼大厅看分班榜。'
    },
    archive: {
      title: '旧库残卷夜行人',
      offsetYear: 0,
      mmdd: '10-14',
      fields: {
        '班级或身份': '暨阳中学高二重点班 · 物理竞赛暨旧书库助理',
        '家庭背景': '父母长年在浙东各市县跑夜路货运，同外婆住在老城旧楼；课余不仅进实验室做物理竞赛题，还靠帮图书馆三楼地方志旧库归档挣一点稳妥补贴。',
        '擅长与学业': '数理逻辑与古籍文献梳理俱佳，眼神敏锐沉得住气，对日期、地名残片和旁人微表情记忆极准。',
        '重要物品': '写满红黑批注的二手《物理竞赛教程》、图书馆三楼旧书库备用钥匙、夹着半张《暨阳风物补遗》拓页的硬壳本。',
        '开局心事': '昨晚整理地方志夹层时翻出了半张标着老鹰山荒径与古亭坐标的泛黄拓片；今夜加训完锁门，总觉得漆黑走廊尽头的阅览角好像还有盏小灯刚熄不久。',
        '开场地点': '图书馆 三楼旧书库外',
        '开场时段': '晚自习后（21:35）'
      },
      story: '晚上九点三十五分，教学楼的喧闹早已散进夜色里，图书馆三楼只有旧书库窗外透进一点路灯余光。老纸张特有的干燥樟脑味混着夜露气味浮在过道间，手里那本清末地方志抄录里夹着的一张模糊残图正压在硬壳笔记底下。',
      action: '把抄好批注的《暨阳风物补遗》残页夹回硬壳本，摸出钥匙准备锁库下楼。'
    },
    gaokao: {
      title: '百日孤城破晓卷',
      offsetYear: 2,
      mmdd: '02-26',
      fields: {
        '班级或身份': '暨阳中学高三重点班学生',
        '家庭背景': '历经成人礼与首考洗礼、瞄准浙江大学冲刺的普通家庭走读生；父母晚饭准点温在锅里，嘴上越放宽心却比谁都早亮灯。',
        '擅长与学业': '进入高三最后百余天合围冲刺阶段，压轴大题手感稳步拔尖，心性也远比高二时沉得住气。',
        '重要物品': '写着目标「浙江大学」字样的黑皮错题册、高三成人礼纪念徽章、半瓶清醒薄荷鼻通。',
        '开局心事': '教室后墙红纸倒计时一天天逼近夏天，有些人从高二藏到高三的心事快兜不住了（若此刻同时启封修仙 DLC，也将按高三剩余时日紧凑演进，不拖进毕业后）。',
        '开场地点': '高三教室',
        '开场时段': '早读前（6:40）'
      },
      story: '二月末的早春还寒，走廊外天色刚泛出一线青白，高三重点班玻璃窗内沿结着一层薄霜。讲台黑板右上角的百日倒计时昨晚刚被擦新，粉笔灰落在窗台一摞翻皱卷边的真题汇编与《浙江大学招生指南》封皮上。',
      action: '把热豆浆和错题本搁上桌面，抬手抹开窗玻璃上一角白雾望向渐渐醒来的校园。'
    },
    graduated: {
      title: '江潮未歇新岁行',
      offsetYear: 2,
      mmdd: '07-18',
      fields: {
        '班级或身份': '暨阳中学毕业生',
        '家庭背景': '刚刚走过高考告别钟声与毕业夜的准大学生，志愿已落定、长假刚刚摊开，眼下正频繁往返于暨阳老城与杭城高校圈之间。',
        '擅长与学业': '彻底告别早晚自习与校规门禁，既有高中三年磨出的敏锐心智，也有足够充裕的时间奔走城区、山野或邻近省会。',
        '重要物品': '高三毕业合影底片、暨阳至杭州东高铁车票夹、一只装满零碎旧票根的随身帆布包。',
        '开局心事': '三年的同学与师长各自站在人生新的分岔路口；若此时暗涌掀开（配合勾选修仙 DLC 即启用毕业后 90 日紧凑节奏），不再被课堂约束的新天地正等着重逢或叩门。',
        '开场地点': '浣江步道',
        '开场时段': '傍晚（18:20）'
      },
      story: '七月中旬的江风终于消下几分日晒的焦灼，夕阳把浣江水面劈成碎金。脱掉校服换成轻便夏装之后，耳边再也没有六点半的起床铃了。远处的暨阳大桥亮起第一排路灯，手机屏保还是不久前在教学楼前拍的那张毕业合照。',
      action: '把冰镇柠檬茶换到左手，顺着江堤步道慢悠悠朝城中街区走，盘算着今晚去哪碰个熟人或查些线索。'
    },
    immortal: {
      title: '太虚启封·云起山城',
      offsetYear: 0,
      mmdd: '09-03',
      enableDlc: true,
      fields: {
        '班级或身份': '暨阳中学高二（8）班学生',
        '家庭背景': '寻常暨阳本地人家出身，唯有祖辈传下一枚不知年月的素面青玉扣贴身戴着；近几日夜深醒转时，耳畔偶尔隐约掠过老鹰山方向吹来的清越余韵。',
        '擅长与学业': '表面课业温和低调，实则五感天生比同龄人清明一筹，能微察山风寒暑之外的那一缕异样沉静。',
        '重要物品': '祖传素面旧青玉扣（贴近锁骨带着些微难言温凉感）、高二重点班新课表。',
        '开局心事': '九月初的空气闷热依旧，可刚踏进教室总觉得窗外吹进来的风比往常清冷一线，讲台门外隐约停下一串轻到近乎没有声音的脚步。',
        '开场地点': '暨阳中学 教学楼四楼 高二（8）班教室',
        '开场时段': '上午课（08:10）'
      },
      story: '九月初的第三节课铃声刚响过不久，窗外掠过一阵顺着江风吹来的意外凉意，带着点雨后深山老松林的味道。胸口衣物底下的旧青玉扣似有似无地透出一丝凉意，正此时班主任推开门站上讲台，朝教室后方挥了挥手，身后跟着一名黑发以旧木簪松松挽起、冷清得仿佛跟满屋燥热隔了一层的陌生女生。',
      action: '按住衣襟底下微凉的旧玉扣抬眸望向讲台前走近的转校生，看班主任怎么交代她落座。'
    }
  };

  function safePlayerAvatar() {
    var wins = windowList();
    for (var i = 0; i < wins.length; i++) {
      try {
        var val = wins[i].localStorage && wins[i].localStorage.getItem('jy-avatar:主角');
        if (typeof val === 'string' && /^(https?:\/\/|data:image\/)/.test(val.trim())) return val.trim();
      } catch (_) {}
    }
    return '';
  }

  function updateIdPreview(root) {
    if (!root) return;
    var name = readField(root, '姓名') || '未署名新生';
    var age = readField(root, '年龄') || '18岁';
    var gender = readField(root, '性别或称谓');
    var cls = readField(root, '班级或身份') || '暨阳中学高二重点班学生';
    var year = String(campusYear(readField(root, '开始年份') || '2020'));
    var setText = function (sel, val) {
      var el = root.querySelector(sel);
      if (el) el.textContent = val;
    };
    setText('[data-id-preview-name]', name);
    setText('[data-id-preview-meta]', age + ' · ' + (gender || '学生'));
    setText('[data-id-preview-class]', cls);
    setText('[data-id-preview-num]', year + '级 · 在读档案');
    setText('[data-id-preview-year]', year);
    setText('[data-id-preview-initial]', (name.replace(/\s+/g, '') || '新').slice(0, 1));
    var photo = root.querySelector('[data-id-preview-photo]');
    var cached = safePlayerAvatar();
    if (photo) {
      if (cached) {
        photo.src = cached;
        photo.hidden = false;
      } else {
        photo.hidden = true;
      }
    }
  }

  function computeOpeningDlcProgress(originRaw, currentRaw, startYearRaw) {
    var oriStr = String(originRaw || currentRaw || '').trim();
    var yearMatch = oriStr.match(/^(\d{4})/);
    var startYear = (typeof startYearRaw === 'number' || typeof startYearRaw === 'string') && /^\d{4}$/.test(String(startYearRaw).trim())
      ? Number(String(startYearRaw).trim())
      : (yearMatch ? Number(yearMatch[1]) : 2020);
    if (!(startYear >= 1000 && startYear <= 9900)) startYear = 2020;
    var parseMs = function (raw) {
      var m = String(raw || '').trim().match(/^(\d{4})[-/年.](\d{1,2})[-/月.](\d{1,2})/);
      if (!m) return null;
      var y = Number(m[1]), mo = Number(m[2]), d = Number(m[3]);
      return (mo >= 1 && mo <= 12 && d >= 1 && d <= 31) ? Date.UTC(y, mo - 1, d) : null;
    };
    var toIso = function (raw, fallback) {
      var m = String(raw || '').trim().match(/^(\d{4})[-/年.](\d{1,2})[-/月.](\d{1,2})/);
      return m ? (m[1] + '-' + String(Number(m[2])).padStart(2, '0') + '-' + String(Number(m[3])).padStart(2, '0')) : fallback;
    };
    var originDate = toIso(originRaw, startYear + '-09-01');
    var currentDate = toIso(currentRaw, originDate);
    var oriMs = parseMs(originDate);
    if (oriMs === null) oriMs = Date.UTC(startYear, 8, 1);
    var curMs = parseMs(currentDate);
    if (curMs === null) curMs = oriMs;
    var gradMs = Date.UTC(startYear + 2, 6, 1);
    var isPostGradOrigin = oriMs >= gradMs;
    var remainDays = isPostGradOrigin ? 0 : Math.floor((gradMs - oriMs) / 86400000);
    var totalDays = isPostGradOrigin ? 90 : Math.max(120, Math.min(400, Math.floor(remainDays * 0.92)));
    var s1 = Math.max(1, Math.round(totalDays * 45 / 400));
    var s2 = Math.max(s1 + 1, Math.round(totalDays * 120 / 400));
    var s3 = Math.max(s2 + 1, Math.round(totalDays * 240 / 400));
    var s4 = totalDays;
    var dayNumber = Math.max(1, Math.floor((curMs - oriMs) / 86400000) + 1);
    var stageIndex = dayNumber <= s1 ? 0 : dayNumber <= s2 ? 1 : dayNumber <= s3 ? 2 : dayNumber <= s4 ? 3 : 4;
    var stageName = ['微兆潜龙期', '灵潮初涌期', '龙眼破禁期', '潜龙秘序期', '百宗出山期'][stageIndex];
    var modeLabel = isPostGradOrigin ? '毕业后90日线' : totalDays < 400 ? ('高三自适应' + totalDays + '日线') : '400日标准线';
    return { originDate: originDate, currentDate: currentDate, dayNumber: dayNumber, stageIndex: stageIndex, stageName: stageName, totalDays: totalDays, s1: s1, s2: s2, s3: s3, s4: s4, isPostGradOrigin: isPostGradOrigin, modeLabel: modeLabel };
  }

  function isDlcEnabled(root) {
    var box = root && root.querySelector('[data-opening-dlc]');
    return !!(box && box.checked);
  }

  function updateDlcHint(root) {
    if (!root) return;
    var enabled = isDlcEnabled(root);
    var boxWrap = root.querySelector('[data-opening-dlc-box]');
    if (boxWrap) boxWrap.setAttribute('data-enabled', enabled ? 'true' : 'false');
    var hintEl = root.querySelector('[data-opening-dlc-hint]');
    if (!hintEl) return;
    var year = campusYear(readField(root, '开始年份') || '2020');
    var mode = getMode(root);
    var targetDate = '';
    if (mode === 'custom') {
      targetDate = readField(root, '开场日期');
    } else {
      var sc = GREETING_SCENES[getGreetingIndex(root)];
      if (sc && sc.date) targetDate = sc.date.replace(/^\d{4}/, String(year)).replaceAll('/', '-');
    }
    var progress = computeOpeningDlcProgress(targetDate || (year + '-09-01'), targetDate || (year + '-09-01'), year);
    hintEl.textContent = enabled
      ? ('已开启（基准日 ' + progress.originDate + ' · ' + progress.modeLabel + '，第 ' + (progress.s4 + 1) + ' 日起百宗出山，同步激活云清晏/谢昭宁与灵脉体系）')
      : ('未开启（保持 100% 纯校园日常；若此刻改选开启将走' + progress.modeLabel + '）');
  }

  function setDlcEnabled(root, enabled) {
    if (!root) return;
    var box = root.querySelector('[data-opening-dlc]');
    if (box) box.checked = !!enabled;
    updateDlcHint(root);
  }

  function applyOpeningTemplate(root, key) {
    var tpl = OPENING_TEMPLATES[key];
    if (!tpl) return;
    root.__jyUserEditing = true;
    closePreview(root);
    var year = campusYear(readField(root, '开始年份') || '2020');
    var payload = Object.assign({}, tpl.fields, {
      '开场日期': String(year + tpl.offsetYear) + '-' + tpl.mmdd
    });
    fillForm(root, payload);
    var customBox = root.querySelector('[data-custom-opening]');
    if (customBox) customBox.value = tpl.story || '';
    var actionBox = root.querySelector('[data-opening-action]');
    if (actionBox) actionBox.value = tpl.action || '';
    setMode(root, 'custom');
    if (tpl.enableDlc) setDlcEnabled(root, true);
    updateIdPreview(root);
    updateDlcHint(root);
    toast(root, '已填入「' + tpl.title + '」开局模板' + (tpl.enableDlc ? '（已自动开启都市修仙 DLC）' : '') + '，可直接开始或继续微调。', 'info');
  }

  function bindSceneThumbs(root) {
    var syncAvatar = function (img) {
      var charName = img.getAttribute('data-thumb-char');
      if (!charName) return;
      var wins = windowList();
      for (var i = 0; i < wins.length; i++) {
        try {
          var cached = wins[i].localStorage && wins[i].localStorage.getItem('jy-avatar:' + charName);
          if (typeof cached === 'string' && /^(https?:\/\/|data:image\/)/.test(cached.trim())) {
            img.src = cached.trim();
            img.hidden = false;
            return;
          }
        } catch (_) {}
      }
    };
    root.querySelectorAll('.jy-opening-scene-thumb img').forEach(function (img) {
      if (img.__jyFallbackBound) {
        syncAvatar(img);
        return;
      }
      img.__jyFallbackBound = true;
      img.addEventListener('error', function () {
        var step = Number(img.dataset.fallbackStep || '0');
        var next = step === 0 ? img.getAttribute('data-fallback-src') : (step === 1 ? img.getAttribute('data-fallback-raw') : '');
        img.dataset.fallbackStep = String(step + 1);
        if (next && next !== img.src) img.src = next;
        else img.hidden = true;
      });
      syncAvatar(img);
    });
  }
  var PLACEHOLDER = '<OpeningSetupUI/>';
  var cleanups = [];
  var timers = [];
  var observer = null;
  var activeRoot = null;
  var submitting = false;
  var bindTimer = null;

  // 预写开场对应的场景补丁（按各自开场白正文事实填写，不统一套 9/1 早自习）。
  var GREETING_SCENES = {
    1: {
      date: '2020/09/01', week: '星期二', time: '早自习', weather: '晴', location: '暨阳中学 教学楼四楼 高二（8）班教室',
      area: '校园', privacy: '公开', pace: '日常铺垫', semester: '高二上', focus: '群体', schoolEvent: '无',
      present: {
        '苏晚棠': { pos: '教室后排靠窗座位', top: '白色短袖校服衬衫', bottom: '深色校服百褶裙', action: '把零食塞进抽屉，回头打量新同学', mood: '好奇里带一点审视', inner: '新来的会坐哪儿？' },
        '温书语': { pos: '窗边第二排', top: '白色短袖校服衬衫', bottom: '深色校服长裤', action: '低头看一本卷了边的课外书', mood: '安静，不愿被打扰', inner: '希望今天不要有人来搭话。' },
        '许念安': { pos: '讲台旁', top: '白色短袖校服衬衫', bottom: '深色校服裙', action: '整理各科的作业本', mood: '平静', inner: '' },
        '沈若微': { pos: '最后一排靠墙角落', top: '洗得发白的校服短袖', bottom: '洗得发白的校服长裤', action: '把自己缩进墙角，低头避开视线', mood: '紧张，想消失', inner: '不要看我。' },
        '慕佳芊': { pos: '讲台上', top: '浅色衬衫', bottom: '及膝浅色半裙', action: '转身写板书，粉笔声清脆', mood: '从容而克制', inner: '这一届会比上一届更难带吗。' }
      }
    },
    2: {
      date: '2020/09/03', week: '星期四', time: '课间', weather: '晴', location: '暨阳中学 高二教师办公室（英语组）',
      area: '校园', privacy: '半私密', pace: '日常铺垫', semester: '高二上', focus: '慕佳芊', schoolEvent: '无',
      present: {
        '慕佳芊': { pos: '英语组办公桌前', top: '浅色衬衫', bottom: '及膝半裙', action: '指尖转着系毛绒兔子吊坠的车钥匙，抬眼看向门口', mood: '轻快随和，带点打量笑意', inner: '这时候专程来三楼，是有正事，还是找借口喘口气？' }
      }
    },
    3: {
      date: '2020/08/29', week: '星期六', time: '下午', weather: '晴热', location: '城区 浣江路巷口',
      area: '城区', privacy: '公开', pace: '事件触发', semester: '高二上', focus: '苏晚棠', schoolEvent: '无',
      present: {
        '苏晚棠': { pos: '黑色奔驰车旁', top: '白色 T 恤', bottom: '深蓝色牛仔短裤', action: '拎着奶茶站在车门边，抬了抬下巴', mood: '心虚又好奇', inner: '这人怎么偏偏在这儿。' }
      }
    },
    4: {
      date: '2020/09/04', week: '星期五', time: '午休', weather: '晴', location: '学校图书馆 B 区第三排',
      area: '校园', privacy: '半私密', pace: '日常铺垫', semester: '高二上', focus: '温书语', schoolEvent: '无',
      present: {
        '温书语': { pos: '书架旁', top: '白色短袖校服衬衫', bottom: '深色校服长裤', action: '把一本旧版《边城》放回书架', mood: '安静而专注', inner: '他会不会真的来。' }
      }
    },
    5: {
      date: '2020/09/07', week: '星期一', time: '夜间', weather: '晴', location: '老城窄巷（学校东南侧）',
      area: '城区', privacy: '半私密', pace: '事件触发', semester: '高二上', focus: '沈若微', schoolEvent: '无',
      present: {
        '沈若微': { pos: '青砖墙边', top: '洗得发白的校服短袖', bottom: '洗得发白的校服长裤', action: '背贴着墙，攥紧书包带发抖', mood: '恐惧到极点', inner: '谁来……谁都好。' }
      }
    },
    6: {
      date: '2020/09/01', week: '星期二', time: '傍晚', weather: '晴', location: '暨阳中学 教学楼四楼 高二（8）班教室',
      area: '校园', privacy: '半私密', pace: '日常铺垫', semester: '高二上', focus: '许念安', schoolEvent: '无',
      present: {
        '许念安': { pos: '讲台旁', top: '白色短袖校服衬衫', bottom: '深色校服裙', action: '把作业本码齐，抬头看向后门', mood: '温和而笃定', inner: '他回来了。' }
      }
    },
    7: {
      date: '2020/09/12', week: '星期六', time: '下午', weather: '多云', location: '青悦城四楼 无招牌咖啡馆',
      area: '周边', privacy: '半私密', pace: '日常铺垫', semester: '高二上', focus: '陈芷汀', schoolEvent: '无',
      present: {
        '陈芷汀': { pos: '靠窗卡座', top: '黑色无袖连衣裙', bottom: '（连衣裙）', action: '托着腮看向门口，指尖轻轻敲杯壁', mood: '打量与试探的兴致', inner: '照片和本人差多少呢。' }
      }
    },
    8: {
      date: '2020/09/02', week: '星期三', time: '上午课', weather: '晴', location: '行政楼 校长办公室门口',
      area: '校园', privacy: '半私密', pace: '事件触发', semester: '高二上', focus: '虞淑婉', schoolEvent: '无',
      present: {
        '虞淑婉': { pos: '办公室门内', top: '米白色真丝衬衫', bottom: '黑色直筒西裤', action: '低头俯视跌坐在地的人', mood: '被打断的愠怒与警觉', inner: '他看到了多少。' }
      }
    },
    9: {
      date: '2020/09/03', week: '星期四', time: '上午课', weather: '晴', location: '暨阳中学 教学楼四楼 高二（8）班教室',
      area: '校园', privacy: '公开', pace: '日常铺垫', semester: '高二上', focus: '云清晏', schoolEvent: '无',
      present: {
        '苏晚棠': { pos: '靠窗后排座位', top: '白色短袖校服衬衫', bottom: '深色校服百褶裙', action: '懒洋洋支着下颌看窗外，听见动静后抬眸打量讲台', mood: '随性好奇', inner: '从外省转来的借读生？看着倒挺冷清。' },
        '温书语': { pos: '窗边第二排', top: '白色短袖校服衬衫', bottom: '深色校服长裤', action: '指尖压着翻过的书页抬眼望向讲台', mood: '安静敏锐', inner: '方才那阵穿堂风怎么凉得有点奇怪。' },
        '许念安': { pos: '讲台旁', top: '白色短袖校服衬衫', bottom: '深色校服裙', action: '攥着花名册准备领新同学认座位发书单', mood: '周到从容', inner: '先把名签与新书单登记好。' },
        '沈若微': { pos: '最后一排靠墙角落', top: '洗得发白的校服短袖', bottom: '洗得发白的校服长裤', action: '垂眼安静整理抽屉，尽量不惹注意', mood: '克制平静', inner: '新来的同学看起来很安静，挺好。' },
        '云清晏': { pos: '讲台前班主任身侧', top: '洗得规整的暨阳中学白衬衣校服与领结', bottom: '深青校裙与过踝袜鞋', action: '垂眸环视过安静下来的教室，极轻地颔首致意后循过道走下台阶', mood: '疏离清冷，初临红尘的淡静微察', inner: '归元眼散逸在山风里的余韵竟真落进这间寻常教室……红尘烟火原是这般鲜活。' }
      }
    }
  };

  // JY_OPENING_CALENDAR_BEGIN
  const openingPeriods = [{"id":"高二上","start":[0,"08-01"],"end":[1,"02-20"]},{"id":"高二下","start":[1,"02-21"],"end":[1,"06-30"]},{"id":"暑假","start":[1,"07-01"],"end":[1,"08-31"]},{"id":"高三上","start":[1,"09-01"],"end":[2,"02-20"]},{"id":"高三下","start":[2,"02-21"],"end":[2,"06-30"]},{"id":"已毕业","start":[2,"07-01"],"end":[99,"12-31"]}];
  // Shared by the prompt, calendar and MVU. Dates are in the story's local calendar.
  function campusDate(value) {
    const date = typeof value === 'string' ? value.replaceAll('/', '-') : '';
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return '';
    const parsed = new Date(date + 'T12:00:00Z');
    return Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0, 10) === date ? date : '';
  }

  function campusYear(value) {
    const year = Number(value);
    return Number.isInteger(year) && year >= 1000 && year <= 9900 ? year : 2020;
  }

  function campusAnchor(edge, year) {
    return edge ? `${year + edge[0]}-${edge[1]}` : '';
  }

  function campusPeriod(periods, date, year, academic) {
    if (academic === '已毕业') return periods.find(period => period.id === '已毕业');
    date = campusDate(date);
    if (!date) return null;
    return periods.find(period => date >= campusAnchor(period.start, year) && date <= campusAnchor(period.end, year)) || null;
  }

  function campusAgeAt(birthday, date) {
    const birth = campusDate(birthday);
    const now = campusDate(date);
    if (!birth || !now || birth > now) return null;
    return Number(now.slice(0, 4)) - Number(birth.slice(0, 4)) - Number(now.slice(5) < birth.slice(5));
  }

  function campusPlayerClass(identity, academic) {
    // Keep custom identities, transfers and class changes from the story.
    if (identity !== '暨阳中学高二重点班学生' && identity !== '暨阳中学高三重点班学生') return identity;
    if (academic === '已毕业') return '暨阳中学毕业生';
    if (academic === '高三上' || academic === '高三下') return '暨阳中学高三重点班学生';
    return identity;
  }
  // JY_OPENING_CALENDAR_END

  function stop() {
    cleanups.forEach(function (fn) { try { fn(); } catch (e) { /* noop */ } });
    cleanups = [];
    timers.forEach(function (id) { clearTimeout(id); clearInterval(id); });
    timers = [];
    clearTimeout(bindTimer);
    bindTimer = null;
    if (observer) { try { observer.disconnect(); } catch (e) { /* noop */ } observer = null; }
    activeRoot = null;
  }

  try { if (window[GLOBAL_KEY] && typeof window[GLOBAL_KEY].stop === 'function') window[GLOBAL_KEY].stop(); } catch (e) { /* noop */ }

  // ---------- DOM 访问 ----------
  function windowList() {
    var out = [];
    function add(w) { if (w && out.indexOf(w) === -1) out.push(w); }
    add(window);
    try { add(window.parent); } catch (e) { /* noop */ }
    try { add(window.top); } catch (e) { /* noop */ }
    out.slice().forEach(function (w) {
      try { (w.document ? w.document.querySelectorAll('iframe') : []).forEach(function (frame) { try { add(frame.contentWindow); } catch (e) { /* noop */ } }); } catch (e) { /* noop */ }
    });
    return out;
  }

  function documentList() {
    var docs = [];
    windowList().forEach(function (w) {
      try { if (w.document && docs.indexOf(w.document) === -1) docs.push(w.document); } catch (e) { /* noop */ }
    });
    return docs;
  }

  function rootList() {
    var roots = [];
    documentList().forEach(function (doc) {
      try { doc.querySelectorAll(ROOT_SELECTOR).forEach(function (root) { if (roots.indexOf(root) === -1) roots.push(root); }); } catch (e) { /* noop */ }
    });
    return roots;
  }

  function fieldElements(root) { return Array.prototype.slice.call(root.querySelectorAll('[data-field]')); }

  function elementValue(el) {
    if (!el) return '';
    return String(('value' in el) ? el.value : (el.textContent || '')).trim();
  }

  function readField(root, name) {
    var el = root.querySelector('[data-field="' + name + '"]');
    return elementValue(el);
  }

  function readForm(root) {
    var data = {};
    fieldElements(root).forEach(function (el) {
      var key = el.getAttribute('data-field');
      if (!key) return;
      data[key] = elementValue(el) || '未设定';
    });
    return data;
  }

  function fillForm(root, data) {
    fieldElements(root).forEach(function (el) {
      var key = el.getAttribute('data-field');
      var value = data && data[key];
      if (typeof value !== 'string') return;
      var next = value === '未设定' ? '' : value;
      if ('value' in el) el.value = next; else el.textContent = next;
    });
    updateIdPreview(root);
  }

  function readText(root, selector) {
    var el = root.querySelector(selector);
    return el ? String(('value' in el) ? el.value : el.textContent || '').trim() : '';
  }

  function getMode(root) { return root.getAttribute('data-opening-mode') === 'custom' ? 'custom' : 'preset'; }

  function setMode(root, mode) {
    root.setAttribute('data-opening-mode', mode === 'custom' ? 'custom' : 'preset');
    root.querySelectorAll('[data-action="select-mode"]').forEach(function (btn) {
      btn.setAttribute('aria-pressed', btn.getAttribute('data-mode') === mode ? 'true' : 'false');
    });
  }

  function getGreetingIndex(root) {
    var n = Number(root.getAttribute('data-greeting-index'));
    return (Number.isFinite(n) && n >= 1 && n < GREETING_NAMES.length) ? Math.floor(n) : 1;
  }

  function setGreetingIndex(root, index) {
    root.setAttribute('data-greeting-index', String(index));
    root.querySelectorAll('[data-action="select-greeting"]').forEach(function (btn) {
      var selected = Number(btn.getAttribute('data-greeting')) === index;
      btn.setAttribute('data-selected', selected ? 'true' : 'false');
      btn.setAttribute('aria-selected', selected ? 'true' : 'false');
    });
  }

  // ---------- 学籍档案（当前酒馆地址的浏览器收藏，可跨聊天复用） ----------
  function readArchive(storage, key) {
    if (!key.startsWith(ARCHIVE_PREFIX)) return null;
    var raw = storage.getItem(key);
    if (!raw) return null;
    try {
      var record = JSON.parse(raw);
      if (!record || typeof record.name !== 'string' || !Number.isFinite(record.savedAt) ||
          Math.abs(record.savedAt) > 8640000000000000 || !record.fields ||
          typeof record.fields !== 'object' || Array.isArray(record.fields)) return null;
      return record;
    } catch (error) {
      return null;
    }
  }

  function renderArchiveList(panel, storage, selectedKey) {
    var select = panel.querySelector('[data-archive-select]');
    var entries = Object.keys(storage).map(function (key) {
      return [key, readArchive(storage, key)];
    }).filter(function (entry) { return entry[1]; });
    entries.sort(function (a, b) { return b[1].savedAt - a[1].savedAt; });
    var options = entries.map(function ([key, record]) {
      var option = panel.ownerDocument.createElement('option');
      option.value = key;
      option.textContent = record.name + ' · ' + new Date(record.savedAt).toLocaleString('zh-CN', {
        dateStyle: 'short', timeStyle: 'short'
      });
      return option;
    });
    if (!options.length) {
      var empty = panel.ownerDocument.createElement('option');
      empty.value = '';
      empty.textContent = '暂无本地档案';
      options.push(empty);
    }
    select.replaceChildren(...options);
    if (entries.some(function (entry) { return entry[0] === selectedKey; })) select.value = selectedKey;
    select.disabled = !entries.length;
    panel.querySelector('[data-action="load-archive"]').disabled = !entries.length;
    panel.querySelector('[data-action="delete-archive"]').disabled = !entries.length;
  }

  function archiveAction(root, panel, action) {
    var status = panel.querySelector('[data-archive-status]');
    var select = panel.querySelector('[data-archive-select]');
    if (action !== 'list' || status.hasAttribute('data-error')) {
      status.textContent = '';
      status.removeAttribute('data-error');
    }
    var key = select.value;
    try {
      var storage = window.top.localStorage;
      if (action === 'save-archive') {
        var nameInput = panel.querySelector('[data-archive-name]');
        var name = elementValue(nameInput) || readField(root, '姓名');
        if (!name) {
          status.textContent = '请填写档案名或人物姓名。';
          status.dataset.error = 'true';
          return;
        }
        var fields = Object.fromEntries(fieldElements(root).map(function (field) {
          return [field.dataset.field, field.value];
        }));
        var savedAt = Date.now();
        var record = {
          name: name.slice(0, 60), savedAt: savedAt, fields: fields,
          mode: getMode(root), greeting: getGreetingIndex(root),
          dlc: isDlcEnabled(root),
          story: root.querySelector('[data-custom-opening]').value,
          action: root.querySelector('[data-opening-action]').value
        };
        key = ARCHIVE_PREFIX + savedAt + '-' + window.crypto.getRandomValues(new Uint32Array(2)).join('-');
        storage.setItem(key, JSON.stringify(record));
        nameInput.value = '';
        status.textContent = '已保存「' + record.name + '」。';
      } else if (action === 'load-archive' || action === 'delete-archive') {
        var selected = readArchive(storage, key);
        if (!selected) {
          status.textContent = '这份档案已不可用。';
          status.dataset.error = 'true';
        } else if (action === 'load-archive') {
          root.__jyUserEditing = true;
          closePreview(root);
          fieldElements(root).forEach(function (field) {
            var value = selected.fields[field.dataset.field];
            field.value = typeof value === 'string' ? value : (DEFAULT_FIELDS[field.dataset.field] || '');
          });
          setMode(root, selected.mode === 'custom' ? 'custom' : 'preset');
          var greeting = selected.greeting;
          var validGreeting = Number.isInteger(greeting) && greeting >= 1 && greeting < GREETING_NAMES.length ? greeting : 1;
          setGreetingIndex(root, validGreeting);
          setDlcEnabled(root, Boolean(selected.dlc) || (selected.mode !== 'custom' && validGreeting === 9));
          root.querySelector('[data-custom-opening]').value = typeof selected.story === 'string' ? selected.story : '';
          root.querySelector('[data-opening-action]').value = typeof selected.action === 'string' ? selected.action : '';
          updateIdPreview(root);
          updateDlcHint(root);
          status.textContent = '已填入「' + selected.name + '」，可继续编辑。';
        } else if (window.top.confirm('删除本地档案「' + selected.name + '」？')) {
          storage.removeItem(key);
          status.textContent = '已删除「' + selected.name + '」。';
        }
      }
      renderArchiveList(panel, storage, key);
    } catch (error) {
      status.textContent = error.name === 'QuotaExceededError' ? '浏览器存储空间不足，可删除旧档案后再保存。' : '浏览器本地存储不可用。';
      status.dataset.error = 'true';
    }
  }

  function setState(root, state) {
    root.setAttribute('data-opening-state', state);
    var confirmBtn = root.querySelector('[data-action="confirm"]');
    if (confirmBtn) confirmBtn.disabled = (state === 'submitting');
  }

  // ---------- 提示 ----------
  function parentToastr() {
    try { if (window.parent && window.parent.toastr) return window.parent.toastr; } catch (e) { /* noop */ }
    try { if (window.top && window.top.toastr) return window.top.toastr; } catch (e) { /* noop */ }
    try { if (typeof toastr !== 'undefined') return toastr; } catch (e) { /* noop */ }
    return null;
  }

  function toastrCall(level, message) {
    var t = parentToastr();
    if (t && typeof t[level] === 'function') { try { t[level](message); } catch (e) { /* noop */ } }
  }

  function toast(root, message, type) {
    var node = root && root.querySelector('[data-toast]');
    if (node) {
      node.textContent = message || '';
      node.setAttribute('data-show', message ? 'true' : 'false');
      node.setAttribute('data-type', type || 'info');
      if (message) {
        var timer = setTimeout(function () {
          if (node.textContent === message) node.setAttribute('data-show', 'false');
        }, 4200);
        timers.push(timer);
      }
    }
    if (type === 'error') toastrCall('error', message); else toastrCall('info', message);
  }

  // ---------- 酒馆助手 API ----------
  function th(name) {
    try { if (typeof window[name] === 'function') return window[name]; } catch (e) { /* noop */ }
    try { if (window.parent && typeof window.parent[name] === 'function') return window.parent[name]; } catch (e) { /* noop */ }
    try { if (window.top && typeof window.top[name] === 'function') return window.top[name]; } catch (e) { /* noop */ }
    return null;
  }

  function getMessages(range) {
    var fn = th('getChatMessages');
    if (!fn) return [];
    try {
      var result = fn(range);
      return Array.isArray(result) ? result : [];
    } catch (e) {
      console.warn('[暨阳开局] getChatMessages 失败', range, e);
      return [];
    }
  }

  function messageText(message) {
    if (!message) return '';
    return String(message.message != null ? message.message : (message.mes != null ? message.mes : ''));
  }

  function messageIsUser(message) {
    if (!message) return false;
    return message.is_user === true || message.isUser === true || message.role === 'user';
  }

  function normalizeText(text) {
    return String(text || '').replace(/<OpeningSetupUI\s*\/>/gi, ' ').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  }

  async function readGreetings() {
    var fn = th('getCharacter');
    if (!fn) throw new Error('酒馆助手尚未提供角色资料接口，请确认扩展已加载后重试。');
    var character = await fn('current');
    if (!character) throw new Error('当前角色资料尚未加载，请重试。');
    if (Array.isArray(character.first_messages) && character.first_messages.length > 1) {
      return character.first_messages.slice(1);
    }
    if (character.data && Array.isArray(character.data.alternate_greetings)) return character.data.alternate_greetings;
    return Array.isArray(character.alternate_greetings) ? character.alternate_greetings : [];
  }

  async function greetingTextAt(index) {
    var text = (await readGreetings())[index - 1];
    return typeof text === 'string' ? text.replace(/<OpeningSetupUI\s*\/>/gi, '').trim() : '';
  }

  async function inferGreetingIndex(messageZeroText) {
    var normalized = normalizeText(messageZeroText);
    if (!normalized) return 0;
    var greetings = await readGreetings();
    for (var i = 0; i < Math.min(GREETING_NAMES.length - 1, greetings.length); i += 1) {
      var greeting = normalizeText(greetings[i]);
      if (!greeting) continue;
      var head = greeting.slice(0, 80);
      if (head && normalized.indexOf(head) !== -1) return i + 1;
    }
    return 0;
  }

  function findLetterMessage(messages) {
    for (var i = 0; i < messages.length; i += 1) {
      var text = messageText(messages[i]);
      if (messageIsUser(messages[i]) && text.indexOf('<letter>') !== -1 && text.indexOf('<initial_setup>') !== -1) return messages[i];
    }
    return null;
  }

  function chatLetter() {
    return findLetterMessage(getMessages('0--1'));
  }

  function parseLetter(text) {
    var data = {};
    var labels = ['姓名', '年龄', '性别或称谓', '班级或身份', '外貌', '性格', '擅长与学业', '家庭背景', '重要物品', '开局心事', '当前开场', '开始年份', '修仙DLC', '开场日期', '开场地点', '开场时段', '自定义开局', '开局行动'];
    var stop = labels.concat(['连续性优先级']).join('|');
    var source = String(text || '');
    labels.forEach(function (label) {
      var re = new RegExp('(?:^|\\n)' + label + '[:：][ \t]*([\\s\\S]*?)(?=\\r?\\n(?:' + stop + ')[:：]|\\r?\\n<\\/initial_setup>|$)');
      var match = source.match(re);
      if (match) data[label] = match[1].replace(/\s+$/, '').trim();
    });
    return data;
  }

  function setChatMessagesSafe(messages) {
    var fn = th('setChatMessages');
    if (!fn) throw new Error('未检测到 setChatMessages 接口，请确认酒馆助手已正确加载。');
    return fn(messages, { refresh: 'affected' });
  }

  function checkPrimaryWorldbook() {
    var getNames = th('getWorldbookNames');
    var getCharNames = th('getCharWorldbookNames');
    if (!getNames || !getCharNames) {
      throw new Error('未检测到酒馆助手世界书接口，请确认酒馆助手已正确加载后再试。');
    }
    var primary = '';
    try { primary = ((getCharNames('current') || {}).primary) || ''; } catch (e) { /* noop */ }
    var names = [];
    try { names = getNames() || []; } catch (e) { /* noop */ }
    if (!primary || names.indexOf(primary) === -1) {
      throw new Error('角色卡的内嵌世界书' + (primary ? '「' + primary + '」' : '') + '尚未导入或绑定。请在角色管理中选择 Import Card Lore（导入卡内世界书）后重试。');
    }
    return primary;
  }

  // ---------- MVU ----------
  function mvuApi() {
    var candidates = [function () { return window.top && window.top.Mvu; }, function () { return window.parent && window.parent.Mvu; }, function () { return window.Mvu; }];
    for (var i = 0; i < candidates.length; i += 1) {
      try { var api = candidates[i](); if (api) return api; } catch (e) { /* noop */ }
    }
    return null;
  }

  function parseOpeningItems(text) {
    var raw = String(text || '').trim();
    if (!raw || raw === '未设定') return [];
    var items = [];
    var current = null;
    raw.split(/\r?\n/).forEach(function (line) {
      var value = line.trim();
      if (!value) return;
      var nameMatch = value.match(/^(?:名称|物品)[:：]\s*(.+)$/);
      var descMatch = value.match(/^描述[:：]\s*(.+)$/);
      if (nameMatch) {
        current = { 名称: nameMatch[1].trim(), 描述: '' };
        items.push(current);
      } else if (descMatch && current) {
        current.描述 = current.描述 ? current.描述 + ' ' + descMatch[1].trim() : descMatch[1].trim();
      } else if (!current) {
        current = { 名称: value, 描述: '' };
        items.push(current);
      } else if (!current.描述) {
        current.描述 = value;
      } else {
        current.描述 = current.描述 + ' ' + value;
      }
    });
    return items.filter(function (item) { return item.名称; });
  }

  function customScene(data) {
    function optional(key) { return data[key] && data[key] !== '未设定' ? data[key] : ''; }
    return { date: optional('开场日期'), time: optional('开场时段'), location: optional('开场地点') };
  }

  function sceneHeading(data) {
    var scene = customScene(data);
    return [scene.date, scene.time, scene.location].filter(Boolean).join(' · ');
  }

  function buildMvuPatches(formData, mode, scene) {
    var patches = [];
    var startYear = parseInt(formData['开始年份'], 10);
    if (!(startYear >= 1900 && startYear <= 2100)) startYear = 2020;
    patches.push(['世界.起始年份', String(startYear)]);
    var custom = mode === 'custom';
    scene = custom ? customScene(formData) : scene;
    if (scene) {
      var sceneDate = custom ? scene.date : scene.date.replace(/^\d{4}/, String(startYear));
      var date = campusDate(sceneDate);
      var semester = campusPeriod(openingPeriods, date, startYear)?.id || '';
      patches.push(['世界.日期', date.replaceAll('-', '/')]);
      patches.push(['世界.星期', date ? '星期' + '日一二三四五六'[new Date(date + 'T12:00:00Z').getUTCDay()] : '']);
      patches.push(['世界.时间段', scene.time]);
      patches.push(['世界.天气', scene.weather || '']);
      patches.push(['世界.当前位置', scene.location]);
      patches.push(['世界.所在区域', scene.area || '']);
      patches.push(['世界.私密程度', scene.privacy || '']);
      patches.push(['剧情.当前事件', '']);
      patches.push(['剧情.校园活动', scene.schoolEvent || (custom ? '' : '无')]);
      patches.push(['剧情.学期', semester]);
      patches.push(['主角.当前位置', scene.location]);
    }
    patches.push(['剧情.当前nsfw', false]);

    patches.push(['主角.姓名', formData['姓名'] === '未设定' ? '' : formData['姓名']]);
    patches.push(['主角.年龄', formData['年龄'] === '未设定' ? '' : formData['年龄']]);
    patches.push(['主角.性别', formData['性别或称谓'] === '未设定' ? '' : formData['性别或称谓']]);
    patches.push(['主角.班级', campusPlayerClass(formData['班级或身份'] === '未设定' ? '' : formData['班级或身份'], semester)]);
    patches.push(['主角.外貌', formData['外貌'] === '未设定' ? '' : formData['外貌']]);
    patches.push(['主角.性格', formData['性格'] === '未设定' ? '' : formData['性格']]);
    patches.push(['主角.擅长与学业', formData['擅长与学业'] === '未设定' ? '' : formData['擅长与学业']]);
    patches.push(['主角.家庭背景', formData['家庭背景'] === '未设定' ? '' : formData['家庭背景']]);
    patches.push(['主角.重要物品', parseOpeningItems(formData['重要物品'])]);

    if (scene) {
      CHARACTER_NAMES.forEach(function (name) {
        var present = scene.present ? scene.present[name] : null;
        patches.push([name + '.是否在场', !!present]);
        patches.push([name + '.好感度', 0]);
        patches.push([name + '.关系阶段', name === '许念安' ? '表面' : '']);
        patches.push([name + '.NSFW', false]);
        patches.push([name + '.当前上装', present ? present.top : '']);
        patches.push([name + '.当前下装', present ? present.bottom : '']);
        patches.push([name + '.所在位置', present ? present.pos : '']);
        patches.push([name + '.动作', present ? present.action : '']);
        patches.push([name + '.心情', present ? present.mood : '']);
        patches.push([name + '.内心独白', present ? present.inner : '']);
        if (name === '沈若微') {
          patches.push(['沈若微.信任度', 0]);
          patches.push(['沈若微.触发家庭话题', false]);
        }
        if (name === '许念安') patches.push(['许念安.控制欲', 0]);
      });
    }
    return patches;
  }

  function findFloatingBridge() {
    var wins = windowList();
    for (var i = 0; i < wins.length; i += 1) {
      try {
        if (wins[i].__jiyangFloatingMusicPlayerV2) return wins[i].__jiyangFloatingMusicPlayerV2;
      } catch (_) {}
    }
    return null;
  }

  function dispatchDlcChanged() {
    var wins = windowList();
    for (var i = 0; i < wins.length; i += 1) {
      try {
        if (typeof wins[i].CustomEvent === 'function' && typeof wins[i].dispatchEvent === 'function') {
          wins[i].dispatchEvent(new wins[i].CustomEvent('jy-aura-dlc-changed', { detail: { messageId: 0 } }));
        }
      } catch (_) {}
    }
  }

  async function syncOpeningWorldbookDlc(bookName, enableDlc) {
    if (!enableDlc) return;
    var bridge = findFloatingBridge();
    if (bridge && typeof bridge.ensureDlcEntries === 'function') {
      await bridge.ensureDlcEntries(bookName, true);
      return;
    }
    var readWb = th('getWorldbook');
    var updateWb = th('updateWorldbookWith');
    if (!bookName || !readWb || !updateWb) return;
    var dlcSet = new Set(DLC_ENTRY_NAMES);
    if (!dlcSet.size) return;
    var entries = await readWb(bookName);
    var needsSync = entries.some(function (entry) {
      var name = entry.name || entry.comment;
      return dlcSet.has(name) && !entry.enabled;
    });
    if (!needsSync) return;
    await updateWb(bookName, function (current) {
      return current.map(function (entry) {
        var name = entry.name || entry.comment;
        return dlcSet.has(name) ? Object.assign({}, entry, { enabled: true }) : entry;
      });
    }, { render: 'immediate' });
  }

  function applyDlcToStatData(stat, options) {
    if (!stat || typeof stat !== 'object') return null;
    var opts = options || {};
    var enableDlc = Boolean(opts.enableDlc);
    stat.剧情 = stat.剧情 || {};
    if (!enableDlc) {
      if (stat.剧情.灵气复苏) stat.剧情.灵气复苏.已开启 = false;
      return null;
    }
    var startYear = stat.世界?.起始年份 || opts.startYear || '2020';
    var dateRaw = stat.世界?.日期 || opts.date || (String(startYear) + '-09-01');
    var progress = computeOpeningDlcProgress(dateRaw, dateRaw, startYear);
    stat.剧情.灵气复苏 = {
      已开启: true,
      开启日期: progress.originDate,
      阶段: progress.stageName
    };
    stat.主角 = stat.主角 || {};
    stat.主角.修行 = stat.主角.修行 || {
      境界: '未引气（凡躯）',
      灵气感应: 0,
      灵根资质: '未测',
      功法与秘术: [],
      法器与灵物: [],
      修行状态: '平顺'
    };
    var isYunArrival = opts.mode === 'preset' && Number(opts.greetingIndex) === 9;
    var yunScene = isYunArrival ? GREETING_SCENES[9]?.present?.['云清晏'] : null;
    stat.云清晏 = stat.云清晏 || {
      是否在场: Boolean(yunScene),
      好感度: 0,
      关系阶段: '观澜',
      NSFW: false,
      当前境界: '炼气大圆满（轮回重修）',
      伤势余韵: '轮回劫伤未愈·阴雨畏寒',
      当前上装: yunScene ? yunScene.top : (progress.isPostGradOrigin ? '素净月白斜襟棉麻长衫' : '洗得规整的暨阳中学白衬衣校服与领结'),
      当前下装: yunScene ? yunScene.bottom : (progress.isPostGradOrigin ? '浅青及踝长裙与布面平底鞋' : '深青校裙与过踝袜鞋'),
      所在位置: yunScene ? yunScene.pos : (progress.isPostGradOrigin ? '待剧情安排相遇' : (progress.dayNumber === 1 ? '暨阳城外·赴约途中' : '待确定')),
      动作: yunScene ? yunScene.action : '',
      心情: yunScene ? yunScene.mood : '',
      内心独白: yunScene ? yunScene.inner : ''
    };
    if (isYunArrival && yunScene) {
      stat.云清晏.是否在场 = true;
      stat.云清晏.当前上装 = yunScene.top;
      stat.云清晏.当前下装 = yunScene.bottom;
      stat.云清晏.所在位置 = yunScene.pos;
      stat.云清晏.动作 = yunScene.action;
      stat.云清晏.心情 = yunScene.mood;
      stat.云清晏.内心独白 = yunScene.inner;
    }
    stat.谢昭宁 = stat.谢昭宁 || {
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
      内心独白: ''
    };
    return progress;
  }

  async function prepareMvuOpening(formData, mode, scene, options) {
    var api = mvuApi();
    if (!api || typeof api.getMvuData !== 'function' || typeof api.setMvuVariable !== 'function') {
      throw new Error('MVU 尚未加载。请确认卡内 MVU 脚本已启用后重试。');
    }
    // 全局脚本没有所属消息楼层，显式读取首楼当前 swipe 的变量。
    var original = await api.getMvuData({ type: 'message', message_id: 0 });
    var next = JSON.parse(JSON.stringify(original || {}));
    if (!next.stat_data || !Object.keys(next.stat_data).length) {
      next.stat_data = {};
      if (typeof api.reloadInitVar === 'function') await api.reloadInitVar(next);
    }
    if (!next.stat_data || !Object.keys(next.stat_data).length) {
      throw new Error('首楼 MVU 变量尚未初始化。请确认卡内世界书已绑定，重新读取初始变量后重试。');
    }
    for (var pair of buildMvuPatches(formData, mode, scene)) {
      if (await api.setMvuVariable(next, pair[0], pair[1], { reason: '玩家开局设定' }) === false) {
        throw new Error('初始变量缺少「' + pair[0] + '」。请重新读取本卡初始变量后重试。');
      }
    }
    applyDlcToStatData(next.stat_data, options);
    return { original: original || {}, next: next };
  }

  // ---------- 输入框 ----------
  function findInput() {
    var selectors = ['#send_textarea', 'textarea#send_textarea', 'textarea[placeholder*="输入"]', '[contenteditable="true"][role="textbox"]'];
    var docs = documentList();
    for (var d = 0; d < docs.length; d += 1) {
      for (var s = 0; s < selectors.length; s += 1) {
        try { var el = docs[d].querySelector(selectors[s]); if (el) return el; } catch (e) { /* noop */ }
      }
    }
    return null;
  }

  function findSendButton() {
    var docs = documentList();
    for (var d = 0; d < docs.length; d += 1) {
      try { var btn = docs[d].querySelector('#send_but'); if (btn) return btn; } catch (e) { /* noop */ }
    }
    return null;
  }

  function sendButtonUsable(btn) {
    if (!btn) return false;
    if (btn.disabled) return false;
    if (btn.classList && btn.classList.contains('displayNone')) return false;
    try { if (btn.offsetParent === null) return false; } catch (e) { /* noop */ }
    return true;
  }

  function writeInput(input, text) {
    input.focus();
    if ('value' in input) {
      var proto = Object.getPrototypeOf(input);
      var descriptor = proto && Object.getOwnPropertyDescriptor(proto, 'value');
      if (descriptor && descriptor.set) descriptor.set.call(input, text); else input.value = text;
    } else { input.textContent = text; }
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
  }

  function snapshotDraft(input) {
    return {
      value: ('value' in input) ? input.value : input.textContent,
      start: input.selectionStart,
      end: input.selectionEnd
    };
  }

  function restoreDraft(input, draft) {
    if (!input || !draft) return;
    try {
      if ('value' in input) input.value = draft.value; else input.textContent = draft.value;
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
      if (typeof draft.start === 'number' && typeof input.setSelectionRange === 'function') {
        input.setSelectionRange(draft.start, draft.end);
      }
    } catch (e) { console.warn('[暨阳开局] 恢复输入框草稿失败', e); }
  }

  function waitForLetter(timeout, stillInChat) {
    return new Promise(function (resolve) {
      var start = Date.now();
      function tick() {
        if (!stillInChat()) { resolve(false); return; }
        if (chatLetter()) { resolve(true); return; }
        if (Date.now() - start >= timeout) { resolve(false); return; }
        setTimeout(tick, 150);
      }
      setTimeout(tick, 120);
    });
  }

  // ---------- 开场消息 / 世界书（旧路径保留，默认关闭） ----------
  function worldbookProfile(data) {
    return [
      '<player_profile>',
      '以下内容是本次对话中 <user> 的唯一玩家档案。以它为准，不要用角色卡默认设定覆盖它。',
      '姓名: ' + data['姓名'],
      '年龄: ' + data['年龄'],
      '性别或称谓: ' + data['性别或称谓'],
      '班级或身份: ' + data['班级或身份'],
      '外貌: ' + data['外貌'],
      '性格: ' + data['性格'],
      '擅长与学业: ' + data['擅长与学业'],
      '家庭背景: ' + data['家庭背景'],
      '重要物品: ' + data['重要物品'],
      '',
      '互动规则:',
      '- 角色应通过具体互动逐渐认识 <user>，不要把未设定内容强加给 <user>。',
      '- 家庭背景与重要物品可以成为剧情线索，但不能替 <user> 自动做决定。',
      '- 用档案中的姓名称呼 <user>；保留 <user> 对自身行动、表达和选择的完全控制。',
      '</player_profile>'
    ].join('\n');
  }

  function legacySaveWorldbook(content) {
    var getCharNames = th('getCharWorldbookNames');
    var updateWorldbookWith = th('updateWorldbookWith');
    if (!getCharNames || !updateWorldbookWith) throw new Error('未检测到世界书接口，无法写入旧版档案。');
    var bookName = (getCharNames('current') || {}).primary;
    if (!bookName) throw new Error('未找到当前角色卡的主世界书。请确认角色卡已完整导入。');
    var entry = {
      name: LEGACY_ENTRY_NAME, enabled: true,
      strategy: { type: 'constant', keys: [], keys_secondary: { logic: 'and_any', keys: [] }, scan_depth: 'same_as_global' },
      position: { type: 'before_character_definition', role: 'system', depth: 0, order: 85 },
      content: content, probability: 100,
      recursion: { prevent_incoming: true, prevent_outgoing: true, delay_until: null },
      effect: { sticky: null, cooldown: null, delay: null }
    };
    return updateWorldbookWith(bookName, function (entries) {
      return entries.filter(function (item) { return item.name !== LEGACY_ENTRY_NAME; }).concat([entry]);
    }, { render: 'immediate' }).then(function () { return bookName; });
  }

  function openingMessage(data, action, customOpening, selectedGreeting, enableDlc) {
    var lines = ['<initial_setup>', '以下是本次新角色的完整初始设定。请在本次开局中接住它，不要遗漏或替 <user> 自动补全未设定内容。', ''];
    lines.push('姓名: ' + data['姓名']);
    lines.push('年龄: ' + data['年龄']);
    lines.push('性别或称谓: ' + data['性别或称谓']);
    lines.push('班级或身份: ' + data['班级或身份']);
    lines.push('外貌: ' + data['外貌']);
    lines.push('性格: ' + data['性格']);
    lines.push('擅长与学业: ' + data['擅长与学业']);
    lines.push('家庭背景: ' + data['家庭背景']);
    lines.push('重要物品: ' + data['重要物品']);
    lines.push('开局心事: ' + data['开局心事']);
    lines.push('');
    lines.push('当前开场: ' + selectedGreeting);
    lines.push('开始年份: ' + data['开始年份']);
    lines.push('修仙DLC: ' + (enableDlc ? '开启（已于开局启封灵气复苏）' : '关闭（纯校园日常）'));
    if (selectedGreeting === '自定义开局') {
      ['开场日期', '开场时段', '开场地点'].forEach(function (key) {
        if (data[key] && data[key] !== '未设定') lines.push(key + ': ' + data[key]);
      });
    }
    if (action) lines.push('开局行动: ' + action);
    lines.push('');
    lines.push('连续性优先级:');
    lines.push('- 如果初始变量中的日期、时间、地点、在场人物、衣着、关系或事件进度与所选开场白冲突，一律以开场白的描写为当前起点。');
    if (selectedGreeting === '自定义开局' && !customOpening) {
      lines.push('- 从首楼指定的场景写出第一幕，留给玩家决定下一步。');
    } else {
      lines.push('- 从首楼最后一刻续写，留给玩家决定下一步。');
    }
    lines.push('</initial_setup>');
    return ['<letter>', lines.join('\n'), '</letter>'].join('\n');
  }

  // ---------- 预览 / 摘要 ----------
  function openPreview(root, index, text) {
    var preview = root.querySelector('[data-preview]');
    if (!preview) return;
    var title = preview.querySelector('[data-preview-title]');
    var content = preview.querySelector('[data-preview-content]');
    if (title) title.textContent = index + ' · ' + GREETING_NAMES[index] + ' · 开场白预览';
    if (content) content.textContent = text;
    var rewrite = preview.querySelector('[data-action="rewrite-preview"]');
    if (rewrite) rewrite.textContent = readText(root, '[data-custom-opening]') || sceneHeading(readForm(root)) ? '继续自定义草稿' : '改写这一幕';
    preview.setAttribute('data-open', 'true');
    preview.setAttribute('aria-hidden', 'false');
    if (content) {
      content.scrollTop = 0;
      content.focus({ preventScroll: true });
    }
    if (typeof preview.scrollIntoView === 'function') preview.scrollIntoView({ block: 'start', inline: 'nearest' });
  }

  function closePreview(root) {
    var preview = root.querySelector('[data-preview]');
    if (!preview) return;
    preview.setAttribute('data-open', 'false');
    preview.setAttribute('aria-hidden', 'true');
  }

  function summaryText(data, mode, index, action, enableDlc) {
    var year = parseInt(data['开始年份'], 10);
    if (!(year >= 1900 && year <= 2100)) year = 2020;
    var dlcLine = '\n都市修仙 DLC：' + (enableDlc ? '已开启' : '未开启');
    if (mode === 'custom') {
      return '姓名：' + data['姓名'] + '\n开局方式：自定义开局\n开始年份：' + year + ' 年' + dlcLine + (sceneHeading(data) ? '\n第一幕：' + sceneHeading(data) : '') + (action ? '\n开局行动：' + action : '');
    }
    var scene = GREETING_SCENES[index];
    return '姓名：' + data['姓名'] + '\n开局：' + GREETING_NAMES[index] + '（' + (scene ? scene.location : '') + '）\n开始年份：' + year + ' 年' + dlcLine + '\n开局行动：' + action;
  }

  function renderSummary(root, data, mode, index, action, enableDlc) {
    var node = root.querySelector('[data-opening-summary-text]');
    if (node) node.textContent = summaryText(data, mode, index, action, enableDlc);
  }

  // ---------- 同步状态 ----------
  async function syncRoot(root) {
    if (submitting || root.getAttribute('data-opening-state') === 'submitting') return;
    if (root.__jyUserEditing === true || root.__jySyncPending) return;
    var messages = getMessages('0-3');
    var messageZero = messages.length ? messageText(messages[0]) : '';
    var letter = findLetterMessage(messages);
    var letterText = messageText(letter);
    if (root.__jySyncedMessage === messageZero && root.__jySyncedLetter === letterText) return;
    var parsed = parseLetter(letterText);
    var index = 0;
    if (parsed['当前开场'] !== '自定义开局' && normalizeText(messageZero)) {
      root.__jySyncPending = true;
      try { index = await inferGreetingIndex(messageZero); } catch (error) { return; }
      finally { root.__jySyncPending = false; }
      if (submitting || !root.isConnected || root.__jyUserEditing === true ||
          messageText(getMessages('0-3')[0]) !== messageZero) return;
    }
    root.__jySyncedMessage = messageZero;
    root.__jySyncedLetter = letterText;
    if (index) setGreetingIndex(root, index);
    if (letter) {
      fillForm(root, parsed);
      if (parsed['当前开场'] !== '自定义开局' && index) setMode(root, 'preset');
      else {
        setMode(root, 'custom');
        var customBox = root.querySelector('[data-custom-opening]');
        var story = messageZero.replace(/<OpeningSetupUI\s*\/>/gi, '').trim();
        var heading = sceneHeading(parsed);
        if (heading && (story === heading || story.startsWith(heading + '\n\n'))) story = story.slice(heading.length).trimStart();
        if (customBox) customBox.value = parsed['自定义开局'] || story;
      }
      var dlcOn = /^开启/.test(parsed['修仙DLC'] || '') || (parsed['当前开场'] !== '自定义开局' && index === 9);
      setDlcEnabled(root, dlcOn);
      var actionBox = root.querySelector('[data-opening-action]');
      if (actionBox) actionBox.value = parsed['开局行动'] || '';
      root.setAttribute('data-opening-state', 'complete');
      renderSummary(root, parsed, getMode(root), getGreetingIndex(root), parsed['开局行动'] || '', dlcOn);
      var confirmBtn = root.querySelector('[data-action="confirm"]');
      if (confirmBtn) confirmBtn.disabled = false;
      closePreview(root);
    } else {
      updateDlcHint(root);
      if (root.getAttribute('data-opening-state') !== 'editing') {
        root.setAttribute('data-opening-state', 'editing');
      }
    }
  }

  function resetToEditing(root) {
    var messages = getMessages('0-3');
    var letter = findLetterMessage(messages);
    if (letter) {
      var parsed = parseLetter(messageText(letter));
      fillForm(root, parsed);
      setDlcEnabled(root, /^开启/.test(parsed['修仙DLC'] || '') || parsed['当前开场'] === '云清晏');
    }
    root.setAttribute('data-opening-state', 'editing');
    root.__jyUserEditing = true;
    closePreview(root);
    updateDlcHint(root);
    toast(root, '可以重新填写档案，再次确认只更新当前版本，不会重复发送开局消息。', 'info');
  }

  // ---------- 提交 ----------
  async function submitOpening(root) {
    if (submitting || root.getAttribute('data-opening-state') === 'submitting') return;
    if (root.getAttribute('data-opening-state') === 'complete') { root.setAttribute('data-opening-state', 'editing'); }

    var formData = readForm(root);
    var mode = getMode(root);
    var index = getGreetingIndex(root);
    var dlcOn = isDlcEnabled(root) || (mode === 'preset' && index === 9);
    var action = readText(root, '[data-opening-action]');
    var custom = mode === 'custom' ? readText(root, '[data-custom-opening]') : '';

    function fail(message) {
      submitting = false;
      setState(root, 'editing');
      root.__jyUserEditing = true;
      toast(root, message, 'error');
    }

    if (!formData['姓名'] || formData['姓名'] === '未设定') return fail('请先填写姓名。');
    if (formData['开始年份'] === '未设定') formData['开始年份'] = DEFAULT_FIELDS['开始年份'];
    if (!/^\d{4}$/.test(formData['开始年份']) || Number(formData['开始年份']) < 1900 || Number(formData['开始年份']) > 2100) return fail('高二入学年份请填写 1900 至 2100 之间的年份。');
    if (mode === 'preset' && !action) return fail('请先填写「你的开局动作」。');
    if (mode === 'custom' && !custom && !customScene(formData).location) return fail('写下一段第一幕，或填一个开场地点。');
    root.__jyPreviewRequest = (root.__jyPreviewRequest || 0) + 1;

    var primaryBook = '';
    try { primaryBook = checkPrimaryWorldbook(); } catch (error) { return fail(error.message); }

    var greeting = '';
    if (mode === 'preset') {
      submitting = true;
      setState(root, 'submitting');
      try { greeting = await greetingTextAt(index); }
      catch (error) { return fail('读取开场白失败：' + error.message); }
      if (!root.isConnected) { submitting = false; return; }
      if (!greeting) return fail('未找到编号 ' + index + ' 的开场白，请重新导入完整角色卡后再试。');
    }
    var seedText = (mode === 'custom' ? [sceneHeading(formData), custom].filter(Boolean).join('\n\n') : greeting) + '\n\n' + PLACEHOLDER;

    var input = findInput();
    var sendButton = findSendButton();
    if (!input) return fail('未找到酒馆输入框，请确认聊天界面已加载后重试。');

    var messageZero = getMessages(0)[0];
    if (!messageZero) return fail('当前聊天没有可写入的开场消息。');
    var originalMessageZero = messageText(messageZero);
    var existingLetter = chatLetter();
    var alreadySubmitted = !!existingLetter;
    if (!alreadySubmitted && !sendButtonUsable(sendButton)) return fail('酒馆发送按钮当前不可用，请检查模型连接或正在进行的生成后重试。');
    var draft = snapshotDraft(input);
    var owner = input.ownerDocument.defaultView;
    var context = owner.SillyTavern?.getContext();
    var chatId = context?.getCurrentChatId?.();
    var stillInChat = function () { return context?.getCurrentChatId?.() === chatId; };
    var variables;
    var staged = false;
    var usedInput = false;
    var letter;

    submitting = true;
    setState(root, 'submitting');
    toast(root, '正在写入开局设定…', 'info');

    try {
      try {
        variables = await prepareMvuOpening(formData, mode, mode === 'preset' ? GREETING_SCENES[index] : null, {
          enableDlc: dlcOn,
          mode: mode,
          greetingIndex: index
        });
      } catch (error) {
        throw new Error('开局变量准备失败：' + error.message);
      }
      if (!root.isConnected || !stillInChat()) return;

      if (dlcOn) {
        try {
          await syncOpeningWorldbookDlc(primaryBook, true);
        } catch (error) {
          throw new Error('启用修仙 DLC 世界书条目失败：' + error.message);
        }
        if (!root.isConnected || !stillInChat()) return;
      }

      var identity = variables.next.stat_data.主角?.班级;
      var profile = identity ? Object.assign({}, formData, { '班级或身份': identity }) : formData;
      letter = openingMessage(profile, action, custom, mode === 'custom' ? '自定义开局' : GREETING_NAMES[index], dlcOn);
      // 正文和 MVU 数据在同一次首楼更新中提交，完成刷新后再发送。
      staged = true;
      var updates = [{ message_id: 0, message: seedText, data: variables.next }];
      if (existingLetter) updates.push({ message_id: existingLetter.message_id, message: letter });
      await setChatMessagesSafe(updates);
      if (!stillInChat()) return;

      if (!alreadySubmitted) {
        if (!sendButtonUsable(sendButton)) throw new Error('首楼更新后发送按钮不可用，请检查酒馆发送状态后重试。');
        usedInput = true;
        writeInput(input, letter);
        sendButton.click();
        var sent = await waitForLetter(8000, stillInChat);
        if (!stillInChat()) return;
        if (!sent) throw new Error('酒馆未把开局动作加入聊天。请检查发送状态或模型连接后重试。');
      }

      if (WRITE_LEGACY_WORLDBOOK) {
        try { await legacySaveWorldbook(worldbookProfile(formData)); } catch (error) { console.warn('[暨阳开局] 旧版世界书写入失败', error); }
      }

      if (usedInput && draft.value && !elementValue(input)) restoreDraft(input, draft);
      dispatchDlcChanged();
      try { findFloatingBridge()?.probeDlc?.(true); } catch (_) {}
      bindAll();
      var visibleRoot = root.isConnected ? root : activeRoot;
      if (!visibleRoot?.isConnected) return;
      visibleRoot.__jyUserEditing = false;
      setDlcEnabled(visibleRoot, dlcOn);
      setState(visibleRoot, 'complete');
      renderSummary(visibleRoot, formData, mode, index, action, dlcOn);
      closePreview(visibleRoot);
      toast(visibleRoot, '开场已保存到本次聊天' + (dlcOn ? '（都市修仙 DLC 已同步开启）。' : '。'), 'info');
    } catch (error) {
      if (!stillInChat()) return;
      var errorMessage = error.message || '开局提交失败，请重试。';
      if (staged && !alreadySubmitted && !chatLetter()) {
        try {
          await setChatMessagesSafe([{ message_id: 0, message: originalMessageZero, data: variables.original }]);
        } catch (rollbackError) {
          errorMessage += ' 首楼恢复失败：' + rollbackError.message;
        }
      }
      if (usedInput) restoreDraft(input, draft);
      bindAll();
      var retryRoot = root.isConnected ? root : activeRoot;
      if (retryRoot?.isConnected) {
        setState(retryRoot, 'editing');
        retryRoot.__jyUserEditing = true;
        fillForm(retryRoot, formData);
        setMode(retryRoot, mode);
        setGreetingIndex(retryRoot, index);
        setDlcEnabled(retryRoot, dlcOn);
        retryRoot.querySelector('[data-opening-action]').value = action;
        retryRoot.querySelector('[data-custom-opening]').value = custom;
      }
      toast(retryRoot, errorMessage, 'error');
    } finally {
      submitting = false;
    }
  }

  // ---------- 事件 ----------
  async function handleClick(root, event) {
    var target = event.target && event.target.closest ? event.target.closest('[data-action]') : null;
    if (!target || !root.contains(target)) return;
    var action = target.getAttribute('data-action');
    if (submitting) { event.preventDefault(); return; }
    var request = (root.__jyPreviewRequest || 0) + 1;
    root.__jyPreviewRequest = request;
    if (action === 'show-archives') {
      var archives = root.querySelector('[data-opening-archives]');
      archives.open = true;
      archives.querySelector('[data-archive-name]').focus();
    } else if (action === 'save-archive' || action === 'load-archive' || action === 'delete-archive') {
      archiveAction(root, target.closest('[data-opening-archives]'), action);
    } else if (action === 'select-mode') {
      event.preventDefault();
      root.__jyUserEditing = true;
      closePreview(root);
      setMode(root, target.getAttribute('data-mode'));
      updateDlcHint(root);
    } else if (action === 'apply-template') {
      event.preventDefault();
      applyOpeningTemplate(root, target.getAttribute('data-template'));
    } else if (action === 'select-greeting') {
      event.preventDefault();
      root.__jyUserEditing = true;
      var index = Number(target.getAttribute('data-greeting')) || 1;
      closePreview(root);
      setGreetingIndex(root, index);
      if (index === 9 && !isDlcEnabled(root)) {
        setDlcEnabled(root, true);
        toast(root, '已选择「云清晏」转学开场，自动为你勾选开启都市修仙 DLC。', 'info');
      } else {
        updateDlcHint(root);
      }
      var text;
      try { text = await greetingTextAt(index); }
      catch (error) {
        if (root.isConnected && root.__jyPreviewRequest === request) toast(root, '读取开场白失败：' + error.message, 'error');
        return;
      }
      if (submitting || !root.isConnected || root.__jyPreviewRequest !== request) return;
      if (text) openPreview(root, index, text);
      else toast(root, '未找到该开场白文本，请重新导入完整角色卡。', 'error');
    } else if (action === 'rewrite-preview') {
      event.preventDefault();
      var editor = root.querySelector('[data-custom-opening]');
      var data = readForm(root);
      if (!editor.value.trim() && !sceneHeading(data)) {
        var scene = GREETING_SCENES[getGreetingIndex(root)];
        editor.value = readText(root, '[data-preview-content]');
        fillForm(root, {
          '开场日期': scene.date.replace(/^2020/, /^\d{4}$/.test(data['开始年份']) ? data['开始年份'] : '2020').replaceAll('/', '-'),
          '开场时段': scene.time,
          '开场地点': scene.location
        });
      }
      root.__jyUserEditing = true;
      closePreview(root);
      setMode(root, 'custom');
      updateDlcHint(root);
      editor.focus();
    } else if (action === 'clear') {
      event.preventDefault();
      root.__jyUserEditing = true;
      fieldElements(root).forEach(function (el) {
        var key = el.getAttribute('data-field');
        var next = DEFAULT_FIELDS[key] || '';
        if ('value' in el) el.value = next; else el.textContent = next;
      });
      var customBox = root.querySelector('[data-custom-opening]');
      if (customBox) customBox.value = '';
      var actionBox = root.querySelector('[data-opening-action]');
      if (actionBox) actionBox.value = '';
      setDlcEnabled(root, false);
      updateIdPreview(root);
      toast(root, '已清空表单，可重新填写。', 'info');
    } else if (action === 'close-preview' || action === 'use-preview') {
      event.preventDefault();
      closePreview(root);
      var selected = root.querySelector('[data-action="select-greeting"][data-selected="true"]');
      if (selected) selected.focus();
    } else if (action === 'reset-opening') {
      event.preventDefault();
      resetToEditing(root);
      updateIdPreview(root);
    }
  }

  function handleSubmit(root, event) {
    if (!event.target || !root.contains(event.target)) return;
    event.preventDefault();
    event.stopPropagation();
    submitOpening(root);
  }

  function bindRoot(root) {
    if (root.__jyOpeningBoundV7) return;
    root.__jyOpeningBoundV7 = true;
    activeRoot = root;
    var onClick = function (event) { handleClick(root, event); };
    var onSubmit = function (event) { handleSubmit(root, event); };
    var onKeydown = function (event) {
      if (event.key !== 'Escape') return;
      var close = event.target.closest('[data-preview][data-open="true"]')?.querySelector('[data-action="close-preview"]');
      if (!close) return;
      event.preventDefault();
      close.click();
    };
    var archives = root.querySelector('[data-opening-archives]');
    var refreshArchives = function () {
      if (archives.open) archiveAction(root, archives, 'list');
    };
    archives?.addEventListener('toggle', refreshArchives);
    var markEditing = function (event) {
      if (!event.target.closest('[data-opening-archives]')) {
        root.__jyUserEditing = true;
        updateIdPreview(root);
        updateDlcHint(root);
      }
    };
    var onChange = function (event) {
      if (event.target.closest('[data-opening-archives]')) return;
      root.__jyUserEditing = true;
      if (event.target.matches('[data-opening-dlc]') && !event.target.checked && getMode(root) === 'preset' && getGreetingIndex(root) === 9) {
        setGreetingIndex(root, 1);
        closePreview(root);
        toast(root, '已关闭修仙 DLC，并从「云清晏」切回「开学第一天」开场。', 'info');
      }
      updateDlcHint(root);
    };
    var onAvatarChanged = function () {
      updateIdPreview(root);
      bindSceneThumbs(root);
    };
    root.addEventListener('input', markEditing);
    root.addEventListener('change', onChange);
    root.addEventListener('click', onClick);
    root.addEventListener('submit', onSubmit);
    root.addEventListener('keydown', onKeydown);
    windowList().forEach(function (win) {
      try { win.addEventListener('jy-avatar-changed', onAvatarChanged); } catch (_) {}
    });
    cleanups.push(function () {
      archives?.removeEventListener('toggle', refreshArchives);
      root.removeEventListener('input', markEditing);
      root.removeEventListener('change', onChange);
      root.removeEventListener('click', onClick);
      root.removeEventListener('submit', onSubmit);
      root.removeEventListener('keydown', onKeydown);
      windowList().forEach(function (win) {
        try { win.removeEventListener('jy-avatar-changed', onAvatarChanged); } catch (_) {}
      });
      root.__jyOpeningBoundV7 = false;
    });
    bindSceneThumbs(root);
    updateIdPreview(root);
    updateDlcHint(root);
    syncRoot(root);
  }

  function bindAll() {
    rootList().forEach(function (root) {
      if (!root.__jyOpeningBoundV7) bindRoot(root);
      else syncRoot(root);
    });
  }

  function scheduleBind() {
    if (bindTimer !== null) return;
    bindTimer = setTimeout(function () {
      bindTimer = null;
      bindAll();
    }, 120);
  }

  function start() {
    var roots = rootList();
    if (roots.length) bindAll();
    // 聊天/消息异步渲染：定时补绑 + DOM 观察
    timers.push(setTimeout(function () { bindAll(); }, 400));
    timers.push(setTimeout(function () { bindAll(); }, 1400));
    documentList().forEach(function (doc) {
      try {
        if (!doc || !doc.documentElement) return;
        var mo = new MutationObserver(scheduleBind);
        mo.observe(doc.documentElement, { childList: true, subtree: true });
        cleanups.push(function () { mo.disconnect(); });
      } catch (e) { /* noop */ }
    });
    try {
      if (window.parent && window.parent !== window) {
        window.parent.addEventListener('pagehide', stop, { once: true });
        cleanups.push(function () { window.parent.removeEventListener('pagehide', stop); });
      }
    } catch (e) { /* noop */ }
    console.info('[暨阳开局/V7] 已加载：MVU 变量写入 + 防重复提交 + 完成态摘要。');
  }

  window[GLOBAL_KEY] = { stop: stop, bind: bindAll };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
