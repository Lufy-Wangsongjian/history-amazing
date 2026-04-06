import type { HistoricalEvent } from './types'

// ============================================================
// Round 11 扩充包（特性 271-300）
// 铁路史 + 航空史 + 汽车史 + 考古重大发现 + 人口迁徙
// + 节日与庆典 + 饮食文化 + 香料贸易 + 地图学 + 度量衡
// ============================================================

// ── 特性271-273: 铁路史 ──────────────────────────────────
export const railwayEvents: HistoricalEvent[] = [
  { id: 'rwy001', year: 1830, title: '利物浦-曼彻斯特铁路', description: '世界上第一条城际客运铁路开通，火车旅行从此成为现实。', category: 'technology', region: 'uk', significance: 3 },
  { id: 'rwy002', year: 1863, title: '伦敦地铁', description: '伦敦开通了世界上第一条地下铁路，城市交通进入地下时代。', category: 'technology', region: 'uk', significance: 3 },
  { id: 'rwy003', year: 1869, title: '美国横贯大陆铁路', description: '东西两段铁路在犹他州普罗蒙特里角接轨，北美大陆被钢铁连为一体。', category: 'technology', region: 'usa', significance: 3 },
  { id: 'rwy004', year: 1891, title: '西伯利亚大铁路', description: '俄国开始修建横跨亚欧大陆的西伯利亚大铁路，全长9,289公里，是世界上最长的铁路线。', category: 'technology', region: 'russia', significance: 2 },
  { id: 'rwy005', year: 1964, title: '东海道新干线', description: '日本开通世界上第一条高速铁路——东海道新干线，运营时速超过200公里。', category: 'technology', region: 'japan', significance: 3 },
  { id: 'rwy006', year: 1994, title: '英法海底隧道', description: '英吉利海峡隧道通车，全长50公里的海底隧道连接了英国和法国。', category: 'technology', region: 'uk', significance: 2 },
  { id: 'rwy007', year: 2008, title: '京津城际高铁', description: '中国第一条设计时速350公里的高铁——京津城际铁路通车，中国高铁时代开始。', category: 'technology', region: 'china', significance: 2 },
]

// ── 特性274-276: 航空史 ──────────────────────────────────
export const aviationEvents: HistoricalEvent[] = [
  { id: 'avi001', year: 1783, title: '蒙特哥菲尔热气球', description: '蒙特哥菲尔兄弟的热气球在巴黎成功载人飞行，人类第一次飞离地面。', category: 'technology', region: 'france', significance: 3 },
  { id: 'avi002', year: 1903, title: '莱特兄弟首飞', description: '莱特兄弟在北卡罗来纳州基蒂霍克完成了人类第一次有动力的可控飞行，持续12秒。', category: 'technology', region: 'usa', significance: 3, figure: '莱特兄弟' },
  { id: 'avi003', year: 1927, title: '林德伯格横渡大西洋', description: '查尔斯·林德伯格驾驶"圣路易斯精神号"完成了从纽约到巴黎的首次不着陆单人飞行。', category: 'exploration', region: 'usa', significance: 2, figure: '林德伯格' },
  { id: 'avi004', year: 1937, title: '兴登堡号空难', description: '德国兴登堡号飞艇在美国着陆时起火爆炸，终结了飞艇客运的黄金时代。', category: 'history', region: 'usa', significance: 2 },
  { id: 'avi005', year: 1947, title: '突破音障', description: '查克·耶格尔驾驶X-1试验机首次突破音速障碍，超音速飞行时代到来。', category: 'technology', region: 'usa', significance: 2, figure: '耶格尔' },
  { id: 'avi006', year: 1952, title: '喷气式客机', description: '德哈维兰"彗星"号成为世界上第一种喷气式客机，虽后因设计缺陷停飞，但开创了喷气时代。', category: 'technology', region: 'uk', significance: 2 },
  { id: 'avi007', year: 1969, title: '波音747', description: '波音747"巨无霸"客机首飞，其双层宽体设计使远程航空旅行变得经济可行。', category: 'technology', region: 'usa', significance: 2 },
  { id: 'avi008', year: 1976, title: '协和式超音速客机', description: '英法合作的协和号超音速客机投入商业运营，伦敦到纽约只需3.5小时。', category: 'technology', region: 'uk', significance: 2 },
]

