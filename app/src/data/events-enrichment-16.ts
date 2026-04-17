/**
 * Enrichment 16 — 美国历史深度事件专题
 * 覆盖殖民、建国、西进、内战、镀金、进步、新政、冷战、民权、科技
 */
import type { HistoricalEvent } from './types'

export const usaHistoryEvents: HistoricalEvent[] = [
  // ═══ 殖民与建国（1607-1800）═══
  {
    id: 'usa001', year: 1607, title: '詹姆斯敦建立',
    description: '英国在弗吉尼亚建立了第一个永久殖民地詹姆斯敦，北美英属殖民时代由此开启。',
    category: 'history', region: 'usa', significance: 2,
    details: '詹姆斯敦最初几年几乎被饥荒和疾病毁灭——第一个冬天只有38人幸存。但烟草种植的成功让殖民地扎下了根，也带来了非洲奴隶贸易的阴影。',
  },
  {
    id: 'usa002', year: 1692, title: '萨勒姆女巫审判',
    description: '马萨诸塞州萨勒姆镇爆发女巫恐慌，20人被处死，成为集体歇斯底里的经典案例。',
    category: 'history', region: 'usa', significance: 2,
    details: '萨勒姆审判至今是"恐惧如何摧毁理性"的警世寓言。阿瑟·米勒的剧作《萨勒姆的女巫》将其与麦卡锡时代的政治迫害相提并论。',
  },
  {
    id: 'usa003', year: 1787, title: '美国宪法制定',
    description: '55位代表在费城制宪会议上起草了世界上第一部成文宪法，确立了联邦制和三权分立。',
    category: 'history', region: 'usa', significance: 3,
    figure: '华盛顿,麦迪逊,富兰克林',
    details: '制宪会议上最激烈的争论是大州与小州的代表权分配——最终的"大妥协"创造了参议院（各州平等）和众议院（按人口分配）的双院制。宪法的弹性设计使它至今仍在运作，只增加了27条修正案。',
  },
  {
    id: 'usa004', year: 1791, title: '权利法案',
    description: '宪法前十条修正案——权利法案——正式生效，保障了言论自由、宗教自由和持枪权等基本权利。',
    category: 'history', region: 'usa', significance: 3,
    details: '第一修正案保护的言论自由至今是美国政治文化的基石。第二修正案的"持枪权"在两百多年后仍是美国最分裂的政治议题之一。',
  },

  // ═══ 西进运动与领土扩张（1800-1860）═══
  {
    id: 'usa005', year: 1803, title: '路易斯安那购地',
    description: '杰斐逊总统以1500万美元从法国购入路易斯安那领地，美国国土面积翻倍。',
    category: 'history', region: 'usa', significance: 3,
    figure: '杰斐逊',
    details: '每英亩不到3美分——这可能是人类历史上最划算的土地交易。拿破仑急需军费而出售，杰斐逊虽对宪法是否授权总统购地存疑，仍果断签约。这笔交易奠定了美国成为大陆国家的基础。',
  },
  {
    id: 'usa006', year: 1823, title: '门罗主义',
    description: '门罗总统宣布"美洲是美洲人的美洲"，警告欧洲列强不得干涉西半球事务。',
    category: 'history', region: 'usa', significance: 2,
    figure: '门罗',
    details: '门罗主义最初只是一纸声明，美国当时根本没有军事力量来执行它。但它逐渐演变为美国外交政策的基石，也成为美国在拉丁美洲行使霸权的理论依据。',
  },
  {
    id: 'usa007', year: 1830, title: '印第安人迁移法案',
    description: '安德鲁·杰克逊签署《印第安人迁移法案》，数万原住民被强制迁往密西西比河以西。',
    category: 'history', region: 'usa', significance: 2,
    figure: '杰克逊',
    details: '"眼泪之路"是美国历史上最黑暗的篇章之一。切诺基族在迁移途中约有四分之一人口死亡。这一事件至今是理解美国原住民历史创伤的关键。',
  },
  {
    id: 'usa008', year: 1848, title: '加利福尼亚淘金热',
    description: '萨特磨坊发现黄金的消息传开，30万淘金者涌入加利福尼亚，美国西部开发急剧加速。',
    category: 'history', region: 'usa', significance: 2,
    details: '淘金热在18个月内让旧金山从一个200人的小镇变成36000人的城市。大多数淘金者一无所获，真正发财的是卖铲子和牛仔裤的人——李维·斯特劳斯就在此时创立了Levi\'s。',
  },

  // ═══ 内战与重建（1860-1900）═══
  {
    id: 'usa009', year: 1861, title: '南北战争爆发',
    description: '南方各州脱离联邦，美国内战爆发。这场持续四年的战争造成约62万人死亡。',
    category: 'warfare', region: 'usa', significance: 3,
    details: '南北战争的死亡人数超过美国参与的所有其他战争死亡人数总和。战争的根本原因是奴隶制，尽管南方声称是为了"州权"。这场战争最终确认了联邦不可分割的原则。',
  },
  {
    id: 'usa010', year: 1863, title: '解放奴隶宣言',
    description: '林肯发布《解放奴隶宣言》，宣布叛乱各州的奴隶"永远获得自由"。',
    category: 'history', region: 'usa', significance: 3,
    figure: '林肯',
    details: '这份文件在法律上只解放了南方叛乱州的奴隶，北方边境州的奴隶并不受影响。但它将战争的道德意义从"维护联邦"提升为"争取自由"，也阻止了英法承认南方邦联。',
  },
  {
    id: 'usa011', year: 1865, title: '林肯遇刺',
    description: '亚伯拉罕·林肯在福特剧院被约翰·布斯刺杀，成为美国第一位被暗杀的总统。',
    category: 'history', region: 'usa', significance: 3,
    figure: '林肯',
    details: '林肯在南北战争结束仅5天后遇刺。讽刺的是，他被刺杀当天白天刚签署了建立特勤局的法令。他的死让重建时期的和解政策失去了最有力的推动者。',
  },
  {
    id: 'usa012', year: 1865, title: '第十三修正案',
    description: '宪法第十三修正案正式废除了美国的奴隶制度。',
    category: 'history', region: 'usa', significance: 3,
    details: '从1619年第一批非洲人被运到弗吉尼亚，到1865年奴隶制正式废除，历时246年。但废除法律上的奴隶制并不等于结束种族不平等——这一斗争又持续了一百多年。',
  },
  {
    id: 'usa013', year: 1886, title: '自由女神像落成',
    description: '法国赠送的自由女神像在纽约港落成，成为美国作为移民灯塔的永恒象征。',
    category: 'architecture', region: 'usa', significance: 2,
    details: '自由女神像原本是暗红色的铜——是氧化作用让她变成了今天的铜绿色。底座上铭刻的诗句"把你疲惫的、贫穷的、渴望自由呼吸的民众交给我"定义了美国的移民精神。',
  },

  // ═══ 镀金时代与进步运动（1870-1920）═══
  {
    id: 'usa014', year: 1920, title: '第十九修正案——妇女投票权',
    description: '宪法第十九修正案赋予美国女性选举权，七十多年的妇女参政运动终于胜利。',
    category: 'history', region: 'usa', significance: 3,
    details: '从1848年塞内卡瀑布宣言到1920年修正案批准，美国女性争取投票权花了72年。推动者苏珊·安东尼在投票权实现前14年就已去世——她没能亲眼看到自己毕生奋斗的成果。',
  },

  // ═══ 新政与二战（1930-1950）═══
  {
    id: 'usa015', year: 1933, title: '罗斯福新政',
    description: '面对大萧条，罗斯福推出"新政"系列改革——社会保障、公共工程、金融监管，重新定义了政府角色。',
    category: 'history', region: 'usa', significance: 3,
    figure: '罗斯福',
    details: '新政是美国政府职能的分水岭：此前政府奉行自由放任，此后政府成为经济的积极参与者。社会保障法案至今仍是美国最重要的社会安全网。新政也确立了民主党作为劳工和少数族裔政党的基础。',
  },
  {
    id: 'usa016', year: 1942, title: '曼哈顿计划',
    description: '美国启动绝密的曼哈顿计划，动员13万人和20亿美元研制原子弹。',
    category: 'technology', region: 'usa', significance: 3,
    figure: '奥本海默',
    details: '奥本海默在第一颗原子弹爆炸后引用印度经典："我成了死神，世界的毁灭者。"曼哈顿计划不仅终结了二战，更永久改变了国际关系——人类第一次拥有了自我毁灭的能力。',
  },
  {
    id: 'usa017', year: 1948, title: '马歇尔计划',
    description: '美国投入约130亿美元援助战后欧洲重建，这是人类历史上最成功的经济援助计划。',
    category: 'history', region: 'usa', significance: 3,
    figure: '马歇尔',
    details: '马歇尔计划的智慧在于：它不是施舍，而是投资。援助金主要用于购买美国商品，既帮助了欧洲复苏，也刺激了美国出口。它还有一个被低估的目标：阻止西欧倒向苏联。',
  },

  // ═══ 冷战与民权（1950-1975）═══
  {
    id: 'usa018', year: 1950, title: '麦卡锡主义',
    description: '参议员麦卡锡发动反共运动，数千人被指控为共产主义者而失去工作和自由。',
    category: 'history', region: 'usa', significance: 2,
    figure: '麦卡锡',
    details: '"你是否现在或曾经是共产党员？"——这个问题毁掉了无数人的职业和生活。好莱坞黑名单让卓别林等艺术家被驱逐出美国。麦卡锡主义至今是"以安全为名践踏自由"的代名词。',
  },
  {
    id: 'usa019', year: 1954, title: '布朗诉教育委员会案',
    description: '最高法院裁定学校种族隔离违宪，推翻了"隔离但平等"原则，成为民权运动的法律里程碑。',
    category: 'history', region: 'usa', significance: 3,
    details: '首席大法官沃伦写下了历史性的判词："在公共教育领域，隔离但平等的原则没有立足之地。"但判决后十年间，南方各州的学校实际种族融合进展极为缓慢。',
  },
  {
    id: 'usa020', year: 1963, title: '肯尼迪遇刺',
    description: '约翰·肯尼迪总统在达拉斯被刺杀，全美陷入震惊与悲痛。',
    category: 'history', region: 'usa', significance: 3,
    figure: '肯尼迪',
    details: '肯尼迪之死是美国20世纪的分水岭。关于暗杀的阴谋论至今不绝于耳。他在就职演说中的名句"不要问国家为你做了什么，要问你能为国家做什么"定义了一代美国人的理想主义。',
  },
  {
    id: 'usa021', year: 1964, title: '民权法案',
    description: '约翰逊总统签署《1964年民权法案》，从法律上禁止基于种族、肤色、宗教、性别和国籍的歧视。',
    category: 'history', region: 'usa', significance: 3,
    figure: '约翰逊,马丁·路德·金',
    details: '民权法案是马丁·路德·金"我有一个梦想"演讲的制度化成果。约翰逊签署法案后对助手说："我们刚把南方交给了共和党一代人。"——这个预言成真了。',
  },
  {
    id: 'usa022', year: 1974, title: '水门事件',
    description: '尼克松因水门窃听丑闻被迫辞职，成为美国唯一主动辞职的总统。',
    category: 'history', region: 'usa', significance: 3,
    figure: '尼克松',
    details: '水门事件的意义远超一次政治丑闻——它证明了美国的制度能够追究最高权力者的责任。"门"（-gate）后缀从此成为所有政治丑闻的通用后缀。调查记者伍德沃德和伯恩斯坦的工作成为新闻自由的标杆。',
  },

  // ═══ 科技与当代（1975-至今）═══
  {
    id: 'usa023', year: 1977, title: 'Apple II',
    description: '乔布斯和沃兹尼亚克发布Apple II，个人电脑从极客玩具变为大众消费品。',
    category: 'technology', region: 'usa', significance: 2,
    figure: '乔布斯,沃兹尼亚克',
    details: 'Apple II是第一台真正面向普通用户的个人电脑——它有彩色显示、内置BASIC语言和软盘驱动器。它的成功证明了一个车库里的两个年轻人可以改变世界。',
  },
  {
    id: 'usa024', year: 2001, title: '9/11事件',
    description: '恐怖分子劫持四架客机撞击世贸中心和五角大楼，近3000人遇难，改变了21世纪的全球格局。',
    category: 'history', region: 'usa', significance: 3,
    details: '9/11不仅改变了美国的外交和安全政策（反恐战争、阿富汗战争、伊拉克战争），也深刻改变了普通人的日常生活——从机场安检到大规模监控。它是21世纪第一个定义性时刻。',
  },
  {
    id: 'usa025', year: 2008, title: '次贷危机',
    description: '美国次级抵押贷款市场崩溃引发全球金融危机，雷曼兄弟破产，全球经济陷入大衰退。',
    category: 'history', region: 'usa', significance: 3,
    details: '这场危机暴露了金融体系"太大而不能倒"的系统性风险。美国政府投入7000亿美元救助华尔街，而数百万普通家庭失去了房产。危机后的占领华尔街运动揭示了日益扩大的贫富差距。',
  },
  {
    id: 'usa026', year: 2008, title: '奥巴马当选',
    description: '巴拉克·奥巴马当选美国第44任总统，成为美国历史上第一位非裔总统。',
    category: 'history', region: 'usa', significance: 3,
    figure: '奥巴马',
    details: '在一个奴隶制曾合法存在246年的国家，一位非裔美国人入主白宫——这个事实本身就是美国社会变迁最有力的证明。他的竞选口号"Yes We Can"成为一个时代的符号。',
  },
]
