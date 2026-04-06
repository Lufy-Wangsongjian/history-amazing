import type { HistoricalEvent } from './types'

// ============================================================
// 事件丰富度扩充包 Part 1
// 特性1: 非洲文明史 + 特性2: 东南亚文明史 + 特性3: 拉丁美洲文明史
// ============================================================

export const africaEnrichmentEvents: HistoricalEvent[] = [
  { id: 'afr001', year: -6000, title: '撒哈拉绿洲时期', description: '撒哈拉地区气候湿润，古人在此发展畜牧和农业，留下大量岩画艺术。', category: 'history', region: 'algeria', significance: 2 },
  { id: 'afr002', year: -3000, title: '班图人大迁徙开始', description: '非洲历史上最大规模的人口迁徙，班图语族从西非向南和向东扩散，历时数千年。', category: 'history', region: 'nigeria', significance: 3 },
  { id: 'afr003', year: -500, title: '杰内-杰诺古城', description: '西非最古老的城市之一在今马里建立，成为跨撒哈拉贸易的重要节点。', category: 'architecture', region: 'mali', significance: 2 },
  { id: 'afr004', year: 340, title: '阿克苏姆方尖碑', description: '阿克苏姆帝国竖立高达24米的花岗岩方尖碑，是古代世界最高的独石建筑之一。', category: 'architecture', region: 'ethiopia', significance: 2 },
  { id: 'afr005', year: 600, title: '斯瓦希里文化形成', description: '东非沿海地区形成独特的斯瓦希里文化，融合班图、阿拉伯和波斯元素。', category: 'history', region: 'kenya', significance: 2 },
  { id: 'afr006', year: 700, title: '基尔瓦苏丹国崛起', description: '东非基尔瓦成为印度洋贸易网络中的重要港口城邦，铸造自己的货币。', category: 'history', region: 'tanzania', significance: 2 },
  { id: 'afr007', year: 1050, title: '廷巴克图学术中心', description: '廷巴克图发展为西非最重要的学术和伊斯兰教育中心，拥有数十万手稿。', details: '桑科雷大学和廷巴克图图书馆收藏的手稿涵盖天文学、数学、医学、法学等领域，证明非洲中世纪的学术成就远超欧洲人的想象。', category: 'philosophy', region: 'mali', significance: 3 },
  { id: 'afr008', year: 1200, title: '埃塞俄比亚拉利贝拉岩石教堂', description: '拉利贝拉国王下令在岩石中雕凿出11座教堂，被誉为"非洲的耶路撒冷"。', category: 'architecture', region: 'ethiopia', significance: 3 },
  { id: 'afr009', year: 1400, title: '贝宁青铜艺术', description: '西非贝宁王国铸造精美绝伦的青铜浮雕和头像，技艺堪比文艺复兴大师。', details: '贝宁青铜器的失蜡法铸造技术极其精细，1897年英军掠夺后在欧洲展出，彻底改变了西方对非洲文明的偏见。', category: 'art', region: 'nigeria', significance: 3 },
  { id: 'afr010', year: 1464, title: '桑海帝国崛起', description: '桑尼·阿里建立桑海帝国，取代马里成为西非最大的帝国。', category: 'history', region: 'mali', significance: 2, figure: '桑尼·阿里' },
  { id: 'afr011', year: 1818, title: '祖鲁王国崛起', description: '沙卡·祖鲁改革军事战术，建立强大的祖鲁王国，深刻影响南部非洲格局。', category: 'warfare', region: 'south-africa', significance: 2, figure: '沙卡·祖鲁' },
  { id: 'afr012', year: 1884, title: '柏林西非会议', description: '欧洲列强在柏林瓜分非洲，在地图上用直尺划定国界，无视非洲民族分布。', details: '14个欧洲国家在没有一个非洲人出席的情况下瓜分了整个大陆，这些人为边界至今仍是无数冲突的根源。', category: 'history', region: 'global', significance: 3 },
  { id: 'afr013', year: 1960, title: '非洲独立年', description: '17个非洲国家在这一年获得独立，被称为"非洲年"，殖民统治大规模瓦解。', category: 'history', region: 'global', significance: 3 },
  { id: 'afr014', year: 1930, title: '内格利杜德运动', description: '法语非洲知识分子发起"内格利杜德"文化运动，重新肯定非洲文化价值和黑人身份。', category: 'philosophy', region: 'global', significance: 2 },
  { id: 'afr015', year: 1958, title: '阿契贝《瓦解》', description: '尼日利亚作家钦努阿·阿契贝发表《瓦解》，成为非洲文学最重要的奠基作品。', category: 'literature', region: 'nigeria', significance: 2, figure: '阿契贝' },
  { id: 'afr016', year: -2500, title: '努比亚文明', description: '尼罗河上游的努比亚文明兴起，与古埃及并行发展，拥有独特的文字和金字塔。', category: 'history', region: 'sudan', significance: 2 },
  { id: 'afr017', year: 1100, title: '大津巴布韦石城鼎盛', description: '大津巴布韦石城达到鼎盛，居民约18000人，全靠干砌花岗岩块建成，外墙高达11米。', category: 'architecture', region: 'south-africa', significance: 2 },
  { id: 'afr018', year: 1986, title: '索因卡获诺贝尔文学奖', description: '尼日利亚作家沃莱·索因卡成为首位获得诺贝尔文学奖的非洲作家。', category: 'literature', region: 'nigeria', significance: 2, figure: '索因卡' },
]

