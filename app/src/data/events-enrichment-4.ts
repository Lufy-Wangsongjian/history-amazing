import type { HistoricalEvent } from './types'

// ============================================================
// Round 2 扩充包（特性 11-40）
// 11. 中国历代文化细化  12. 日本文化深度  13. 韩国朝鲜史
// 14. 宗教与信仰扩充  15. 世界文学经典  16. 印度文明深化
// 17. 波斯与中亚  18. 奥斯曼与土耳其  19. 俄罗斯帝国
// 20. 西班牙葡萄牙  21. 荷兰黄金时代  22. 北欧维京与近代
// 23. 东欧波兰匈牙利  24. 加拿大澳新  25. 巴西阿根廷
// 26. 中美洲加勒比  27. 非洲近现代补充  28. 丝绸之路贸易
// 29. 环境与灾难  30. 体育与奥运  31-40. 各类目细粒度补充
// ============================================================

// ── 特性11: 中国历代文化细化 ──────────────────────────
export const chinaDeepEvents: HistoricalEvent[] = [
  { id: 'cn001', year: -1600, title: '商朝甲骨文', description: '商朝在龟甲和兽骨上刻写占卜文字，是中国最早的成熟文字系统。', category: 'literature', region: 'china', significance: 3 },
  { id: 'cn002', year: -1046, title: '武王伐纣·周朝建立', description: '武王率联军在牧野之战推翻商朝，建立周朝，开创封建制度。', category: 'history', region: 'china', significance: 3, figure: '周武王' },
  { id: 'cn003', year: -770, title: '春秋时代开始', description: '周平王东迁洛邑，中国进入诸侯争霸的春秋时代，百家争鸣由此酝酿。', category: 'history', region: 'china', significance: 2 },
  { id: 'cn004', year: -221, title: '秦始皇统一六国', description: '嬴政统一六国建立秦朝，统一文字、度量衡和货币，开创中国大一统格局。', category: 'history', region: 'china', significance: 3, figure: '秦始皇' },
  { id: 'cn005', year: -210, title: '秦始皇兵马俑', description: '秦始皇陵兵马俑坑建造，8000多个真人大小的陶俑组成地下军团。', category: 'art', region: 'china', significance: 3, figure: '秦始皇' },
  { id: 'cn006', year: -104, title: '司马迁《史记》', description: '司马迁忍受宫刑之辱完成《史记》，开创了中国纪传体通史的传统。', category: 'literature', region: 'china', significance: 3, figure: '司马迁' },
  { id: 'cn007', year: 105, title: '蔡伦改进造纸术', description: '蔡伦改进造纸工艺，使纸张成为廉价实用的书写材料，推动了知识传播。', category: 'technology', region: 'china', significance: 3, figure: '蔡伦' },
  { id: 'cn008', year: 609, title: '隋朝大运河', description: '隋炀帝修建贯通南北的大运河，全长2700公里，是古代世界最大的水利工程。', category: 'technology', region: 'china', significance: 3 },
  { id: 'cn009', year: 618, title: '唐朝建立', description: '李渊建立唐朝，开启了中国历史上最开放繁荣的时代之一。', category: 'history', region: 'china', significance: 3 },
  { id: 'cn010', year: 755, title: '杜甫与李白', description: '唐代诗歌在李白的浪漫和杜甫的写实中达到巅峰，"诗仙"与"诗圣"交相辉映。', category: 'literature', region: 'china', significance: 3, figure: '李白' },
  { id: 'cn011', year: 960, title: '宋朝文化巅峰', description: '赵匡胤建立宋朝。宋代在科技、文化、经济上远超同时代欧洲。', category: 'history', region: 'china', significance: 2 },
  { id: 'cn012', year: 1040, title: '毕昇活字印刷', description: '毕昇发明胶泥活字印刷术，比古腾堡早约400年。', category: 'technology', region: 'china', significance: 3, figure: '毕昇' },
  { id: 'cn013', year: 1088, title: '沈括《梦溪笔谈》', description: '沈括撰写百科全书式的《梦溪笔谈》，记录了指南针、活字印刷等重大发明。', category: 'science', region: 'china', significance: 2, figure: '沈括' },
  { id: 'cn014', year: 1271, title: '元朝建立', description: '忽必烈建立元朝，是中国历史上第一个由少数民族建立的大一统王朝。', category: 'history', region: 'china', significance: 2, figure: '忽必烈' },
  { id: 'cn015', year: 1405, title: '永乐大典', description: '明成祖下令编纂《永乐大典》，收录约8亿字，是当时世界上最大的百科全书。', category: 'literature', region: 'china', significance: 2 },
  { id: 'cn016', year: 1420, title: '紫禁城建成', description: '北京紫禁城建成，占地72万平方米，是世界上现存最大的古代宫殿建筑群。', category: 'architecture', region: 'china', significance: 3 },
  { id: 'cn017', year: 1578, title: '李时珍《本草纲目》', description: '李时珍耗时27年完成药物学巨著《本草纲目》，收录1892种药物。', category: 'medicine', region: 'china', significance: 2, figure: '李时珍' },
  { id: 'cn018', year: 1750, title: '曹雪芹《红楼梦》', description: '曹雪芹创作中国古典小说巅峰《红楼梦》，被誉为中国的"百科全书式小说"。', category: 'literature', region: 'china', significance: 3, figure: '曹雪芹' },
  { id: 'cn019', year: 1919, title: '五四运动', description: '北京学生掀起五四运动，推动了新文化运动和白话文普及，中国近代思想解放里程碑。', category: 'history', region: 'china', significance: 3 },
  { id: 'cn020', year: 1949, title: '新中国成立', description: '中华人民共和国成立，结束了一百多年的动荡，中国历史翻开新的一页。', category: 'history', region: 'china', significance: 3 },
]

