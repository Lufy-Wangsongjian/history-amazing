import type { HistoricalEvent } from './types'

// ============================================================
// Round 10 扩充包（特性 236-270）
// 货币与金融深化 + 保险与精算 + 银行史 + 间谍与情报 + 游戏史
// + 漫画与动画 + 广告与营销 + 博物馆 + 动物保护 + 消防与应急
// + 司法制度 + 奴隶制废除 + 印刷深化 + 农业深化 + 能源史
// ============================================================

// ── 特性236-238: 货币与金融史深化 ────────────────────────
export const currencyEvents: HistoricalEvent[] = [
  { id: 'cur001', year: -3000, title: '美索不达米亚银本位', description: '苏美尔人使用银锭作为价值尺度和交换媒介，建立了最早的货币体系。', category: 'history', region: 'iraq', significance: 2 },
  { id: 'cur002', year: -700, title: '吕底亚金币', description: '小亚细亚吕底亚王国铸造了世界上最早的标准化金属硬币，货币经济由此诞生。', category: 'history', region: 'turkey', significance: 3 },
  { id: 'cur003', year: 1024, title: '世界最早的纸币', description: '北宋益州发行交子，是世界上最早的政府发行的纸币。', category: 'history', region: 'china', significance: 3 },
  { id: 'cur004', year: 1609, title: '阿姆斯特丹银行', description: '阿姆斯特丹银行成立，引入了标准化的银行账户和转账系统，是现代中央银行的雏形。', category: 'history', region: 'netherlands', significance: 2 },
  { id: 'cur005', year: 1694, title: '英格兰银行', description: '英格兰银行成立，是世界上最早的中央银行之一，为政府提供贷款并发行纸币。', category: 'history', region: 'uk', significance: 3 },
  { id: 'cur006', year: 1792, title: '美元诞生', description: '美国国会通过《铸币法案》，确立了美元为国家货币单位，采用十进制。', category: 'history', region: 'usa', significance: 2 },
  { id: 'cur007', year: 1871, title: '金本位制', description: '德国统一后采用金本位制，随后各主要国家纷纷效仿，全球金融体系有了统一标准。', category: 'history', region: 'global', significance: 2 },
  { id: 'cur008', year: 1944, title: '布雷顿森林体系', description: '44国代表在布雷顿森林建立了以美元为中心的固定汇率体系，美元与黄金挂钩。', category: 'history', region: 'usa', significance: 3 },
  { id: 'cur009', year: 1971, title: '尼克松冲击', description: '尼克松宣布美元与黄金脱钩，布雷顿森林体系崩溃，浮动汇率时代开始。', category: 'history', region: 'usa', significance: 3, figure: '尼克松' },
  { id: 'cur010', year: 2009, title: '比特币诞生', description: '中本聪发布比特币白皮书并挖出创世区块，去中心化加密货币时代开始。', category: 'technology', region: 'global', significance: 3 },
]

// ── 特性239-240: 保险与精算 ──────────────────────────────
export const insuranceEvents: HistoricalEvent[] = [
  { id: 'ins001', year: -1750, title: '汉谟拉比法典中的保险', description: '巴比伦《汉谟拉比法典》中规定了商队贷款的风险分担条款，是保险概念的最早记录。', category: 'history', region: 'iraq', significance: 2 },
  { id: 'ins002', year: 1347, title: '最早的海上保险合同', description: '热那亚商人签订了已知最早的海上保险合同，为地中海贸易提供风险保障。', category: 'history', region: 'italy', significance: 2 },
  { id: 'ins003', year: 1666, title: '伦敦大火与火灾保险', description: '伦敦大火的惨痛经历催生了最早的火灾保险公司，1680年"火灾办公室"成立。', category: 'history', region: 'uk', significance: 2 },
  { id: 'ins004', year: 1688, title: '劳合社', description: '伦敦劳合咖啡馆成为海上保险的交易中心，后发展为世界上最著名的保险市场——劳合社。', category: 'history', region: 'uk', significance: 2 },
  { id: 'ins005', year: 1762, title: '精算学诞生', description: '英国公平人寿保险公司首次使用数学和统计方法计算保费，现代精算科学诞生。', category: 'science', region: 'uk', significance: 2 },
]

