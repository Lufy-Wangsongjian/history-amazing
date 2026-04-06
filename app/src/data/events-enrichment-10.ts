import type { HistoricalEvent } from './types'

// ============================================================
// Round 9 扩充包（特性 201-235）
// 心理学 + 社会学 + 民族独立运动 + 海洋与航海史 + 天文学深化
// + 密码学与信息安全 + 图书馆与知识存储 + 邮政与通信
// + 气象科学 + 矿业与冶金 + 纺织与服饰文化 + 陶瓷史 + 园林与景观
// ============================================================

// ── 特性201-203: 心理学史 ──────────────────────────────
export const psychologyEvents: HistoricalEvent[] = [
  { id: 'psy001', year: 1879, title: '第一个心理学实验室', description: '威廉·冯特在莱比锡大学建立了世界上第一个心理学实验室，心理学从哲学中独立为一门科学。', category: 'science', region: 'germany', significance: 3, figure: '冯特' },
  { id: 'psy002', year: 1895, title: '精神分析诞生', description: '弗洛伊德发表《歇斯底里研究》，提出潜意识理论和自由联想法，精神分析学派诞生。', category: 'science', region: 'austria', significance: 3, figure: '弗洛伊德' },
  { id: 'psy003', year: 1905, title: '比奈-西蒙智力量表', description: '阿尔弗雷德·比奈和泰奥多尔·西蒙开发了第一个标准化智力测试量表。', category: 'science', region: 'france', significance: 2, figure: '比奈' },
  { id: 'psy004', year: 1913, title: '行为主义宣言', description: '约翰·华生发表行为主义宣言，主张心理学应只研究可观察的行为而非意识。', category: 'science', region: 'usa', significance: 2, figure: '华生' },
  { id: 'psy005', year: 1920, title: '格式塔心理学', description: '韦特海默、苛勒和科夫卡确立格式塔心理学，揭示"整体大于部分之和"的知觉规律。', category: 'science', region: 'germany', significance: 2 },
  { id: 'psy006', year: 1943, title: '马斯洛需求层次', description: '亚伯拉罕·马斯洛提出人类需求层次理论，从生理需求到自我实现，影响了管理学和教育学。', category: 'science', region: 'usa', significance: 2, figure: '马斯洛' },
  { id: 'psy007', year: 1953, title: 'REM睡眠发现', description: '阿瑟林斯基和克莱特曼发现快速眼动（REM）睡眠阶段，揭开了梦境的神经科学面纱。', category: 'science', region: 'usa', significance: 2 },
  { id: 'psy008', year: 1961, title: '米尔格拉姆服从实验', description: '斯坦利·米尔格拉姆的电击服从实验揭示了普通人在权威命令下可能做出极端行为。', category: 'science', region: 'usa', significance: 2, figure: '米尔格拉姆' },
  { id: 'psy009', year: 1967, title: '认知革命', description: '内瑟的《认知心理学》出版，标志着认知科学的正式确立，心理学从行为主义转向信息加工模型。', category: 'science', region: 'usa', significance: 2 },
  { id: 'psy010', year: 2002, title: '卡尼曼获诺贝尔奖', description: '心理学家丹尼尔·卡尼曼因行为经济学研究获诺贝尔经济学奖，揭示了人类决策中的系统性偏差。', category: 'science', region: 'usa', significance: 2, figure: '卡尼曼' },
]

