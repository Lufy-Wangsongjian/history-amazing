import type { HistoricalEvent } from './types'

// ═══════════════════════════════════════════════════════════════════
//  以色列/巴勒斯坦历史事件（按王朝与时代演变系统细化）
//
//  ID 规则: il + 三位数字，从 il001 开始
//  region 统一为 'israel'
// ═══════════════════════════════════════════════════════════════════

export const israelHistoryEvents: HistoricalEvent[] = [

  // ─── 迦南时代与族长传说（约前 3300 – 前 1200）──────────
  {
    id: 'il001', year: -3300, endYear: -1200, title: '迦南城邦时代',
    description: '在埃及和美索不达米亚两大文明之间，迦南地（今以色列/巴勒斯坦）出现了耶利哥、夏琐、米吉多等城邦，是连接亚非欧的贸易走廊和战略要地。',
    details: '耶利哥是世界上最古老的有城墙城市之一（约前8000年即有定居），夏琐是迦南最大的城邦，面积约80公顷。阿玛尔纳书信（前14世纪）记录了迦南城邦统治者与埃及法老之间的外交通信，反映了这一地区复杂的政治格局。迦南人发明了原始字母文字，后经腓尼基人发展为几乎所有现代字母系统的源头。',
    category: 'history', region: 'israel', significance: 1,
    image: 'https://picsum.photos/seed/chrono-il001/1200/800',
  },
  {
    id: 'il002', year: -1200, title: '以色列人定居迦南·士师时代',
    description: '青铜时代晚期崩溃后，以色列部落在迦南山地定居。士师（如底波拉、基甸、参孙）在外敌入侵时担任临时军事领袖，但部落之间缺乏统一政权。',
    details: '考古证据显示约前1200年迦南山地突然出现了大量新的小型定居点——没有猪骨、陶器风格简朴，与迦南城市文化形成对比。这些定居者是否就是《圣经》中的以色列人仍有争议。士师时代的核心特征是"无王统治"——"那时以色列中没有王，各人任意而行"（《士师记》21:25）。',
    category: 'history', region: 'israel', significance: 2,
    image: 'https://picsum.photos/seed/chrono-il002/1200/800',
    relatedIds: ['il001', 'il003'],
  },

  // ─── 统一王国与分裂（约前 1020 – 前 586）─────────────
  {
    id: 'il003', year: -1020, endYear: -930, title: '统一王国·扫罗、大卫、所罗门',
    description: '为应对非利士人的威胁，以色列部落联盟建立了统一王国。扫罗为首任国王，大卫攻占耶路撒冷为首都，所罗门建造了第一圣殿——犹太信仰的核心圣所。',
    details: '大卫从牧羊少年成长为国王，他征服耶路撒冷（约前1000年）并将约柜迎入城中，使其成为宗教和政治中心。所罗门利用父亲积累的国力建造了辉煌的第一圣殿——至圣所安放约柜，只有大祭司一年一次可以进入。他还发展了红海贸易和铜矿开采，但沉重的赋税和劳役激起了北方部落的不满。',
    category: 'history', region: 'israel', significance: 3, figure: '大卫/所罗门',
    image: 'https://picsum.photos/seed/chrono-il003/1200/800',
    relatedIds: ['il002', 'il004'],
  },
  {
    id: 'il004', year: -930, title: '王国分裂·以色列与犹大',
    description: '所罗门死后其子罗波安拒绝减轻赋税，北方十个部落脱离建立以色列国（首都撒马利亚），南方两个部落组成犹大国（首都耶路撒冷），统一王国一分为二。',
    details: '北方以色列国较大也较富裕，但政治不稳——200年间经历了9个王朝19位国王，多次通过政变更替。南方犹大国虽小，但大卫家族的王统从未中断。两国时而联盟时而交战。先知以利亚在以色列与巴力崇拜斗争，以赛亚在犹大宣告社会正义——先知运动成为犹太教最独特的精神遗产之一。',
    category: 'history', region: 'israel', significance: 2,
    image: 'https://picsum.photos/seed/chrono-il004/1200/800',
    relatedIds: ['il003', 'il005'],
  },
  {
    id: 'il005', year: -722, title: '亚述灭以色列国·十个失散部落',
    description: '亚述帝国攻陷撒马利亚，灭亡北方以色列国，将居民强制迁徙至亚述各地。北方十个部落从此消失在历史中，成为"以色列十个失散部落"之谜。',
    details: '亚述的强制迁徙政策旨在瓦解被征服民族的认同。被迁走的以色列人逐渐融入周围民族，而从亚述其他地方迁入的移民与留下的以色列人通婚，形成了后来的撒马利亚人——犹大人与撒马利亚人之间的敌意延续了数百年。只有南方的犹大国在亚述的阴影下艰难存续。',
    category: 'warfare', region: 'israel', significance: 2,
    image: 'https://picsum.photos/seed/chrono-il005/1200/800',
    relatedIds: ['il004', 'il006'],
  },
  {
    id: 'il006', year: -586, title: '巴比伦之囚·第一圣殿被毁',
    description: '新巴比伦帝国的尼布甲尼撒二世攻破耶路撒冷，焚毁第一圣殿，将犹大精英强制迁徙至巴比伦。"巴比伦之囚"成为犹太民族记忆中最深刻的创伤之一。',
    details: '《诗篇》137篇记录了流亡者的悲痛："我们曾在巴比伦的河边坐下，一追想锡安就哭了。"然而巴比伦流亡也带来了深刻的宗教转型——失去了圣殿和故土后，犹太教从以神庙祭祀为中心转向以律法和经文为中心。会堂（synagogue）制度、安息日的严格遵守、《托拉》的编纂和研读都在流亡中发展成熟。犹太教因此成为人类历史上第一个不依赖固定圣地就能存续的宗教。',
    category: 'history', region: 'israel', significance: 3, figure: '尼布甲尼撒二世',
    image: 'https://picsum.photos/seed/chrono-il006/1200/800',
    relatedIds: ['il005', 'il007'],
  },

  // ─── 波斯、希腊化与哈斯蒙尼（前 539 – 前 63）──────
  {
    id: 'il007', year: -539, title: '居鲁士大帝允许犹太人回归',
    description: '波斯阿契美尼德帝国的居鲁士大帝征服巴比伦后颁布诏令，允许犹太人返回耶路撒冷重建圣殿。"居鲁士诏令"使他在犹太传统中被尊为"上帝的牧人"。',
    details: '约前515年第二圣殿在原址上重建完成，但规模远不及第一圣殿。文士以斯拉和省长尼希米在前5世纪推行了宗教改革——以斯拉公开宣读《托拉》，确立了犹太教以律法为核心的信仰形态。波斯统治时期犹大享有相当的自治权，波斯帝国的宗教宽容政策使犹太教得以在本土重新扎根。',
    category: 'history', region: 'israel', significance: 2, figure: '居鲁士/以斯拉',
    image: 'https://picsum.photos/seed/chrono-il007/1200/800',
    relatedIds: ['il006', 'il008'],
  },
  {
    id: 'il008', year: -332, endYear: -167, title: '希腊化时期·文化冲突',
    description: '亚历山大大帝征服后巴勒斯坦先后被托勒密和塞琉古帝国统治。希腊文化的渗透在犹太社会引发了激烈的文化冲突——"希腊化"与"传统主义"之争。',
    details: '部分犹太精英积极拥抱希腊文化——在耶路撒冷修建希腊式体育馆，取希腊名字。但严守律法的虔诚派（哈西德人）坚决抵制。塞琉古国王安条克四世（前175-164年在位）试图强制推行希腊化——禁止安息日和割礼，在圣殿中设立宙斯祭坛（"令人憎恶之物"），引发了马加比起义。',
    category: 'history', region: 'israel', significance: 2,
    image: 'https://picsum.photos/seed/chrono-il008/1200/800',
    relatedIds: ['il007', 'il009'],
  },
  {
    id: 'il009', year: -167, endYear: -63, title: '马加比起义与哈斯蒙尼王朝',
    description: '祭司马提亚和其子犹大·马加比领导犹太人起义反抗塞琉古帝国的宗教迫害。前164年收复并洁净第二圣殿——这一事件成为犹太节日"光明节"（汉努卡）的由来。',
    details: '犹大·马加比以游击战术多次击败塞琉古正规军，堪称古代游击战的典范。他的兄弟们建立了哈斯蒙尼王朝（前140-63年）——犹太人自巴比伦之囚以来首次拥有独立国家。但哈斯蒙尼后期陷入内斗，最终两位王位争夺者分别邀请罗马将军庞培调停，庞培趁机于前63年攻占耶路撒冷，犹太人的独立再次丧失。',
    category: 'warfare', region: 'israel', significance: 2, figure: '犹大·马加比',
    image: 'https://picsum.photos/seed/chrono-il009/1200/800',
    relatedIds: ['il008', 'il010'],
  },

  // ─── 罗马统治（前 63 – 公元 638）────────────────
  {
    id: 'il010', year: -37, endYear: -4, title: '大希律王·罗马附庸国王',
    description: '以东人希律在罗马支持下统治犹大，大规模扩建了第二圣殿（希律圣殿），使其成为古代世界最宏伟的宗教建筑之一。但他的残暴统治令犹太人深恶痛绝。',
    details: '希律圣殿的扩建是一项浩大工程——圣殿山平台面积扩大至14万平方米，西墙（"哭墙"）的巨石每块重达数百吨，至今屹立。他还修建了凯撒利亚海港、马萨达要塞和希罗底翁宫殿。然而他杀死了自己的妻子和三个儿子，奥古斯都曾讽刺"做希律的猪都比做他的儿子安全"。',
    category: 'architecture', region: 'israel', significance: 2, figure: '大希律',
    image: 'https://picsum.photos/seed/chrono-il010/1200/800',
    relatedIds: ['il009', 'il011'],
  },
  {
    id: 'il011', year: 30, title: '耶稣受难与基督教起源',
    description: '拿撒勒人耶稣在罗马总督彼拉多治下被钉十字架处死。他的追随者相信他复活并升天，这一信仰发展为基督教——人类历史上影响最广泛的宗教。',
    details: '耶稣的传道活动主要在加利利和犹大地区，核心信息是"天国近了"和"爱你的邻居"。他挑战了犹太宗教权威和圣殿体制，最终在逾越节期间被捕并被罗马人处决。他的死亡和据传的复活成为基督教信仰的核心。保罗（原名扫罗）将这一原本的犹太教派系传播到非犹太人中间，基督教由此超越了犹太教的民族边界走向世界。',
    category: 'religion', region: 'israel', significance: 3, figure: '耶稣/保罗',
    image: 'https://picsum.photos/seed/chrono-il011/1200/800',
    relatedIds: ['il010', 'il012'],
  },
  {
    id: 'il012', year: 70, title: '罗马摧毁第二圣殿·犹太大流散',
    description: '犹太人第一次起义（66-73年）失败后，罗马将军提图斯攻陷耶路撒冷，焚毁了第二圣殿。只有西墙（"哭墙"）残存。犹太民族进入近两千年的大流散时代。',
    details: '约瑟夫斯在《犹太战争》中详细记录了围城的惨状——饥饿至极的居民甚至出现了人相食的悲剧。提图斯将圣殿器物（包括金灯台）作为战利品带回罗马，至今刻在罗马提图斯凯旋门上。前73年马萨达要塞960名犹太守军在罗马围困下集体自杀——"马萨达永不再陷落"成为现代以色列的精神象征。圣殿被毁后犹太教在拉比约哈南·本·扎凯的领导下完成了从圣殿祭祀到拉比律法研读的根本性转型。',
    category: 'warfare', region: 'israel', significance: 3, figure: '提图斯',
    image: 'https://picsum.photos/seed/chrono-il012/1200/800',
    relatedIds: ['il011', 'il013'],
  },
  {
    id: 'il013', year: 135, title: '巴尔·科赫巴起义·犹太人被逐出耶路撒冷',
    description: '犹太人在巴尔·科赫巴领导下发动第二次大规模反罗马起义（132-135年）。哈德良皇帝血腥镇压后将耶路撒冷改名为"爱利亚·卡皮托利纳"，禁止犹太人进入，并将该省改名为"巴勒斯坦"。',
    details: '巴尔·科赫巴建立了短暂的独立国家，铸造了自己的钱币。拉比阿基瓦曾宣称他是弥赛亚。但罗马军团投入12个军团进行镇压，屠杀了约58万犹太人。哈德良在圣殿山上建造了罗马神庙，禁止犹太人进城——只有在每年的阿布月第九日（圣殿毁灭纪念日），犹太人才被允许来到西墙哭泣。"巴勒斯坦"这一地名即源于罗马人对此地的重新命名（取自犹太人的宿敌"非利士人"）。',
    category: 'warfare', region: 'israel', significance: 2, figure: '巴尔·科赫巴/哈德良',
    image: 'https://picsum.photos/seed/chrono-il013/1200/800',
    relatedIds: ['il012'],
  },

  // ─── 拜占庭、阿拉伯与十字军（638 – 1517）─────────
  {
    id: 'il014', year: 638, title: '阿拉伯征服耶路撒冷',
    description: '哈里发欧麦尔亲自接受耶路撒冷的投降。他在圣殿山上祈祷，据传拒绝在圣墓教堂内祈祷以免穆斯林日后将其改为清真寺。',
    details: '欧麦尔签署的"欧麦尔契约"保障了基督徒的宗教自由和财产安全。他在圣殿山上发现了犹太人被罗马人清除圣殿后残留的岩石，下令在此处建造了清真寺——后来发展为阿克萨清真寺和圆顶清真寺（岩石清真寺，691年由倭马亚哈里发阿卜杜勒·马利克建造）。圣殿山/尊贵禁地从此成为犹太教、基督教和伊斯兰教三大宗教共同的神圣之地。',
    category: 'history', region: 'israel', significance: 2, figure: '欧麦尔',
    image: 'https://picsum.photos/seed/chrono-il014/1200/800',
  },
  {
    id: 'il015', year: 1099, endYear: 1291, title: '十字军王国·耶路撒冷拉丁王国',
    description: '第一次十字军东征攻占耶路撒冷（1099年），建立了耶路撒冷拉丁王国。十字军在近东维持了近200年的存在，深刻影响了东西方文化交流。',
    details: '1099年7月15日十字军攻入耶路撒冷，屠杀了城内几乎所有穆斯林和犹太人——据记载血流成河。十字军国家建立了独特的封建体制和壮观的城堡（如骑士堡、蒙特利尔堡）。1187年萨拉丁收复耶路撒冷后十字军退守沿海城市。1291年阿卡城陷落标志着十字军在近东的彻底终结。十字军时代推动了欧洲对东方香料、丝绸和科学知识的需求。',
    category: 'warfare', region: 'israel', significance: 2,
    image: 'https://picsum.photos/seed/chrono-il015/1200/800',
  },
  {
    id: 'il016', year: 1517, endYear: 1917, title: '奥斯曼帝国统治巴勒斯坦',
    description: '奥斯曼帝国苏丹塞利姆一世征服巴勒斯坦，开启了长达四百年的奥斯曼统治。苏莱曼大帝重建了耶路撒冷城墙（至今的旧城城墙）。',
    details: '奥斯曼统治时期巴勒斯坦是一个相对和平但经济落后的省份。犹太人在萨法德形成了卡巴拉神秘主义研究中心。16世纪苏莱曼大帝修建的耶路撒冷城墙至今完好——这是今日旧城的标志性景观。18-19世纪随着奥斯曼帝国衰落，巴勒斯坦成为欧洲列强争夺的对象。',
    category: 'history', region: 'israel', significance: 1,
    image: 'https://picsum.photos/seed/chrono-il016/1200/800',
  },

  // ─── 犹太复国主义与英国托管（1897 – 1948）─────────
  {
    id: 'il017', year: 1897, title: '第一届犹太复国主义大会',
    description: '西奥多·赫茨尔在瑞士巴塞尔召开第一届犹太复国主义大会，提出在巴勒斯坦建立"犹太民族家园"的政治纲领，现代犹太复国运动正式启动。',
    details: '赫茨尔是维也纳记者，目睹了德雷福斯事件中法国社会的反犹浪潮后确信同化无法解决"犹太人问题"，只有建立自己的国家。大会后他在日记中写道："在巴塞尔我建立了犹太国家……也许五年后，最多五十年后，所有人都会看到它。"事实上恰好51年后的1948年以色列建国。犹太人开始有组织地向巴勒斯坦移民（阿利亚）。',
    category: 'history', region: 'israel', significance: 3, figure: '赫茨尔',
    image: 'https://picsum.photos/seed/chrono-il017/1200/800',
    relatedIds: ['il018'],
  },
  {
    id: 'il018', year: 1917, title: '贝尔福宣言·英国承诺犹太家园',
    description: '英国外交大臣贝尔福致信犹太裔银行家罗斯柴尔德勋爵，声明英国政府"赞成在巴勒斯坦为犹太人建立民族家园"。这份67个字的信改变了中东的命运。',
    details: '贝尔福宣言是一份充满矛盾的文件——它承诺支持犹太民族家园，同时声明"不得损害巴勒斯坦现有非犹太社区的公民和宗教权利"。而当时巴勒斯坦约90%的人口是阿拉伯人。1920年国际联盟将巴勒斯坦委托英国托管，贝尔福宣言被写入托管条款。此后犹太移民不断增加，与当地阿拉伯人的冲突日益激烈。',
    category: 'history', region: 'israel', significance: 2, figure: '贝尔福',
    image: 'https://picsum.photos/seed/chrono-il018/1200/800',
    relatedIds: ['il017', 'il019'],
  },
  {
    id: 'il019', year: 1947, title: '联合国分治方案（181号决议）',
    description: '联合国大会以33票赞成、13票反对通过了巴勒斯坦分治方案，将其分为犹太国和阿拉伯国，耶路撒冷由国际托管。犹太方面接受，阿拉伯方面拒绝。',
    details: '分治方案将57%的土地划给占人口33%的犹太人（当时约60万），43%划给占67%的阿拉伯人（约120万）。方案通过当夜，巴勒斯坦即爆发内战。英国宣布将于1948年5月15日结束托管并撤离。阿拉伯高级委员会拒绝方案并号召全面抵抗。',
    category: 'history', region: 'israel', significance: 3,
    image: 'https://picsum.photos/seed/chrono-il019/1200/800',
    relatedIds: ['il018', 'il020'],
  },

  // ─── 现代以色列（1948 – 至今）────────────────
  {
    id: 'il020', year: 1948, title: '以色列独立宣言',
    description: '1948年5月14日，本-古里安在特拉维夫宣读《以色列独立宣言》。次日英国托管结束，埃及、约旦、叙利亚、伊拉克和黎巴嫩联合进攻以色列，第一次中东战争爆发。',
    details: '以色列在战争中不仅存活下来，还将控制区从分治方案的57%扩大到78%。约70万巴勒斯坦阿拉伯人逃离或被驱逐（阿拉伯人称之为"灾难日"/Nakba），成为延续至今的难民问题。约旦控制了西岸和东耶路撒冷（包括旧城），埃及控制了加沙地带。1949年停战协议划定了"绿线"。',
    category: 'history', region: 'israel', significance: 3, figure: '本-古里安',
    image: 'https://picsum.photos/seed/chrono-il020/1200/800',
    relatedIds: ['il019', 'il021'],
  },
  {
    id: 'il021', year: 1967, title: '六日战争·以色列控制全部耶路撒冷',
    description: '1967年6月，以色列在六天内击败埃及、约旦和叙利亚三国联军，占领了西奈半岛、加沙地带、西岸（包括东耶路撒冷旧城）和戈兰高地。',
    details: '6月5日以色列空军先发制人摧毁了埃及空军的大部分飞机。6月7日以色列伞兵通过狮门攻入旧城，抵达西墙——犹太士兵在近两千年来首次在西墙前祈祷的照片成为以色列最具标志性的图像。以色列随后宣布统一耶路撒冷。但占领也带来了深远的问题——数百万巴勒斯坦人置于军事占领之下，定居点问题成为巴以冲突的核心。联合国242号决议要求以色列撤出占领领土，但至今未得到执行。',
    category: 'warfare', region: 'israel', significance: 3,
    image: 'https://picsum.photos/seed/chrono-il021/1200/800',
    relatedIds: ['il020', 'il022'],
  },
  {
    id: 'il022', year: 1993, title: '奥斯陆协议·巴以和平进程',
    description: '以色列总理拉宾和巴解组织主席阿拉法特在白宫草坪上握手，签署了《奥斯陆协议》，双方首次相互承认。这一历史性突破给中东和平带来了短暂的希望。',
    details: '秘密谈判在挪威进行了数月。协议确立了巴勒斯坦有限自治的框架，建立了巴勒斯坦权力机构。拉宾、阿拉法特和佩雷斯因此获得1994年诺贝尔和平奖。然而极端分子的暴力行动不断破坏和平进程——1995年11月4日拉宾被以色列极端民族主义者伊盖尔·阿米尔刺杀，和平进程遭受了可能是永远无法恢复的打击。',
    category: 'history', region: 'israel', significance: 2, figure: '拉宾/阿拉法特',
    image: 'https://picsum.photos/seed/chrono-il022/1200/800',
    relatedIds: ['il021'],
  },

  // ─── 补充间隙 ──────────────────────────────
  { id: 'il023', year: -930, endYear: -586, title: '分裂王国时期（以色列与犹大）', description: '南北两个犹太王国并存约350年，先后被亚述和巴比伦灭亡。', category: 'history', region: 'israel', significance: 1 },
  { id: 'il024', year: -586, endYear: -332, title: '巴比伦之囚与波斯统治', description: '犹太人经历巴比伦流亡后在波斯允许下回归重建第二圣殿。', category: 'history', region: 'israel', significance: 2 },
  { id: 'il025', year: 135, endYear: 638, title: '罗马-拜占庭统治', description: '犹太人被逐出耶路撒冷后，巴勒斯坦先后在罗马和拜占庭帝国统治下。基督教成为主导宗教。', category: 'history', region: 'israel', significance: 1 },
  { id: 'il026', year: 638, endYear: 1099, title: '阿拉伯-法蒂玛统治', description: '伊斯兰征服后巴勒斯坦成为阿拉伯世界的一部分，圆顶清真寺建成。', category: 'history', region: 'israel', significance: 1 },
  { id: 'il027', year: 1291, endYear: 1517, title: '马穆鲁克统治', description: '十字军被驱逐后马穆鲁克苏丹国控制巴勒斯坦至奥斯曼征服。', category: 'history', region: 'israel', significance: 1 },
  { id: 'il028', year: 1917, endYear: 1948, title: '英国托管巴勒斯坦', description: '贝尔福宣言后英国托管期间犹太移民不断增加，阿犹冲突日益激化。', category: 'history', region: 'israel', significance: 2 },
  { id: 'il029', year: 1948, endYear: 2030, title: '现代以色列国', description: '从建国战争到六日战争、奥斯陆和平进程和巴以冲突延续至今。', category: 'history', region: 'israel', significance: 3 },
  // 以色列间隙补充
  { id: 'il030', year: -1200, endYear: -1020, title: '士师时代', description: '以色列部落定居迦南后约180年的无王时期，底波拉、基甸、参孙等士师领导抵抗外敌。', category: 'history', region: 'israel', significance: 1 },
  { id: 'il031', year: -63, endYear: -37, title: '罗马共和国控制期', description: '庞培攻占耶路撒冷后犹太成为罗马附庸，哈斯蒙尼末裔在罗马扶持下名义统治。', category: 'history', region: 'israel', significance: 1 },
  { id: 'il032', year: -4, endYear: 135, title: '罗马直辖·犹太起义时代', description: '希律死后犹太被分割为罗马行省，经历耶稣时代、第一次犹太起义（70年圣殿被毁）和巴尔·科赫巴起义（135年）。', category: 'history', region: 'israel', significance: 2 },
]

// 批量设置图片兜底
const makeEventImage = (eventId: string) => `https://picsum.photos/seed/chrono-${eventId}/1200/800`
for (const event of israelHistoryEvents) {
  if (!event.image) {
    event.image = makeEventImage(event.id)
  }
}