// ── 特性241-243: 间谍与情报史 ────────────────────────────
export const espionageEvents: HistoricalEvent[] = [
  { id: 'esp001', year: -500, title: '孙子论间谍', description: '孙子在《孙子兵法》中专门论述了间谍的五种类型和使用方法，是最早的系统性情报理论。', category: 'warfare', region: 'china', significance: 2, figure: '孙子' },
  { id: 'esp002', year: 1585, title: '沃辛厄姆情报网', description: '弗朗西斯·沃辛厄姆为伊丽莎白一世建立了英国历史上第一个系统化的间谍网络。', category: 'history', region: 'uk', significance: 2 },
  { id: 'esp003', year: 1917, title: '齐默尔曼电报', description: '英国截获并破译了德国外长齐默尔曼的秘密电报，促使美国加入一战。', category: 'warfare', region: 'uk', significance: 2 },
  { id: 'esp004', year: 1942, title: '曼哈顿计划间谍', description: '苏联间谍成功渗透美国曼哈顿计划，获取了原子弹的关键技术信息。', category: 'warfare', region: 'usa', significance: 2 },
  { id: 'esp005', year: 1947, title: 'CIA成立', description: '美国中央情报局成立，成为冷战时期西方阵营的核心情报机构。', category: 'history', region: 'usa', significance: 2 },
  { id: 'esp006', year: 1961, title: '柏林间谍隧道', description: '冷战期间，CIA和MI6在柏林地下挖掘了一条隧道窃听苏联通信电缆。', category: 'history', region: 'germany', significance: 1 },
  { id: 'esp007', year: 1985, title: '间谍年', description: '1985年被称为"间谍年"，多名西方国家的资深间谍被揭露为苏联间谍。', category: 'history', region: 'usa', significance: 1 },
]

// ── 特性244-246: 游戏史 ──────────────────────────────────
export const gamingEvents: HistoricalEvent[] = [
  { id: 'gam001', year: -3000, title: '乌尔皇家棋盘', description: '苏美尔乌尔城出土了约5000年前的棋盘游戏，是世界上最古老的桌游之一。', category: 'history', region: 'iraq', significance: 2 },
  { id: 'gam002', year: -500, title: '围棋', description: '围棋起源于中国春秋战国时期，是人类发明的最复杂的棋类游戏之一。', category: 'history', region: 'china', significance: 2 },
  { id: 'gam003', year: 600, title: '国际象棋前身', description: '恰图兰卡棋在印度诞生，经波斯传入阿拉伯，最终演变为现代国际象棋。', category: 'history', region: 'india', significance: 2 },
  { id: 'gam004', year: 1903, title: '大富翁原型', description: '利兹·玛吉发明了《地主游戏》，旨在批判垄断资本主义，后被改编为《大富翁》。', category: 'history', region: 'usa', significance: 1 },
  { id: 'gam005', year: 1972, title: 'Pong', description: '雅达利的Pong是第一款商业成功的电子游戏，电子游戏产业由此起步。', category: 'technology', region: 'usa', significance: 2 },
  { id: 'gam006', year: 1985, title: '超级马里奥兄弟', description: '任天堂的超级马里奥兄弟在FC上发售，拯救了北美电子游戏市场，成为文化符号。', category: 'technology', region: 'japan', significance: 2 },
  { id: 'gam007', year: 2004, title: '魔兽世界', description: '暴雪的魔兽世界上线，高峰期拥有1200万订阅者，定义了大型多人在线角色扮演游戏。', category: 'technology', region: 'usa', significance: 2 },
  { id: 'gam008', year: 2017, title: '电竞入亚运会', description: '电子竞技被列为2022年亚运会正式比赛项目，游戏从娱乐走向竞技体育。', category: 'history', region: 'global', significance: 2 },
]