// ── 特性12: 日本文化深度 ──────────────────────────
export const japanDeepEvents: HistoricalEvent[] = [
  { id: 'jp001', year: 710, title: '奈良时代', description: '日本迁都平城京（奈良），全面学习唐朝制度和文化，建造了东大寺和奈良大佛。', category: 'history', region: 'japan', significance: 2 },
  { id: 'jp002', year: 794, title: '平安时代', description: '日本迁都平安京（京都），开创了持续四百年的贵族文化黄金期。', category: 'history', region: 'japan', significance: 2 },
  { id: 'jp003', year: 1010, title: '紫式部《源氏物语》', description: '紫式部创作《源氏物语》，被认为是世界上第一部长篇小说。', details: '这部54卷的小说以细腻的心理描写和优美的散文展现了平安贵族的生活，比欧洲最早的长篇小说早了数百年。', category: 'literature', region: 'japan', significance: 3, figure: '紫式部' },
  { id: 'jp004', year: 1185, title: '镰仓幕府', description: '源赖朝建立镰仓幕府，武士阶层开始统治日本，开启了近七百年的幕府时代。', category: 'history', region: 'japan', significance: 2, figure: '源赖朝' },
  { id: 'jp005', year: 1274, title: '蒙古入侵日本', description: '忽必烈两次派遣大军入侵日本，均被台风（"神风"）摧毁。', category: 'warfare', region: 'japan', significance: 2 },
  { id: 'jp006', year: 1467, title: '应仁之乱', description: '日本进入战国时代，群雄割据，武士道精神和城堡建筑达到巅峰。', category: 'warfare', region: 'japan', significance: 2 },
  { id: 'jp007', year: 1600, title: '关原合战', description: '德川家康在关原之战获胜，建立了持续265年的德川幕府和平时期。', category: 'warfare', region: 'japan', significance: 2, figure: '德川家康' },
  { id: 'jp008', year: 1700, title: '浮世绘与江户文化', description: '江户时代商业文化繁荣，浮世绘版画、歌舞伎和俳句达到艺术高峰。', category: 'art', region: 'japan', significance: 2 },
  { id: 'jp009', year: 1830, title: '葛饰北斋《神奈川冲浪里》', description: '葛饰北斋创作《富岳三十六景》，其中《神奈川冲浪里》成为世界上最著名的版画。', category: 'art', region: 'japan', significance: 3, figure: '葛饰北斋' },
  { id: 'jp010', year: 1945, title: '广岛长崎原子弹', description: '美国在广岛和长崎投下原子弹，日本投降，人类首次使用核武器。', category: 'warfare', region: 'japan', significance: 3 },
  { id: 'jp011', year: 1968, title: '川端康成获诺贝尔文学奖', description: '川端康成成为日本首位诺贝尔文学奖得主，以《雪国》等作品闻名。', category: 'literature', region: 'japan', significance: 2, figure: '川端康成' },
]