// ── 特性204-206: 社会学与社会运动 ──────────────────────
export const sociologyEvents: HistoricalEvent[] = [
  { id: 'soc001', year: 1838, title: '社会学诞生', description: '奥古斯特·孔德创造了"社会学"一词，主张用实证方法研究社会现象。', category: 'philosophy', region: 'france', significance: 2, figure: '孔德' },
  { id: 'soc002', year: 1848, title: '塞内卡瀑布大会', description: '美国历史上第一次女权大会在纽约州塞内卡瀑布举行，发表了《情感宣言》。', category: 'history', region: 'usa', significance: 2 },
  { id: 'soc003', year: 1893, title: '涂尔干《社会分工论》', description: '涂尔干出版《社会分工论》，提出机械团结与有机团结的概念，奠定了现代社会学基础。', category: 'philosophy', region: 'france', significance: 2, figure: '涂尔干' },
  { id: 'soc004', year: 1903, title: '韦伯《新教伦理》', description: '马克斯·韦伯开始发表《新教伦理与资本主义精神》，解释了宗教信仰如何推动经济发展。', category: 'philosophy', region: 'germany', significance: 2, figure: '韦伯' },
  { id: 'soc005', year: 1955, title: '蒙哥马利公交抵制', description: '罗莎·帕克斯拒绝给白人让座后，马丁·路德·金领导了蒙哥马利公交抵制运动。', category: 'history', region: 'usa', significance: 3, figure: '马丁·路德·金' },
  { id: 'soc006', year: 1963, title: '华盛顿大游行', description: '25万人在华盛顿集会，马丁·路德·金发表"我有一个梦想"演讲，推动了民权法案通过。', category: 'history', region: 'usa', significance: 3, figure: '马丁·路德·金' },
  { id: 'soc007', year: 1968, title: '五月风暴', description: '法国爆发全国性学生和工人运动，巴黎街头的抗议震撼了整个西方社会。', category: 'history', region: 'france', significance: 2 },
  { id: 'soc008', year: 1969, title: '石墙运动', description: '纽约石墙酒吧的警察突击搜查引发了LGBTQ+群体的大规模抗议，现代性少数权利运动由此发端。', category: 'history', region: 'usa', significance: 2 },
  { id: 'soc009', year: 2011, title: '阿拉伯之春', description: '突尼斯小贩自焚引发了席卷中东北非的反政府浪潮，多国政权更迭。', category: 'history', region: 'global', significance: 2 },
]

// ── 特性207-210: 民族独立运动 ──────────────────────────
export const nationalLiberationEvents: HistoricalEvent[] = [
  { id: 'nli001', year: 1804, title: '海地独立', description: '海地成为第一个由被奴役者成功革命建立的独立国家，也是拉丁美洲第一个独立国家。', category: 'history', region: 'cuba', significance: 3 },
  { id: 'nli002', year: 1821, title: '墨西哥独立', description: '经过11年独立战争，墨西哥从西班牙殖民统治下获得独立。', category: 'history', region: 'mexico', significance: 2 },
  { id: 'nli003', year: 1822, title: '巴西独立', description: '佩德罗一世宣布巴西从葡萄牙独立，建立巴西帝国。', category: 'history', region: 'brazil', significance: 2 },
  { id: 'nli004', year: 1830, title: '希腊独立', description: '希腊经过近十年独立战争从奥斯曼帝国独立，这是近代欧洲第一次成功的民族独立运动。', category: 'history', region: 'greece', significance: 2 },
  { id: 'nli005', year: 1947, title: '印巴分治', description: '英属印度分为印度和巴基斯坦两个独立国家，伴随着大规模的人口迁移和教派冲突。', category: 'history', region: 'india', significance: 3 },
  { id: 'nli006', year: 1954, title: '越南奠边府', description: '越南军队在奠边府击败法军，法国殖民统治结束，越南暂时南北分治。', category: 'warfare', region: 'vietnam', significance: 2 },
  { id: 'nli007', year: 1957, title: '加纳独立', description: '恩克鲁玛领导加纳从英国独立，成为撒哈拉以南非洲第一个独立的殖民地国家。', category: 'history', region: 'ghana', significance: 3, figure: '恩克鲁玛' },
  { id: 'nli008', year: 1960, title: '非洲独立年', description: '1960年有17个非洲国家宣布独立，被称为"非洲年"，殖民时代走向终结。', category: 'history', region: 'global', significance: 3 },
  { id: 'nli009', year: 1962, title: '阿尔及利亚独立', description: '经过八年血腥独立战争，阿尔及利亚从法国独立，约150万人在战争中丧生。', category: 'history', region: 'algeria', significance: 2 },
  { id: 'nli010', year: 1990, title: '纳米比亚独立', description: '纳米比亚成为非洲大陆最后一个从殖民统治下获得独立的国家。', category: 'history', region: 'south-africa', significance: 2 },
]

