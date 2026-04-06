import type { HistoricalEvent } from './types'

// ============================================================
// Round 7 扩充包（特性 171-200）
// 史前与青铜时代补全 + 古典晚期 + 近代早期 + 工业革命深化
// + 两次世界大战补充 + 21世纪关键节点 + 文化交流事件
// + 灾难与复原 + 太空探索深化 + AI与数字时代
// ============================================================

// ── 特性171-174: 史前与青铜时代 ──────────────────────
export const prehistoryEvents: HistoricalEvent[] = [
  { id: 'pre001', year: -8000, title: '杰里科·最早的城镇', description: '约旦河谷的杰里科是世界上最古老的持续定居点之一，早在公元前8000年就有城墙防御。', category: 'history', region: 'israel', significance: 2 },
  { id: 'pre002', year: -6500, title: '恰塔霍裕克', description: '安纳托利亚的恰塔霍裕克是已知最大的新石器时代聚落，居民达数千人，房屋紧密相连。', category: 'history', region: 'turkey', significance: 2 },
  { id: 'pre003', year: -5000, title: '美索不达米亚灌溉', description: '两河流域的人类发明了灌溉系统，使沙漠变为良田，城市文明的物质基础由此奠定。', category: 'technology', region: 'iraq', significance: 2 },
  { id: 'pre004', year: -3500, title: '车轮的发明', description: '苏美尔人或乌克兰草原的人类发明了车轮，彻底改变了运输和战争方式。', category: 'technology', region: 'iraq', significance: 3 },
  { id: 'pre005', year: -3200, title: '楔形文字', description: '苏美尔人发明楔形文字用于记录贸易和法律，人类从此进入有文字记载的"历史时代"。', category: 'literature', region: 'iraq', significance: 3 },
  { id: 'pre006', year: -2500, title: '巨石阵建成', description: '英格兰索尔兹伯里平原上的巨石阵建成，其天文学用途至今仍是考古学之谜。', category: 'architecture', region: 'uk', significance: 2 },
  { id: 'pre007', year: -1700, title: '青铜器时代鼎盛', description: '地中海东部的青铜技术达到巅峰，迈锡尼、赫梯、埃及新王国组成了国际化的"青铜世界"。', category: 'technology', region: 'greece', significance: 2 },
  { id: 'pre008', year: -1200, title: '青铜时代崩溃', description: '约公元前1200年，地中海东部多个文明几乎同时崩溃，原因可能包括海上民族入侵、干旱和系统性崩溃。', category: 'history', region: 'global', significance: 3 },
]

// ── 特性175-177: 古典晚期与中世纪早期 ────────────────
export const lateAntiquityEvents: HistoricalEvent[] = [
  { id: 'lat001', year: 313, title: '米兰敕令', description: '君士坦丁大帝颁布米兰敕令，基督教在罗马帝国获得合法地位。', category: 'religion', region: 'italy', significance: 3, figure: '君士坦丁' },
  { id: 'lat002', year: 410, title: '罗马城沦陷', description: '西哥特人阿拉里克攻陷罗马，800年来罗马城首次被外族攻破，震惊了整个文明世界。', category: 'warfare', region: 'italy', significance: 3 },
  { id: 'lat003', year: 476, title: '西罗马帝国灭亡', description: '日耳曼人奥多亚克废黜最后一位西罗马皇帝，古典时代正式结束。', category: 'history', region: 'italy', significance: 3 },
  { id: 'lat004', year: 622, title: '穆罕默德迁徙', description: '穆罕默德从麦加迁往麦地那（希吉拉），伊斯兰历从此开始计算。', category: 'religion', region: 'saudi-arabia', significance: 3, figure: '穆罕默德' },
  { id: 'lat005', year: 732, title: '图尔战役', description: '法兰克人查理·马特在图尔击败阿拉伯军队，阻止了伊斯兰向西欧的扩张。', category: 'warfare', region: 'france', significance: 2, figure: '查理·马特' },
  { id: 'lat006', year: 800, title: '查理曼加冕', description: '法兰克国王查理曼在圣诞节被教皇加冕为"罗马皇帝"，欧洲中世纪的政治格局由此奠定。', category: 'history', region: 'france', significance: 3, figure: '查理曼' },
  { id: 'lat007', year: 1054, title: '东西教会大分裂', description: '罗马教皇与君士坦丁堡牧首互相开除对方教籍，基督教世界永久分裂。', category: 'religion', region: 'turkey', significance: 3 },
]

