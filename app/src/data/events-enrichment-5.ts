import type { HistoricalEvent } from './types'

// ============================================================
// Round 3 扩充包（特性 41-70）
// 薄弱地区补全 + 印度深化 + 战争关键 + 科技里程碑 + 经济贸易
// ============================================================

// ── 特性31-35: 印度文明深化 ──────────────────────────
export const indiaDeepEvents: HistoricalEvent[] = [
  { id: 'ind001', year: -1500, title: '吠陀时代', description: '雅利安人迁入印度次大陆，《梨俱吠陀》等经典编纂，种姓制度的雏形出现。', category: 'religion', region: 'india', significance: 2 },
  { id: 'ind002', year: -321, title: '孔雀王朝', description: '旃陀罗笈多建立孔雀王朝，其孙阿育王统一印度大部，推广佛教。', category: 'history', region: 'india', significance: 3, figure: '阿育王' },
  { id: 'ind003', year: -250, title: '阿育王石柱', description: '阿育王在全印度竖立石柱和石刻，刻上以非暴力和宗教宽容为核心的敕令。', category: 'history', region: 'india', significance: 2, figure: '阿育王' },
  { id: 'ind004', year: 320, title: '笈多王朝黄金时代', description: '笈多王朝是印度古典文化的黄金时代，数学、天文学、文学和艺术蓬勃发展。', category: 'history', region: 'india', significance: 2 },
  { id: 'ind005', year: 499, title: '阿耶波多', description: '印度数学家阿耶波多精确计算了圆周率和地球自转，提出了日心说的早期版本。', category: 'science', region: 'india', significance: 2, figure: '阿耶波多' },
  { id: 'ind006', year: 628, title: '印度零的发明', description: '婆罗摩笈多首次系统阐述了零作为数字的规则和负数的运算，彻底改变了数学。', category: 'science', region: 'india', significance: 3, figure: '婆罗摩笈多' },
  { id: 'ind007', year: 1526, title: '莫卧儿帝国建立', description: '巴布尔从中亚入侵印度，建立莫卧儿帝国，融合了波斯、突厥和印度文化。', category: 'history', region: 'india', significance: 3, figure: '巴布尔' },
  { id: 'ind008', year: 1600, title: '阿克巴大帝', description: '莫卧儿皇帝阿克巴推行宗教宽容政策，建立了多民族帝国的行政体系。', category: 'history', region: 'india', significance: 2, figure: '阿克巴' },
  { id: 'ind009', year: 1913, title: '泰戈尔获诺贝尔文学奖', description: '泰戈尔以《吉檀迦利》获奖，成为亚洲第一位诺贝尔文学奖得主。', category: 'literature', region: 'india', significance: 2, figure: '泰戈尔' },
  { id: 'ind010', year: 1930, title: '甘地食盐进军', description: '甘地率领支持者步行388公里到海边自制食盐，以非暴力抗议英国殖民统治。', category: 'history', region: 'india', significance: 3, figure: '甘地' },
]

// ── 特性36-40: 战争与军事关键 ──────────────────────────
export const warfareDeepEvents: HistoricalEvent[] = [
  { id: 'war001', year: -480, title: '温泉关之战', description: '斯巴达300勇士在温泉关抵抗波斯大军，成为西方文明捍卫自由的永恒象征。', category: 'warfare', region: 'greece', significance: 3, figure: '列奥尼达' },
  { id: 'war002', year: -331, title: '亚历山大征服波斯', description: '亚历山大大帝在高加米拉击败波斯帝国，建立了从希腊到印度的庞大帝国。', category: 'warfare', region: 'greece', significance: 3, figure: '亚历山大' },
  { id: 'war003', year: -202, title: '扎马战役', description: '罗马将军西庇阿在扎马击败迦太基名将汉尼拔，结束了第二次布匿战争。', category: 'warfare', region: 'italy', significance: 2, figure: '汉尼拔' },
  { id: 'war004', year: 636, title: '亚尔穆克之战', description: '阿拉伯军队在亚尔穆克大败拜占庭帝国，叙利亚和巴勒斯坦进入伊斯兰时代。', category: 'warfare', region: 'syria', significance: 2 },
  { id: 'war005', year: 1415, title: '阿金库尔之战', description: '英国长弓手在阿金库尔以少胜多击败法国重甲骑士，改变了中世纪战争方式。', category: 'warfare', region: 'france', significance: 2 },
  { id: 'war006', year: 1571, title: '勒班陀海战', description: '基督教联合舰队在勒班陀击败奥斯曼海军，终结了奥斯曼在地中海的海上霸权。', category: 'warfare', region: 'greece', significance: 2 },
  { id: 'war007', year: 1757, title: '普拉西战役', description: '克莱武在普拉西击败莫卧儿军队，英国东印度公司开始统治印度。', category: 'warfare', region: 'india', significance: 2 },
  { id: 'war008', year: 1914, title: '第一次世界大战', description: '萨拉热窝刺杀事件引发全面战争，四年内约2000万人死亡，四大帝国崩溃。', category: 'warfare', region: 'global', significance: 3 },
  { id: 'war009', year: 1939, title: '第二次世界大战', description: '人类历史上规模最大的战争，六年内约7000万人死亡，彻底重塑了世界秩序。', category: 'warfare', region: 'global', significance: 3 },
  { id: 'war010', year: 1944, title: '诺曼底登陆', description: '盟军在诺曼底海滩发动人类历史上最大规模的两栖登陆，开辟了欧洲第二战场。', category: 'warfare', region: 'france', significance: 3 },
]

