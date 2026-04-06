import type { HistoricalEvent } from './types'

// ============================================================
// 事件丰富度扩充包 Part 3
// 特性7: 中世纪补充 + 特性8: 科学革命与启蒙 + 特性9: 20世纪全球化 + 特性10: 哲学思想史
// ============================================================

export const medievalEnrichmentEvents: HistoricalEvent[] = [
  { id: 'mdv001', year: 527, title: '查士丁尼大帝', description: '拜占庭皇帝编纂《民法大全》，后来成为整个欧洲大陆法律体系的基石。', category: 'history', region: 'turkey', significance: 3, figure: '查士丁尼' },
  { id: 'mdv002', year: 537, title: '圣索菲亚大教堂建成', description: '君士坦丁堡的圣索菲亚大教堂竣工，其巨大穹顶是建筑史上的奇迹。', category: 'architecture', region: 'turkey', significance: 3 },
  { id: 'mdv003', year: 732, title: '图尔战役', description: '查理·马特在图尔击败阿拉伯军队，阻止了伊斯兰势力在欧洲的扩张。', category: 'warfare', region: 'france', significance: 2, figure: '查理·马特' },
  { id: 'mdv004', year: 800, title: '查理大帝加冕', description: '教皇为查理大帝加冕为"罗马人的皇帝"，奠定中世纪欧洲政教关系基本格局。', category: 'history', region: 'france', significance: 3, figure: '查理大帝' },
  { id: 'mdv005', year: 868, title: '《金刚经》雕版印刷', description: '世界现存最早的印刷书籍《金刚经》，印制于唐朝。', category: 'technology', region: 'china', significance: 2 },
  { id: 'mdv006', year: 988, title: '基辅罗斯受洗', description: '弗拉基米尔大公让基辅罗斯皈依东正教，奠定俄罗斯文明的宗教文化基础。', category: 'religion', region: 'ukraine', significance: 2, figure: '弗拉基米尔' },
  { id: 'mdv007', year: 1054, title: '基督教东西分裂', description: '基督教分裂为天主教和东正教，至今影响着欧洲的文化和地缘格局。', category: 'religion', region: 'global', significance: 3 },
  { id: 'mdv008', year: 1066, title: '诺曼征服英格兰', description: '威廉公爵在黑斯廷斯战役中击败英格兰国王，使法语成为英格兰官方语言三百年，永久塑造了英语面貌。', category: 'warfare', region: 'uk', significance: 3, figure: '征服者威廉' },
  { id: 'mdv009', year: 1096, title: '第一次十字军东征', description: '教皇号召基督徒收复圣地，第一次十字军攻陷耶路撒冷。', category: 'warfare', region: 'global', significance: 3 },
  { id: 'mdv010', year: 1206, title: '成吉思汗统一蒙古', description: '铁木真统一蒙古诸部，随后建立了人类历史上最大的连续领土帝国（3300万平方公里）。', category: 'history', region: 'mongolia', significance: 3, figure: '成吉思汗' },
  { id: 'mdv011', year: 1215, title: '大宪章', description: '英格兰贵族迫使约翰王签署大宪章，确立法治和限制王权的原则，成为英美宪政传统基石。', category: 'history', region: 'uk', significance: 3 },
  { id: 'mdv012', year: 1258, title: '蒙古毁灭巴格达', description: '蒙古军攻陷巴格达，杀死哈里发，烧毁智慧之家图书馆，阿拉伯黄金时代终结。', category: 'warfare', region: 'iraq', significance: 3 },
  { id: 'mdv013', year: 1271, title: '马可·波罗东行', description: '威尼斯商人马可·波罗开始长达24年的东方之旅，其游记向欧洲揭示东方文明。', category: 'exploration', region: 'italy', significance: 2, figure: '马可·波罗' },
  { id: 'mdv014', year: 1453, title: '君士坦丁堡陷落', description: '奥斯曼帝国攻陷君士坦丁堡，拜占庭终结。学者携古希腊典籍逃往意大利，助燃文艺复兴。', category: 'warfare', region: 'turkey', significance: 3, figure: '穆罕默德二世' },
  { id: 'mdv015', year: 750, title: '造纸术传入伊斯兰世界', description: '怛罗斯之战后中国造纸术传入阿拉伯世界，推动伊斯兰文明的知识爆发。', category: 'technology', region: 'uzbekistan', significance: 3 },
  { id: 'mdv016', year: 830, title: '智慧之家', description: '阿巴斯王朝在巴格达建立智慧之家，大规模翻译希腊、波斯和印度典籍，保存发展了古典知识。', category: 'philosophy', region: 'iraq', significance: 3 },
  { id: 'mdv017', year: 1088, title: '博洛尼亚大学', description: '欧洲第一所大学在意大利博洛尼亚成立，中世纪大学体系由此诞生。', category: 'history', region: 'italy', significance: 2 },
]

