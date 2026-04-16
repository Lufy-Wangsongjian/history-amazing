/**
 * Enrichment 15 — 荷兰/低地国家 · 西班牙 · 哈布斯堡 · 东欧专题
 */
import type { HistoricalEvent } from './types'

/* ═══════════════════════════════════════════════
   荷兰 / 低地国家 事件（+15）
   ═══════════════════════════════════════════════ */
export const netherlandsEvents: HistoricalEvent[] = [
  {
    id: 'nl001', year: 1356, title: '汉萨同盟与布鲁日',
    description: '布鲁日成为北海贸易中心，佛兰德呢绒闻名欧洲，低地国家的商业文明开始崛起。',
    category: 'history', region: 'belgium', significance: 2,
    details: '布鲁日不仅是贸易港口，更是欧洲最早的国际金融中心之一——"bourse"（证券交易所）一词就源于布鲁日的范德布尔斯家族。',
  },
  {
    id: 'nl002', year: 1477, title: '勃艮第公国终结与哈布斯堡接管',
    description: '勇士查理战死南锡，低地国家通过联姻落入哈布斯堡家族之手。',
    category: 'history', region: 'netherlands', significance: 2,
  },
  {
    id: 'nl003', year: 1566, title: '破坏圣像运动',
    description: '新教徒在低地国家大规模摧毁天主教教堂的圣像和装饰，标志着荷兰独立战争的序幕。',
    category: 'religion', region: 'netherlands', significance: 2,
    details: '这场"圣像破坏风暴"在短短数周内席卷了整个低地国家，超过400座教堂被毁。它既是宗教改革的激进表达，也是对西班牙统治的政治抗议。',
  },
  {
    id: 'nl004', year: 1568, title: '八十年战争爆发',
    description: '荷兰人在沉默者威廉领导下起兵反抗西班牙统治，开启了持续80年的独立战争。',
    category: 'warfare', region: 'netherlands', significance: 3,
    details: '这是欧洲历史上持续时间最长的独立战争之一。荷兰人利用水利工程——决堤淹没田地——作为军事武器，创造了"以水为兵"的独特战术。',
  },
  {
    id: 'nl005', year: 1579, title: '乌得勒支联盟',
    description: '北方七省签署联盟条约，奠定了荷兰共和国的政治基础。',
    category: 'history', region: 'netherlands', significance: 2,
    details: '乌得勒支联盟是现代联邦制的先驱之一——各省保留高度自治权，但在外交和军事上联合行动。',
  },
  {
    id: 'nl006', year: 1602, title: '荷兰东印度公司成立',
    description: '世界上第一家股份制公司成立，开创了现代资本主义的基本范式。',
    category: 'history', region: 'netherlands', significance: 3,
    details: 'VOC不仅是一家贸易公司——它拥有铸币权、外交权和宣战权，是人类历史上最强大的商业组织。鼎盛时期其市值（按通胀调整）约为现代苹果公司的8倍。',
  },
  {
    id: 'nl007', year: 1637, title: '郁金香狂热',
    description: '荷兰郁金香球茎价格飙升后崩溃，成为人类历史上第一次有记载的投机泡沫。',
    category: 'history', region: 'netherlands', significance: 3,
    details: '在狂热巅峰，一颗"永远的奥古斯都"郁金香球茎可以换一栋阿姆斯特丹运河边的豪宅。这个故事至今仍是金融教科书中"非理性繁荣"的经典案例。',
  },
  {
    id: 'nl008', year: 1648, title: '威斯特伐利亚和约与荷兰独立',
    description: '八十年战争结束，西班牙正式承认荷兰共和国独立，现代国际法体系的基石奠定。',
    category: 'history', region: 'netherlands', significance: 3,
    details: '威斯特伐利亚和约不仅结束了荷兰独立战争和三十年战争，更确立了"国家主权"原则——各国在自己领土内拥有最高权力，这一原则至今仍是国际关系的基础。',
  },
  {
    id: 'nl009', year: 1660, title: '荷兰黄金时代的巅峰',
    description: '伦勃朗、维米尔、斯宾诺莎同时活跃，荷兰在艺术、哲学和科学上达到巅峰。',
    category: 'art', region: 'netherlands', significance: 3,
    figure: '伦勃朗,维米尔,斯宾诺莎',
    details: '一个只有150万人口的小国，同时产生了西方绘画史上最伟大的画家、最深刻的哲学家和最先进的科学仪器制造商。这种文化密度在人类历史上几乎绝无仅有。',
  },
  {
    id: 'nl010', year: 1688, title: '光荣革命——荷兰执政入主英国',
    description: '荷兰执政威廉三世率军渡过英吉利海峡，在几乎不流血的情况下成为英国国王。',
    category: 'history', region: 'netherlands', significance: 3,
    figure: '威廉三世',
    details: '这是历史上最成功的"反向征服"——名义上是英国议会邀请威廉来"保护"新教，实际上荷兰人在政治、金融和军事上深刻改造了英国。',
  },
  {
    id: 'nl011', year: 1795, title: '巴达维亚共和国',
    description: '法国大革命军队入侵荷兰，推翻了持续两个世纪的联省共和国。',
    category: 'history', region: 'netherlands', significance: 2,
  },
  {
    id: 'nl012', year: 1830, title: '比利时独立',
    description: '布鲁塞尔歌剧院的一场演出引发了起义，比利时从荷兰联合王国中分离独立。',
    category: 'history', region: 'belgium', significance: 2,
    details: '导火索是歌剧《波蒂奇的哑女》中"为祖国而死"的咏叹调——观众从剧院冲出直奔街头。这可能是历史上唯一一场由歌剧直接引发的革命。',
  },
  {
    id: 'nl013', year: 1944, title: '饥饿之冬',
    description: '纳粹封锁下的荷兰西部经历了严酷的大饥荒，超过2万人死亡。',
    category: 'history', region: 'netherlands', significance: 2,
    details: '饥饿之冬的幸存者后来为表观遗传学提供了关键证据——他们的后代在数十年后仍表现出与饥荒相关的健康问题，证明了极端环境可以跨代影响基因表达。',
  },
  {
    id: 'nl014', year: 1953, title: '北海大洪水与三角洲工程',
    description: '风暴潮夺走1836条生命，催生了人类历史上最宏大的水利防洪工程。',
    category: 'technology', region: 'netherlands', significance: 2,
    details: '三角洲工程耗时40年，被美国土木工程师学会评为"现代世界七大奇迹"之一。荷兰人与水的千年搏斗，在此达到了技术巅峰。',
  },
  {
    id: 'nl015', year: 2002, title: '荷兰成为全球首个同性婚姻合法化国家',
    description: '荷兰通过立法允许同性婚姻，开启了全球LGBTQ+权利运动的新纪元。',
    category: 'history', region: 'netherlands', significance: 2,
    details: '从17世纪的宗教宽容到21世纪的婚姻平等，荷兰在"少数人权利保护"领域始终走在世界前列。',
  },
]