// ── 特性277-279: 汽车史 ──────────────────────────────────
export const automobileEvents: HistoricalEvent[] = [
  { id: 'aut001', year: 1769, title: '居纽蒸汽车', description: '法国军官居纽制造了第一辆蒸汽动力车辆，时速约3.6公里，用于拖拉大炮。', category: 'technology', region: 'france', significance: 2 },
  { id: 'aut002', year: 1886, title: '奔驰专利汽车', description: '卡尔·本茨获得了第一辆以汽油内燃机驱动的汽车专利，现代汽车工业由此诞生。', category: 'technology', region: 'germany', significance: 3, figure: '本茨' },
  { id: 'aut003', year: 1908, title: '福特T型车', description: '亨利·福特推出T型车并引入流水线生产，汽车从奢侈品变为普通人的出行工具。', category: 'technology', region: 'usa', significance: 3, figure: '福特' },
  { id: 'aut004', year: 1938, title: '大众甲壳虫', description: '德国大众汽车公司推出"国民车"甲壳虫，后来成为全球最畅销的单一车型。', category: 'technology', region: 'germany', significance: 2 },
  { id: 'aut005', year: 1956, title: '美国州际公路', description: '艾森豪威尔签署《联邦公路法》，启动了美国州际公路系统的建设，改变了美国城市面貌。', category: 'technology', region: 'usa', significance: 2 },
  { id: 'aut006', year: 1997, title: '丰田普锐斯', description: '丰田推出了全球第一款量产混合动力汽车普锐斯，开创了绿色汽车时代。', category: 'technology', region: 'japan', significance: 2 },
  { id: 'aut007', year: 2012, title: '特斯拉Model S', description: '特斯拉Model S上市，证明了纯电动汽车可以兼顾性能和续航，加速了汽车电动化转型。', category: 'technology', region: 'usa', significance: 2 },
]

// ── 特性280-283: 考古重大发现 ────────────────────────────
export const archaeologyEvents: HistoricalEvent[] = [
  { id: 'arc001', year: 1799, title: '罗塞塔石碑发现', description: '拿破仑远征军在埃及罗塞塔发现了同时刻有古埃及象形文字、世俗体和希腊文的石碑。', category: 'history', region: 'egypt', significance: 3 },
  { id: 'arc002', year: 1822, title: '商博良破译象形文字', description: '法国学者商博良成功破译了古埃及象形文字，打开了法老文明的大门。', category: 'science', region: 'france', significance: 3, figure: '商博良' },
  { id: 'arc003', year: 1871, title: '施里曼发掘特洛伊', description: '德国考古学家施里曼在土耳其希萨利克发掘了特洛伊遗址，证明了荷马史诗有历史基础。', category: 'history', region: 'turkey', significance: 3, figure: '施里曼' },
  { id: 'arc004', year: 1922, title: '图坦卡蒙墓', description: '霍华德·卡特发现了几乎未被盗掘的图坦卡蒙墓，黄金面具成为古埃及文明的标志。', category: 'history', region: 'egypt', significance: 3, figure: '卡特' },
  { id: 'arc005', year: 1929, title: '殷墟甲骨文', description: '河南安阳殷墟大规模发掘，出土大量甲骨文，确认了商朝的真实存在。', category: 'history', region: 'china', significance: 3 },
  { id: 'arc006', year: 1947, title: '死海古卷', description: '牧羊人在死海边的库姆兰洞穴中发现了公元前3世纪至1世纪的圣经手抄本。', category: 'religion', region: 'israel', significance: 3 },
  { id: 'arc007', year: 1974, title: '秦始皇兵马俑', description: '陕西临潼农民打井时发现了秦始皇陵兵马俑坑，8000多尊真人大小的陶俑震惊世界。', category: 'history', region: 'china', significance: 3 },
  { id: 'arc008', year: 1991, title: '冰人奥茨', description: '登山者在阿尔卑斯山发现了约5300年前的冰冻木乃伊"奥茨"，是欧洲最古老的人类遗体。', category: 'science', region: 'austria', significance: 2 },
  { id: 'arc009', year: 2003, title: '弗洛勒斯人', description: '在印尼弗洛勒斯岛发现了矮小的人属新物种"弗洛勒斯人"，被媒体称为"霍比特人"。', category: 'science', region: 'indonesia', significance: 2 },
]