// ── 特性41-50: 科技里程碑补充 ──────────────────────────
export const techDeepEvents: HistoricalEvent[] = [
  { id: 'tec001', year: 1450, title: '火药传入欧洲', description: '中国发明的火药经丝绸之路传入欧洲后被用于火枪和火炮，彻底改变了战争方式。', category: 'technology', region: 'global', significance: 3 },
  { id: 'tec002', year: 1712, title: '纽科门蒸汽机', description: '托马斯·纽科门发明实用蒸汽机用于矿井排水，工业革命的先声。', category: 'technology', region: 'uk', significance: 2 },
  { id: 'tec003', year: 1839, title: '查尔斯·古德伊尔硫化橡胶', description: '古德伊尔意外发现硫化橡胶，使橡胶成为实用工业材料。', category: 'technology', region: 'usa', significance: 2 },
  { id: 'tec004', year: 1867, title: '诺贝尔发明炸药', description: '诺贝尔发明安全炸药，大幅推进了采矿和建筑，其遗产设立了诺贝尔奖。', category: 'technology', region: 'sweden', significance: 2, figure: '诺贝尔' },
  { id: 'tec005', year: 1901, title: '马可尼跨大西洋无线电', description: '马可尼成功发送了第一条跨大西洋无线电信号，无线通信时代开始。', category: 'technology', region: 'italy', significance: 3, figure: '马可尼' },
  { id: 'tec006', year: 1926, title: '电视发明', description: '贝尔德在伦敦进行了世界上第一次电视演示，视觉传播的新纪元。', category: 'technology', region: 'uk', significance: 2, figure: '贝尔德' },
  { id: 'tec007', year: 1942, title: '首个核反应堆', description: '费米在芝加哥大学建成第一个受控核链式反应堆，核能时代开始。', category: 'technology', region: 'usa', significance: 3, figure: '费米' },
  { id: 'tec008', year: 1958, title: '集成电路', description: '基尔比和诺伊斯分别独立发明集成电路，微电子革命由此开始。', category: 'technology', region: 'usa', significance: 3, figure: '基尔比' },
  { id: 'tec009', year: 1971, title: '微处理器', description: '英特尔发布4004微处理器，将整个CPU集成到单一芯片，个人电脑时代的基石。', category: 'technology', region: 'usa', significance: 3 },
  { id: 'tec010', year: 1983, title: 'TCP/IP协议', description: 'ARPANET正式切换到TCP/IP协议，现代互联网的技术基础确立。', category: 'technology', region: 'usa', significance: 3 },
  { id: 'tec011', year: 1997, title: '深蓝击败卡斯帕罗夫', description: 'IBM深蓝计算机击败国际象棋世界冠军卡斯帕罗夫，AI里程碑。', category: 'technology', region: 'usa', significance: 2 },
  { id: 'tec012', year: 2003, title: '人类基因组计划完成', description: '历时13年的人类基因组计划完成，解读了30亿个碱基对，精准医疗时代开始。', category: 'science', region: 'global', significance: 3 },
  { id: 'tec013', year: 2012, title: '希格斯玻色子发现', description: 'CERN大型强子对撞机发现希格斯玻色子，证实了物质质量起源的理论。', category: 'science', region: 'switzerland', significance: 3 },
  { id: 'tec014', year: 2022, title: 'ChatGPT发布', description: 'OpenAI发布ChatGPT，大语言模型技术引爆全球AI浪潮。', category: 'technology', region: 'usa', significance: 3 },
]

