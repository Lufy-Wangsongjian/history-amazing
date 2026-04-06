import type { HistoricalEvent } from './types'

// ============================================================
// Round 4 扩充包（特性 71-100）
// 女性历史 + 经济金融 + 语言文字 + 法律人权 + 城市文明
// + 食物农业 + 数学 + 天文 + 海洋 + 21世纪
// ============================================================

// ── 特性71-75: 女性历史与性别里程碑 ──────────────────
export const womenHistoryEvents: HistoricalEvent[] = [
  { id: 'wmn001', year: -1479, title: '哈特谢普苏特女法老', description: '埃及历史上最成功的女法老，统治22年间大兴土木、扩展贸易，堪称最伟大的统治者之一。', category: 'history', region: 'egypt', significance: 2, figure: '哈特谢普苏特' },
  { id: 'wmn002', year: 1429, title: '圣女贞德', description: '17岁的农家少女贞德率军在奥尔良击败英军，扭转了百年战争的战局。', category: 'warfare', region: 'france', significance: 3, figure: '贞德' },
  { id: 'wmn003', year: 1792, title: '沃斯通克拉夫特《女权辩护》', description: '玛丽·沃斯通克拉夫特发表女权主义奠基之作，主张女性应享有平等的教育权。', category: 'philosophy', region: 'uk', significance: 2, figure: '沃斯通克拉夫特' },
  { id: 'wmn004', year: 1903, title: '居里夫人获诺贝尔奖', description: '居里夫人成为首位获得诺贝尔奖的女性，也是唯一获得两个不同学科诺贝尔奖的人。', category: 'science', region: 'france', significance: 3, figure: '居里夫人' },
  { id: 'wmn005', year: 1920, title: '美国女性获投票权', description: '美国宪法第十九修正案赋予女性投票权，经过七十年的妇女参政运动终获胜利。', category: 'history', region: 'usa', significance: 3 },
  { id: 'wmn006', year: 1963, title: '特蕾什科娃·首位女宇航员', description: '苏联宇航员特蕾什科娃成为第一位进入太空的女性，绕地球飞行48圈。', category: 'exploration', region: 'russia', significance: 2, figure: '特蕾什科娃' },
  { id: 'wmn007', year: 2014, title: '马拉拉获诺贝尔和平奖', description: '巴基斯坦女孩马拉拉·优素福扎伊成为最年轻的诺贝尔奖获得者，倡导女童教育权。', category: 'history', region: 'pakistan', significance: 2, figure: '马拉拉' },
]

// ── 特性76-80: 经济金融与贸易 ──────────────────────
export const economicsEvents: HistoricalEvent[] = [
  { id: 'eco001', year: -600, title: '吕底亚铸币', description: '小亚细亚的吕底亚王国铸造世界上第一批标准化金属货币，商业革命由此开始。', category: 'technology', region: 'turkey', significance: 3 },
  { id: 'eco002', year: 1397, title: '美第奇银行', description: '美第奇家族创建的银行业帝国资助了文艺复兴，发明了现代银行业的许多基本技术。', category: 'history', region: 'italy', significance: 2 },
  { id: 'eco003', year: 1637, title: '荷兰郁金香狂热', description: '世界上第一次有记录的投机泡沫——郁金香球茎价格飙升到房产水平后崩盘。', category: 'history', region: 'netherlands', significance: 2 },
  { id: 'eco004', year: 1792, title: '纽约证券交易所', description: '24名经纪人在华尔街一棵梧桐树下签署协议，纽约证券交易所由此诞生。', category: 'history', region: 'usa', significance: 2 },
  { id: 'eco005', year: 1944, title: '布雷顿森林体系', description: '44个国家在新罕布什尔州建立了以美元为中心的国际货币体系，IMF和世界银行诞生。', category: 'history', region: 'usa', significance: 3 },
  { id: 'eco006', year: 2008, title: '全球金融危机', description: '美国次贷危机引发全球金融海啸，雷曼兄弟破产，全球经济陷入大衰退。', category: 'history', region: 'global', significance: 3 },
  { id: 'eco007', year: 2009, title: '比特币诞生', description: '神秘人物中本聪创建比特币，区块链技术和加密货币革命由此开始。', category: 'technology', region: 'global', significance: 2 },
]

// ── 特性81-85: 语言文字与教育 ──────────────────────
export const languageEvents: HistoricalEvent[] = [
  { id: 'lng001', year: -1200, title: '腓尼基字母', description: '腓尼基人发明了22个辅音字母，成为几乎所有现代字母文字系统的祖先。', category: 'literature', region: 'lebanon', significance: 3 },
  { id: 'lng002', year: -500, title: '梵文·波你尼文法', description: '古印度语言学家波你尼编写了《八章书》，是人类最早也最完善的语法学著作之一。', category: 'literature', region: 'india', significance: 2, figure: '波你尼' },
  { id: 'lng003', year: 1799, title: '罗塞塔石碑发现', description: '拿破仑远征军在埃及发现罗塞塔石碑，碑上三种文字为破译古埃及象形文字提供了钥匙。', category: 'science', region: 'egypt', significance: 3 },
  { id: 'lng004', year: 1822, title: '商博良破译象形文字', description: '法国学者商博良成功破译古埃及象形文字，失传1500年的古埃及文明重现于世。', category: 'science', region: 'france', significance: 3, figure: '商博良' },
  { id: 'lng005', year: 1887, title: '世界语', description: '波兰医生柴门霍夫创造了世界语（Esperanto），试图建立一种国际辅助语言促进和平。', category: 'literature', region: 'poland', significance: 1 },
]