// ── 特性284-286: 人口迁徙 ────────────────────────────────
export const migrationEvents: HistoricalEvent[] = [
  { id: 'mig001', year: -70000, title: '走出非洲', description: '现代人类祖先从非洲东部出发，开始了向全球各大陆迁移的漫长旅程。', category: 'history', region: 'global', significance: 3 },
  { id: 'mig002', year: -15000, title: '进入美洲', description: '人类可能通过白令陆桥或沿海路线从亚洲进入美洲大陆。', category: 'history', region: 'global', significance: 3 },
  { id: 'mig003', year: 375, title: '日耳曼民族大迁徙', description: '匈人的西迁引发了日耳曼各部族的连锁迁移，重塑了欧洲的民族和政治版图。', category: 'history', region: 'global', significance: 3 },
  { id: 'mig004', year: 1620, title: '五月花号', description: '102名清教徒乘坐五月花号抵达新大陆，建立了普利茅斯殖民地。', category: 'history', region: 'usa', significance: 2 },
  { id: 'mig005', year: 1845, title: '爱尔兰大饥荒移民', description: '爱尔兰马铃薯饥荒导致约100万人死亡和200万人移民，多数前往美国。', category: 'history', region: 'ireland', significance: 2 },
  { id: 'mig006', year: 1882, title: '华人排斥法案', description: '美国通过《排华法案》，这是美国历史上第一部针对特定族裔的移民限制法律。', category: 'history', region: 'usa', significance: 2 },
  { id: 'mig007', year: 1910, title: '大迁移', description: '约600万非裔美国人从美国南部乡村迁移到北部和西部城市，改变了美国的文化和政治版图。', category: 'history', region: 'usa', significance: 2 },
  { id: 'mig008', year: 2015, title: '欧洲难民危机', description: '叙利亚内战等冲突导致超过100万难民涌入欧洲，引发了深刻的社会和政治变革。', category: 'history', region: 'global', significance: 2 },
]

// ── 特性287-289: 节日与庆典 ──────────────────────────────
export const festivalEvents: HistoricalEvent[] = [
  { id: 'fes001', year: -776, title: '古代奥林匹克运动会', description: '第一届古代奥林匹克运动会在希腊奥林匹亚举行，此后每四年举办一次，延续近1200年。', category: 'history', region: 'greece', significance: 3 },
  { id: 'fes002', year: -500, title: '酒神节', description: '古雅典的酒神节（狄俄尼索斯节）是希腊戏剧的摇篮，悲剧和喜剧在此诞生。', category: 'art', region: 'greece', significance: 2 },
  { id: 'fes003', year: 7, title: '春节', description: '汉武帝确立太初历后春节日期稳定，成为中华民族最重要的传统节日。', category: 'history', region: 'china', significance: 3 },
  { id: 'fes004', year: 354, title: '圣诞节', description: '罗马教会将12月25日定为耶稣基督的诞辰纪念日，此后成为西方世界最重要的节日。', category: 'religion', region: 'italy', significance: 3 },
  { id: 'fes005', year: 1605, title: '感恩节', description: '英国移民在普利茅斯举行了第一次感恩节庆典，后来成为美国的国家节日。', category: 'history', region: 'usa', significance: 2 },
  { id: 'fes006', year: 1897, title: '维也纳新年音乐会', description: '维也纳爱乐乐团的新年音乐会始于19世纪末，如今全球数亿人通过电视观看。', category: 'music', region: 'austria', significance: 2 },
  { id: 'fes007', year: 1969, title: '伍德斯托克音乐节', description: '纽约州伍德斯托克的三天音乐节吸引了40万人参加，成为反文化运动的标志性事件。', category: 'music', region: 'usa', significance: 2 },
]

// ── 特性290-293: 饮食文化 ────────────────────────────────
export const foodCultureEvents: HistoricalEvent[] = [
  { id: 'fod001', year: -8000, title: '啤酒酿造', description: '美索不达米亚的苏美尔人是最早的啤酒酿造者，啤酒是古代工人的重要饮品和营养来源。', category: 'history', region: 'iraq', significance: 2 },
  { id: 'fod002', year: -6000, title: '葡萄酒起源', description: '高加索地区（今格鲁吉亚）最早开始酿造葡萄酒，是人类最古老的酒精饮料之一。', category: 'history', region: 'global', significance: 2 },
  { id: 'fod003', year: -2737, title: '茶的发现', description: '传说中的神农氏发现了茶叶的饮用价值，茶后来成为世界上消费量最大的饮料之一。', category: 'history', region: 'china', significance: 3 },
  { id: 'fod004', year: 800, title: '咖啡的发现', description: '传说埃塞俄比亚牧羊人发现山羊食用咖啡果后精力充沛，咖啡的饮用习惯由此传播。', category: 'history', region: 'ethiopia', significance: 2 },
  { id: 'fod005', year: 1519, title: '巧克力传入欧洲', description: '西班牙征服者在阿兹特克帝国发现了可可饮料，巧克力从此传入欧洲并风靡全球。', category: 'history', region: 'mexico', significance: 2 },
  { id: 'fod006', year: 1765, title: '第一家餐厅', description: '巴黎出现了第一家现代意义上的餐厅，客人可以从菜单中选择菜品，在独立桌位用餐。', category: 'history', region: 'france', significance: 2 },
  { id: 'fod007', year: 1810, title: '罐头食品', description: '法国人尼古拉·阿佩尔发明了罐头食品保存法，拿破仑为其颁发了1.2万法郎的奖金。', category: 'technology', region: 'france', significance: 2 },
  { id: 'fod008', year: 1940, title: '麦当劳创立', description: '麦当劳兄弟在加州开设了第一家汉堡餐厅，后来发展为全球最大的快餐连锁。', category: 'history', region: 'usa', significance: 2 },
  { id: 'fod009', year: 1958, title: '方便面诞生', description: '安藤百福发明了世界上第一款方便面"鸡肉拉面"，这一发明改变了全球饮食习惯。', category: 'technology', region: 'japan', significance: 2, figure: '安藤百福' },
]