// ── 特性51-60: 薄弱地区补全（菲律宾/马来/新加坡/加拿大/智利/委内瑞拉等）───
export const smallRegionEvents: HistoricalEvent[] = [
  // 菲律宾
  { id: 'sr001', year: 1565, title: '西班牙殖民菲律宾', description: '西班牙建立马尼拉殖民地，开始了长达333年的统治。', category: 'history', region: 'philippines', significance: 2 },
  { id: 'sr002', year: 1896, title: '黎刹与菲律宾革命', description: '何塞·黎刹被处决激发了菲律宾独立运动，他被尊为国父。', category: 'history', region: 'philippines', significance: 2, figure: '黎刹' },
  // 马来西亚
  { id: 'sr003', year: 1957, title: '马来亚独立', description: '马来亚联合邦脱离英国独立，1963年与沙巴、砂拉越和新加坡合组马来西亚。', category: 'history', region: 'malaysia', significance: 2 },
  // 新加坡
  { id: 'sr004', year: 1965, title: '新加坡独立', description: '新加坡被迫脱离马来西亚独立，李光耀领导下发展为亚洲四小龙之一。', category: 'history', region: 'singapore', significance: 2, figure: '李光耀' },
  // 加拿大
  { id: 'sr005', year: 1885, title: '加拿大太平洋铁路', description: '横贯加拿大的太平洋铁路完工，将大西洋和太平洋沿岸连接起来，国家统一的象征。', category: 'technology', region: 'canada', significance: 2 },
  { id: 'sr006', year: 1982, title: '加拿大宪法独立', description: '加拿大将宪法从英国"遣返"，获得完全的宪法主权。', category: 'history', region: 'canada', significance: 1 },
  // 智利
  { id: 'sr007', year: 1818, title: '智利独立', description: '贝纳多·奥希金斯领导智利脱离西班牙独立。', category: 'history', region: 'chile', significance: 2, figure: '奥希金斯' },
  { id: 'sr008', year: 1973, title: '智利政变', description: '皮诺切特发动军事政变推翻阿连德政府，开始了17年的军事独裁。', category: 'history', region: 'chile', significance: 2 },
  // 委内瑞拉
  { id: 'sr009', year: 1811, title: '委内瑞拉独立宣言', description: '委内瑞拉成为拉美最早宣布独立的国家之一。', category: 'history', region: 'venezuela', significance: 1 },
  // 罗马尼亚
  { id: 'sr010', year: 1600, title: '瓦拉几亚·摩尔达维亚统一', description: '勇敢的米哈伊短暂统一了罗马尼亚三公国，被视为统一先驱。', category: 'history', region: 'romania', significance: 1 },
  { id: 'sr011', year: 1989, title: '罗马尼亚革命', description: '罗马尼亚爆发革命推翻齐奥塞斯库独裁政权，是东欧剧变中最血腥的一场。', category: 'history', region: 'romania', significance: 2 },
  // 匈牙利
  { id: 'sr012', year: 1000, title: '匈牙利建国', description: '伊什特万一世加冕为匈牙利第一任国王，将匈牙利引入基督教欧洲。', category: 'history', region: 'hungary', significance: 2 },
  { id: 'sr013', year: 1956, title: '匈牙利起义', description: '匈牙利人民起义反抗苏联控制，被苏军坦克镇压，但震动了冷战格局。', category: 'history', region: 'hungary', significance: 2 },
  // 坦桑尼亚
  { id: 'sr014', year: 1961, title: '坦桑尼亚独立', description: '朱利叶斯·尼雷尔领导坦桑尼亚独立，推行非洲社会主义（乌贾马）实验。', category: 'history', region: 'tanzania', significance: 2, figure: '尼雷尔' },
  // 加纳
  { id: 'sr015', year: 1482, title: '埃尔米纳城堡', description: '葡萄牙人在加纳海岸建造埃尔米纳城堡，是撒哈拉以南非洲最古老的欧洲建筑。', category: 'architecture', region: 'ghana', significance: 2 },
  // 孟加拉
  { id: 'sr016', year: 1971, title: '孟加拉国独立', description: '东巴基斯坦经历独立战争成为孟加拉国，约300万人在战争中遇难。', category: 'history', region: 'bangladesh', significance: 2 },
  // 斯里兰卡
  { id: 'sr017', year: -250, title: '僧伽罗佛教传入', description: '阿育王之子将佛教带到斯里兰卡，锡兰成为上座部佛教最重要的传承地。', category: 'religion', region: 'sri-lanka', significance: 2 },
  // 阿富汗
  { id: 'sr018', year: 1979, title: '苏联入侵阿富汗', description: '苏联入侵阿富汗，引发十年战争，成为苏联解体的重要催化剂之一。', category: 'warfare', region: 'afghanistan', significance: 3 },
  // 经济贸易
  { id: 'sr019', year: 1694, title: '英格兰银行成立', description: '英格兰银行成立，是世界上第一个成功运作的中央银行，现代金融体系的基石。', category: 'history', region: 'uk', significance: 2 },
  { id: 'sr020', year: 1776, title: '美国独立宣言', description: '13个殖民地宣布脱离英国独立，"人人生而平等"成为民主理想的基石。', category: 'history', region: 'usa', significance: 3 },
]