export const southeastAsiaEnrichmentEvents: HistoricalEvent[] = [
  { id: 'sea001', year: -500, title: '东山文化', description: '越南东山铜鼓文化辐射整个东南亚，是该地区最重要的青铜时代文明。', category: 'art', region: 'vietnam', significance: 2 },
  { id: 'sea002', year: 100, title: '扶南王国', description: '东南亚最早的印度化国家在今柬埔寨南部建立，控制湄公河三角洲贸易。', category: 'history', region: 'cambodia', significance: 2 },
  { id: 'sea003', year: 650, title: '室利佛逝帝国', description: '苏门答腊的室利佛逝帝国崛起，控制马六甲海峡，是海上丝绸之路的关键枢纽。', details: '唐僧义净曾在此停留六年学习梵文，它是佛教在东南亚传播的重要中心。', category: 'history', region: 'indonesia', significance: 3 },
  { id: 'sea004', year: 802, title: '高棉帝国建立', description: '阇耶跋摩二世统一高棉，建立吴哥王朝，开启东南亚最辉煌的古典文明。', category: 'history', region: 'cambodia', significance: 3, figure: '阇耶跋摩二世' },
  { id: 'sea005', year: 850, title: '婆罗浮屠建成', description: '爪哇的婆罗浮屠佛塔建成，是世界上最大的佛教建筑，拥有2672块浮雕和504座佛像。', category: 'architecture', region: 'indonesia', significance: 3 },
  { id: 'sea006', year: 1113, title: '吴哥窟开工', description: '苏耶跋摩二世下令建造吴哥窟，占地超过200公顷，是人类有史以来最大的宗教建筑。', category: 'architecture', region: 'cambodia', significance: 3, figure: '苏耶跋摩二世' },
  { id: 'sea007', year: 1238, title: '素可泰王国', description: '泰国第一个统一王国素可泰建立，兰甘亨大帝创制泰文。', category: 'history', region: 'thailand', significance: 2, figure: '兰甘亨' },
  { id: 'sea008', year: 1293, title: '满者伯夷帝国', description: '爪哇岛的满者伯夷帝国建立，极盛时控制整个东南亚群岛。', category: 'history', region: 'indonesia', significance: 2 },
  { id: 'sea009', year: 1400, title: '马六甲苏丹国', description: '马六甲苏丹国建立，成为东西方贸易十字路口和伊斯兰教在东南亚传播的中心。', category: 'history', region: 'malaysia', significance: 2 },
  { id: 'sea010', year: 1044, title: '蒲甘王朝统一缅甸', description: '阿奴律陀统一缅甸建立蒲甘王朝，兴建数千座佛塔，至今仍存2000余座。', category: 'architecture', region: 'myanmar', significance: 2, figure: '阿奴律陀' },
  { id: 'sea011', year: 40, title: '征氏姐妹起义', description: '越南征侧和征贰姐妹领导反汉起义，是越南民族英雄的象征。', category: 'warfare', region: 'vietnam', significance: 2, figure: '征氏姐妹' },
  { id: 'sea012', year: 1428, title: '越南黎朝建立', description: '黎利驱逐明朝统治建立后黎朝，越南独立民族意识进一步强化。', category: 'history', region: 'vietnam', significance: 2, figure: '黎利' },
  { id: 'sea013', year: 1767, title: '缅甸毁灭阿瑜陀耶', description: '缅甸军队攻陷并焚毁泰国首都阿瑜陀耶，四百年古都化为废墟。', category: 'warfare', region: 'thailand', significance: 2 },
  { id: 'sea014', year: 1945, title: '印尼独立宣言', description: '苏加诺宣布印尼独立，经过四年独立战争后荷兰承认印尼主权。', category: 'history', region: 'indonesia', significance: 2, figure: '苏加诺' },
  { id: 'sea015', year: 1954, title: '奠边府战役', description: '越南在奠边府击败法国殖民军，法属印度支那殖民体系终结。', category: 'warfare', region: 'vietnam', significance: 3 },
  { id: 'sea016', year: 1967, title: '东盟成立', description: '泰国、印尼、马来西亚、菲律宾和新加坡成立东盟，推动区域合作与和平。', category: 'history', region: 'thailand', significance: 2 },
  { id: 'sea017', year: 1975, title: '红色高棉执政', description: '红色高棉攻占金边，波尔布特推行极端政策，约170万人在大屠杀中死亡。', category: 'history', region: 'cambodia', significance: 3 },
  { id: 'sea018', year: 1986, title: '菲律宾人民力量革命', description: '菲律宾爆发"人民力量"革命，和平推翻马科斯独裁政权。', category: 'history', region: 'philippines', significance: 2 },
]