// ── 特性211-214: 海洋与航海史 ──────────────────────────
export const maritimeEvents: HistoricalEvent[] = [
  { id: 'mar001', year: -1500, title: '腓尼基航海', description: '腓尼基人是古代最杰出的航海家，他们的商船纵横地中海，建立了迦太基等殖民地。', category: 'exploration', region: 'lebanon', significance: 2 },
  { id: 'mar002', year: -500, title: '波利尼西亚航海', description: '波利尼西亚人仅凭星星、洋流和鸟群的指引，在太平洋上航行数千公里定居偏远岛屿。', category: 'exploration', region: 'new-zealand', significance: 2 },
  { id: 'mar003', year: 1571, title: '勒班陀海战', description: '西班牙联合舰队在勒班陀击败奥斯曼海军，阻止了奥斯曼帝国在地中海的扩张。', category: 'warfare', region: 'greece', significance: 2 },
  { id: 'mar004', year: 1588, title: '西班牙无敌舰队', description: '英国舰队击败西班牙无敌舰队，海上霸权开始从伊比利亚转移到英国。', category: 'warfare', region: 'uk', significance: 3 },
  { id: 'mar005', year: 1805, title: '特拉法尔加海战', description: '纳尔逊率领英国舰队在特拉法尔加击败法西联合舰队，确立了英国一百年的海上霸权。', category: 'warfare', region: 'uk', significance: 3, figure: '纳尔逊' },
  { id: 'mar006', year: 1807, title: '第一艘蒸汽船', description: '罗伯特·富尔顿的克莱蒙号蒸汽船在哈德逊河上航行成功，帆船时代开始落幕。', category: 'technology', region: 'usa', significance: 2 },
  { id: 'mar007', year: 1914, title: '巴拿马运河通航', description: '巴拿马运河正式通航，连接大西洋和太平洋，缩短了全球航运距离。', category: 'technology', region: 'global', significance: 3 },
  { id: 'mar008', year: 1960, title: '马里亚纳海沟探索', description: '特里斯特号深潜器载人下潜至马里亚纳海沟最深处10,916米，到达了地球的最深点。', category: 'exploration', region: 'global', significance: 2 },
]

// ── 特性215-218: 天文学深化 ──────────────────────────────
export const astronomyEvents: HistoricalEvent[] = [
  { id: 'ast001', year: -280, title: '阿里斯塔克斯日心说', description: '古希腊天文学家阿里斯塔克斯最早提出太阳是宇宙中心的日心说，比哥白尼早1800年。', category: 'science', region: 'greece', significance: 2, figure: '阿里斯塔克斯' },
  { id: 'ast002', year: -130, title: '喜帕恰斯星表', description: '喜帕恰斯编制了西方第一部恒星星表，记录了约850颗恒星的位置和亮度。', category: 'science', region: 'greece', significance: 2, figure: '喜帕恰斯' },
  { id: 'ast003', year: 813, title: '巴格达天文台', description: '阿拔斯王朝在巴格达建立天文台，阿拉伯天文学家精确测量了地球周长和黄赤交角。', category: 'science', region: 'iraq', significance: 2 },
  { id: 'ast004', year: 1054, title: '宋代超新星记录', description: '中国天文学家记录了金牛座超新星爆发（今蟹状星云），这颗"客星"白天可见长达23天。', category: 'science', region: 'china', significance: 2 },
  { id: 'ast005', year: 1609, title: '伽利略望远镜观天', description: '伽利略首次用望远镜观测天体，发现了木星的四颗卫星和月球表面的环形山。', category: 'science', region: 'italy', significance: 3, figure: '伽利略' },
  { id: 'ast006', year: 1687, title: '牛顿万有引力', description: '牛顿在《自然哲学的数学原理》中提出万有引力定律，统一了天体运动和地面力学。', category: 'science', region: 'uk', significance: 3, figure: '牛顿' },
  { id: 'ast007', year: 1838, title: '恒星视差', description: '贝塞尔首次成功测量恒星视差，证实了日心说并为恒星距离的测量开辟了道路。', category: 'science', region: 'germany', significance: 2, figure: '贝塞尔' },
  { id: 'ast008', year: 1929, title: '哈勃定律', description: '哈勃发现星系远离速度与距离成正比，证明宇宙正在膨胀，大爆炸理论由此奠基。', category: 'science', region: 'usa', significance: 3, figure: '哈勃' },
  { id: 'ast009', year: 1967, title: '脉冲星发现', description: '乔瑟琳·贝尔发现了第一颗脉冲星，证实了中子星的存在。', category: 'science', region: 'uk', significance: 2, figure: '贝尔' },
  { id: 'ast010', year: 2019, title: '第一张黑洞照片', description: '事件视界望远镜团队拍摄了M87星系中心超大质量黑洞的第一张照片。', category: 'science', region: 'global', significance: 3 },
]