// ── 特性247-249: 漫画与动画 ──────────────────────────────
export const comicsEvents: HistoricalEvent[] = [
  { id: 'com001', year: 1827, title: '现代漫画诞生', description: '瑞士画家鲁道夫·托普弗创作了公认的第一部现代连环漫画，用连续画面讲述故事。', category: 'art', region: 'switzerland', significance: 2 },
  { id: 'com002', year: 1895, title: '报纸连环漫画', description: '《黄孩子》在《纽约世界报》连载，是美国第一个成功的报纸连环漫画。', category: 'art', region: 'usa', significance: 2 },
  { id: 'com003', year: 1938, title: '超人诞生', description: '超人在《动作漫画》第一期登场，开创了超级英雄漫画的黄金时代。', category: 'art', region: 'usa', significance: 3 },
  { id: 'com004', year: 1947, title: '手冢治虫《新宝岛》', description: '手冢治虫的《新宝岛》开创了电影分镜式的漫画叙事手法，被称为"漫画之神"。', category: 'art', region: 'japan', significance: 3, figure: '手冢治虫' },
  { id: 'com005', year: 1963, title: '埃尔热《丁丁历险记》完结', description: '比利时漫画家埃尔热的丁丁系列以其精细的绘画和全球冒险故事影响了整个欧洲漫画。', category: 'art', region: 'belgium', significance: 2, figure: '埃尔热' },
  { id: 'com006', year: 1986, title: '《守望者》', description: '阿兰·摩尔的《守望者》以其深刻的主题和文学性证明了漫画可以是严肃文学。', category: 'art', region: 'uk', significance: 2 },
  { id: 'com007', year: 1997, title: '《海贼王》连载', description: '尾田荣一郎的《海贼王》开始在《少年JUMP》连载，成为史上发行量最大的漫画系列。', category: 'art', region: 'japan', significance: 2 },
  { id: 'com008', year: 1928, title: '米老鼠诞生', description: '华特·迪士尼的米老鼠在《汽船威利号》中首次亮相，成为全球最知名的卡通形象。', category: 'art', region: 'usa', significance: 3, figure: '迪士尼' },
  { id: 'com009', year: 1937, title: '白雪公主与七个小矮人', description: '迪士尼的《白雪公主》是世界上第一部彩色动画长片，开创了动画电影产业。', category: 'art', region: 'usa', significance: 3 },
  { id: 'com010', year: 1988, title: '宫崎骏《龙猫》', description: '宫崎骏的《龙猫》将日本动画推向全球观众，龙猫成为吉卜力工作室的标志。', category: 'art', region: 'japan', significance: 2, figure: '宫崎骏' },
]

// ── 特性250-251: 广告与营销 ──────────────────────────────
export const advertisingEvents: HistoricalEvent[] = [
  { id: 'adv001', year: -3000, title: '古埃及广告', description: '古埃及城市中的莎草纸海报和墙壁刻文是最早的商业广告形式。', category: 'history', region: 'egypt', significance: 1 },
  { id: 'adv002', year: 1472, title: '最早的印刷广告', description: '英国印刷商威廉·卡克斯顿印刷了第一张广告传单，宣传他出版的宗教书籍。', category: 'history', region: 'uk', significance: 1 },
  { id: 'adv003', year: 1836, title: '报纸广告模式', description: '法国报纸《新闻报》首次以广告收入补贴降低售价，开创了广告支撑媒体的商业模式。', category: 'history', region: 'france', significance: 2 },
  { id: 'adv004', year: 1941, title: '第一条电视广告', description: 'NBC播出了宝路华手表的10秒广告，电视广告时代正式开始。', category: 'history', region: 'usa', significance: 2 },
  { id: 'adv005', year: 1994, title: '第一个网络横幅广告', description: 'AT&T在HotWired网站投放了第一个互联网横幅广告，数字广告时代来临。', category: 'technology', region: 'usa', significance: 2 },
  { id: 'adv006', year: 2000, title: 'Google AdWords', description: '谷歌推出AdWords关键词广告系统，搜索引擎广告成为互联网经济的支柱。', category: 'technology', region: 'usa', significance: 2 },
]