export const enlightenmentEnrichmentEvents: HistoricalEvent[] = [
  { id: 'enl001', year: 1543, title: '哥白尼日心说', description: '哥白尼在临终前发表《天体运行论》，提出太阳而非地球是宇宙中心。', category: 'science', region: 'poland', significance: 3, figure: '哥白尼' },
  { id: 'enl002', year: 1609, title: '伽利略望远镜观测', description: '伽利略用自制望远镜观测到木星卫星和月球环形山，为日心说提供实证。', category: 'science', region: 'italy', significance: 3, figure: '伽利略' },
  { id: 'enl003', year: 1637, title: '笛卡尔"我思故我在"', description: '笛卡尔提出"我思故我在"，建立了现代哲学的理性主义传统。', category: 'philosophy', region: 'france', significance: 3, figure: '笛卡尔' },
  { id: 'enl004', year: 1665, title: '牛顿奇迹年', description: '23岁的牛顿在瘟疫隔离期间完成了微积分、光学和万有引力理论的基础工作。', category: 'science', region: 'uk', significance: 3, figure: '牛顿' },
  { id: 'enl005', year: 1687, title: '牛顿《原理》', description: '牛顿出版《自然哲学的数学原理》，用数学统一了天上和地上的物理规律。', category: 'science', region: 'uk', significance: 3, figure: '牛顿' },
  { id: 'enl006', year: 1689, title: '洛克《政府论》', description: '洛克提出天赋人权和社会契约论，为现代民主政治奠定哲学基础。', category: 'philosophy', region: 'uk', significance: 3, figure: '洛克' },
  { id: 'enl007', year: 1735, title: '林奈生物分类法', description: '林奈创立"界门纲目科属种"生物分类系统，至今仍在使用。', category: 'science', region: 'sweden', significance: 2, figure: '林奈' },
  { id: 'enl008', year: 1751, title: '法国百科全书', description: '狄德罗主编28卷《百科全书》，用理性审视一切，被认为是法国大革命的思想武器。', category: 'philosophy', region: 'france', significance: 3, figure: '狄德罗' },
  { id: 'enl009', year: 1762, title: '卢梭《社会契约论》', description: '卢梭提出"人民主权"思想，成为法国大革命最重要的理论来源之一。', category: 'philosophy', region: 'switzerland', significance: 3, figure: '卢梭' },
  { id: 'enl010', year: 1776, title: '亚当·斯密《国富论》', description: '"看不见的手"理论奠定了现代经济学和自由市场理论的基础。', category: 'philosophy', region: 'uk', significance: 3, figure: '亚当·斯密' },
  { id: 'enl011', year: 1781, title: '康德《纯粹理性批判》', description: '康德批判理性本身，调和经验主义和理性主义，重新定义哲学疆界。', category: 'philosophy', region: 'germany', significance: 3, figure: '康德' },
  { id: 'enl012', year: 1789, title: '法国大革命', description: '攻占巴士底狱标志着法国大革命爆发，"自由、平等、博爱"的理念传遍全球。', category: 'history', region: 'france', significance: 3 },
  { id: 'enl013', year: 1752, title: '富兰克林风筝实验', description: '富兰克林用风筝实验证明闪电是电现象，并发明了避雷针。', category: 'science', region: 'usa', significance: 2, figure: '富兰克林' },
  { id: 'enl014', year: 1774, title: '拉瓦锡氧气理论', description: '拉瓦锡推翻燃素说，建立以氧为核心的燃烧理论，"现代化学之父"。', category: 'science', region: 'france', significance: 3, figure: '拉瓦锡' },
]

