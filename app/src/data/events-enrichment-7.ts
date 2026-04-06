import type { HistoricalEvent } from './types'

// ============================================================
// Round 5 扩充包（特性 101-135）
// 电影史 + 戏剧表演 + 舞蹈 + 建筑深化 + 教育制度
// + 环境保护 + 外交与条约 + 体育史 + 传媒出版 + 时尚设计
// + 数学深化 + 天文深化 + 海洋探索 + 城市文明 + 摄影史
// ============================================================

// ── 特性101-103: 电影史 ──────────────────────────────
export const cinemaEvents: HistoricalEvent[] = [
  { id: 'cin001', year: 1895, title: '卢米埃尔兄弟首映', description: '1895年12月28日，卢米埃尔兄弟在巴黎大咖啡馆放映《工厂大门》等短片，标志着电影的诞生。', category: 'art', region: 'france', significance: 3, figure: '卢米埃尔兄弟' },
  { id: 'cin002', year: 1902, title: '梅里爱《月球旅行记》', description: '乔治·梅里爱拍摄了科幻电影先驱之作，开创了特效和叙事电影的先河。', category: 'art', region: 'france', significance: 2, figure: '梅里爱' },
  { id: 'cin003', year: 1915, title: '格里菲斯《一个国家的诞生》', description: '大卫·格里菲斯执导的长片革新了电影语言（交叉剪辑、特写镜头），尽管内容极具争议。', category: 'art', region: 'usa', significance: 2, figure: '格里菲斯' },
  { id: 'cin004', year: 1927, title: '有声电影诞生', description: '华纳兄弟的《爵士歌王》成为第一部商业有声长片，默片时代终结。', category: 'technology', region: 'usa', significance: 3 },
  { id: 'cin005', year: 1937, title: '迪士尼《白雪公主》', description: '世界上第一部动画长片，开创了动画电影产业。', category: 'art', region: 'usa', significance: 2 },
  { id: 'cin006', year: 1941, title: '奥逊·威尔斯《公民凯恩》', description: '被誉为影史最伟大的电影之一，革新了深焦摄影、非线性叙事和声音设计。', category: 'art', region: 'usa', significance: 3, figure: '奥逊·威尔斯' },
  { id: 'cin007', year: 1954, title: '黑泽明《七武士》', description: '日本电影大师黑泽明的杰作，对世界动作电影和叙事结构产生深远影响。', category: 'art', region: 'japan', significance: 3, figure: '黑泽明' },
  { id: 'cin008', year: 1959, title: '法国新浪潮电影运动', description: '特吕弗《四百击》和戈达尔《精疲力尽》领衔的法国新浪潮，彻底改变了电影美学。', category: 'art', region: 'france', significance: 2 },
  { id: 'cin009', year: 1977, title: '卢卡斯《星球大战》', description: '乔治·卢卡斯的太空歌剧开创了大片时代和视觉特效革命。', category: 'art', region: 'usa', significance: 2, figure: '卢卡斯' },
  { id: 'cin010', year: 1988, title: '宫崎骏《龙猫》', description: '宫崎骏创作的动画经典，吉卜力工作室成为世界动画艺术的标杆。', category: 'art', region: 'japan', significance: 2, figure: '宫崎骏' },
  { id: 'cin011', year: 1994, title: '中国第五代导演崛起', description: '张艺谋《活着》、陈凯歌《霸王别姬》等作品将中国电影推向世界舞台。', category: 'art', region: 'china', significance: 2, figure: '张艺谋' },
  { id: 'cin012', year: 2019, title: '奉俊昊《寄生虫》', description: '韩国电影《寄生虫》获得奥斯卡最佳影片奖，成为首部获此殊荣的非英语电影。', category: 'art', region: 'korea', significance: 2, figure: '奉俊昊' },
]