// ── 特性294-296: 香料贸易 ────────────────────────────────
export const spiceTradeEvents: HistoricalEvent[] = [
  { id: 'spi001', year: -2000, title: '肉桂贸易', description: '古埃及人从东南亚进口肉桂用于防腐和宗教仪式，这是世界上最早的长途香料贸易。', category: 'history', region: 'egypt', significance: 2 },
  { id: 'spi002', year: -100, title: '罗马香料之路', description: '罗马帝国每年花费巨额金银从印度和阿拉伯进口胡椒、肉桂和丁香。', category: 'history', region: 'global', significance: 2 },
  { id: 'spi003', year: 1498, title: '达伽马到达印度', description: '瓦斯科·达伽马绕过好望角到达印度，开辟了从欧洲到亚洲的海上香料贸易航线。', category: 'exploration', region: 'portugal', significance: 3, figure: '达伽马' },
  { id: 'spi004', year: 1602, title: '荷兰东印度公司', description: '荷兰东印度公司成立，垄断了东南亚的香料贸易，是人类历史上第一个跨国公司和股份公司。', category: 'history', region: 'netherlands', significance: 3 },
  { id: 'spi005', year: 1770, title: '香料垄断终结', description: '法国人将丁香和肉豆蔻偷运出摩鹿加群岛移植到毛里求斯，荷兰的香料垄断开始瓦解。', category: 'history', region: 'global', significance: 2 },
]

// ── 特性297-298: 地图学 ──────────────────────────────────
export const cartographyEvents: HistoricalEvent[] = [
  { id: 'map001', year: -600, title: '巴比伦世界地图', description: '巴比伦泥板上的世界地图是现存最古老的世界地图，将巴比伦置于世界中心。', category: 'science', region: 'iraq', significance: 2 },
  { id: 'map002', year: 150, title: '托勒密地理学', description: '托勒密的《地理学》用经纬度坐标描述世界，虽有误差但影响了地图学1000多年。', category: 'science', region: 'egypt', significance: 3, figure: '托勒密' },
  { id: 'map003', year: 1154, title: '伊德里西世界地图', description: '阿拉伯地理学家伊德里西为西西里国王绘制了中世纪最精确的世界地图。', category: 'science', region: 'morocco', significance: 2 },
  { id: 'map004', year: 1569, title: '墨卡托投影', description: '墨卡托发明了等角投影法绘制世界地图，航海者终于能在地图上画出直线航线。', category: 'science', region: 'belgium', significance: 3, figure: '墨卡托' },
  { id: 'map005', year: 1891, title: '国际百万分之一地图', description: '国际地理大会提议绘制统一比例尺的全球地图，是全球测绘标准化的起点。', category: 'science', region: 'global', significance: 2 },
  { id: 'map006', year: 2005, title: 'Google地球', description: '谷歌发布Google Earth，普通人第一次可以在电脑上自由浏览高分辨率的全球卫星影像。', category: 'technology', region: 'usa', significance: 2 },
]

// ── 特性299-300: 度量衡 ──────────────────────────────────
export const measurementEvents: HistoricalEvent[] = [
  { id: 'mea001', year: -3000, title: '古埃及肘尺', description: '古埃及人以法老的前臂为标准创造了"肘尺"，用于建造金字塔等精密工程。', category: 'technology', region: 'egypt', significance: 2 },
  { id: 'mea002', year: -221, title: '秦始皇统一度量衡', description: '秦始皇统一了全国的长度、容量和重量标准，建立了中国最早的标准化体系。', category: 'history', region: 'china', significance: 3 },
  { id: 'mea003', year: 1791, title: '米制的诞生', description: '法国国民大会定义了"米"为从北极到赤道距离的千万分之一，公制计量体系由此建立。', category: 'science', region: 'france', significance: 3 },
  { id: 'mea004', year: 1875, title: '米制公约', description: '17个国家签署了《米制公约》，成立国际计量局，统一全球计量标准。', category: 'science', region: 'global', significance: 2 },
  { id: 'mea005', year: 1960, title: '国际单位制(SI)', description: '国际计量大会正式建立了国际单位制（SI），以米、千克、秒等七个基本单位为基础。', category: 'science', region: 'global', significance: 2 },
  { id: 'mea006', year: 2019, title: 'SI单位重新定义', description: '国际单位制的七个基本单位全部改为基于物理常数定义，千克不再依赖实物基准。', category: 'science', region: 'global', significance: 2 },
]