// ── 特性219-221: 密码学与信息安全 ────────────────────────
export const cryptographyEvents: HistoricalEvent[] = [
  { id: 'cry001', year: -50, title: '凯撒密码', description: '尤利乌斯·凯撒使用字母替换加密法传递军事情报，这是最早的有据可查的加密方法之一。', category: 'technology', region: 'italy', significance: 2, figure: '凯撒' },
  { id: 'cry002', year: 850, title: '阿拉伯频率分析', description: '阿拉伯数学家肯迪提出频率分析法破解密码，这是密码分析学的奠基之作。', category: 'technology', region: 'iraq', significance: 2 },
  { id: 'cry003', year: 1586, title: '维热纳尔密码', description: '法国密码学家维热纳尔发表多表替换密码，被称为"不可破解的密码"长达三百年。', category: 'technology', region: 'france', significance: 2 },
  { id: 'cry004', year: 1918, title: 'Enigma密码机', description: '德国工程师谢尔比乌斯发明了Enigma转子密码机，后被纳粹军队广泛使用。', category: 'technology', region: 'germany', significance: 2 },
  { id: 'cry005', year: 1940, title: '布莱切利庄园破解Enigma', description: '图灵和波兰密码学家在布莱切利庄园成功破解德军Enigma密码，可能缩短了二战两年。', category: 'technology', region: 'uk', significance: 3, figure: '图灵' },
  { id: 'cry006', year: 1976, title: '公钥密码学', description: '迪菲和赫尔曼提出了公钥密码体制的概念，彻底改变了安全通信的范式。', category: 'technology', region: 'usa', significance: 3 },
  { id: 'cry007', year: 1977, title: 'RSA加密算法', description: '里维斯特、沙米尔和阿德尔曼发明RSA算法，成为互联网安全通信的基石。', category: 'technology', region: 'usa', significance: 3 },
  { id: 'cry008', year: 2013, title: '斯诺登事件', description: '爱德华·斯诺登揭露了美国国家安全局的大规模监控项目，引发了全球隐私权大辩论。', category: 'technology', region: 'usa', significance: 2, figure: '斯诺登' },
]