// ── 特性252-253: 博物馆 ──────────────────────────────────
export const museumEvents: HistoricalEvent[] = [
  { id: 'mus001', year: -530, title: '恩尼加尔迪博物馆', description: '巴比伦公主恩尼加尔迪在乌尔城建立了一个收藏古物的房间，被认为是世界上最早的博物馆。', category: 'history', region: 'iraq', significance: 2 },
  { id: 'mus002', year: 1683, title: '阿什莫林博物馆', description: '牛津大学的阿什莫林博物馆开放，是世界上第一个现代意义上的公共博物馆。', category: 'history', region: 'uk', significance: 2 },
  { id: 'mus003', year: 1753, title: '大英博物馆', description: '大英博物馆成立，向公众免费开放，如今收藏超过800万件来自世界各地的文物。', category: 'history', region: 'uk', significance: 3 },
  { id: 'mus004', year: 1793, title: '卢浮宫对公众开放', description: '法国大革命后卢浮宫向公众开放，将王室收藏变为人民的财产。', category: 'art', region: 'france', significance: 3 },
  { id: 'mus005', year: 1846, title: '史密森尼学会', description: '美国国会用英国科学家史密森的遗赠建立了史密森尼学会，如今管理着19座博物馆。', category: 'history', region: 'usa', significance: 2 },
  { id: 'mus006', year: 1925, title: '故宫博物院', description: '紫禁城改为故宫博物院对公众开放，中国皇室的宝藏从此成为全民共享的文化遗产。', category: 'art', region: 'china', significance: 3 },
  { id: 'mus007', year: 1997, title: '毕尔巴鄂古根海姆', description: '弗兰克·盖里设计的古根海姆博物馆落成，以惊人的建筑造型复兴了整座城市的经济。', category: 'architecture', region: 'spain', significance: 2 },
]

// ── 特性254-255: 动物保护与生态 ──────────────────────────
export const conservationEvents: HistoricalEvent[] = [
  { id: 'con001', year: 1872, title: '黄石国家公园', description: '美国建立了世界上第一个国家公园——黄石公园，开创了自然保护的国家公园模式。', category: 'history', region: 'usa', significance: 3 },
  { id: 'con002', year: 1903, title: '第一个野生动物保护区', description: '西奥多·罗斯福建立了美国第一个国家野生动物保护区——鹈鹕岛。', category: 'history', region: 'usa', significance: 2, figure: '罗斯福' },
  { id: 'con003', year: 1948, title: 'IUCN成立', description: '世界自然保护联盟在法国枫丹白露成立，开始系统性地评估全球物种的濒危状况。', category: 'science', region: 'global', significance: 2 },
  { id: 'con004', year: 1961, title: 'WWF成立', description: '世界自然基金会成立，大熊猫标志成为全球最知名的自然保护符号。', category: 'science', region: 'global', significance: 2 },
  { id: 'con005', year: 1973, title: 'CITES公约', description: '《濒危野生动植物种国际贸易公约》签署，限制了濒危物种的国际贸易。', category: 'science', region: 'global', significance: 2 },
  { id: 'con006', year: 1987, title: '最后一只金蟾蜍', description: '哥斯达黎加蒙特维多的金蟾蜍是最早因气候变化被宣告灭绝的物种之一。', category: 'science', region: 'global', significance: 2 },
]

// ── 特性256-257: 消防与灾害应对 ──────────────────────────
export const firefightingEvents: HistoricalEvent[] = [
  { id: 'fir001', year: -24, title: '罗马消防队', description: '奥古斯都在罗马大火后建立了"守夜人"消防队，是人类历史上第一支有组织的消防力量。', category: 'history', region: 'italy', significance: 2 },
  { id: 'fir002', year: 1631, title: '第一辆消防车', description: '德国工程师汉斯·豪奇发明了第一辆手动消防泵车，提高了灭火效率。', category: 'technology', region: 'germany', significance: 2 },
  { id: 'fir003', year: 1736, title: '富兰克林消防队', description: '本杰明·富兰克林在费城创建了美国第一支志愿消防队。', category: 'history', region: 'usa', significance: 2, figure: '富兰克林' },
  { id: 'fir004', year: 1871, title: '芝加哥大火', description: '芝加哥大火烧毁了全城三分之一的建筑，灾后重建催生了摩天大楼和现代建筑规范。', category: 'history', region: 'usa', significance: 2 },
  { id: 'fir005', year: 1906, title: '旧金山大地震', description: '旧金山地震及随后的大火摧毁了大部分城市，推动了现代抗震建筑标准的制定。', category: 'history', region: 'usa', significance: 2 },
]