// ── 特性178-181: 工业革命深化 ──────────────────────────
export const industrialDeepEvents: HistoricalEvent[] = [
  { id: 'ind101', year: 1764, title: '珍妮纺纱机', description: '哈格里夫斯发明多锭纺纱机，纺织效率提升数倍，工业革命从纺织业开始。', category: 'technology', region: 'uk', significance: 2 },
  { id: 'ind102', year: 1769, title: '瓦特蒸汽机', description: '瓦特改良的蒸汽机成为工厂和矿井的通用动力源，开启了蒸汽时代。', category: 'technology', region: 'uk', significance: 3, figure: '瓦特' },
  { id: 'ind103', year: 1804, title: '第一台蒸汽机车', description: '理查德·特里维西克制造了世界上第一台蒸汽机车，铁路时代即将来临。', category: 'technology', region: 'uk', significance: 2 },
  { id: 'ind104', year: 1825, title: '世界第一条铁路', description: '斯托克顿至达灵顿铁路开通，乘客首次体验火车运输。', category: 'technology', region: 'uk', significance: 3 },
  { id: 'ind105', year: 1848, title: '加州淘金热', description: '加利福尼亚发现黄金引发30万人的淘金热，加速了美国西部开发。', category: 'history', region: 'usa', significance: 2 },
  { id: 'ind106', year: 1856, title: '贝塞麦转炉炼钢', description: '贝塞麦发明了廉价大规模炼钢法，钢铁取代铁成为工业文明的骨架。', category: 'technology', region: 'uk', significance: 3 },
  { id: 'ind107', year: 1869, title: '苏伊士运河', description: '苏伊士运河开通，欧洲到亚洲的航程缩短数千公里，重塑了全球贸易格局。', category: 'technology', region: 'egypt', significance: 3 },
  { id: 'ind108', year: 1876, title: '内燃机', description: '尼古拉斯·奥托发明了四冲程内燃机，为后来的汽车和航空工业奠定了技术基础。', category: 'technology', region: 'germany', significance: 3 },
]

// ── 特性182-185: 两次世界大战补充 ──────────────────────
export const worldWarEvents: HistoricalEvent[] = [
  { id: 'ww001', year: 1914, title: '第一次世界大战爆发', description: '欧洲列强的联盟体系将一场暗杀事件升级为席卷全球的战争，四年间造成约2000万人死亡。', category: 'warfare', region: 'global', significance: 3 },
  { id: 'ww002', year: 1916, title: '索姆河战役', description: '一战中最血腥的战役之一，英法联军在第一天就伤亡近6万人，战役持续5个月。', category: 'warfare', region: 'france', significance: 2 },
  { id: 'ww003', year: 1917, title: '俄国十月革命', description: '布尔什维克在列宁领导下推翻临时政府，建立了世界上第一个社会主义国家。', category: 'history', region: 'russia', significance: 3, figure: '列宁' },
  { id: 'ww004', year: 1929, title: '华尔街崩盘', description: '"黑色星期二"美国股市崩盘，引发了持续十年的大萧条，全球经济陷入灾难。', category: 'history', region: 'usa', significance: 3 },
  { id: 'ww005', year: 1933, title: '希特勒上台', description: '阿道夫·希特勒被任命为德国总理，纳粹独裁政权的建立最终导向了二战和大屠杀。', category: 'history', region: 'germany', significance: 3, figure: '希特勒' },
  { id: 'ww006', year: 1939, title: '第二次世界大战爆发', description: '德国入侵波兰，英法对德宣战，人类历史上最大规模的战争开始了。', category: 'warfare', region: 'global', significance: 3 },
  { id: 'ww007', year: 1941, title: '珍珠港事件', description: '日本偷袭珍珠港，美国正式加入二战，战争真正成为全球性冲突。', category: 'warfare', region: 'usa', significance: 3 },
  { id: 'ww008', year: 1944, title: '诺曼底登陆', description: 'D日，盟军15万人横渡英吉利海峡登陆法国诺曼底，欧洲解放由此开始。', category: 'warfare', region: 'france', significance: 3 },
  { id: 'ww009', year: 1945, title: '广岛原子弹', description: '美国在广岛投下人类第一颗实战原子弹，数日后在长崎投下第二颗，日本随后投降。', category: 'warfare', region: 'japan', significance: 3 },
  { id: 'ww010', year: 1945, title: '联合国成立', description: '51个国家在旧金山签署《联合国宪章》，建立了新的国际秩序和集体安全体系。', category: 'history', region: 'global', significance: 3 },
]