// ── 特性104-106: 戏剧与表演艺术 ──────────────────────
export const theaterEvents: HistoricalEvent[] = [
  { id: 'tht001', year: -534, title: '古希腊悲剧诞生', description: '雅典酒神节上忒斯庇斯成为第一位演员，从合唱队中独立出来进行表演，戏剧由此诞生。', category: 'art', region: 'greece', significance: 3, figure: '忒斯庇斯' },
  { id: 'tht002', year: -472, title: '埃斯库罗斯《波斯人》', description: '埃斯库罗斯被称为"悲剧之父"，引入第二位演员，增加了戏剧的对话和冲突。', category: 'art', region: 'greece', significance: 2, figure: '埃斯库罗斯' },
  { id: 'tht003', year: -441, title: '索福克勒斯《安提戈涅》', description: '索福克勒斯将演员增加到三位，强化个人命运与社会秩序的冲突。', category: 'art', region: 'greece', significance: 2, figure: '索福克勒斯' },
  { id: 'tht004', year: 200, title: '罗马竞技场表演', description: '罗马斗兽场举办大规模演出——角斗、模拟海战、戏剧再现神话，成为帝国权力的象征。', category: 'art', region: 'italy', significance: 2 },
  { id: 'tht005', year: 1300, title: '元杂剧黄金时代', description: '关汉卿、王实甫等创作了《窦娥冤》《西厢记》，中国戏曲艺术达到第一个高峰。', category: 'art', region: 'china', significance: 2, figure: '关汉卿' },
  { id: 'tht006', year: 1600, title: '歌舞伎诞生', description: '日本歌舞伎戏剧在京都由出云阿国创立，成为日本最具代表性的传统表演艺术。', category: 'art', region: 'japan', significance: 2 },
  { id: 'tht007', year: 1664, title: '莫里哀《伪君子》', description: '法国喜剧大师莫里哀的代表作对伪善的辛辣讽刺，成为欧洲喜剧的巅峰。', category: 'literature', region: 'france', significance: 2, figure: '莫里哀' },
  { id: 'tht008', year: 1790, title: '京剧的形成', description: '四大徽班进京，徽调与汉调、昆曲、秦腔融合，中国京剧逐渐成型。', category: 'art', region: 'china', significance: 2 },
  { id: 'tht009', year: 1898, title: '斯坦尼斯拉夫斯基体系', description: '俄国导演斯坦尼斯拉夫斯基创立的表演体系成为现代戏剧的基石。', category: 'art', region: 'russia', significance: 2, figure: '斯坦尼斯拉夫斯基' },
  { id: 'tht010', year: 1943, title: '百老汇黄金时代', description: '罗杰斯与哈默斯坦的《俄克拉荷马！》开创了现代音乐剧的叙事整合形式。', category: 'music', region: 'usa', significance: 2 },
  { id: 'tht011', year: 1957, title: '《西区故事》', description: '伯恩斯坦作曲的音乐剧将莎士比亚搬进纽约街头，音乐剧达到艺术新高度。', category: 'music', region: 'usa', significance: 2, figure: '伯恩斯坦' },
]

// ── 特性107-108: 舞蹈史 ──────────────────────────────
export const danceEvents: HistoricalEvent[] = [
  { id: 'dnc001', year: -3000, title: '古埃及祭祀舞蹈', description: '古埃及墓壁画记录了最早的有组织舞蹈，舞蹈是宗教仪式的核心组成。', category: 'art', region: 'egypt', significance: 1 },
  { id: 'dnc002', year: 1581, title: '芭蕾舞诞生', description: '法国宫廷上演《皇后的喜剧芭蕾》，标志着芭蕾作为独立艺术形式的诞生。', category: 'art', region: 'france', significance: 2 },
  { id: 'dnc003', year: 1832, title: '浪漫芭蕾·《仙女》', description: '玛丽·塔里奥尼在巴黎首演《仙女》，脚尖技术成为芭蕾的标志。', category: 'art', region: 'france', significance: 2 },
  { id: 'dnc004', year: 1877, title: '柴可夫斯基《天鹅湖》', description: '柴可夫斯基创作的芭蕾经典至今仍是世界上演最多的芭蕾舞剧。', category: 'music', region: 'russia', significance: 2, figure: '柴可夫斯基' },
  { id: 'dnc005', year: 1913, title: '斯特拉文斯基《春之祭》', description: '尼金斯基编舞的《春之祭》在巴黎首演引发骚乱，标志着现代舞蹈的革命性开端。', category: 'music', region: 'france', significance: 3, figure: '斯特拉文斯基' },
  { id: 'dnc006', year: 1958, title: '玛莎·格雷厄姆与现代舞', description: '美国编舞家玛莎·格雷厄姆发展出以"收缩与释放"为核心的现代舞技术体系。', category: 'art', region: 'usa', significance: 2, figure: '玛莎·格雷厄姆' },
]