// ── 特性258-260: 司法制度演变 ────────────────────────────
export const judicialEvents: HistoricalEvent[] = [
  { id: 'jud001', year: -1750, title: '汉谟拉比法典', description: '巴比伦国王汉谟拉比颁布了人类最早的系统性法律之一，刻在石柱上的282条法律至今可读。', category: 'history', region: 'iraq', significance: 3 },
  { id: 'jud002', year: -450, title: '罗马十二铜表法', description: '罗马共和国颁布十二铜表法，将法律从贵族垄断变为公开文本，是罗马法的基石。', category: 'history', region: 'italy', significance: 3 },
  { id: 'jud003', year: 529, title: '查士丁尼法典', description: '拜占庭皇帝查士丁尼编纂了罗马法大全，成为后世欧洲大陆法系的基础。', category: 'history', region: 'turkey', significance: 3, figure: '查士丁尼' },
  { id: 'jud004', year: 1689, title: '英国权利法案', description: '英国议会通过《权利法案》，限制王权并确立了议会主权原则。', category: 'history', region: 'uk', significance: 3 },
  { id: 'jud005', year: 1804, title: '拿破仑法典', description: '《拿破仑法典》是现代民法典的典范，至今仍是法国和许多国家法律体系的基础。', category: 'history', region: 'france', significance: 3, figure: '拿破仑' },
  { id: 'jud006', year: 1945, title: '纽伦堡审判', description: '二战后纽伦堡国际军事法庭审判纳粹战犯，确立了"反人类罪"的国际法原则。', category: 'history', region: 'germany', significance: 3 },
  { id: 'jud007', year: 1998, title: '国际刑事法院', description: '120个国家签署《罗马规约》建立国际刑事法院，可追究种族灭绝、战争罪等国际犯罪。', category: 'history', region: 'global', significance: 2 },
]

// ── 特性261-263: 奴隶制与废除 ────────────────────────────
export const abolitionEvents: HistoricalEvent[] = [
  { id: 'abl001', year: -2000, title: '古代奴隶制', description: '苏美尔、巴比伦、埃及等古代文明普遍存在奴隶制度，战俘和债务人沦为奴隶。', category: 'history', region: 'global', significance: 2 },
  { id: 'abl002', year: 73, title: '斯巴达克斯起义', description: '角斗士斯巴达克斯领导了罗马历史上最大的奴隶起义，7万奴隶组成军队对抗罗马军团。', category: 'warfare', region: 'italy', significance: 2, figure: '斯巴达克斯' },
  { id: 'abl003', year: 1562, title: '大西洋奴隶贸易', description: '英国人约翰·霍金斯开始了英国的大西洋奴隶贸易，此后三百年约1200万非洲人被贩卖到美洲。', category: 'history', region: 'global', significance: 3 },
  { id: 'abl004', year: 1772, title: '萨默塞特案', description: '英国法院裁定奴隶在踏上英国本土后即获自由，废奴运动获得法律先例。', category: 'history', region: 'uk', significance: 2 },
  { id: 'abl005', year: 1807, title: '英国废除奴隶贸易', description: '英国议会通过法案废除了大西洋奴隶贸易，皇家海军开始在海上拦截贩奴船只。', category: 'history', region: 'uk', significance: 3 },
  { id: 'abl006', year: 1833, title: '英国全面废奴', description: '英国通过《废奴法案》，在整个大英帝国范围内废除奴隶制，80万奴隶获得自由。', category: 'history', region: 'uk', significance: 3 },
  { id: 'abl007', year: 1863, title: '解放奴隶宣言', description: '林肯总统发布解放奴隶宣言，宣布南方叛乱州的奴隶获得自由。', category: 'history', region: 'usa', significance: 3, figure: '林肯' },
  { id: 'abl008', year: 1888, title: '巴西废奴', description: '巴西是西半球最后一个废除奴隶制的国家，75万奴隶获得自由。', category: 'history', region: 'brazil', significance: 2 },
]