// ── 特性13: 韩国朝鲜史 ──────────────────────────
export const koreaDeepEvents: HistoricalEvent[] = [
  { id: 'kr001', year: -57, title: '三国时代开始', description: '新罗、百济和高句丽三国鼎立，朝鲜半岛进入三国争霸时代。', category: 'history', region: 'korea', significance: 2 },
  { id: 'kr002', year: 668, title: '新罗统一朝鲜半岛', description: '新罗联合唐朝击败百济和高句丽，首次统一朝鲜半岛大部分地区。', category: 'history', region: 'korea', significance: 2 },
  { id: 'kr003', year: 918, title: '高丽王朝', description: '王建建立高丽王朝，"Korea"一词即源自"高丽"。高丽青瓷闻名世界。', category: 'history', region: 'korea', significance: 2, figure: '王建' },
  { id: 'kr004', year: 1234, title: '高丽金属活字', description: '高丽发明世界上最早的金属活字印刷术，比古腾堡早约200年。', category: 'technology', region: 'korea', significance: 3 },
  { id: 'kr005', year: 1392, title: '朝鲜王朝建立', description: '李成桂建立朝鲜王朝，采用儒学治国，存续518年。', category: 'history', region: 'korea', significance: 2, figure: '李成桂' },
  { id: 'kr006', year: 1443, title: '世宗大王创制韩文', description: '世宗大王创制训民正音（韩文字母），被联合国教科文组织誉为最科学的文字系统之一。', details: '在韩文发明之前，朝鲜使用汉字，绝大多数平民是文盲。世宗大王设计的字母系统与发音器官的形状对应，简洁高效，使识字率大幅提升。', category: 'literature', region: 'korea', significance: 3, figure: '世宗大王' },
  { id: 'kr007', year: 1592, title: '壬辰倭乱', description: '丰臣秀吉入侵朝鲜，李舜臣以龟甲船击败日本水军，成为朝鲜民族英雄。', category: 'warfare', region: 'korea', significance: 2, figure: '李舜臣' },
  { id: 'kr008', year: 1950, title: '朝鲜战争', description: '朝鲜半岛爆发战争，三年后以停战线（三八线附近）告终，南北分裂延续至今。', category: 'warfare', region: 'korea', significance: 3 },
]

// ── 特性14: 宗教与信仰扩充 ──────────────────────────
export const religionDeepEvents: HistoricalEvent[] = [
  { id: 'rel001', year: -1300, title: '摩西出埃及', description: '传说中摩西率领以色列人离开埃及，在西奈山上接受十诫，犹太教由此奠基。', category: 'religion', region: 'egypt', significance: 3, figure: '摩西' },
  { id: 'rel002', year: 30, title: '耶稣受难与复活', description: '拿撒勒人耶稣在耶路撒冷被钉十字架，门徒们声称他三日后复活，基督教由此诞生。', category: 'religion', region: 'israel', significance: 3, figure: '耶稣' },
  { id: 'rel003', year: 313, title: '米兰敕令', description: '罗马皇帝君士坦丁颁布米兰敕令，基督教在罗马帝国获得合法地位。', category: 'religion', region: 'italy', significance: 3, figure: '君士坦丁' },
  { id: 'rel004', year: 622, title: '穆罕默德迁徙麦地那', description: '伊斯兰教创始人穆罕默德从麦加迁徙到麦地那（希吉拉），伊斯兰历纪元开始。', category: 'religion', region: 'saudi-arabia', significance: 3, figure: '穆罕默德' },
  { id: 'rel005', year: 1517, title: '马丁·路德宗教改革', description: '路德在维滕贝格教堂门上张贴《九十五条论纲》，新教运动由此爆发，基督教世界永久分裂。', category: 'religion', region: 'germany', significance: 3, figure: '马丁·路德' },
  { id: 'rel006', year: 1469, title: '纳纳克·锡克教创立', description: '古鲁纳纳克创立锡克教，融合印度教和伊斯兰教元素，强调平等和服务。', category: 'religion', region: 'india', significance: 2, figure: '纳纳克' },
  { id: 'rel007', year: 1844, title: '巴哈伊教创立', description: '巴孛在波斯宣布使命，巴哈伊教由此萌芽，主张世界统一与人类一体。', category: 'religion', region: 'iran', significance: 1 },
  { id: 'rel008', year: 250, title: '摩尼教', description: '波斯先知摩尼创立摩尼教，融合基督教、佛教和琐罗亚斯德教，传播到罗马和中国。', category: 'religion', region: 'iran', significance: 2, figure: '摩尼' },
  { id: 'rel009', year: -600, title: '琐罗亚斯德教', description: '查拉图斯特拉创立琐罗亚斯德教（拜火教），其善恶二元论深刻影响了犹太教、基督教和伊斯兰教。', category: 'religion', region: 'iran', significance: 3, figure: '查拉图斯特拉' },
  { id: 'rel010', year: 67, title: '佛教传入中国', description: '传说白马驮经，佛教正式传入中国，此后深刻融入中华文明。', category: 'religion', region: 'china', significance: 2 },
]