// ── 特性109-112: 建筑深化 ──────────────────────────────
export const architectureDeepEvents: HistoricalEvent[] = [
  { id: 'arc001', year: -2560, title: '吉萨大金字塔', description: '胡夫金字塔建成，高146米，是近4000年间人类最高的建筑物。', category: 'architecture', region: 'egypt', significance: 3 },
  { id: 'arc002', year: -447, title: '帕特农神庙', description: '雅典卫城上的帕特农神庙建成，成为古典建筑和西方文明的象征。', category: 'architecture', region: 'greece', significance: 3 },
  { id: 'arc003', year: 80, title: '罗马斗兽场', description: '可容纳5万观众的弗拉维安圆形剧场竣工，是古罗马工程技术的巅峰之作。', category: 'architecture', region: 'italy', significance: 3 },
  { id: 'arc004', year: 537, title: '圣索菲亚大教堂', description: '查士丁尼大帝下令建造，巨大穹顶跨度31米，引领了拜占庭建筑千年。', category: 'architecture', region: 'turkey', significance: 3 },
  { id: 'arc005', year: 1173, title: '比萨斜塔开建', description: '比萨钟楼因地基不均匀下沉开始倾斜，却意外成为世界最著名的建筑之一。', category: 'architecture', region: 'italy', significance: 1 },
  { id: 'arc006', year: 1248, title: '科隆大教堂开建', description: '哥特式建筑的杰作，历时632年才完工（1880年），是中世纪建筑野心的象征。', category: 'architecture', region: 'germany', significance: 2 },
  { id: 'arc007', year: 1632, title: '泰姬陵开建', description: '莫卧儿皇帝沙贾汗为亡妻建造的白色大理石陵墓，被誉为"印度之珍珠"。', category: 'architecture', region: 'india', significance: 3, figure: '沙贾汗' },
  { id: 'arc008', year: 1889, title: '埃菲尔铁塔', description: '古斯塔夫·埃菲尔为巴黎世博会建造的铁塔，从临时展品变成巴黎永恒的地标。', category: 'architecture', region: 'france', significance: 3, figure: '埃菲尔' },
  { id: 'arc009', year: 1931, title: '帝国大厦', description: '纽约帝国大厦仅用410天建成，以381米高度保持世界最高建筑称号近40年。', category: 'architecture', region: 'usa', significance: 2 },
  { id: 'arc010', year: 1958, title: '巴西利亚的建造', description: '奥斯卡·尼迈耶设计的巴西新首都是现代主义城市规划的最大胆实验。', category: 'architecture', region: 'brazil', significance: 2, figure: '尼迈耶' },
  { id: 'arc011', year: 1973, title: '悉尼歌剧院', description: '约恩·乌松设计的悉尼歌剧院竣工，成为20世纪最具标志性的建筑之一。', category: 'architecture', region: 'australia', significance: 2 },
  { id: 'arc012', year: 2010, title: '哈利法塔', description: '迪拜的哈利法塔以828米高度成为世界最高建筑，标志着超高层建筑的新纪元。', category: 'architecture', region: 'saudi-arabia', significance: 2 },
]