export const latinAmericaEnrichmentEvents: HistoricalEvent[] = [
  { id: 'lat001', year: -1500, title: '奥尔梅克文明', description: '中美洲最早的高级文明在墨西哥湾沿岸兴起，以巨型石头像闻名，被称为"中美洲文明之母"。', category: 'history', region: 'mexico', significance: 3 },
  { id: 'lat002', year: -300, title: '玛雅文明古典前期', description: '玛雅人建造蒂卡尔等城邦，发展出精确的天文历法和象形文字。', category: 'science', region: 'mexico', significance: 2 },
  { id: 'lat003', year: 250, title: '玛雅文明古典鼎盛', description: '玛雅文明进入鼎盛期，独立发展出"零"的概念，建造了高达70米的金字塔神庙。', category: 'architecture', region: 'mexico', significance: 3 },
  { id: 'lat004', year: 600, title: '蒂奥蒂华坎鼎盛', description: '墨西哥高原的蒂奥蒂华坎是当时美洲最大的城市，人口超过12万，"太阳金字塔"底面积与埃及大金字塔相当。', category: 'architecture', region: 'mexico', significance: 2 },
  { id: 'lat005', year: 1325, title: '特诺奇蒂特兰建城', description: '阿兹特克人在湖中岛上建立首都，以浮动花园为农业基础，发展为25万人的大都市。', details: '科尔特斯初见此城时惊叹其规模和美丽，称之为"仿如梦境"。', category: 'architecture', region: 'mexico', significance: 3 },
  { id: 'lat006', year: 1438, title: '印加帝国扩张', description: '帕查库蒂大帝开始印加帝国急速扩张，在没有文字和车轮的条件下建立了南美最大帝国。', category: 'history', region: 'peru', significance: 3, figure: '帕查库蒂' },
  { id: 'lat007', year: 1450, title: '马丘比丘建造', description: '印加人在安第斯山脉海拔2430米处建造马丘比丘，被称为"失落之城"。', category: 'architecture', region: 'peru', significance: 3 },
  { id: 'lat008', year: 1519, title: '科尔特斯征服阿兹特克', description: '科尔特斯率600人利用政治分裂和天花疫情，两年内征服了拥有数百万人口的阿兹特克帝国。', category: 'warfare', region: 'mexico', significance: 3, figure: '科尔特斯' },
  { id: 'lat009', year: 1545, title: '波托西银矿', description: '玻利维亚波托西发现巨型银矿，白银流向全球推动最早的经济全球化，代价是无数矿工的生命。', category: 'history', region: 'bolivia', significance: 3 },
  { id: 'lat010', year: 1791, title: '海地奴隶起义', description: '杜桑·卢维杜尔领导海地奴隶起义，建立西半球第一个黑人共和国——历史上唯一成功的大规模奴隶起义。', category: 'history', region: 'cuba', significance: 3, figure: '杜桑·卢维杜尔' },
  { id: 'lat011', year: 1920, title: '墨西哥壁画运动', description: '里维拉等人掀起壁画运动，用公共艺术讲述人民的故事，创造了20世纪最具社会影响力的艺术运动之一。', category: 'art', region: 'mexico', significance: 2, figure: '迭戈·里维拉' },
  { id: 'lat012', year: 1967, title: '马尔克斯《百年孤独》', description: '加西亚·马尔克斯发表《百年孤独》，开创魔幻现实主义文学，影响全球。', category: 'literature', region: 'colombia', significance: 3, figure: '加西亚·马尔克斯' },
  { id: 'lat013', year: -100, title: '纳斯卡线条', description: '秘鲁纳斯卡人在沙漠中绘制巨型地画，从空中才能完整看到，目的至今成谜。', category: 'art', region: 'peru', significance: 2 },
  { id: 'lat014', year: 1943, title: '博尔赫斯《虚构集》', description: '阿根廷作家博尔赫斯发表《虚构集》，以迷宫般的哲学小说震撼世界文坛。', category: 'literature', region: 'argentina', significance: 2, figure: '博尔赫斯' },
  { id: 'lat015', year: 1958, title: '巴西利亚建城', description: '巴西在内陆建造全新首都巴西利亚，尼迈耶的现代主义建筑成为城市规划经典。', category: 'architecture', region: 'brazil', significance: 2, figure: '尼迈耶' },
  { id: 'lat016', year: -1200, title: '查文文明', description: '南美洲最早的高级文明在秘鲁安第斯山兴起，以查文德万塔尔神庙为中心。', category: 'history', region: 'peru', significance: 2 },
  { id: 'lat017', year: 1971, title: '聂鲁达获诺贝尔文学奖', description: '智利诗人巴勃罗·聂鲁达获诺贝尔文学奖，被誉为"20世纪最伟大的诗人之一"。', category: 'literature', region: 'chile', significance: 2, figure: '聂鲁达' },
  { id: 'lat018', year: 1959, title: '古巴革命', description: '卡斯特罗领导游击队推翻巴蒂斯塔独裁政权，建立社会主义政权。', category: 'history', region: 'cuba', significance: 2, figure: '卡斯特罗' },
]