// ── 特性15: 世界文学经典 ──────────────────────────
export const literatureDeepEvents: HistoricalEvent[] = [
  { id: 'lit001', year: -700, title: '荷马史诗', description: '《伊利亚特》和《奥德赛》奠定了西方文学的基础，被誉为"一切伟大文学的源头"。', category: 'literature', region: 'greece', significance: 3, figure: '荷马' },
  { id: 'lit002', year: 8, title: '奥维德《变形记》', description: '罗马诗人奥维德完成叙事长诗《变形记》，收录250个希腊罗马神话，影响深远。', category: 'literature', region: 'italy', significance: 2, figure: '奥维德' },
  { id: 'lit003', year: 1307, title: '但丁《神曲》', description: '但丁用意大利语写成《神曲》，描绘了从地狱到天堂的旅程，开创了文艺复兴文学。', category: 'literature', region: 'italy', significance: 3, figure: '但丁' },
  { id: 'lit004', year: 1353, title: '薄伽丘《十日谈》', description: '薄伽丘创作《十日谈》，100个故事以幽默和讽刺描绘人性，开创了欧洲短篇小说传统。', category: 'literature', region: 'italy', significance: 2, figure: '薄伽丘' },
  { id: 'lit005', year: 1600, title: '莎士比亚《哈姆雷特》', description: '莎士比亚创作《哈姆雷特》，"生存还是毁灭"成为人类文学最著名的台词。', category: 'literature', region: 'uk', significance: 3, figure: '莎士比亚' },
  { id: 'lit006', year: 1605, title: '塞万提斯《堂吉诃德》', description: '塞万提斯创作《堂吉诃德》，被认为是第一部现代意义上的长篇小说。', category: 'literature', region: 'spain', significance: 3, figure: '塞万提斯' },
  { id: 'lit007', year: 1719, title: '笛福《鲁滨逊漂流记》', description: '笛福创作《鲁滨逊漂流记》，开创了英语冒险小说和现实主义叙事传统。', category: 'literature', region: 'uk', significance: 2, figure: '笛福' },
  { id: 'lit008', year: 1813, title: '简·奥斯丁《傲慢与偏见》', description: '奥斯丁以精妙的讽刺和对日常生活的细致观察，创作了英国文学经典。', category: 'literature', region: 'uk', significance: 2, figure: '简·奥斯丁' },
  { id: 'lit009', year: 1851, title: '梅尔维尔《白鲸》', description: '赫尔曼·梅尔维尔创作《白鲸》，关于人类执念与自然力量的对抗，美国文学巅峰。', category: 'literature', region: 'usa', significance: 2, figure: '梅尔维尔' },
  { id: 'lit010', year: 1915, title: '卡夫卡《变形记》', description: '卡夫卡创作《变形记》，一觉醒来变成甲虫的荒诞叙事开创了现代主义文学。', category: 'literature', region: 'czech', significance: 3, figure: '卡夫卡' },
  { id: 'lit011', year: 1922, title: '乔伊斯《尤利西斯》', description: '詹姆斯·乔伊斯创作《尤利西斯》，意识流手法将现代主义小说推向极致。', category: 'literature', region: 'ireland', significance: 3, figure: '乔伊斯' },
  { id: 'lit012', year: 1925, title: '鲁迅《呐喊》', description: '鲁迅以《狂人日记》《阿Q正传》等作品揭示国民性弱点，奠定中国现代文学基础。', category: 'literature', region: 'china', significance: 3, figure: '鲁迅' },
]