// ── 特性222-223: 图书馆与知识存储 ────────────────────────
export const libraryEvents: HistoricalEvent[] = [
  { id: 'lib001', year: -2600, title: '苏美尔泥板图书馆', description: '乌尔和尼普尔城邦建立了最早的泥板文书档案室，保存了数千块楔形文字泥板。', category: 'literature', region: 'iraq', significance: 2 },
  { id: 'lib002', year: -300, title: '亚历山大图书馆', description: '托勒密王朝在亚历山大建立了古代世界最大的图书馆，收藏了约70万卷莎草纸书卷。', category: 'literature', region: 'egypt', significance: 3 },
  { id: 'lib003', year: 830, title: '智慧宫', description: '阿拔斯王朝在巴格达建立智慧宫，大量翻译希腊、波斯、印度文献，保存了古典知识遗产。', category: 'literature', region: 'iraq', significance: 3 },
  { id: 'lib004', year: 1088, title: '博洛尼亚大学图书馆', description: '欧洲最古老的大学博洛尼亚建立了系统的学术图书馆，中世纪学术传统由此延续。', category: 'literature', region: 'italy', significance: 2 },
  { id: 'lib005', year: 1731, title: '本杰明·富兰克林图书馆', description: '富兰克林在费城创办了美国第一个会员制借阅图书馆，公共图书馆运动的先驱。', category: 'literature', region: 'usa', significance: 2, figure: '富兰克林' },
  { id: 'lib006', year: 1800, title: '美国国会图书馆', description: '美国国会图书馆成立，如今是世界上最大的图书馆，收藏超过1.7亿件藏品。', category: 'literature', region: 'usa', significance: 2 },
  { id: 'lib007', year: 2004, title: 'Google图书计划', description: '谷歌启动大规模图书数字化计划，目标是扫描世界上所有的书籍并使其可搜索。', category: 'technology', region: 'usa', significance: 2 },
]

// ── 特性224-225: 邮政与通信史 ────────────────────────────
export const postalEvents: HistoricalEvent[] = [
  { id: 'pos001', year: -2400, title: '古埃及信使', description: '古埃及法老使用信使传递王室文书和军事命令，是最早的有组织的邮递系统。', category: 'technology', region: 'egypt', significance: 1 },
  { id: 'pos002', year: -500, title: '波斯皇家驿道', description: '大流士一世建立了从苏萨到萨迪斯的皇家驿道，骑马信使能在7天内跑完2700公里。', category: 'technology', region: 'iran', significance: 2 },
  { id: 'pos003', year: 1206, title: '蒙古驿站系统', description: '成吉思汗建立了横跨欧亚的站赤驿站系统，信使每天可行进200英里。', category: 'technology', region: 'mongolia', significance: 2, figure: '成吉思汗' },
  { id: 'pos004', year: 1516, title: '图恩与塔克西斯邮政', description: '哈布斯堡帝国委托图恩与塔克西斯家族运营欧洲第一个国际邮政网络。', category: 'technology', region: 'austria', significance: 2 },
  { id: 'pos005', year: 1840, title: '黑便士邮票', description: '英国发行了世界上第一枚邮票"黑便士"，统一邮资制度使普通人也能通信。', category: 'technology', region: 'uk', significance: 3 },
  { id: 'pos006', year: 1860, title: '小马快递', description: '美国小马快递在密苏里州和加州之间传递邮件，骑手在10天内横跨3000公里。', category: 'technology', region: 'usa', significance: 1 },
  { id: 'pos007', year: 1874, title: '万国邮政联盟', description: '万国邮政联盟在伯尔尼成立，建立了国际邮件互寄的统一规则。', category: 'technology', region: 'global', significance: 2 },
]

// ── 特性226-228: 气象与地球科学 ────────────────────────
export const meteorologyEvents: HistoricalEvent[] = [
  { id: 'met001', year: -340, title: '亚里士多德《气象学》', description: '亚里士多德的《气象学》是西方最早系统讨论天气现象的著作。', category: 'science', region: 'greece', significance: 2, figure: '亚里士多德' },
  { id: 'met002', year: 1643, title: '托里拆利气压计', description: '托里拆利发明了水银气压计，人类第一次能够测量大气压力。', category: 'science', region: 'italy', significance: 2, figure: '托里拆利' },
  { id: 'met003', year: 1714, title: '华氏温度计', description: '丹尼尔·华伦海特发明了精确的水银温度计，并建立了华氏温标。', category: 'science', region: 'netherlands', significance: 2 },
  { id: 'met004', year: 1735, title: '哈德利环流', description: '乔治·哈德利提出了地球大气环流的理论模型，解释了信风和气候带的形成。', category: 'science', region: 'uk', significance: 2 },
  { id: 'met005', year: 1856, title: '第一张天气图', description: '法国天文学家勒维耶制作了第一张天气实况图，现代气象预报由此开始。', category: 'science', region: 'france', significance: 2 },
  { id: 'met006', year: 1922, title: '数值天气预报理论', description: '刘易斯·理查德森提出用数值方法计算天气预报的理论，虽然当时计算手段不足以实现。', category: 'science', region: 'uk', significance: 2 },
  { id: 'met007', year: 1960, title: '第一颗气象卫星', description: 'TIROS-1卫星发射升空，从太空拍摄了第一张地球云图，天气预报进入卫星时代。', category: 'science', region: 'usa', significance: 2 },
  { id: 'met008', year: 1988, title: 'IPCC成立', description: '联合国政府间气候变化专门委员会（IPCC）成立，系统评估人类活动对气候变化的影响。', category: 'science', region: 'global', significance: 2 },
]