// ── 特性264-266: 农业深化 ────────────────────────────────
export const agricultureEvents: HistoricalEvent[] = [
  { id: 'agr001', year: -10000, title: '新月沃地农业革命', description: '人类在两河流域的新月沃地开始种植小麦和大麦，农业革命改变了人类生存方式。', category: 'history', region: 'iraq', significance: 3 },
  { id: 'agr002', year: -7000, title: '长江流域稻作', description: '中国长江中下游地区开始种植水稻，亚洲最重要的粮食作物由此驯化。', category: 'history', region: 'china', significance: 3 },
  { id: 'agr003', year: -5000, title: '玉米驯化', description: '中美洲原住民从野生类蜀黍中驯化出玉米，它后来成为美洲文明的基础粮食。', category: 'history', region: 'mexico', significance: 2 },
  { id: 'agr004', year: -3000, title: '犁的发明', description: '美索不达米亚人发明了牛拉犁，农业生产力大幅提升，人口增长和城市化成为可能。', category: 'technology', region: 'iraq', significance: 3 },
  { id: 'agr005', year: 1701, title: '杰思罗·塔尔条播机', description: '杰思罗·塔尔发明了马拉条播机，种子播种更均匀更节省，英国农业革命由此开始。', category: 'technology', region: 'uk', significance: 2 },
  { id: 'agr006', year: 1842, title: '化学肥料', description: '约翰·贝尼特·劳斯建立了世界上第一家人造肥料工厂，化肥大幅提高了农业产量。', category: 'technology', region: 'uk', significance: 2 },
  { id: 'agr007', year: 1961, title: '绿色革命', description: '诺曼·布劳格培育的高产小麦品种在墨西哥和印度推广，避免了数十亿人的饥荒。', category: 'science', region: 'global', significance: 3, figure: '布劳格' },
  { id: 'agr008', year: 1994, title: '第一种转基因食品', description: 'FDA批准了第一种转基因食品——延熟番茄Flavr Savr上市销售。', category: 'technology', region: 'usa', significance: 2 },
]

// ── 特性267-270: 能源史 ──────────────────────────────────
export const energyEvents: HistoricalEvent[] = [
  { id: 'eng001', year: -500000, title: '人类控制火', description: '直立人学会了控制和使用火，这是人类技术史上最根本的突破。', category: 'technology', region: 'global', significance: 3 },
  { id: 'eng002', year: 200, title: '罗马水磨', description: '罗马人广泛使用水力驱动的磨坊，利用水流能量替代了人力和畜力。', category: 'technology', region: 'italy', significance: 2 },
  { id: 'eng003', year: 1100, title: '风车磨坊', description: '荷兰和英国开始大量使用风车磨坊，风能成为中世纪重要的动力来源。', category: 'technology', region: 'netherlands', significance: 2 },
  { id: 'eng004', year: 1712, title: '纽可门蒸汽机', description: '纽可门发明了第一台实用的蒸汽机，用于煤矿抽水，化石能源时代由此开启。', category: 'technology', region: 'uk', significance: 2 },
  { id: 'eng005', year: 1859, title: '第一口油井', description: '埃德温·德雷克在宾夕法尼亚州钻出了美国第一口商业石油井，石油工业诞生。', category: 'technology', region: 'usa', significance: 3 },
  { id: 'eng006', year: 1882, title: '爱迪生发电厂', description: '爱迪生在纽约珍珠街建立了第一座商用发电厂，为曼哈顿提供电力照明。', category: 'technology', region: 'usa', significance: 3, figure: '爱迪生' },
  { id: 'eng007', year: 1942, title: '第一座核反应堆', description: '恩里科·费米在芝加哥大学建成了第一座可控核裂变反应堆CP-1。', category: 'science', region: 'usa', significance: 3, figure: '费米' },
  { id: 'eng008', year: 1954, title: '第一座核电站', description: '苏联的奥布宁斯克核电站开始向电网供电，是世界上第一座核能发电站。', category: 'technology', region: 'russia', significance: 2 },
  { id: 'eng009', year: 1973, title: '石油危机', description: '阿拉伯国家对西方实施石油禁运，油价暴涨四倍，全球经济陷入滞胀。', category: 'history', region: 'global', significance: 3 },
  { id: 'eng010', year: 2016, title: '可再生能源超越煤炭', description: '全球可再生能源新增装机容量首次超过化石燃料，能源转型迎来拐点。', category: 'technology', region: 'global', significance: 2 },
]