// ── 特性16-20: 波斯/中亚/土耳其/西葡/荷兰 ──────────────────
export const eurasiaDeepEvents: HistoricalEvent[] = [
  // 波斯与中亚
  { id: 'eur001', year: -550, title: '波斯帝国建立', description: '居鲁士大帝建立阿契美尼德帝国，是人类历史上第一个横跨三大洲的帝国。', category: 'history', region: 'iran', significance: 3, figure: '居鲁士' },
  { id: 'eur002', year: -490, title: '马拉松战役', description: '雅典军队在马拉松击败波斯入侵者，传令兵跑了42公里报捷——马拉松长跑的由来。', category: 'warfare', region: 'greece', significance: 3 },
  { id: 'eur003', year: 1010, title: '菲尔多西《列王纪》', description: '波斯诗人菲尔多西完成史诗《列王纪》，6万对偶句讲述波斯传奇，是伊朗文化的脊梁。', category: 'literature', region: 'iran', significance: 3, figure: '菲尔多西' },
  { id: 'eur004', year: 1370, title: '帖木儿帝国', description: '帖木儿从撒马尔罕崛起，建立了从印度到地中海的庞大帝国。', category: 'history', region: 'uzbekistan', significance: 2, figure: '帖木儿' },
  { id: 'eur005', year: 1420, title: '撒马尔罕天文台', description: '帖木儿之孙乌鲁伯格在撒马尔罕建造天文台，编制了中世纪最精确的星表。', category: 'science', region: 'uzbekistan', significance: 2, figure: '乌鲁伯格' },
  // 奥斯曼与土耳其
  { id: 'eur006', year: 1299, title: '奥斯曼帝国建立', description: '奥斯曼一世建立奥斯曼王朝，后发展为横跨欧亚非三大洲的帝国。', category: 'history', region: 'turkey', significance: 3 },
  { id: 'eur007', year: 1520, title: '苏莱曼大帝', description: '奥斯曼帝国在苏莱曼一世时期达到鼎盛，领土从维也纳城下延伸到波斯湾。', category: 'history', region: 'turkey', significance: 3, figure: '苏莱曼' },
  { id: 'eur008', year: 1923, title: '土耳其共和国', description: '凯末尔废除苏丹制建立世俗共和国，推行拉丁字母和西式法律。', category: 'history', region: 'turkey', significance: 2, figure: '凯末尔' },
  // 西班牙葡萄牙
  { id: 'eur009', year: 711, title: '摩尔人征服西班牙', description: '穆斯林军队跨过直布罗陀海峡征服伊比利亚大部，开启了安达卢西亚文明。', category: 'history', region: 'spain', significance: 2 },
  { id: 'eur010', year: 1492, title: '格拉纳达收复', description: '卡斯蒂利亚和阿拉贡收复格拉纳达，结束了近八百年的穆斯林统治。', category: 'history', region: 'spain', significance: 2 },
  { id: 'eur011', year: 1580, title: '卡蒙斯《卢济塔尼亚人之歌》', description: '葡萄牙民族史诗歌颂达·伽马的航海壮举，是葡语文学最伟大的作品。', category: 'literature', region: 'portugal', significance: 2, figure: '卡蒙斯' },
  // 荷兰黄金时代
  { id: 'eur012', year: 1602, title: '荷兰东印度公司', description: '世界上第一家股份制公司成立，开创了现代资本主义和证券交易。', category: 'history', region: 'netherlands', significance: 3 },
  { id: 'eur013', year: 1642, title: '伦勃朗《夜巡》', description: '伦勃朗创作《夜巡》，巴洛克光影技法达到巅峰。', category: 'art', region: 'netherlands', significance: 3, figure: '伦勃朗' },
  { id: 'eur014', year: 1665, title: '维米尔《戴珍珠耳环的少女》', description: '维米尔以神秘的光线和色彩创作了荷兰黄金时代最迷人的肖像画。', category: 'art', region: 'netherlands', significance: 2, figure: '维米尔' },
  // 俄罗斯
  { id: 'eur015', year: 1703, title: '彼得大帝建圣彼得堡', description: '彼得大帝在沼泽地上建造新首都，以"面向欧洲的窗口"推动俄罗斯现代化。', category: 'history', region: 'russia', significance: 2, figure: '彼得大帝' },
  { id: 'eur016', year: 1812, title: '拿破仑入侵俄罗斯', description: '拿破仑率60万大军入侵俄罗斯，焦土战略和严冬使其惨败，仅约3万人生还。', category: 'warfare', region: 'russia', significance: 3, figure: '拿破仑' },
  // 北欧维京
  { id: 'eur017', year: 793, title: '维京时代开始', description: '维京人袭击英格兰林迪斯法恩修道院，拉开了持续近三百年的维京扩张时代。', category: 'warfare', region: 'norway', significance: 2 },
  { id: 'eur018', year: 874, title: '维京人发现冰岛', description: '挪威人定居冰岛，后在此建立了世界上最古老的议会（930年）。', category: 'exploration', region: 'norway', significance: 2 },
  // 东欧
  { id: 'eur019', year: 1410, title: '格伦瓦尔德之战', description: '波兰-立陶宛联军在格伦瓦尔德击败条顿骑士团，是中世纪最大的骑士战役之一。', category: 'warfare', region: 'poland', significance: 2 },
  { id: 'eur020', year: 1683, title: '维也纳之战', description: '波兰国王索别斯基率联军在维也纳城下击败奥斯曼帝国，奥斯曼扩张从此止步。', category: 'warfare', region: 'austria', significance: 2, figure: '索别斯基' },
]