export const modernGlobalizationEvents: HistoricalEvent[] = [
  { id: 'glb001', year: 1903, title: '莱特兄弟首飞', description: '人类历史上第一次动力飞行，飞行了12秒，人类从此征服天空。', category: 'technology', region: 'usa', significance: 3, figure: '莱特兄弟' },
  { id: 'glb002', year: 1905, title: '爱因斯坦奇迹年', description: '26岁的专利局小职员一年发表狭义相对论、光电效应等五篇划时代论文。E=mc²成为核能理论基础。', category: 'science', region: 'switzerland', significance: 3, figure: '爱因斯坦' },
  { id: 'glb003', year: 1929, title: '大萧条', description: '华尔街股市崩盘引发全球经济大萧条，失业率飙升，改变了经济政策理念。', category: 'history', region: 'usa', significance: 3 },
  { id: 'glb004', year: 1945, title: '联合国成立', description: '51个国家签署《联合国宪章》，建立战后国际秩序基本框架。', category: 'history', region: 'global', significance: 3 },
  { id: 'glb005', year: 1947, title: '印度独立与分治', description: '印度和巴基斯坦独立，分治引发1500万人迁移和约百万人死亡。', category: 'history', region: 'india', significance: 3, figure: '甘地' },
  { id: 'glb006', year: 1948, title: '世界人权宣言', description: '联合国通过《世界人权宣言》，首次在国际层面确立普世人权标准。', category: 'history', region: 'global', significance: 3 },
  { id: 'glb007', year: 1957, title: '斯普特尼克卫星', description: '苏联发射第一颗人造卫星斯普特尼克，太空竞赛正式开始。', category: 'technology', region: 'russia', significance: 3 },
  { id: 'glb008', year: 1962, title: '古巴导弹危机', description: '美苏核对峙使人类最接近核战争边缘，最终以苏联撤走导弹告终。', category: 'history', region: 'global', significance: 3 },
  { id: 'glb009', year: 1963, title: '"我有一个梦想"', description: '马丁·路德·金在华盛顿发表著名演说，成为美国民权运动最高潮。', category: 'history', region: 'usa', significance: 3, figure: '马丁·路德·金' },
  { id: 'glb010', year: 1989, title: '柏林墙倒塌', description: '柏林墙倒塌标志冷战结束，东西方重新统一，全球化加速。', category: 'history', region: 'germany', significance: 3 },
  { id: 'glb011', year: 1991, title: '万维网向公众开放', description: '蒂姆·伯纳斯-李发明的万维网向公众开放，互联网时代正式开始。', category: 'technology', region: 'uk', significance: 3, figure: '蒂姆·伯纳斯-李' },
  { id: 'glb012', year: 2001, title: '九一一事件', description: '恐怖袭击改变了全球安全格局和国际关系，开启了反恐战争时代。', category: 'history', region: 'usa', significance: 3 },
  { id: 'glb013', year: 2007, title: 'iPhone发布', description: '苹果发布iPhone，智能手机革命开始，移动互联网改变了人类的生活方式。', category: 'technology', region: 'usa', significance: 3, figure: '乔布斯' },
  { id: 'glb014', year: 2016, title: 'AlphaGo击败李世石', description: 'DeepMind的AlphaGo击败围棋世界冠军，AI能力的突破性展示震撼全球。', category: 'technology', region: 'uk', significance: 2 },
]