// ── 特性113-115: 教育制度 ──────────────────────────────
export const educationEvents: HistoricalEvent[] = [
  { id: 'edu001', year: -387, title: '柏拉图创建学园', description: '柏拉图在雅典创建学园（Academy），被视为西方最早的高等学府。', category: 'philosophy', region: 'greece', significance: 3, figure: '柏拉图' },
  { id: 'edu002', year: 859, title: '卡鲁因大学', description: '摩洛哥非斯的卡鲁因大学建立，被吉尼斯认证为世界上最古老的持续运营大学。', category: 'history', region: 'morocco', significance: 2 },
  { id: 'edu003', year: 1088, title: '博洛尼亚大学', description: '欧洲第一所现代意义的大学在意大利博洛尼亚成立，确立了大学自治传统。', category: 'history', region: 'italy', significance: 3 },
  { id: 'edu004', year: 1636, title: '哈佛大学', description: '北美第一所高等学府在马萨诸塞建立，后来成为世界顶尖的学术中心。', category: 'history', region: 'usa', significance: 2 },
  { id: 'edu005', year: 1717, title: '普鲁士义务教育', description: '普鲁士国王腓特烈·威廉一世颁布法令实行义务教育，开创了现代公共教育制度。', category: 'history', region: 'germany', significance: 3 },
  { id: 'edu006', year: 1905, title: '废除科举制', description: '清朝废除实行了1300年的科举制度，中国教育走向现代化转型。', category: 'history', region: 'china', significance: 3 },
  { id: 'edu007', year: 1948, title: '联合国教科文组织', description: 'UNESCO开始运作，推动全球教育权利和文化遗产保护。', category: 'history', region: 'global', significance: 2 },
]

// ── 特性116-118: 环境保护与生态 ──────────────────────────
export const environmentEvents: HistoricalEvent[] = [
  { id: 'env001', year: 1854, title: '梭罗《瓦尔登湖》', description: '梭罗的自然随笔唤醒了现代环保意识，成为环保主义的精神源头。', category: 'literature', region: 'usa', significance: 2, figure: '梭罗' },
  { id: 'env002', year: 1962, title: '蕾切尔·卡逊《寂静的春天》', description: '卡逊揭露了DDT等农药的生态危害，直接促成了现代环保运动和美国环保署的成立。', category: 'science', region: 'usa', significance: 3, figure: '蕾切尔·卡逊' },
  { id: 'env003', year: 1970, title: '第一个地球日', description: '2000万美国人走上街头参加首个地球日活动，环保运动成为主流社会力量。', category: 'history', region: 'usa', significance: 2 },
  { id: 'env004', year: 1986, title: '切尔诺贝利核事故', description: '乌克兰切尔诺贝利核电站爆炸，是人类历史上最严重的核灾难，改变了全球核能政策。', category: 'technology', region: 'ukraine', significance: 3 },
  { id: 'env005', year: 1987, title: '蒙特利尔议定书', description: '全球各国签署协议逐步淘汰消耗臭氧层的物质，被誉为最成功的国际环保条约。', category: 'science', region: 'global', significance: 2 },
  { id: 'env006', year: 1997, title: '京都议定书', description: '第一个具有法律约束力的气候变化国际协议，要求发达国家减少温室气体排放。', category: 'history', region: 'global', significance: 2 },
  { id: 'env007', year: 2015, title: '巴黎气候协定', description: '196个国家同意将全球升温控制在2°C以内，是人类应对气候变化的里程碑。', category: 'history', region: 'global', significance: 3 },
  { id: 'env008', year: 2018, title: '格蕾塔·通贝里气候抗议', description: '瑞典少女通贝里发起"为气候罢课"运动，引发全球数百万年轻人的气候行动。', category: 'history', region: 'sweden', significance: 2, figure: '通贝里' },
]