// ── 特性86-90: 法律与人权 ──────────────────────
export const lawAndRightsEvents: HistoricalEvent[] = [
  { id: 'law001', year: -1754, title: '汉谟拉比法典', description: '巴比伦国王汉谟拉比颁布法典，282条法律以"以眼还眼"著称，是已知最早的完整法律文本之一。', category: 'history', region: 'iraq', significance: 3, figure: '汉谟拉比' },
  { id: 'law002', year: -509, title: '罗马共和国', description: '罗马人推翻国王建立共和制，元老院和公民大会的双重权力结构影响了后世民主制度。', category: 'history', region: 'italy', significance: 3 },
  { id: 'law003', year: 1689, title: '英国权利法案', description: '光荣革命后英国议会通过《权利法案》，确立了君主立宪制和议会至上的原则。', category: 'history', region: 'uk', significance: 3 },
  { id: 'law004', year: 1863, title: '林肯解放奴隶宣言', description: '林肯发布《解放奴隶宣言》，宣布叛乱州的奴隶获得自由。', category: 'history', region: 'usa', significance: 3, figure: '林肯' },
  { id: 'law005', year: 1964, title: '美国民权法案', description: '约翰逊总统签署《民权法案》，正式禁止基于种族、肤色、宗教和性别的歧视。', category: 'history', region: 'usa', significance: 3 },
]

// ── 特性91-95: 食物农业与日常生活 ──────────────────
export const dailyLifeEvents: HistoricalEvent[] = [
  { id: 'dlf001', year: -8000, title: '农业革命', description: '中东新月沃地的人类开始种植小麦和大麦、驯养绵羊和山羊，人类从采集走向定居。', category: 'technology', region: 'iraq', significance: 3 },
  { id: 'dlf002', year: -7000, title: '中国水稻种植', description: '长江流域开始系统种植水稻，养活了东亚数十亿人口的主粮由此起源。', category: 'technology', region: 'china', significance: 3 },
  { id: 'dlf003', year: -3000, title: '古埃及面包和啤酒', description: '古埃及人发展出发酵面包和啤酒酿造技术，这两样食物构成了日常饮食的基础。', category: 'technology', region: 'egypt', significance: 1 },
  { id: 'dlf004', year: 800, title: '咖啡的发现', description: '传说埃塞俄比亚牧羊人发现了咖啡豆的提神效果，咖啡后来征服了全世界。', category: 'history', region: 'ethiopia', significance: 2 },
  { id: 'dlf005', year: 1492, title: '哥伦布大交换', description: '新旧大陆的连接引发了史无前例的物种交换：番茄、土豆、玉米传入欧洲，小麦和马传入美洲。', category: 'history', region: 'global', significance: 3 },
  { id: 'dlf006', year: 1760, title: '英国工业革命', description: '从纺织机械化开始，工业革命彻底改变了人类生产方式和社会结构。', category: 'technology', region: 'uk', significance: 3 },
  { id: 'dlf007', year: 1869, title: '横贯大陆铁路', description: '美国首条横贯大陆的铁路在犹他州接轨，东西海岸的旅程从6个月缩短到1周。', category: 'technology', region: 'usa', significance: 2 },
]

// ── 特性96-100: 数学/天文/海洋/21世纪 ──────────────────
export const scienceAndFutureEvents: HistoricalEvent[] = [
  // 数学
  { id: 'saf001', year: -300, title: '欧几里得《几何原本》', description: '欧几里得编写《几何原本》，从五条公理出发推导出整个几何体系，是人类理性思维的典范。', category: 'science', region: 'egypt', significance: 3, figure: '欧几里得' },
  { id: 'saf002', year: 820, title: '花拉子密与代数', description: '波斯数学家花拉子密撰写《还原与对消》，"代数"（Algebra）一词即源自此书。', category: 'science', region: 'iraq', significance: 3, figure: '花拉子密' },
  { id: 'saf003', year: 1202, title: '斐波那契《算盘书》', description: '斐波那契将阿拉伯数字引入欧洲，同时发现了著名的斐波那契数列。', category: 'science', region: 'italy', significance: 2, figure: '斐波那契' },
  // 天文
  { id: 'saf004', year: -150, title: '希帕库斯星等系统', description: '希腊天文学家希帕库斯编制了最早的星表，发明了沿用至今的星等分类系统。', category: 'science', region: 'greece', significance: 2, figure: '希帕库斯' },
  { id: 'saf005', year: 1929, title: '哈勃发现宇宙膨胀', description: '哈勃观测到遥远星系在远离我们，证明宇宙正在膨胀，大爆炸理论的观测基础。', category: 'science', region: 'usa', significance: 3, figure: '哈勃' },
  { id: 'saf006', year: 2019, title: '首张黑洞照片', description: '事件视界望远镜（EHT）捕获了M87星系中心超大质量黑洞的第一张照片。', category: 'science', region: 'global', significance: 2 },
  // 海洋
  { id: 'saf007', year: 1872, title: 'HMS挑战者号科考', description: '英国挑战者号开始了历时四年的全球海洋科学考察，现代海洋学由此诞生。', category: 'exploration', region: 'uk', significance: 2 },
  // 21世纪
  { id: 'saf008', year: 2004, title: 'Facebook上线', description: '扎克伯格在哈佛创建Facebook，社交网络从此改变了人类的社交方式。', category: 'technology', region: 'usa', significance: 2, figure: '扎克伯格' },
  { id: 'saf009', year: 2020, title: '新冠大流行', description: 'COVID-19全球大流行，数百万人死亡，深刻改变了工作方式和社会运作模式。', category: 'medicine', region: 'global', significance: 3 },
  { id: 'saf010', year: 2024, title: 'AI元年', description: '大语言模型和生成式AI在全球范围内爆发性普及，各行各业开始深度整合AI能力。', category: 'technology', region: 'global', significance: 3 },
]