// ── 特性229-230: 矿业与冶金 ──────────────────────────────
export const miningEvents: HistoricalEvent[] = [
  { id: 'min001', year: -5000, title: '铜的冶炼', description: '安纳托利亚和伊朗高原的工匠最早掌握了从矿石中冶炼铜的技术，铜器时代开始。', category: 'technology', region: 'turkey', significance: 2 },
  { id: 'min002', year: -2000, title: '锡青铜合金', description: '人类发现铜锡合金（青铜）比纯铜更硬更耐用，青铜器时代文明由此繁盛。', category: 'technology', region: 'iraq', significance: 2 },
  { id: 'min003', year: -1200, title: '铁器时代开始', description: '赫梯人率先掌握了铁的冶炼技术，铁器取代青铜成为主要金属工具和武器。', category: 'technology', region: 'turkey', significance: 3 },
  { id: 'min004', year: 1545, title: '波托西银矿', description: '玻利维亚波托西银矿的发现使西班牙成为世界上最富有的帝国，也改变了全球经济。', category: 'history', region: 'bolivia', significance: 2 },
  { id: 'min005', year: 1848, title: '加利福尼亚金矿', description: '萨特磨坊发现黄金引发加州淘金热，30万淘金者涌入改变了美国西部的面貌。', category: 'history', region: 'usa', significance: 2 },
  { id: 'min006', year: 1886, title: '兰德金矿', description: '南非威特沃特斯兰德发现大量黄金矿脉，约翰内斯堡城市由此兴起。', category: 'history', region: 'south-africa', significance: 2 },
  { id: 'min007', year: 1947, title: '碳-14年代测定法', description: '利比发明放射性碳-14年代测定法，考古学和地质学获得了精确的时间标尺。', category: 'science', region: 'usa', significance: 3, figure: '利比' },
]

// ── 特性231-232: 纺织与服饰文化 ──────────────────────────
export const textileEvents: HistoricalEvent[] = [
  { id: 'tex001', year: -6000, title: '最早的织物', description: '安纳托利亚恰塔霍裕克遗址出土了世界上已知最早的纺织品残片。', category: 'technology', region: 'turkey', significance: 2 },
  { id: 'tex002', year: -3000, title: '丝绸起源', description: '中国新石器时代的先民最早养蚕缫丝，丝绸后来成为东西方贸易的核心商品。', category: 'technology', region: 'china', significance: 3 },
  { id: 'tex003', year: -2500, title: '棉花种植', description: '印度河流域的哈拉帕文明最早种植和纺织棉花，棉布舒适透气，适合热带气候。', category: 'technology', region: 'india', significance: 2 },
  { id: 'tex004', year: 1589, title: '针织机发明', description: '威廉·李发明了手摇针织机，袜子的生产效率提升了数十倍。', category: 'technology', region: 'uk', significance: 2 },
  { id: 'tex005', year: 1793, title: '惠特尼轧棉机', description: '伊莱·惠特尼发明轧棉机，美国南部棉花产量激增，但也加深了对奴隶劳动的依赖。', category: 'technology', region: 'usa', significance: 2, figure: '惠特尼' },
  { id: 'tex006', year: 1856, title: '第一种合成染料', description: '威廉·亨利·柏琴意外合成了苯胺紫（莫夫紫），开创了合成染料和合成化学工业。', category: 'science', region: 'uk', significance: 2 },
  { id: 'tex007', year: 1935, title: '尼龙发明', description: '杜邦公司的华莱士·卡罗瑟斯发明了尼龙，第一种完全人工合成的纤维。', category: 'technology', region: 'usa', significance: 2 },
]