// ── 特性21-30: 大洋洲/巴西阿根廷/丝路/灾难/体育/建筑/技术/艺术运动 ──────
export const worldDeepEvents: HistoricalEvent[] = [
  // 加拿大澳新
  { id: 'wld001', year: 1867, title: '加拿大自治领', description: '加拿大联邦成立，在保持英联邦成员身份的同时获得自治权。', category: 'history', region: 'canada', significance: 2 },
  { id: 'wld002', year: 1770, title: '库克船长登陆澳大利亚', description: '库克船长宣布澳大利亚东海岸为英国领土，1788年英国在此建立流放殖民地。', category: 'history', region: 'australia', significance: 2 },
  { id: 'wld003', year: 1840, title: '怀唐伊条约', description: '英国与毛利酋长签署怀唐伊条约，被认为是新西兰的建国文件。', category: 'history', region: 'new-zealand', significance: 2 },
  // 丝绸之路
  { id: 'wld004', year: -130, title: '张骞通西域', description: '张骞出使西域，开辟了连接东西方文明的丝绸之路。', details: '张骞两次出使西域共历时约20年，虽然最初的外交目标失败，但他带回的关于中亚各国的信息使汉朝第一次了解到了一个广阔的外部世界。丝绸之路从此成为东西方文明交流的大动脉。', category: 'exploration', region: 'china', significance: 3, figure: '张骞' },
  { id: 'wld005', year: 600, title: '丝绸之路鼎盛', description: '唐朝时期丝绸之路贸易达到巅峰，长安成为当时世界上最大的国际都市。', category: 'history', region: 'china', significance: 2 },
  // 环境与灾难
  { id: 'wld006', year: 79, title: '维苏威火山爆发', description: '维苏威火山爆发埋葬了庞贝城和赫库兰尼姆城，火山灰完整保存了古罗马城市生活的快照。', category: 'history', region: 'italy', significance: 2 },
  { id: 'wld007', year: 1755, title: '里斯本大地震', description: '里斯本发生9级大地震并引发海啸和大火，几乎摧毁了整座城市，深刻影响了启蒙哲学。', category: 'history', region: 'portugal', significance: 2 },
  { id: 'wld008', year: 1883, title: '喀拉喀托火山爆发', description: '印尼喀拉喀托火山大爆发，爆炸声传到5000公里外，引发的海啸导致3.6万人遇难。', category: 'history', region: 'indonesia', significance: 2 },
  // 体育
  { id: 'wld009', year: -776, title: '古代奥运会', description: '第一届古代奥林匹克运动会在希腊奥林匹亚举行，比赛期间各城邦停战。', category: 'history', region: 'greece', significance: 2 },
  { id: 'wld010', year: 1930, title: '首届世界杯', description: '首届FIFA世界杯在乌拉圭举行，东道主夺冠，足球成为全球第一运动。', category: 'history', region: 'argentina', significance: 2 },
  // 建筑奇迹补充
  { id: 'wld011', year: 1632, title: '泰姬陵建造', description: '莫卧儿皇帝沙贾汗为纪念亡妻修建泰姬陵，被誉为"大理石之梦"。', category: 'architecture', region: 'india', significance: 3 },
  { id: 'wld012', year: 1887, title: '埃菲尔铁塔', description: '居斯塔夫·埃菲尔为1889年巴黎世博会设计建造铁塔，成为工业时代最著名的建筑。', category: 'architecture', region: 'france', significance: 2 },
  { id: 'wld013', year: 1931, title: '帝国大厦', description: '纽约帝国大厦落成，以443米的高度保持了世界最高建筑的纪录近40年。', category: 'architecture', region: 'usa', significance: 2 },
  { id: 'wld014', year: 1973, title: '悉尼歌剧院', description: '约恩·乌松设计的悉尼歌剧院落成，帆形屋顶成为20世纪建筑最具辨识度的作品。', category: 'architecture', region: 'australia', significance: 2 },
  // 技术发明补充
  { id: 'wld015', year: 1440, title: '古腾堡印刷术', description: '古腾堡发明了活字印刷机和油墨技术，大规模印刷的《古腾堡圣经》彻底改变了知识传播方式。', category: 'technology', region: 'germany', significance: 3, figure: '古腾堡' },
  { id: 'wld016', year: 1769, title: '瓦特蒸汽机', description: '瓦特改良蒸汽机使其效率大幅提升，工业革命获得了强劲的动力引擎。', category: 'technology', region: 'uk', significance: 3, figure: '瓦特' },
  { id: 'wld017', year: 1837, title: '达盖尔银版摄影', description: '达盖尔公布实用摄影术，人类第一次可以精确记录视觉现实。', category: 'technology', region: 'france', significance: 2, figure: '达盖尔' },
  { id: 'wld018', year: 1888, title: '赫兹发现电磁波', description: '赫兹用实验证实了电磁波的存在，为无线电通信和现代通讯技术奠基。', category: 'science', region: 'germany', significance: 2, figure: '赫兹' },
  { id: 'wld019', year: 1947, title: '晶体管发明', description: '贝尔实验室发明晶体管，取代笨重的真空管，开启了电子信息时代。', category: 'technology', region: 'usa', significance: 3 },
  { id: 'wld020', year: 1969, title: '阿帕网诞生', description: '美国国防部建立阿帕网（ARPANET），互联网的前身由此诞生。', category: 'technology', region: 'usa', significance: 3 },
  // 艺术运动
  { id: 'wld021', year: 1907, title: '毕加索《亚威农少女》', description: '毕加索创作《亚威农少女》，立体主义诞生，西方绘画传统被彻底打破。', category: 'art', region: 'spain', significance: 3, figure: '毕加索' },
  { id: 'wld022', year: 1917, title: '杜尚《泉》', description: '杜尚将一个小便池签名后送去展览，彻底挑战了"什么是艺术"的定义，达达主义的标志。', category: 'art', region: 'france', significance: 3, figure: '杜尚' },
  { id: 'wld023', year: 1937, title: '毕加索《格尔尼卡》', description: '毕加索以西班牙内战中被轰炸的小镇为题创作巨幅画作，成为20世纪最强烈的反战宣言。', category: 'art', region: 'spain', significance: 3, figure: '毕加索' },
  { id: 'wld024', year: 1962, title: '安迪·沃霍尔与波普艺术', description: '沃霍尔的《坎贝尔浓汤罐头》将商业图像变成艺术，波普运动模糊了高雅与通俗的界限。', category: 'art', region: 'usa', significance: 2, figure: '安迪·沃霍尔' },
]