/* ═══════════════════════════════════════════════
   西班牙 / 伊比利亚 事件（+15）
   ═══════════════════════════════════════════════ */
export const spainEvents: HistoricalEvent[] = [
  {
    id: 'sp001', year: 711, title: '摩尔人入侵伊比利亚',
    description: '穆斯林军队跨越直布罗陀海峡，在短短7年内征服了几乎整个伊比利亚半岛。',
    category: 'warfare', region: 'spain', significance: 3,
    details: '摩尔人的入侵开启了长达近800年的"安达卢斯"时代。这不是简单的征服——伊斯兰、基督教和犹太教在此交融，创造了中世纪欧洲最先进的文明。',
  },
  {
    id: 'sp002', year: 929, title: '科尔多瓦哈里发国',
    description: '阿卜杜勒·拉赫曼三世宣布建立独立哈里发国，科尔多瓦成为西欧最大、最繁华的城市。',
    category: 'history', region: 'spain', significance: 2,
    details: '科尔多瓦拥有70座图书馆、900座公共浴室和50万人口——而同时期的巴黎只有约3万人。这里是当时西欧的知识中心。',
  },
  {
    id: 'sp003', year: 1085, title: '托莱多收复',
    description: '卡斯蒂利亚国王阿方索六世收复托莱多，基督教世界获得了伊斯兰文明的知识宝库。',
    category: 'history', region: 'spain', significance: 2,
    details: '托莱多的翻译学校将阿拉伯语保存的亚里士多德、欧几里得和托勒密著作翻译为拉丁语，直接催化了欧洲的"12世纪文艺复兴"。',
  },
  {
    id: 'sp004', year: 1212, title: '纳瓦斯德托洛萨战役',
    description: '基督教联军在安达卢西亚击溃穆瓦希德军队，收复运动的转折点。',
    category: 'warfare', region: 'spain', significance: 2,
  },
  {
    id: 'sp005', year: 1469, title: '卡斯蒂利亚与阿拉贡联姻',
    description: '伊莎贝拉与费迪南的婚姻统一了伊比利亚半岛两大王国，现代西班牙由此诞生。',
    category: 'history', region: 'spain', significance: 3,
    figure: '伊莎贝拉一世,费迪南二世',
    details: '这对"天主教双王"的联姻改变了世界历史走向——没有这次联姻，就没有1492年的格拉纳达收复和哥伦布远航。',
  },
  {
    id: 'sp006', year: 1492, title: '格拉纳达陷落与犹太人驱逐令',
    description: '收复运动最后一战结束，同年颁布驱逐犹太人的阿尔罕布拉法令。',
    category: 'history', region: 'spain', significance: 3,
    details: '1492年是西班牙历史上最密集的一年：1月格拉纳达陷落，3月驱逐犹太人，8月哥伦布起航。一个帝国的崛起和一场人道灾难发生在同一年。',
  },
  {
    id: 'sp007', year: 1516, title: '哈布斯堡西班牙的开始',
    description: '查理一世（即神圣罗马帝国皇帝查理五世）继承西班牙王位，开启哈布斯堡在西班牙的统治。',
    category: 'history', region: 'spain', significance: 3,
    figure: '查理五世',
    details: '查理五世是历史上地盘最辽阔的欧洲君主——他同时统治着西班牙、荷兰、南意大利、奥地利和美洲殖民地。"在我的帝国里太阳永远不会落下"就是他说的。',
  },
  {
    id: 'sp008', year: 1571, title: '勒班陀海战',
    description: '西班牙领导的神圣同盟舰队在希腊勒班陀击败奥斯曼海军，阻止了奥斯曼在地中海的扩张。',
    category: 'warfare', region: 'spain', significance: 2,
    details: '这是世界上最后一场大型桨帆船海战。塞万提斯在此战中失去了左手的活动能力，后来写出了《堂吉诃德》。',
  },
  {
    id: 'sp009', year: 1588, title: '无敌舰队的覆灭',
    description: '菲利普二世派出的"无敌舰队"在英吉利海峡遭遇惨败，西班牙海上霸权开始动摇。',
    category: 'warfare', region: 'spain', significance: 3,
    details: '130艘战舰中只有67艘返回西班牙。这次失败虽未立即终结西班牙帝国，但它打破了"不可战胜"的神话，为英荷海上崛起打开了空间。',
  },
  {
    id: 'sp010', year: 1605, title: '《堂吉诃德》出版',
    description: '塞万提斯发表了被广泛认为是西方文学史上第一部现代小说的作品。',
    category: 'literature', region: 'spain', significance: 3,
    figure: '塞万提斯',
    details: '堂吉诃德不仅是一个滑稽的骑士——他是人类理想主义与现实主义之间永恒张力的化身。"知道世界是什么样的，但仍然选择它应该是什么样的"——这就是堂吉诃德精神。',
  },
  {
    id: 'sp011', year: 1700, title: '西班牙王位继承战争',
    description: '哈布斯堡西班牙绝嗣，引发欧洲大国混战，波旁王朝入主西班牙。',
    category: 'warfare', region: 'spain', significance: 2,
    details: '这场战争改变了欧洲地图——西班牙失去了荷兰和意大利领地，直布罗陀被英国占领至今。',
  },
  {
    id: 'sp012', year: 1808, title: '半岛战争与西班牙独立战争',
    description: '拿破仑入侵西班牙，激起了全民游击抵抗，"游击战"一词由此诞生。',
    category: 'warfare', region: 'spain', significance: 2,
    details: '"guerrilla"（小战争）一词就是西班牙人在反抗拿破仑时发明的。戈雅的《1808年5月3日》画作永久记录了这场抵抗的残酷与英勇。',
  },
  {
    id: 'sp013', year: 1898, title: '美西战争——帝国的终结',
    description: '西班牙在与美国的战争中失去古巴、波多黎各和菲律宾，四百年殖民帝国终结。',
    category: 'warfare', region: 'spain', significance: 2,
    details: '"98一代"知识分子在帝国崩溃后掀起了深刻的文化反思——西班牙到底是什么？这个问题至今仍在塑造西班牙的自我认知。',
  },
  {
    id: 'sp014', year: 1936, title: '西班牙内战',
    description: '共和派与佛朗哥的国民军之间的内战成为二战的"彩排"，左右意识形态在此激烈碰撞。',
    category: 'warfare', region: 'spain', significance: 3,
    details: '国际纵队从50多个国家赶来支援共和派，海明威、奥威尔和聂鲁达都参与其中。毕加索的《格尔尼卡》就是对这场战争中无辜平民遭轰炸的控诉。',
  },
  {
    id: 'sp015', year: 1975, title: '佛朗哥去世与西班牙民主转型',
    description: '独裁者佛朗哥去世，胡安·卡洛斯一世推动了和平的民主过渡。',
    category: 'history', region: 'spain', significance: 2,
    details: '西班牙的民主转型被称为"transición"，是20世纪最成功的和平政治转型之一。从独裁到民主，没有流血革命，只有谈判和妥协。',
  },
]