// ── 特性61-70: 人物传记亮点 + 跨文明交流 ──────────────────
export const figureAndExchangeEvents: HistoricalEvent[] = [
  { id: 'fig001', year: -356, title: '亚历山大大帝诞生', description: '亚历山大的远征将希腊文化传播到埃及和印度，催生了融合东西方的希腊化文明。', category: 'history', region: 'greece', significance: 3, figure: '亚历山大' },
  { id: 'fig002', year: 100, title: '罗马帝国鼎盛', description: '图拉真皇帝时期罗马帝国达到最大疆域，覆盖500万平方公里，约6000万人口。', category: 'history', region: 'italy', significance: 2, figure: '图拉真' },
  { id: 'fig003', year: 1452, title: '达·芬奇诞生', description: '达·芬奇是人类历史上最全面的天才——画家、雕塑家、建筑师、工程师、解剖学家、发明家。', category: 'art', region: 'italy', significance: 3, figure: '达·芬奇' },
  { id: 'fig004', year: 1498, title: '达·芬奇《最后的晚餐》', description: '达·芬奇完成壁画《最后的晚餐》，以戏剧性的构图和心理描写震撼了文艺复兴。', category: 'art', region: 'italy', significance: 3, figure: '达·芬奇' },
  { id: 'fig005', year: 1508, title: '米开朗基罗西斯廷天顶画', description: '米开朗基罗花四年仰卧在脚手架上完成西斯廷教堂天顶画，"创造亚当"成为人类艺术的巅峰。', category: 'art', region: 'italy', significance: 3, figure: '米开朗基罗' },
  { id: 'fig006', year: 1564, title: '莎士比亚诞生', description: '威廉·莎士比亚诞生于斯特拉福，创作了37部戏剧和154首十四行诗，深刻塑造了英语本身。', category: 'literature', region: 'uk', significance: 3, figure: '莎士比亚' },
  { id: 'fig007', year: 1776, title: '美国独立与宪法', description: '美国建国者们起草了融合启蒙思想的宪法，建立了现代代议制民主的典范。', category: 'history', region: 'usa', significance: 3 },
  { id: 'fig008', year: 1859, title: '苏伊士运河开工', description: '法国工程师雷赛布主持苏伊士运河开工，连接地中海和红海，缩短东西方航程。', category: 'technology', region: 'egypt', significance: 2 },
  { id: 'fig009', year: 1948, title: '以色列建国', description: '以色列在巴勒斯坦建国，随即爆发第一次中东战争，中东地缘格局由此定型。', category: 'history', region: 'israel', significance: 3 },
  { id: 'fig010', year: 1978, title: '改革开放', description: '邓小平推动改革开放，中国经济开始高速增长，数亿人摆脱贫困。', category: 'history', region: 'china', significance: 3 },
]