// ── 特性186-189: 灾难与人类韧性 ──────────────────────
export const disasterEvents: HistoricalEvent[] = [
  { id: 'dis001', year: -1628, title: '锡拉火山爆发', description: '爱琴海锡拉岛火山大爆发，可能摧毁了米诺斯文明，或许就是亚特兰蒂斯传说的原型。', category: 'history', region: 'greece', significance: 2 },
  { id: 'dis002', year: 79, title: '维苏威火山埋葬庞贝', description: '维苏威火山爆发将庞贝和赫库兰尼姆城完全掩埋，17世纪的发掘让古罗马生活重现。', category: 'history', region: 'italy', significance: 3 },
  { id: 'dis003', year: 1347, title: '黑死病', description: '黑死病从亚洲传入欧洲，在五年间夺走了欧洲三分之一到二分之一的人口。', category: 'medicine', region: 'global', significance: 3 },
  { id: 'dis004', year: 1556, title: '嘉靖大地震', description: '陕西关中发生8级以上大地震，造成约83万人死亡，是有记录以来死亡人数最多的地震。', category: 'history', region: 'china', significance: 2 },
  { id: 'dis005', year: 1666, title: '伦敦大火', description: '伦敦大火烧毁了全城80%以上的建筑，但灾后重建催生了现代城市规划和消防制度。', category: 'history', region: 'uk', significance: 2 },
  { id: 'dis006', year: 1755, title: '里斯本大地震', description: '里斯本大地震和海啸几乎摧毁整座城市，促使启蒙哲学家重新思考神义论。', category: 'history', region: 'portugal', significance: 2 },
  { id: 'dis007', year: 1912, title: '泰坦尼克号沉没', description: '"永不沉没"的泰坦尼克号首航撞冰山沉没，1500多人遇难，促成了海上安全法规改革。', category: 'history', region: 'uk', significance: 2 },
  { id: 'dis008', year: 1918, title: '西班牙大流感', description: '1918年大流感在全球造成约5000万至1亿人死亡，远超一战的战场伤亡。', category: 'medicine', region: 'global', significance: 3 },
  { id: 'dis009', year: 2004, title: '印度洋海啸', description: '9.1级地震引发的印度洋海啸波及14国，造成约23万人死亡。', category: 'history', region: 'indonesia', significance: 2 },
  { id: 'dis010', year: 2011, title: '日本311大地震', description: '日本东北部9.0级地震和海啸引发福岛核事故，造成近2万人死亡。', category: 'history', region: 'japan', significance: 2 },
]

// ── 特性190-193: 太空探索深化 ──────────────────────────
export const spaceDeepEvents: HistoricalEvent[] = [
  { id: 'spc001', year: 1957, title: '莱卡·第一只太空狗', description: '苏联将流浪狗莱卡送入太空，它成为第一个进入轨道的地球生物。', category: 'exploration', region: 'russia', significance: 2 },
  { id: 'spc002', year: 1961, title: '加加林首次太空飞行', description: '苏联宇航员尤里·加加林乘坐东方一号完成首次载人太空飞行，绕地球一圈。', category: 'exploration', region: 'russia', significance: 3, figure: '加加林' },
  { id: 'spc003', year: 1971, title: '第一个空间站', description: '苏联发射了人类第一个空间站"礼炮1号"，开创了长期太空居住的先河。', category: 'exploration', region: 'russia', significance: 2 },
  { id: 'spc004', year: 1977, title: '旅行者号探测器', description: '旅行者1号和2号发射，利用行星引力弹弓效应飞掠外太阳系，如今已飞出日球层。', category: 'exploration', region: 'usa', significance: 3 },
  { id: 'spc005', year: 1990, title: '哈勃太空望远镜', description: '哈勃太空望远镜发射入轨，拍摄了人类历史上最清晰的深空影像，改变了我们对宇宙的认知。', category: 'science', region: 'usa', significance: 3 },
  { id: 'spc006', year: 1998, title: '国际空间站', description: '16个国家合作建造的国际空间站开始组装，成为人类太空合作的伟大典范。', category: 'exploration', region: 'global', significance: 2 },
  { id: 'spc007', year: 2012, title: '好奇号登陆火星', description: 'NASA好奇号火星车成功登陆火星盖尔撞击坑，开始了对火星宜居性的深入探测。', category: 'exploration', region: 'usa', significance: 2 },
  { id: 'spc008', year: 2020, title: 'SpaceX载人飞行', description: 'SpaceX龙飞船将宇航员送往国际空间站，标志着商业载人航天时代的开始。', category: 'exploration', region: 'usa', significance: 2 },
  { id: 'spc009', year: 2021, title: '詹姆斯·韦伯太空望远镜', description: '韦伯望远镜发射入轨，红外观测能力达到哈勃的100倍，可以看到宇宙最早期的星系。', category: 'science', region: 'usa', significance: 3 },
]