// ── 特性233: 陶瓷史 ──────────────────────────────────────
export const ceramicsEvents: HistoricalEvent[] = [
  { id: 'cer001', year: -20000, title: '最早的陶器', description: '中国江西仙人洞出土了约2万年前的陶器碎片，是目前已知最古老的陶器。', category: 'technology', region: 'china', significance: 2 },
  { id: 'cer002', year: -6000, title: '彩陶文化', description: '中国仰韶文化的彩陶是新石器时代最精美的陶器之一，以几何纹样和动物图案著称。', category: 'art', region: 'china', significance: 2 },
  { id: 'cer003', year: 200, title: '东汉青瓷', description: '中国东汉时期发明了真正意义上的瓷器（青瓷），烧制温度达到1200度以上。', category: 'technology', region: 'china', significance: 3 },
  { id: 'cer004', year: 960, title: '宋代五大名窑', description: '宋代汝窑、官窑、哥窑、钧窑、定窑代表了中国瓷器艺术的最高成就。', category: 'art', region: 'china', significance: 3 },
  { id: 'cer005', year: 1368, title: '青花瓷', description: '元末明初的景德镇青花瓷成为中国最具代表性的出口商品，畅销全球。', category: 'art', region: 'china', significance: 3 },
  { id: 'cer006', year: 1709, title: '迈森瓷器', description: '伯特格尔在萨克森发现了欧洲瓷器的烧制秘方，建立了迈森瓷器工厂。', category: 'technology', region: 'germany', significance: 2 },
]

// ── 特性234-235: 园林与景观设计 ──────────────────────────
export const gardenEvents: HistoricalEvent[] = [
  { id: 'gar001', year: -600, title: '巴比伦空中花园', description: '传说中的巴比伦空中花园是古代世界七大奇迹之一，据说是尼布甲尼撒二世为王后所建。', category: 'architecture', region: 'iraq', significance: 2 },
  { id: 'gar002', year: 353, title: '兰亭集序', description: '王羲之在兰亭举办曲水流觞雅集，所写《兰亭集序》不仅是书法圣品，也是中国园林文化的经典场景。', category: 'art', region: 'china', significance: 2, figure: '王羲之' },
  { id: 'gar003', year: 1500, title: '日本枯山水', description: '京都龙安寺的枯山水庭院以15块石头和白砂砾表现宇宙与空寂，是禅宗美学的极致。', category: 'architecture', region: 'japan', significance: 2 },
  { id: 'gar004', year: 1661, title: '凡尔赛花园', description: '安德烈·勒诺特尔设计了凡尔赛宫的法式花园，以几何对称和轴线透视闻名，影响了欧洲园林设计。', category: 'architecture', region: 'france', significance: 3 },
  { id: 'gar005', year: 1750, title: '英国风景园林', description: '"能力"布朗推广了自然风景式园林，以起伏草地、蜿蜒小溪取代了法式几何花园。', category: 'architecture', region: 'uk', significance: 2 },
  { id: 'gar006', year: 1858, title: '纽约中央公园', description: '弗雷德里克·奥姆斯特德设计的中央公园是世界上最著名的城市公园，开创了现代城市景观设计。', category: 'architecture', region: 'usa', significance: 3, figure: '奥姆斯特德' },
  { id: 'gar007', year: 1509, title: '苏州拙政园', description: '明代御史王献臣建造拙政园，是中国四大名园之一，代表了江南私家园林的最高水平。', category: 'architecture', region: 'china', significance: 2 },
]
