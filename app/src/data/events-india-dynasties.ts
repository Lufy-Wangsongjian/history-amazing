import type { HistoricalEvent } from './types'

// ═══════════════════════════════════════════════════════════════════
//  印度王朝历史事件（按王朝演变系统细化）
//
//  ID 规则: in + 三位数字，从 in001 开始
//  所有 region 统一为 'india'（除特别注明 'pakistan' 等）
// ═══════════════════════════════════════════════════════════════════

export const indiaDynastyEvents: HistoricalEvent[] = [

  // ─── 印度河流域文明 / 哈拉帕文明（约前 3300 – 前 1300）─────
  {
    id: 'in001', year: -3300, endYear: -1300, title: '印度河流域文明（哈拉帕文明）',
    description: '人类最早的城市文明之一，在印度河流域建造了哈拉帕和摩亨佐-达罗等高度规划的城市，拥有先进的排水系统和标准化度量衡。',
    details: '哈拉帕文明覆盖面积约130万平方公里，超过同期的埃及和美索不达米亚文明。城市采用严格的网格状道路规划，砖块尺寸标准化（长宽高比例为4:2:1），公共浴池和精密的排水系统表明了极高的城市管理水平。至今未能破解的印度河铭文约有400个符号，是考古学的重大谜题之一。约前1900年起文明逐渐衰落，原因可能包括气候变化导致的萨拉斯瓦蒂河干涸和季风模式改变。',
    category: 'architecture', region: 'pakistan', significance: 3,
    image: 'https://picsum.photos/seed/chrono-in001/1200/800',
  },
  {
    id: 'in002', year: -2600, title: '摩亨佐-达罗城市鼎盛',
    description: '摩亨佐-达罗（"死者之丘"）达到鼎盛期，人口约4万，大浴场、谷仓和行政建筑展示了复杂的社会组织。',
    details: '大浴场长12米、宽7米、深2.5米，周围有更衣室和地下排水管，可能用于宗教沐浴仪式。出土的"祭司王"半身像和"舞女"青铜像是南亚最早的艺术杰作。城市中没有发现宫殿或巨型神庙，暗示其可能采用了不同于两河流域的权力结构。',
    category: 'architecture', region: 'pakistan', significance: 2,
    image: 'https://picsum.photos/seed/chrono-in002/1200/800',
    relatedIds: ['in001'],
  },

  // ─── 吠陀时代（约前 1500 – 前 600）──────────────────
  {
    id: 'in003', year: -1500, endYear: -1000, title: '早期吠陀时代·雅利安人迁入',
    description: '印度-雅利安人从中亚经开伯尔山口进入印度次大陆，带来了吠陀宗教、梵语和种姓制度的雏形，编纂了最古老的宗教文献《梨俱吠陀》。',
    details: '《梨俱吠陀》包含1028首赞美诗，是人类最早的宗教文献之一。早期吠陀社会以部落为单位、以畜牧为主，"罗阇"（部落首领）通过选举产生。瓦尔那（种姓）制度此时尚未僵化——婆罗门、刹帝利、吠舍三等级之间存在流动性。火祭仪式（阿耆尼火祭）是核心宗教活动。',
    category: 'religion', region: 'india', significance: 3,
    image: 'https://picsum.photos/seed/chrono-in003/1200/800',
  },
  {
    id: 'in004', year: -1000, endYear: -600, title: '晚期吠陀时代·列国形成',
    description: '雅利安人东迁至恒河平原，农业社会取代畜牧经济，部落逐渐发展为王国，种姓制度日趋固化，《奥义书》哲学革命开始。',
    details: '铁器的使用使恒河流域的密林得到开垦，稻作农业蓬勃发展。《奥义书》（约前800-500年编纂）标志着印度哲学的根本性转向——从外在的祭祀仪式转向内在的灵魂探索，提出了"梵我一如"（Brahman即Atman）的核心思想，为后来的佛教和耆那教提供了思想土壤。',
    category: 'philosophy', region: 'india', significance: 2,
    image: 'https://picsum.photos/seed/chrono-in004/1200/800',
    relatedIds: ['in003'],
  },

  // ─── 十六大国与沙门思潮（前 600 – 前 322）──────────
  {
    id: 'in005', year: -600, endYear: -322, title: '十六大国时代（摩诃阇那波陀）',
    description: '恒河平原出现十六个强大的王国和共和国，摩揭陀国逐渐崛起为最强势力，城市文明和商业经济蓬勃发展。',
    details: '十六大国中既有君主制王国（如摩揭陀、俱萨罗），也有贵族共和制（如跋耆联邦、释迦族共和国）。摩揭陀的首都王舍城（后迁至华氏城）成为北印度政治中心。此时恒河流域出现了大规模的铸币、行会组织和远程贸易网络。',
    category: 'history', region: 'india', significance: 2,
    image: 'https://picsum.photos/seed/chrono-in005/1200/800',
  },
  {
    id: 'in006', year: -563, title: '释迦牟尼诞生',
    description: '悉达多·乔达摩（释迦牟尼）诞生于释迦族共和国的蓝毗尼（今尼泊尔境内），后创立佛教，成为影响亚洲数十亿人的伟大宗教。',
    details: '悉达多是释迦族首领之子，29岁出家求道，35岁在菩提伽耶菩提树下悟道，此后45年间行走于恒河平原传法。他提出的"四圣谛""八正道"和"缘起"学说构成了佛教哲学的核心。他的教导打破了婆罗门种姓垄断宗教权力的传统，向所有人开放了解脱之道。',
    category: 'religion', region: 'india', significance: 3, figure: '释迦牟尼',
    image: 'https://picsum.photos/seed/chrono-in006/1200/800',
    relatedIds: ['in005'],
  },
  {
    id: 'in007', year: -540, title: '摩诃毗罗与耆那教',
    description: '大雄摩诃毗罗创立耆那教，宣扬极端的非暴力（阿含萨）和苦行主义，成为印度文明的重要组成部分。',
    details: '耆那教的"非暴力"理念走得比佛教更远——虔诚的耆那教徒走路扫地以免踩死昆虫，蒙住口鼻以免吸入微生物。耆那教将宇宙视为永恒存在、无需创造者，通过严格的苦行和道德修持追求灵魂的解脱。',
    category: 'religion', region: 'india', significance: 2, figure: '摩诃毗罗',
    image: 'https://picsum.photos/seed/chrono-in007/1200/800',
  },
  {
    id: 'in008', year: -362, endYear: -321, title: '难陀王朝·摩揭陀霸权',
    description: '低种姓出身的摩诃帕德马·难陀建立难陀王朝，以强大的军事力量统一了恒河平原大部分地区，为孔雀帝国的统一奠定基础。',
    details: '难陀王朝据说拥有20万步兵、2万骑兵和数千头战象的庞大军队。亚历山大大帝东征至旁遮普后，正是因为士兵听闻难陀军队的规模而拒绝继续前进。难陀王朝虽然军力强大但统治残暴，最终被旃陀罗笈多推翻。',
    category: 'history', region: 'india', significance: 1, figure: '摩诃帕德马·难陀',
    image: 'https://picsum.photos/seed/chrono-in008/1200/800',
    relatedIds: ['in009'],
  },

  // ─── 孔雀帝国（前 322 – 前 185）──────────────────
  {
    id: 'in009', year: -322, endYear: -185, title: '孔雀帝国建立·旃陀罗笈多',
    description: '旃陀罗笈多在谋臣考底利耶（《利论》作者）辅佐下推翻难陀王朝，建立了印度历史上第一个统一大帝国——孔雀帝国。',
    details: '旃陀罗笈多击退了亚历山大部将塞琉古的入侵，通过和约获得了阿富汗和俾路支斯坦的广大领土。考底利耶的《利论》（Arthashastra）是世界上最早的政治学和国家治理专著之一，详细论述了间谍网络、外交策略和经济管理。帝国首都华氏城（今巴特那）据希腊使节梅伽斯提尼记载，是当时世界上最大的城市之一。',
    category: 'history', region: 'india', significance: 3, figure: '旃陀罗笈多',
    image: 'https://picsum.photos/seed/chrono-in009/1200/800',
    relatedIds: ['in008', 'in010'],
  },
  {
    id: 'in010', year: -268, endYear: -232, title: '阿育王·佛教帝王',
    description: '阿育王在羯陵伽战争的屠杀中幡然悔悟，皈依佛教，以"达摩"（正法）治国，在全国竖立石柱和岩刻，派遣传教团将佛教传播到斯里兰卡和中亚。',
    details: '羯陵伽战争（前261年）造成约10万人死亡、15万人被掳。阿育王为此深感痛悔，此后放弃了武力扩张。他在全国各地树立的石柱和岩壁诏令用多种文字（包括婆罗米文和佉卢文）记录了他的治国理念：尊重所有宗教、保护动物、建造医院和道路。阿育王的狮子柱头成为现代印度的国徽。',
    category: 'history', region: 'india', significance: 3, figure: '阿育王',
    image: 'https://picsum.photos/seed/chrono-in010/1200/800',
    relatedIds: ['in009'],
  },

  // ─── 后孔雀时代：贵霜与百乘（前 185 – 约 320）──────
  {
    id: 'in011', year: -185, title: '巽伽王朝·孔雀帝国瓦解后的北印度',
    description: '孔雀帝国末代皇帝被将军普希亚密特拉·巽伽刺杀，巽伽王朝取而代之。普希亚密特拉复兴了婆罗门教，标志着佛教在北印度影响力的首次衰退。',
    details: '巽伽王朝统治了约112年。此时北印度面临希腊-巴克特里亚王国的入侵，印度-希腊文化交流产生了独特的犍陀罗艺术风格——希腊雕塑技法被用于表现佛教题材。桑奇大塔在此时期得到扩建，成为佛教建筑的典范。',
    category: 'history', region: 'india', significance: 1, figure: '普希亚密特拉·巽伽',
    image: 'https://picsum.photos/seed/chrono-in011/1200/800',
  },
  {
    id: 'in012', year: 30, endYear: 375, title: '百乘王朝（萨塔瓦哈纳）·德干霸主',
    description: '百乘王朝统治德干高原约四百年，控制了印度洋贸易通道，是南北印度文化交流的关键桥梁。',
    details: '百乘王朝（又称安德拉王朝）是第一个在德干高原建立大帝国的势力。他们控制了从阿拉伯海到孟加拉湾的贸易通道，与罗马帝国有大量海上贸易（大量罗马金币在南印度出土）。国王乔达密普特拉·萨塔卡尼击退了斯基泰人的入侵，阿旃陀石窟的最早洞窟也开凿于此时期。',
    category: 'history', region: 'india', significance: 2,
    image: 'https://picsum.photos/seed/chrono-in012/1200/800',
  },
  {
    id: 'in013', year: 78, endYear: 250, title: '贵霜帝国·迦腻色伽大王',
    description: '中亚月氏人建立的贵霜帝国在迦腻色伽统治时期达到鼎盛，疆域从阿富汗延伸至恒河平原，丝绸之路贸易繁荣，犍陀罗佛教艺术达到巅峰。',
    details: '迦腻色伽大力护持佛教，据传召集了第四次佛教集结。贵霜帝国是丝绸之路上的关键枢纽，连接了罗马、波斯、中亚和中国。犍陀罗艺术在此时创造了最早的佛陀人形雕像——此前佛教艺术从不直接描绘佛陀本人，只用脚印、菩提树等象征物代替。贵霜钱币上同时出现了希腊、波斯、印度和佛教的神祇形象，体现了罕见的文化包容。',
    category: 'art', region: 'india', significance: 3, figure: '迦腻色伽',
    image: 'https://picsum.photos/seed/chrono-in013/1200/800',
  },

  // ─── 笈多帝国·印度古典黄金时代（约 320 – 550）────────
  {
    id: 'in014', year: 320, endYear: 550, title: '笈多帝国建立·旃陀罗笈多一世',
    description: '旃陀罗笈多一世通过联姻和征服建立笈多帝国，开启了印度历史上公认的"黄金时代"——科学、文学、艺术和哲学全面繁荣。',
    details: '笈多帝国初期通过与梨车毗族的联姻获得了政治合法性。帝国采用了较松散的封建体制——中央直辖区之外的领地由附庸王统治。笈多时期铸造的金币以精美的艺术表现闻名，钱币上的萨摩陀罗笈多被描绘为弹琵琶的形象，体现了笈多帝王文武兼备的理想。',
    category: 'history', region: 'india', significance: 3, figure: '旃陀罗笈多一世',
    image: 'https://picsum.photos/seed/chrono-in014/1200/800',
    relatedIds: ['in015', 'in016'],
  },
  {
    id: 'in015', year: 380, endYear: 415, title: '旃陀罗笈多二世·超日王',
    description: '超日王时代笈多帝国达到极盛，疆域涵盖几乎整个北印度。中国僧人法显到访，记载了帝国的繁荣与安定。',
    details: '法显在《佛国记》中记载了笈多帝国的社会风貌：道路安全、人民富庶、刑法宽松。超日王击败了西部的斯基泰人（塞迦），将帝国版图扩展至阿拉伯海沿岸。传说中的"九宝"宫廷汇聚了迦梨陀娑（最伟大的梵语诗人）、阿耶波多（天文学家）等杰出人才。',
    category: 'history', region: 'india', significance: 2, figure: '旃陀罗笈多二世/超日王',
    image: 'https://picsum.photos/seed/chrono-in015/1200/800',
    relatedIds: ['in014'],
  },
  {
    id: 'in016', year: 400, title: '笈多时代科学成就·阿耶波多',
    description: '笈多时代的数学家阿耶波多提出地球自转说和日月食科学解释，发展了零的概念和十进制计数法——改变了人类文明的数学基础。',
    details: '阿耶波多（476-550年）在29岁时写成《阿耶波多历》，其中用梵语韵文表述了圆周率的近似值（3.1416），提出地球绕轴自转（而非天穹转动），并给出了正弦函数表。印度数字系统（包括零的概念和位值制）后经阿拉伯人传入欧洲，成为全世界通用的"阿拉伯数字"——这可能是印度对人类文明最深远的贡献。',
    category: 'science', region: 'india', significance: 3, figure: '阿耶波多',
    image: 'https://picsum.photos/seed/chrono-in016/1200/800',
  },
  {
    id: 'in017', year: 455, title: '嚈哒人入侵·笈多帝国衰落',
    description: '中亚游牧民族嚈哒人（白匈奴）大举入侵北印度，重创笈多帝国，帝国进入缓慢解体过程。',
    details: '嚈哒首领托拉马纳和密希拉古拉的入侵极具破坏性——大量佛教寺院被毁，那烂陀寺险遭破坏。虽然笈多帝国和附庸国最终击退了嚈哒人，但帝国的中央权威已不可恢复，此后北印度再次陷入群雄割据。',
    category: 'warfare', region: 'india', significance: 2,
    image: 'https://picsum.photos/seed/chrono-in017/1200/800',
  },

  // ─── 后笈多时代：戒日王与南印度诸王朝（550 – 1206）──
  {
    id: 'in018', year: 606, endYear: 647, title: '戒日王·最后的北印度统一者',
    description: '戒日王（哈沙·瓦尔达纳）统一了北印度大部，以曲女城为都。玄奘在此期间到访印度，留下了珍贵的历史记录。',
    details: '玄奘在《大唐西域记》中详细记录了戒日王的统治和印度社会。戒日王本人精通梵语文学，创作了三部戏剧。他在曲女城举办的大规模佛教法会据传集合了数十万人。然而戒日王死后帝国立即瓦解，说明其统一主要依赖个人魅力而非制度建设。',
    category: 'history', region: 'india', significance: 2, figure: '戒日王/玄奘',
    image: 'https://picsum.photos/seed/chrono-in018/1200/800',
  },
  {
    id: 'in019', year: 600, endYear: 900, title: '帕拉瓦王朝·南印度石窟建筑',
    description: '帕拉瓦王朝统治今泰米尔纳德邦地区，在马马拉普拉姆开凿了壮观的海岸神庙和石窟，将达罗毗荼建筑艺术推向第一个高峰。',
    details: '帕拉瓦国王那罗辛诃跋摩一世（别称"摩亨德拉"）在马马拉普拉姆的花岗岩崖壁上开凿了五座整石雕刻的"五座战车"（Pancha Rathas），以及著名的"阿周那的苦行"浮雕——长29米、高13米，是世界上最大的岩石浮雕之一。帕拉瓦建筑风格深刻影响了后来的朱罗王朝和东南亚的高棉帝国。',
    category: 'architecture', region: 'india', significance: 2,
    image: 'https://picsum.photos/seed/chrono-in019/1200/800',
  },
  {
    id: 'in020', year: 850, endYear: 1279, title: '朱罗帝国·海上强国',
    description: '朱罗王朝在拉贾拉贾一世和拉金德拉一世统治下发展为南亚最强大的海上帝国，海军远征斯里兰卡、马尔代夫乃至东南亚的苏门答腊。',
    details: '拉贾拉贾一世（985-1014年在位）建造了坦贾武尔的布里哈迪斯瓦拉大神庙——花岗岩塔高66米，顶部巨石重80吨，是达罗毗荼建筑的巅峰之作。其子拉金德拉一世的海军远征至苏门答腊的三佛齐帝国，控制了马六甲海峡的贸易通道。朱罗帝国的青铜雕塑（尤其是湿婆"舞王"像）是印度艺术的最高成就之一。',
    category: 'history', region: 'india', significance: 3, figure: '拉贾拉贾一世',
    image: 'https://picsum.photos/seed/chrono-in020/1200/800',
  },
  {
    id: 'in021', year: 750, endYear: 1174, title: '帕拉王朝·佛教最后的护持者',
    description: '帕拉王朝统治孟加拉和比哈尔地区，是印度最后一个大力护持佛教的王朝，那烂陀寺和超戒寺在此时期达到学术巅峰。',
    details: '那烂陀寺（意为"莲花之地"）是古代世界最大的大学，鼎盛时期有上万名学生和两千名教师，图书馆藏书号称"九层楼高"。帕拉时期发展出的佛教密宗和独特的帕拉-塞纳艺术风格对西藏、东南亚的佛教艺术产生了深远影响。1193年巴赫提亚尔·赫尔吉攻陷那烂陀寺，佛教在印度本土基本消亡。',
    category: 'religion', region: 'india', significance: 2,
    image: 'https://picsum.photos/seed/chrono-in021/1200/800',
  },

  // ─── 德里苏丹国（1206 – 1526）─────────────────
  {
    id: 'in022', year: 1206, endYear: 1526, title: '德里苏丹国建立',
    description: '古尔王朝将领库特布丁·艾巴克建立奴隶王朝，开启了德里苏丹国时代——穆斯林统治者首次在印度建立了持久的政权，历经五个王朝更替。',
    details: '德里苏丹国先后经历了奴隶王朝（1206-1290）、卡尔吉王朝（1290-1320）、图格鲁克王朝（1320-1414）、赛义德王朝（1414-1451）和洛迪王朝（1451-1526）五个朝代。库特布丁·艾巴克修建了德里的库特布塔（高72.5米，至今是世界上最高的砖砌宣礼塔），象征伊斯兰统治的确立。',
    category: 'history', region: 'india', significance: 3, figure: '库特布丁·艾巴克',
    image: 'https://picsum.photos/seed/chrono-in022/1200/800',
  },
  {
    id: 'in023', year: 1296, endYear: 1316, title: '阿拉丁·卡尔吉·德里苏丹国极盛',
    description: '阿拉丁·卡尔吉将苏丹国版图扩展至南印度，击退了蒙古帝国对印度的多次入侵，实施了严格的价格管控和情报系统。',
    details: '阿拉丁至少击退了六次蒙古入侵，保住了印度免遭蒙古铁蹄的蹂躏。他的名将马利克·卡富尔率军深入南印度，从德干直打到马杜赖，掠夺了大量财富。他建立了极为高效的市场监管制度——粮价、布价和牲口价均受官方管制，违者重惩。',
    category: 'warfare', region: 'india', significance: 2, figure: '阿拉丁·卡尔吉',
    image: 'https://picsum.photos/seed/chrono-in023/1200/800',
  },
  {
    id: 'in024', year: 1336, endYear: 1646, title: '毗奢耶那伽罗帝国·南印度抵抗',
    description: '哈里哈拉一世和布卡一世在通加巴德拉河南岸建立毗奢耶那伽罗帝国，成为南印度抵御德里苏丹国和德干苏丹国扩张的最后堡垒。',
    details: '毗奢耶那伽罗（意为"胜利之城"）鼎盛时期是全球最大的城市之一，波斯和葡萄牙旅行者对其繁华赞叹不已。帝国在克里希纳德瓦拉亚（1509-1529年在位）统治下达到巅峰，他被视为泰卢固语文学的黄金时代的缔造者。1565年塔利科塔战役中帝国惨败于德干苏丹国联军，首都被彻底摧毁。',
    category: 'history', region: 'india', significance: 2, figure: '克里希纳德瓦拉亚',
    image: 'https://picsum.photos/seed/chrono-in024/1200/800',
  },

  // ─── 莫卧儿帝国（1526 – 1857）──────────────────
  {
    id: 'in025', year: 1526, title: '帕尼帕特战役·莫卧儿帝国建立',
    description: '帖木儿后裔巴布尔在第一次帕尼帕特战役中以火炮和骑兵配合战术击败洛迪苏丹，建立了莫卧儿帝国。',
    details: '巴布尔仅有约1.2万兵力对阵洛迪的约10万大军和1000头战象。他将火炮用牛车连接成防线，骑兵从两翼包抄，首创了印度战场上火器与骑兵的协同作战。巴布尔同时是一位杰出的文学家，他的自传《巴布尔纳玛》以突厥语写成，被认为是世界上第一部真正的自传体文学作品。',
    category: 'warfare', region: 'india', significance: 3, figure: '巴布尔',
    image: 'https://picsum.photos/seed/chrono-in025/1200/800',
    relatedIds: ['in026'],
  },
  {
    id: 'in026', year: 1556, endYear: 1605, title: '阿克巴大帝·宗教宽容',
    description: '阿克巴是莫卧儿帝国最伟大的皇帝，统一了印度大部分地区，推行宗教宽容政策，废除了对非穆斯林的吉兹亚税，创建了融合各宗教元素的"圣教"。',
    details: '阿克巴13岁即位，在摄政大臣拜拉姆汗辅佐下巩固了政权。他的统治创新包括：建立了以"曼萨布达尔"（军衔-俸禄）制度为基础的官僚体系；推行"苏赫·库勒"（普遍和平）政策，任命印度教徒（如拉杰普特人）担任高级军政职务；在法特赫普尔·西克里建造了融合伊斯兰和印度建筑风格的新都。他在宫廷中举办各宗教领袖的辩论会，试图找到各宗教的共同真理。',
    category: 'history', region: 'india', significance: 3, figure: '阿克巴',
    image: 'https://picsum.photos/seed/chrono-in026/1200/800',
    relatedIds: ['in025', 'in027'],
  },
  {
    id: 'in027', year: 1632, endYear: 1653, title: '泰姬陵建造',
    description: '莫卧儿皇帝沙贾汗为悼念亡妻穆姆塔兹·玛哈尔建造泰姬陵，动用两万工匠历时22年完成，被誉为"永恒面颊上的一滴眼泪"。',
    details: '泰姬陵以白色大理石建造，镶嵌了来自中国的绿松石、斯里兰卡的蓝宝石、阿拉伯的珊瑚等28种宝石。建筑采用了严格的轴对称设计，四座宣礼塔微微外倾以防地震时倒向主体。泰戈尔称之为"永恒面颊上的一滴眼泪"。传说沙贾汗计划在对岸用黑色大理石建造自己的陵墓，但被儿子奥朗则布推翻后囚禁至死。',
    category: 'architecture', region: 'india', significance: 3, figure: '沙贾汗',
    image: 'https://picsum.photos/seed/chrono-in027/1200/800',
    relatedIds: ['in026'],
  },
  {
    id: 'in028', year: 1658, endYear: 1707, title: '奥朗则布·帝国极盛与衰落之始',
    description: '奥朗则布通过夺位战争囚禁父亲沙贾汗、处死兄弟继位。他将帝国版图扩展至南印度最南端（几乎统一整个次大陆），但恢复了宗教压迫政策，引发马拉塔、锡克和拉杰普特人的持续叛乱。',
    details: '奥朗则布恢复征收吉兹亚税、摧毁印度教神庙，逆转了阿克巴的宽容政策。他在德干与马拉塔帝国进行了长达27年的消耗战（1681-1707），虽然军事上占据优势但始终无法彻底平定。这场旷日持久的战争耗尽了帝国财力，他死后莫卧儿帝国迅速走向瓦解。',
    category: 'history', region: 'india', significance: 2, figure: '奥朗则布',
    image: 'https://picsum.photos/seed/chrono-in028/1200/800',
    relatedIds: ['in029'],
  },

  // ─── 马拉塔帝国与锡克帝国（1674 – 1849）──────────
  {
    id: 'in029', year: 1674, endYear: 1818, title: '马拉塔帝国·希瓦吉建国',
    description: '马拉塔民族英雄希瓦吉利用德干高原的山地地形对抗莫卧儿帝国，建立了马拉塔联盟，最终取代莫卧儿成为印度次大陆最强大的本土势力。',
    details: '希瓦吉以游击战术闻名——"山鼠战术"让莫卧儿军队疲于奔命。他1674年在赖加德堡加冕为"恰特拉帕蒂"（至尊皇帝），建立了高效的海军和行政体系。希瓦吉之后马拉塔以"佩什瓦"（首相）家族为实际统治者，形成了庞大的联盟体制。1761年帕尼帕特第三次战役马拉塔惨败于阿富汗的阿赫默德·沙·杜兰尼，此后联盟日趋松散，最终在三次英马战争（1775-1818）中被英国征服。',
    category: 'history', region: 'india', significance: 3, figure: '希瓦吉',
    image: 'https://picsum.photos/seed/chrono-in029/1200/800',
    relatedIds: ['in028'],
  },
  {
    id: 'in030', year: 1799, endYear: 1849, title: '锡克帝国·兰吉特·辛格',
    description: '兰吉特·辛格统一旁遮普各锡克势力，建立强大的锡克帝国，拥有南亚最现代化的军队，是抵御英国扩张的最后一个印度本土强权。',
    details: '兰吉特·辛格被称为"旁遮普之狮"。他建立了一支由法国和意大利军官训练的现代化军队（哈尔萨军队），拥有欧洲式的炮兵和步兵操练。帝国以宗教宽容著称——锡克教徒、穆斯林和印度教徒均在政府中担任要职。他1839年去世后帝国陷入内乱，在两次英锡战争（1845-1849）后被英国吞并。',
    category: 'history', region: 'india', significance: 2, figure: '兰吉特·辛格',
    image: 'https://picsum.photos/seed/chrono-in030/1200/800',
  },

  // ─── 英属印度（1757 – 1947）──────────────────
  {
    id: 'in031', year: 1757, title: '普拉西战役·英国殖民统治开端',
    description: '英国东印度公司军官罗伯特·克莱武在普拉西战役中击败孟加拉纳瓦布，英国通过商业公司实现了对印度的殖民控制。',
    details: '这场战役更多是一场阴谋而非正面交锋——克莱武事先收买了纳瓦布的将领米尔·贾法尔，战场上大部分孟加拉军队倒戈。此后东印度公司获得了孟加拉的税收权（迪瓦尼），利用印度的巨大财富资助了进一步的军事扩张。',
    category: 'warfare', region: 'india', significance: 3, figure: '罗伯特·克莱武',
    image: 'https://picsum.photos/seed/chrono-in031/1200/800',
  },
  {
    id: 'in032', year: 1857, title: '印度民族大起义（第一次独立战争）',
    description: '印度士兵（sepoy）因新型恩菲尔德步枪子弹涂有猪油和牛油而起义，迅速演变为大规模的反英民族起义，几乎动摇了英国在印度的统治。',
    details: '起义从密拉特爆发后迅速蔓延至德里、勒克瑙、坎普尔等地。起义军一度拥立莫卧儿末代皇帝巴哈杜尔·沙·扎法尔为领袖。英国花了14个月才镇压起义，随后解散了东印度公司，由英国王室直接统治印度（建立英属印度帝国，维多利亚女王1877年加冕为"印度女皇"）。',
    category: 'warfare', region: 'india', significance: 3,
    image: 'https://picsum.photos/seed/chrono-in032/1200/800',
  },
  {
    id: 'in033', year: 1885, title: '印度国民大会党成立',
    description: '印度国民大会党（国大党）在孟买成立，最初是温和派精英组织，后来发展为领导印度独立运动的核心政治力量。',
    details: '国大党最初由退休英国官员艾伦·奥克塔维安·休谟发起创建，早期以请愿和温和改良为主。1905年孟加拉分治事件引发了大规模抵制英货运动（斯瓦德希运动），国大党开始激进化。此后在提拉克、甘地和尼赫鲁等领袖的领导下，国大党成为亚洲最成功的反殖民运动组织。',
    category: 'history', region: 'india', significance: 2,
    image: 'https://picsum.photos/seed/chrono-in033/1200/800',
  },
  {
    id: 'in034', year: 1919, title: '阿姆利则惨案',
    description: '英国戴尔将军下令向旁遮普阿姆利则贾利安瓦拉巴格广场上和平集会的民众开枪，造成至少379人死亡、1200多人受伤，震惊世界并彻底激化了独立运动。',
    details: '集会民众被困在四面围墙的封闭广场内，戴尔下令士兵向人群最密集处射击，持续约10分钟，打了1650发子弹。惨案发生后泰戈尔放弃了英国授予的爵位以示抗议，甘地开始领导全面的非合作运动。这一事件被视为英国在印度道德权威崩塌的转折点。',
    category: 'history', region: 'india', significance: 2,
    image: 'https://picsum.photos/seed/chrono-in034/1200/800',
    relatedIds: ['in035'],
  },
  {
    id: 'in035', year: 1930, title: '甘地食盐长征',
    description: '甘地率领78名追随者从萨巴尔马蒂修行林步行388公里至丹迪海岸，公开制盐以抗议英国的盐税垄断，掀起了席卷全印度的"公民不服从运动"。',
    details: '食盐长征是甘地"非暴力不合作"运动的标志性事件。英国的盐税垄断使每个印度人——无论贫富——都成了受害者，甘地巧妙地选择了这个能团结所有阶层的议题。长征期间全世界媒体持续报道，极大地损害了英国统治的国际形象。约6万人因参与运动被逮捕。',
    category: 'history', region: 'india', significance: 3, figure: '甘地',
    image: 'https://picsum.photos/seed/chrono-in035/1200/800',
  },

  // ─── 独立与现代印度（1947 – 至今）────────────────
  {
    id: 'in036', year: 1947, title: '印巴分治与印度独立',
    description: '1947年8月15日，印度从英国统治下独立，但同时伴随着印巴分治——根据宗教人口划分为印度和巴基斯坦两个国家，分治引发了人类历史上最大规模的人口迁徙和惨烈的教派暴力。',
    details: '约1500万人在印巴之间被迫迁徙，约100-200万人在分治暴力中丧生。旁遮普和孟加拉两省被一分为二，数百万家庭离散。律师西里尔·拉德克利夫在短短五周内就划定了3000多公里的边界线——他从未去过印度。1948年1月30日，甘地因反对教派暴力而被印度教极端主义者暗杀。',
    category: 'history', region: 'india', significance: 3, figure: '尼赫鲁/甘地/蒙巴顿',
    image: 'https://picsum.photos/seed/chrono-in036/1200/800',
  },
  {
    id: 'in037', year: 1950, title: '印度宪法生效·共和国建立',
    description: '印度宪法于1950年1月26日生效，印度成为主权民主共和国。宪法由安贝德卡尔主持起草，是世界上最长的成文宪法。',
    details: '安贝德卡尔本人出身于"不可接触者"（达利特）阶层，他将废除种姓歧视写入宪法基本权利中。印度宪法确立了议会民主制、世俗主义、联邦制和社会主义四大原则。1月26日被定为"共和国日"（区别于8月15日的独立日），纪念印度从英王统治的自治领正式转变为人民主权的共和国。',
    category: 'history', region: 'india', significance: 3, figure: '安贝德卡尔',
    image: 'https://picsum.photos/seed/chrono-in037/1200/800',
  },
  {
    id: 'in038', year: 1991, title: '经济自由化改革',
    description: '在严重的国际收支危机下，财政部长曼莫汉·辛格推行经济自由化改革，拆除了"许可证制度"的官僚壁垒，开放了外资投资，启动了印度经济的高速增长。',
    details: '1991年印度外汇储备仅够支付两周的进口——被迫将黄金空运至英格兰银行做抵押以获取紧急贷款。危机之下曼莫汉·辛格大幅削减关税、取消工业许可证、允许外资直接投资。改革释放了印度的经济潜力：此后印度GDP增速长期保持在6-8%，IT和服务业外包产业蓬勃发展，班加罗尔成为全球科技中心之一。',
    category: 'history', region: 'india', significance: 2, figure: '曼莫汉·辛格',
    image: 'https://picsum.photos/seed/chrono-in038/1200/800',
  },

  // ─── 补充间隙（让时间线连贯）──────────────────────
  {
    id: 'in039', year: -185, endYear: 30, title: '后孔雀时代·巽伽与印度-希腊诸王国',
    description: '孔雀帝国衰落后北印度陷入分裂，巽伽、甘婆、印度-希腊和印度-斯基泰等多个政权并存。',
    category: 'history', region: 'india', significance: 1,
  },
  {
    id: 'in040', year: 550, endYear: 606, title: '后笈多时代·北印度碎片化',
    description: '笈多帝国瓦解后嚈哒人被逐，北印度分裂为多个小王国，直到戒日王短暂统一。',
    category: 'history', region: 'india', significance: 1,
  },
  {
    id: 'in041', year: 647, endYear: 1206, title: '拉杰普特时代·诸王争霸',
    description: '戒日王死后至德里苏丹国建立前的近600年间，拉杰普特武士王国（如普拉蒂哈拉、朱罗、帕拉）割据北南印度。',
    category: 'history', region: 'india', significance: 2,
  },
  {
    id: 'in042', year: 1526, endYear: 1857, title: '莫卧儿帝国（完整时期）',
    description: '从巴布尔建国到末代皇帝巴哈杜尔·沙被英国废黜，莫卧儿帝国统治印度超过330年。',
    category: 'history', region: 'india', significance: 3, figure: '巴布尔/阿克巴/沙贾汗',
  },
  {
    id: 'in043', year: 1757, endYear: 1947, title: '英属印度（完整时期）',
    description: '从普拉西战役到印度独立，英国对印度的殖民统治持续了190年。',
    category: 'history', region: 'india', significance: 3,
  },
  {
    id: 'in044', year: 1947, endYear: 2030, title: '现代印度共和国',
    description: '从独立到世界最大民主国家，印度经历了尼赫鲁社会主义、英迪拉·甘地时代和1991年经济自由化。',
    category: 'history', region: 'india', significance: 2,
  },
  // 印度间隙补充
  { id: 'in045', year: -232, endYear: -185, title: '孔雀帝国晚期', description: '阿育王之后孔雀帝国迅速衰落，中央控制力瓦解，约50年后被将领推翻。', category: 'history', region: 'india', significance: 1 },
  { id: 'in046', year: 250, endYear: 320, title: '后贵霜·西总督与地方王国', description: '贵霜衰落后北印度分裂为多个地方势力（西总督、纳加人等），直到笈多崛起。', category: 'history', region: 'india', significance: 1 },
  { id: 'in047', year: 415, endYear: 550, title: '笈多晚期与嚈哒入侵', description: '超日王后笈多帝国渐衰，嚈哒人入侵重创北印度，帝国约550年终结。', category: 'history', region: 'india', significance: 1 },
  { id: 'in048', year: 1849, endYear: 1947, title: '英属印度（后期殖民统治）', description: '锡克帝国被吞并后英国完成对整个次大陆的控制，直至1947年独立。', category: 'history', region: 'india', significance: 2 },
]

// 批量设置图片兜底
const makeEventImage = (eventId: string) => `https://picsum.photos/seed/chrono-${eventId}/1200/800`
for (const event of indiaDynastyEvents) {
  if (!event.image) {
    event.image = makeEventImage(event.id)
  }
}