// ── 特性119-121: 外交与国际条约 ──────────────────────────
export const diplomacyEvents: HistoricalEvent[] = [
  { id: 'dip001', year: -1259, title: '最早的和平条约', description: '古埃及与赫梯帝国签订《卡迭什和约》，是已知人类历史上最早的和平条约。', category: 'history', region: 'egypt', significance: 2 },
  { id: 'dip002', year: 1648, title: '威斯特伐利亚和约', description: '结束了三十年战争，确立了国家主权原则和现代国际关系体系的基础。', category: 'history', region: 'germany', significance: 3 },
  { id: 'dip003', year: 1815, title: '维也纳会议', description: '拿破仑战争后欧洲列强重新划分版图，建立了维持近百年的欧洲均势体系。', category: 'history', region: 'austria', significance: 3 },
  { id: 'dip004', year: 1919, title: '凡尔赛条约', description: '一战后的和平条约对德国施加严厉条件，埋下了二战的种子。', category: 'history', region: 'france', significance: 3 },
  { id: 'dip005', year: 1920, title: '国际联盟成立', description: '第一个旨在维持世界和平的国际组织，尽管最终失败，但为联合国奠定了基础。', category: 'history', region: 'global', significance: 2 },
  { id: 'dip006', year: 1955, title: '万隆会议', description: '29个亚非国家在印尼万隆举行会议，发起了不结盟运动，改变了冷战格局。', category: 'history', region: 'indonesia', significance: 2 },
  { id: 'dip007', year: 1972, title: '尼克松访华', description: '美国总统尼克松历史性访问中国，打破了两国20多年的外交隔绝。', category: 'history', region: 'china', significance: 3, figure: '尼克松' },
  { id: 'dip008', year: 1993, title: '欧盟成立', description: '《马斯特里赫特条约》生效，欧洲共同体演变为欧洲联盟，开启了政治和经济深度一体化。', category: 'history', region: 'global', significance: 3 },
]

// ── 特性122-124: 体育史 ──────────────────────────────
export const sportsEvents: HistoricalEvent[] = [
  { id: 'spt001', year: -776, title: '古代奥运会', description: '第一届古代奥运会在希腊奥林匹亚举行，运动员赤身竞技，和平期间停止战争。', category: 'history', region: 'greece', significance: 3 },
  { id: 'spt002', year: 1863, title: '现代足球规则', description: '英格兰足球总会在伦敦成立并制定统一规则，现代足球由此诞生。', category: 'history', region: 'uk', significance: 2 },
  { id: 'spt003', year: 1896, title: '现代奥运会', description: '顾拜旦复兴的第一届现代奥运会在雅典举行，来自14国的241名运动员参赛。', category: 'history', region: 'greece', significance: 3, figure: '顾拜旦' },
  { id: 'spt004', year: 1930, title: '第一届世界杯', description: '第一届FIFA世界杯在乌拉圭举行，东道主在决赛中击败阿根廷夺冠。', category: 'history', region: 'argentina', significance: 2 },
  { id: 'spt005', year: 1936, title: '柏林奥运会', description: '杰西·欧文斯在纳粹德国柏林奥运会上夺得四枚金牌，以行动回击种族偏见。', category: 'history', region: 'germany', significance: 2, figure: '杰西·欧文斯' },
  { id: 'spt006', year: 1947, title: '杰基·罗宾逊打破肤色障碍', description: '杰基·罗宾逊加入布鲁克林道奇队，成为现代美国职棒大联盟首位黑人球员。', category: 'history', region: 'usa', significance: 2, figure: '杰基·罗宾逊' },
  { id: 'spt007', year: 1960, title: '穆罕默德·阿里崛起', description: '18岁的卡修斯·克莱在罗马奥运会夺得拳击金牌，后来成为"世纪最伟大的运动员"。', category: 'history', region: 'usa', significance: 2, figure: '穆罕默德·阿里' },
  { id: 'spt008', year: 2008, title: '北京奥运会', description: '中国举办的第一届夏季奥运会，开幕式震撼世界，标志着中国综合国力的展现。', category: 'history', region: 'china', significance: 2 },
]