export const philosophyEnrichmentEvents: HistoricalEvent[] = [
  { id: 'phi001', year: -600, title: '泰勒斯·西方哲学诞生', description: '泰勒斯提出"万物源于水"，开创了用理性而非神话解释自然的传统。', category: 'philosophy', region: 'greece', significance: 3, figure: '泰勒斯' },
  { id: 'phi002', year: -551, title: '孔子诞生', description: '孔子诞生，其"仁义礼智信"思想成为中华文明两千年的核心价值体系。', category: 'philosophy', region: 'china', significance: 3, figure: '孔子' },
  { id: 'phi003', year: -500, title: '释迦牟尼悟道', description: '乔达摩·悉达多在菩提树下悟道，创立佛教，提出四圣谛和八正道。', category: 'philosophy', region: 'india', significance: 3, figure: '释迦牟尼' },
  { id: 'phi004', year: -470, title: '苏格拉底', description: '苏格拉底用反诘法追问真理本质，"未经审视的生活不值得过"。', category: 'philosophy', region: 'greece', significance: 3, figure: '苏格拉底' },
  { id: 'phi005', year: -380, title: '柏拉图《理想国》', description: '柏拉图提出理念论和理想国构想，其"洞穴比喻"至今仍是认识论的核心隐喻。', category: 'philosophy', region: 'greece', significance: 3, figure: '柏拉图' },
  { id: 'phi006', year: -340, title: '亚里士多德百科全书式哲学', description: '亚里士多德几乎在每个知识领域都有奠基性贡献——逻辑学、物理学、伦理学、政治学、生物学。', category: 'philosophy', region: 'greece', significance: 3, figure: '亚里士多德' },
  { id: 'phi007', year: -300, title: '老庄道家哲学成熟', description: '《庄子》编纂完成，道家"无为而治"和"逍遥游"思想对中国文化影响深远。', category: 'philosophy', region: 'china', significance: 3, figure: '庄子' },
  { id: 'phi008', year: 1265, title: '托马斯·阿奎那', description: '阿奎那在《神学大全》中融合亚里士多德哲学和基督教神学，影响天主教思想至今。', category: 'philosophy', region: 'italy', significance: 2, figure: '阿奎那' },
  { id: 'phi009', year: 1807, title: '黑格尔辩证法', description: '黑格尔发表《精神现象学》，其辩证法深刻影响了马克思和整个19世纪思想。', category: 'philosophy', region: 'germany', significance: 3, figure: '黑格尔' },
  { id: 'phi010', year: 1844, title: '克尔凯郭尔·存在主义先驱', description: '丹麦哲学家克尔凯郭尔发表一系列著作，强调个体存在和主观选择，开启存在主义思潮。', category: 'philosophy', region: 'denmark', significance: 2, figure: '克尔凯郭尔' },
  { id: 'phi011', year: 1883, title: '尼采"上帝已死"', description: '尼采在《查拉图斯特拉如是说》中宣告"上帝已死"，挑战欧洲道德和价值观基础。', category: 'philosophy', region: 'germany', significance: 3, figure: '尼采' },
  { id: 'phi012', year: 1927, title: '海德格尔《存在与时间》', description: '海德格尔追问"存在的意义"，奠定了20世纪存在主义和现象学的基础。', category: 'philosophy', region: 'germany', significance: 2, figure: '海德格尔' },
  { id: 'phi013', year: 1943, title: '萨特存在主义', description: '萨特发表《存在与虚无》，提出"存在先于本质"，人被判定为自由的。', category: 'philosophy', region: 'france', significance: 2, figure: '萨特' },
  { id: 'phi014', year: 1949, title: '波伏瓦《第二性》', description: '西蒙娜·德·波伏瓦发表《第二性》，"女人不是天生的，而是被塑造的"，女性主义思想基石。', category: 'philosophy', region: 'france', significance: 3, figure: '波伏瓦' },
]