/* ═══════════════════════════════════════════════
   东欧专题事件（+20）
   ═══════════════════════════════════════════════ */
export const easternEuropeEvents: HistoricalEvent[] = [
  // --- 波兰 ---
  {
    id: 'ee001', year: 966, title: '波兰受洗',
    description: '梅什科一世接受基督教洗礼，波兰正式加入欧洲基督教文明圈。',
    category: 'religion', region: 'poland', significance: 2,
    details: '波兰选择从罗马而非君士坦丁堡接受洗礼，这个看似微小的决定决定了波兰未来一千年的文化归属——属于西方而非东方。',
  },
  {
    id: 'ee002', year: 1386, title: '波兰-立陶宛联合',
    description: '雅盖隆王朝建立，波兰-立陶宛成为欧洲面积最大的国家。',
    category: 'history', region: 'poland', significance: 3,
    details: '这个联合体在鼎盛时期从波罗的海延伸到黑海，面积超过100万平方公里。它的"贵族民主制"比英国大宪章更早赋予贵族实质性的政治权力。',
  },
  {
    id: 'ee003', year: 1410, title: '格伦瓦尔德战役',
    description: '波兰-立陶宛联军在格伦瓦尔德击败条顿骑士团，中世纪欧洲最大的战役之一。',
    category: 'warfare', region: 'poland', significance: 2,
    details: '双方共投入约6万人——在火药时代之前，这是一个惊人的数字。此战终结了条顿骑士团的扩张野心。',
  },
  {
    id: 'ee004', year: 1569, title: '卢布林联合——波兰立陶宛联邦',
    description: '波兰和立陶宛从王朝联合升级为宪制联邦，创建了欧洲最早的联邦制国家。',
    category: 'history', region: 'poland', significance: 2,
  },
  {
    id: 'ee005', year: 1683, title: '维也纳之战',
    description: '波兰国王索别斯基率领骑兵解围维也纳，挡住了奥斯曼帝国对欧洲腹地的最后一次大规模进攻。',
    category: 'warfare', region: 'poland', significance: 3,
    figure: '扬三世·索别斯基',
    details: '索别斯基指挥的翼骑兵冲锋是军事史上最壮观的骑兵突击之一——约2万骑兵从山坡上俯冲而下，直接击溃了15万奥斯曼大军。',
  },
  {
    id: 'ee006', year: 1795, title: '波兰第三次瓜分——国家消亡',
    description: '俄、普、奥三国瓜分波兰，波兰从欧洲地图上消失了123年。',
    category: 'history', region: 'poland', significance: 3,
    details: '一个有着800年历史的国家就这样消失了。但波兰人的民族认同——通过语言、天主教信仰和肖邦的音乐——在三个帝国的统治下顽强存活了下来。',
  },
  // --- 匈牙利 ---
  {
    id: 'ee007', year: 896, title: '马扎尔人定居匈牙利平原',
    description: '来自乌拉尔山脉的马扎尔游牧民在多瑙河盆地定居，建立匈牙利国家的前身。',
    category: 'history', region: 'hungary', significance: 2,
  },
  {
    id: 'ee008', year: 1000, title: '匈牙利王国建立',
    description: '伊什特万一世加冕为王并接受基督教，匈牙利正式成为中欧大国。',
    category: 'history', region: 'hungary', significance: 2,
    figure: '伊什特万一世',
  },
  {
    id: 'ee009', year: 1526, title: '莫哈奇战役——匈牙利的浩劫',
    description: '匈牙利军队在莫哈奇被奥斯曼帝国苏莱曼大帝击溃，国王阵亡，匈牙利被一分为三。',
    category: 'warfare', region: 'hungary', significance: 3,
    details: '莫哈奇是匈牙利历史上最痛苦的记忆——一个曾经的中欧强国在一天之内失去了独立。此后近400年，匈牙利人在奥斯曼和哈布斯堡之间被反复争夺。',
  },
  {
    id: 'ee010', year: 1848, title: '匈牙利革命',
    description: '裴多菲在布达佩斯朗诵革命诗篇，匈牙利人起义反抗哈布斯堡统治。',
    category: 'history', region: 'hungary', significance: 2,
    figure: '裴多菲,科苏特',
    details: '"起来吧匈牙利人，祖国在召唤！"裴多菲的这首诗成为革命的号角。虽然革命被俄军干预镇压，但它为1867年的奥匈妥协奠定了精神基础。',
  },
  {
    id: 'ee011', year: 1867, title: '奥匈妥协——二元帝国诞生',
    description: '奥地利和匈牙利达成妥协，建立了独特的二元君主制帝国。',
    category: 'history', region: 'hungary', significance: 2,
    details: '奥匈帝国是一个多民族实验——11个主要民族在同一个帝国框架内共存。它的失败和解体直接导致了一战后中欧的"巴尔干化"。',
  },
  {
    id: 'ee012', year: 1956, title: '匈牙利十月事件',
    description: '布达佩斯市民和学生起义反抗苏联控制，遭到苏军坦克镇压。',
    category: 'history', region: 'hungary', significance: 3,
    details: '约2500匈牙利人和700苏军士兵在冲突中丧生，20万匈牙利人逃往西方。这是冷战中东欧卫星国对苏联最早和最激烈的反抗。',
  },
  // --- 捷克/波西米亚 ---
  {
    id: 'ee013', year: 1415, title: '胡斯被烧死在康斯坦茨',
    description: '捷克宗教改革者扬·胡斯在宗教会议上被判为异端并处以火刑，比路德早了100年。',
    category: 'religion', region: 'czech', significance: 3,
    figure: '扬·胡斯',
    details: '胡斯比马丁·路德早了整整一个世纪挑战教会权威。他的处决引发了胡斯战争——一群捷克农民用战车和连枷击败了五次十字军讨伐。',
  },
  {
    id: 'ee014', year: 1618, title: '布拉格掷出窗外事件',
    description: '波西米亚新教贵族将三名帝国使者扔出窗外，直接引爆了三十年战争。',
    category: 'history', region: 'czech', significance: 3,
    details: '这是历史上最著名的"非外交手段"——三个人从21米高的窗户被扔出去（幸存了，据说是落在了一堆粪肥上）。但这个看似荒诞的事件引发了欧洲史上最惨烈的战争。',
  },
  {
    id: 'ee015', year: 1968, title: '布拉格之春',
    description: '捷克斯洛伐克试图推行"人性化的社会主义"改革，被苏联领导的20万华约军队入侵终止。',
    category: 'history', region: 'czech', significance: 3,
    details: '"布拉格之春"证明了苏联体制无法从内部改革——任何偏离莫斯科路线的尝试都会遭到军事镇压。这个教训直到1989年才被推翻。',
  },
  // --- 巴尔干 ---
  {
    id: 'ee016', year: 1389, title: '科索沃战役',
    description: '塞尔维亚在科索沃平原与奥斯曼帝国展开决战，此战成为塞尔维亚民族记忆的核心。',
    category: 'warfare', region: 'serbia', significance: 2,
    details: '虽然战役结果是平局甚至塞尔维亚方面的微弱胜利，但此后塞尔维亚逐渐被奥斯曼吞并。科索沃成为了塞尔维亚民族神话的中心——600年后仍在影响巴尔干政治。',
  },
  {
    id: 'ee017', year: 1453, title: '瓦拉几亚的弗拉德三世',
    description: '"穿刺公"弗拉德以极端残忍手段抵抗奥斯曼入侵，成为德古拉传说的原型。',
    category: 'history', region: 'romania', significance: 2,
    figure: '弗拉德三世',
    details: '弗拉德在今天的罗马尼亚被视为民族英雄——他以一个小国之力抵抗了整个奥斯曼帝国。布拉姆·斯托克后来以他为原型创造了吸血鬼德古拉。',
  },
  // --- 乌克兰 ---
  {
    id: 'ee018', year: 1648, title: '赫梅利尼茨基起义',
    description: '乌克兰哥萨克在赫梅利尼茨基领导下起义反抗波兰统治，深刻改变了东欧版图。',
    category: 'warfare', region: 'ukraine', significance: 2,
    figure: '赫梅利尼茨基',
    details: '这次起义导致乌克兰从波兰-立陶宛转入俄国保护（1654年佩列亚斯拉夫协议），开启了乌克兰与俄罗斯长达数百年的复杂关系。',
  },
  {
    id: 'ee019', year: 1932, title: '乌克兰大饥荒',
    description: '斯大林的强制集体化政策导致乌克兰约400万人死于饥荒，被称为"Holodomor"。',
    category: 'history', region: 'ukraine', significance: 3,
    details: '"Holodomor"意为"以饥饿灭绝"。在世界上最肥沃的黑土地上制造的人为饥荒，是20世纪最惨烈的人道灾难之一。至今仍是乌俄关系中最敏感的历史记忆。',
  },
  {
    id: 'ee020', year: 1989, title: '天鹅绒革命与东欧剧变',
    description: '捷克斯洛伐克在哈维尔领导下和平结束了共产党统治，民主化浪潮席卷整个东欧。',
    category: 'history', region: 'czech', significance: 3,
    figure: '哈维尔',
    details: '捷克人称之为"天鹅绒革命"因为它的和平性——没有一声枪响。哈维尔从监狱到总统府只用了42天，这是20世纪最戏剧性的政治转变之一。',
  },
]