// ── 特性125-127: 传媒与出版 ──────────────────────────
export const mediaEvents: HistoricalEvent[] = [
  { id: 'med001', year: 868, title: '《金刚经》最早的印刷品', description: '中国敦煌发现的《金刚经》卷子是世界上已知最早有明确日期的印刷品。', category: 'technology', region: 'china', significance: 2 },
  { id: 'med002', year: 1605, title: '第一份报纸', description: '约翰·卡罗卢斯在斯特拉斯堡出版了《报道》，被认为是世界上第一份定期报纸。', category: 'technology', region: 'germany', significance: 2 },
  { id: 'med003', year: 1844, title: '电报', description: '莫尔斯发出第一封长途电报"上帝创造了何等奇迹"，开启了远程即时通信时代。', category: 'technology', region: 'usa', significance: 3, figure: '莫尔斯' },
  { id: 'med004', year: 1876, title: '电话发明', description: '亚历山大·贝尔获得电话专利，人类第一次能远距离传递声音。', category: 'technology', region: 'usa', significance: 3, figure: '贝尔' },
  { id: 'med005', year: 1895, title: '无线电', description: '马可尼成功进行了无线电通信实验，开启了广播通信的时代。', category: 'technology', region: 'italy', significance: 3, figure: '马可尼' },
  { id: 'med006', year: 1926, title: '电视首次演示', description: '约翰·贝尔德在伦敦首次公开演示了电视机，视觉传播进入电子时代。', category: 'technology', region: 'uk', significance: 3 },
  { id: 'med007', year: 1969, title: 'ARPANET', description: '美国国防部高等研究计划署创建的ARPANET发出第一条信息，互联网的前身诞生。', category: 'technology', region: 'usa', significance: 3 },
  { id: 'med008', year: 2004, title: 'Facebook上线', description: '扎克伯格在哈佛宿舍创建的社交网络后来改变了全球社交和信息传播方式。', category: 'technology', region: 'usa', significance: 2, figure: '扎克伯格' },
  { id: 'med009', year: 2005, title: 'YouTube上线', description: '视频分享平台YouTube上线，使全民视频创作和传播成为可能。', category: 'technology', region: 'usa', significance: 2 },
]

// ── 特性128-130: 时尚与设计 ──────────────────────────
export const fashionEvents: HistoricalEvent[] = [
  { id: 'fsh001', year: -3000, title: '古埃及亚麻时尚', description: '古埃及人发展出精致的亚麻服装工艺，白色亚麻长袍成为地位和纯洁的象征。', category: 'art', region: 'egypt', significance: 1 },
  { id: 'fsh002', year: 1858, title: '高级定制时装诞生', description: '查尔斯·沃斯在巴黎创立第一家高级定制时装屋，时尚从手工业变为艺术产业。', category: 'art', region: 'france', significance: 2 },
  { id: 'fsh003', year: 1920, title: '可可·香奈儿的解放', description: '香奈儿设计的小黑裙和套装解放了女性着装，用简洁取代了维多利亚时代的束缚。', category: 'art', region: 'france', significance: 2, figure: '香奈儿' },
  { id: 'fsh004', year: 1947, title: '迪奥New Look', description: '迪奥的"新风貌"以丰满裙摆和收腰设计重新定义了战后女性的优雅。', category: 'art', region: 'france', significance: 2, figure: '迪奥' },
  { id: 'fsh005', year: 1960, title: '迷你裙革命', description: '玛丽·奎恩特设计的迷你裙成为60年代青年反文化和女性解放的象征。', category: 'art', region: 'uk', significance: 2 },
  { id: 'fsh006', year: 1984, title: '日本设计师冲击巴黎', description: '川久保玲和山本耀司等日本设计师以解构主义美学颠覆了西方时尚的传统观念。', category: 'art', region: 'japan', significance: 2 },
]