// ── 特性194-196: 文化交流与全球化 ──────────────────────
export const culturalExchangeEvents: HistoricalEvent[] = [
  { id: 'cex001', year: -130, title: '张骞出使西域', description: '汉武帝派张骞出使西域，开辟了丝绸之路，东西方文明交流的大动脉由此打通。', category: 'exploration', region: 'china', significance: 3, figure: '张骞' },
  { id: 'cex002', year: 630, title: '玄奘西行取经', description: '唐代僧人玄奘历时17年前往印度取经，带回佛教经典657部，《西游记》由此取材。', category: 'religion', region: 'china', significance: 3, figure: '玄奘' },
  { id: 'cex003', year: 1271, title: '马可·波罗到达中国', description: '威尼斯商人马可·波罗来到忽必烈的元朝宫廷，他的游记让欧洲人第一次了解了东方。', category: 'exploration', region: 'china', significance: 2, figure: '马可·波罗' },
  { id: 'cex004', year: 1405, title: '郑和下西洋', description: '明朝宦官郑和率领当时世界上最大的远洋舰队七次下西洋，到达东非海岸。', category: 'exploration', region: 'china', significance: 3, figure: '郑和' },
  { id: 'cex005', year: 1602, title: '利玛窦传教', description: '意大利耶稣会士利玛窦获准进入紫禁城，将西方科学引入中国，也把中国文化介绍给欧洲。', category: 'religion', region: 'china', significance: 2, figure: '利玛窦' },
  { id: 'cex006', year: 1853, title: '佩里黑船来航', description: '美国海军准将佩里率"黑船"抵达日本浦贺，迫使日本开国，明治维新的序幕拉开。', category: 'history', region: 'japan', significance: 3, figure: '佩里' },
  { id: 'cex007', year: 1964, title: '新干线', description: '日本开通世界上第一条高速铁路——东海道新干线，列车时速超200公里，引领了全球高铁革命。', category: 'technology', region: 'japan', significance: 2 },
  { id: 'cex008', year: 2013, title: '一带一路倡议', description: '中国提出"丝绸之路经济带"和"21世纪海上丝绸之路"倡议，复兴古代陆海贸易通道。', category: 'history', region: 'china', significance: 2 },
]

// ── 特性197-200: AI与数字时代 ──────────────────────────
export const digitalAgeEvents: HistoricalEvent[] = [
  { id: 'dig001', year: 1936, title: '图灵机', description: '阿兰·图灵提出了通用计算机的理论模型——图灵机，奠定了计算机科学的理论基础。', category: 'technology', region: 'uk', significance: 3, figure: '图灵' },
  { id: 'dig002', year: 1946, title: 'ENIAC', description: '世界上第一台通用电子计算机ENIAC在宾夕法尼亚大学建成，重30吨，占地170平方米。', category: 'technology', region: 'usa', significance: 3 },
  { id: 'dig003', year: 1969, title: '人类登月', description: '阿波罗11号宇航员阿姆斯特朗和奥尔德林登上月球，全球6亿人通过电视见证了这一时刻。', category: 'exploration', region: 'usa', significance: 3, figure: '阿姆斯特朗' },
  { id: 'dig004', year: 1971, title: '微处理器', description: '英特尔推出4004微处理器，将计算机的中央处理器缩小到一块指甲大小的芯片上。', category: 'technology', region: 'usa', significance: 3 },
  { id: 'dig005', year: 1983, title: 'TCP/IP协议', description: 'ARPANET正式采用TCP/IP协议，现代互联网的技术基础就此确立。', category: 'technology', region: 'usa', significance: 3 },
  { id: 'dig006', year: 1989, title: '万维网', description: '蒂姆·伯纳斯-李在CERN发明了万维网，让互联网从学术工具变为全球信息平台。', category: 'technology', region: 'switzerland', significance: 3, figure: '伯纳斯-李' },
  { id: 'dig007', year: 1998, title: '谷歌成立', description: '拉里·佩奇和谢尔盖·布林创立谷歌，PageRank算法革新了信息检索方式。', category: 'technology', region: 'usa', significance: 2 },
  { id: 'dig008', year: 2010, title: '深度学习突破', description: '深度学习在图像识别领域取得突破性进展，神经网络技术再次兴起。', category: 'technology', region: 'global', significance: 2 },
  { id: 'dig009', year: 2016, title: 'AlphaGo击败李世石', description: 'DeepMind的AlphaGo以4:1击败围棋世界冠军李世石，AI能力震惊世界。', category: 'technology', region: 'korea', significance: 2 },
  { id: 'dig010', year: 2022, title: 'ChatGPT发布', description: 'OpenAI发布ChatGPT，大型语言模型进入公众视野，掀起全球AI应用浪潮。', category: 'technology', region: 'usa', significance: 3 },
  { id: 'dig011', year: 2024, title: 'AI生成视频', description: 'Sora等AI视频生成模型发布，人工智能从文本和图像扩展到动态影像创作。', category: 'technology', region: 'usa', significance: 2 },
]