// ── 特性131-132: 摄影史 ──────────────────────────────
export const photographyEvents: HistoricalEvent[] = [
  { id: 'pht001', year: 1826, title: '第一张照片', description: '法国发明家尼埃普斯拍摄了世界上第一张保存下来的照片，曝光时间长达8小时。', category: 'technology', region: 'france', significance: 3, figure: '尼埃普斯' },
  { id: 'pht002', year: 1839, title: '达盖尔银版摄影法', description: '达盖尔发明的银版摄影法将曝光时间缩短到分钟级别，摄影正式成为大众媒介。', category: 'technology', region: 'france', significance: 2, figure: '达盖尔' },
  { id: 'pht003', year: 1888, title: '柯达相机', description: '乔治·伊斯曼推出"你按下快门，其他的交给我们"的柯达相机，摄影走向大众。', category: 'technology', region: 'usa', significance: 2 },
  { id: 'pht004', year: 1936, title: '多萝西娅·兰格《迁徙的母亲》', description: '这张照片成为大萧条时期最具象征意义的影像，展示了摄影的社会记录力量。', category: 'art', region: 'usa', significance: 2, figure: '兰格' },
  { id: 'pht005', year: 1975, title: '数码相机发明', description: '柯达工程师史蒂夫·萨松制造了第一台数码相机，拍出了0.01百万像素的照片。', category: 'technology', region: 'usa', significance: 2 },
]

// ── 特性133-135: 城市文明与基础设施 ──────────────────
export const urbanEvents: HistoricalEvent[] = [
  { id: 'urb001', year: -3100, title: '乌鲁克·最早的城市', description: '苏美尔城市乌鲁克人口达数万，拥有神庙、市场和书写系统，是人类最早的大型城市。', category: 'history', region: 'iraq', significance: 3 },
  { id: 'urb002', year: -2600, title: '摩亨佐-达罗', description: '印度河文明的大城市拥有规划整齐的街道网格和先进的排水系统，城市规划令人惊叹。', category: 'architecture', region: 'pakistan', significance: 2 },
  { id: 'urb003', year: 100, title: '罗马的百万人口', description: '罗马成为人类历史上第一个人口超过100万的城市，拥有引水渠、浴场和下水道系统。', category: 'architecture', region: 'italy', significance: 2 },
  { id: 'urb004', year: 1100, title: '宋代汴京', description: '北宋首都开封人口超百万，夜市繁荣，《清明上河图》记录了这座城市的繁华景象。', category: 'history', region: 'china', significance: 2 },
  { id: 'urb005', year: 1863, title: '伦敦地铁', description: '世界上第一条地下铁路在伦敦开通，开启了城市公共交通的新纪元。', category: 'technology', region: 'uk', significance: 2 },
  { id: 'urb006', year: 1882, title: '爱迪生电力系统', description: '爱迪生在纽约建成第一个商用发电站和配电网络，城市照明进入电气时代。', category: 'technology', region: 'usa', significance: 3, figure: '爱迪生' },
  { id: 'urb007', year: 1914, title: '巴拿马运河', description: '历时10年建成的巴拿马运河连通太平洋和大西洋，改变了全球航运格局。', category: 'technology', region: 'colombia', significance: 3 },
  { id: 'urb008', year: 1956, title: '美国州际公路系统', description: '艾森豪威尔签署法案建设州际公路系统，重塑了美国的城市布局和生活方式。', category: 'technology', region: 'usa', significance: 2 },
  { id: 'urb009', year: 1994, title: '英法海底隧道', description: '英吉利海峡隧道开通，50公里的海底通道将英国与欧洲大陆物理连接。', category: 'technology', region: 'uk', significance: 2 },
  { id: 'urb010', year: 2011, title: '全球城市化超50%', description: '联合国宣布全球城市人口首次超过农村人口，人类正式进入"城市物种"时代。', category: 'history', region: 'global', significance: 2 },
]
