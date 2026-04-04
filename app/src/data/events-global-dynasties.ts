import type { HistoricalEvent } from './types'

// ═══════════════════════════════════════════════════════════════════
//  全球各国王朝/时代补充（补齐文明图谱中缺失色块的国家）
//
//  ID 规则: gd + 三位数字
//  每个国家至少覆盖从早期文明到现代的连贯时间线
// ═══════════════════════════════════════════════════════════════════

export const globalDynastyEvents: HistoricalEvent[] = [

  // ═══════════════ 东亚 ═══════════════════════════════════

  // ─── 日本 ──────────────────────────────────
  { id: 'gd001', year: -300, endYear: 300, title: '弥生时代', description: '稻作农业从大陆传入，青铜器和铁器使用，邪马台国出现。', category: 'history', region: 'japan', significance: 1 },
  { id: 'gd002', year: 300, endYear: 710, title: '古坟·飞鸟时代', description: '大和政权统一日本，佛教传入，大化改新仿唐制建立中央集权。', category: 'history', region: 'japan', significance: 2 },
  { id: 'gd003', year: 710, endYear: 1185, title: '奈良·平安时代', description: '日本古典文化巅峰，《源氏物语》诞生，藤原氏摄关政治，武士阶层崛起。', category: 'history', region: 'japan', significance: 2, figure: '紫式部' },
  { id: 'gd004', year: 1185, endYear: 1603, title: '镰仓·室町·战国时代', description: '武家政治确立，幕府与天皇并存。战国群雄割据，织田信长、丰臣秀吉先后统一。', category: 'history', region: 'japan', significance: 2, figure: '源赖朝/织田信长' },
  { id: 'gd005', year: 1603, endYear: 1868, title: '江户幕府（德川时代）', description: '德川家康建立幕府，实行锁国政策260年。町人文化繁荣，浮世绘兴盛。', category: 'history', region: 'japan', significance: 3, figure: '德川家康' },
  { id: 'gd006', year: 1868, endYear: 1945, title: '明治维新至二战', description: '明治维新全面西化，甲午战争、日俄战争使日本跻身列强，军国主义最终导向二战惨败。', category: 'history', region: 'japan', significance: 3 },
  { id: 'gd007', year: 1945, endYear: 2030, title: '战后日本', description: '从废墟中崛起的经济奇迹，成为世界第二（后第三）大经济体。', category: 'history', region: 'japan', significance: 2 },

  // ─── 韩国/朝鲜 ──────────────────────────────
  { id: 'gd008', year: -57, endYear: 668, title: '三国时代（高句丽·百济·新罗）', description: '朝鲜半岛三国鼎立近700年，佛教传入，各国发展出独特文化。', category: 'history', region: 'korea', significance: 2 },
  { id: 'gd009', year: 668, endYear: 935, title: '统一新罗', description: '新罗联合唐朝灭百济、高句丽后统一半岛，佛教文化达到巅峰。', category: 'history', region: 'korea', significance: 2 },
  { id: 'gd010', year: 918, endYear: 1392, title: '高丽王朝', description: '王建建立高丽，发明金属活字印刷，雕版《高丽大藏经》，青瓷工艺闻名世界。', category: 'history', region: 'korea', significance: 2 },
  { id: 'gd011', year: 1392, endYear: 1897, title: '朝鲜王朝', description: '李成桂建朝鲜，世宗大王创制韩文字母（训民正音），儒学治国延续500年。', category: 'history', region: 'korea', significance: 3, figure: '世宗大王' },
  { id: 'gd012', year: 1897, endYear: 1945, title: '大韩帝国与日本殖民', description: '短暂的大韩帝国（1897-1910）被日本吞并，殖民统治35年至二战结束。', category: 'history', region: 'korea', significance: 2 },
  { id: 'gd013', year: 1948, endYear: 2030, title: '大韩民国', description: '朝鲜战争后南北分裂，韩国从军事独裁走向民主化，"汉江奇迹"经济腾飞。', category: 'history', region: 'korea', significance: 2 },

  // ─── 蒙古 ──────────────────────────────────
  { id: 'gd014', year: 1206, endYear: 1368, title: '蒙古帝国', description: '成吉思汗统一草原建立史上最大陆地帝国，横跨欧亚大陆。', category: 'history', region: 'mongolia', significance: 3, figure: '成吉思汗' },
  { id: 'gd015', year: 1368, endYear: 1911, title: '北元与清朝统治', description: '元朝退回草原后蒙古分裂，17世纪被清朝征服，纳入中国版图。', category: 'history', region: 'mongolia', significance: 1 },
  { id: 'gd016', year: 1911, endYear: 2030, title: '现代蒙古', description: '1911年独立，1924年成为社会主义国家，1990年民主化。', category: 'history', region: 'mongolia', significance: 1 },

  // ═══════════════ 东南亚 ═════════════════════════════════

  // ─── 越南 ──────────────────────────────────
  { id: 'gd017', year: -207, endYear: 938, title: '中国统治时期（北属期）', description: '从南越国到唐朝灭亡，越南被中国统治超过千年，但保持了独特的文化认同。', category: 'history', region: 'vietnam', significance: 1 },
  { id: 'gd018', year: 938, endYear: 1407, title: '独立王朝（丁·黎·李·陈）', description: '吴权击败南汉独立，经历多个王朝，抗击蒙古三次入侵成功。', category: 'history', region: 'vietnam', significance: 2 },
  { id: 'gd019', year: 1428, endYear: 1802, title: '后黎朝与南北分裂', description: '黎利驱逐明朝恢复独立，后期南北郑阮对立近200年。', category: 'history', region: 'vietnam', significance: 1 },
  { id: 'gd020', year: 1802, endYear: 1945, title: '阮朝与法国殖民', description: '阮朝统一越南，1862年起逐步沦为法国殖民地。', category: 'history', region: 'vietnam', significance: 2 },
  { id: 'gd021', year: 1945, endYear: 2030, title: '现代越南', description: '胡志明宣布独立，经历抗法、抗美战争，1975年统一，1986年革新开放。', category: 'history', region: 'vietnam', significance: 2, figure: '胡志明' },

  // ─── 泰国 ──────────────────────────────────
  { id: 'gd022', year: 1238, endYear: 1438, title: '素可泰王国', description: '泰国第一个统一王朝，创制泰文字母，上座部佛教成为国教。', category: 'history', region: 'thailand', significance: 2 },
  { id: 'gd023', year: 1351, endYear: 1767, title: '阿瑜陀耶王国（大城王朝）', description: '东南亚强国，与欧洲通商，1767年被缅甸灭亡。', category: 'history', region: 'thailand', significance: 2 },
  { id: 'gd024', year: 1782, endYear: 2030, title: '却克里王朝（曼谷王朝）', description: '拉玛一世建都曼谷至今，泰国是东南亚唯一未被殖民的国家。', category: 'history', region: 'thailand', significance: 2 },

  // ─── 柬埔寨 ──────────────────────────────────
  { id: 'gd025', year: 802, endYear: 1431, title: '高棉帝国（吴哥王朝）', description: '苏利耶跋摩二世建造吴哥窟，高棉帝国是东南亚最辉煌的文明之一。', category: 'history', region: 'cambodia', significance: 3, figure: '苏利耶跋摩二世' },
  { id: 'gd026', year: 1431, endYear: 1863, title: '后吴哥时期', description: '吴哥被暹罗攻破后高棉衰落，在泰国和越南之间艰难生存。', category: 'history', region: 'cambodia', significance: 1 },
  { id: 'gd027', year: 1863, endYear: 2030, title: '法国保护国至现代', description: '法国殖民、独立、红色高棉大屠杀（1975-1979）和战后重建。', category: 'history', region: 'cambodia', significance: 2 },

  // ─── 印度尼西亚 ──────────────────────────────
  { id: 'gd028', year: 700, endYear: 1400, title: '三佛齐·满者伯夷帝国', description: '苏门答腊三佛齐和爪哇满者伯夷先后称霸东南亚海上贸易。', category: 'history', region: 'indonesia', significance: 2 },
  { id: 'gd029', year: 1400, endYear: 1945, title: '伊斯兰苏丹国与荷兰殖民', description: '伊斯兰传入后各苏丹国兴起，16世纪起荷兰东印度公司逐步殖民。', category: 'history', region: 'indonesia', significance: 2 },
  { id: 'gd030', year: 1945, endYear: 2030, title: '现代印度尼西亚', description: '苏加诺宣布独立，苏哈托"新秩序"32年，1998年民主化改革。', category: 'history', region: 'indonesia', significance: 2 },

  // ─── 缅甸 ──────────────────────────────────
  { id: 'gd031', year: 1044, endYear: 1287, title: '蒲甘王朝', description: '阿奴律陀统一缅甸，蒲甘建造了数千座佛塔，1287年被蒙古征服。', category: 'history', region: 'myanmar', significance: 2 },
  { id: 'gd032', year: 1287, endYear: 2030, title: '后蒲甘至现代缅甸', description: '经历东吁、贡榜王朝、英国殖民、独立和军政府长期统治。', category: 'history', region: 'myanmar', significance: 1 },

  // ═══════════════ 西亚 / 波斯 ═══════════════════════════

  // ─── 伊朗（波斯）──────────────────────────────
  { id: 'gd033', year: -550, endYear: -330, title: '阿契美尼德帝国（波斯第一帝国）', description: '居鲁士大帝建立的帝国从埃及延伸至印度河，是古代世界最大的帝国。', category: 'history', region: 'iran', significance: 3, figure: '居鲁士/大流士' },
  { id: 'gd034', year: -330, endYear: -141, title: '塞琉古帝国统治', description: '亚历山大征服后希腊化的塞琉古帝国统治波斯地区约200年。', category: 'history', region: 'iran', significance: 1 },
  { id: 'gd035', year: -247, endYear: 224, title: '帕提亚帝国（安息）', description: '帕提亚人推翻塞琉古建立安息帝国，与罗马对峙为丝绸之路上的重要势力。', category: 'history', region: 'iran', significance: 2 },
  { id: 'gd036', year: 224, endYear: 651, title: '萨珊帝国（波斯第二帝国）', description: '萨珊王朝复兴波斯文明，琐罗亚斯德教为国教，与拜占庭长期对抗。', category: 'history', region: 'iran', significance: 3 },
  { id: 'gd037', year: 651, endYear: 1501, title: '伊斯兰波斯（阿拉伯至蒙古）', description: '阿拉伯征服后波斯伊斯兰化，萨曼、加兹尼、塞尔柱、蒙古伊尔汗国、帖木儿先后统治。', category: 'history', region: 'iran', significance: 2 },
  { id: 'gd038', year: 1501, endYear: 1979, title: '萨法维至巴列维王朝', description: '萨法维确立什叶派为国教，经阿夫沙尔、恺加尔至巴列维，1979年伊斯兰革命推翻君主制。', category: 'history', region: 'iran', significance: 3 },
  { id: 'gd039', year: 1979, endYear: 2030, title: '伊朗伊斯兰共和国', description: '霍梅尼建立的政教合一共和国，经历两伊战争和国际制裁。', category: 'history', region: 'iran', significance: 2, figure: '霍梅尼' },

  // ═══════════════ 欧洲补充 ═══════════════════════════════

  // ─── 荷兰 ──────────────────────────────────
  { id: 'gd040', year: 1568, endYear: 1795, title: '荷兰共和国（黄金时代）', description: '脱离西班牙独立后成为17世纪全球最富裕的海上贸易帝国。', category: 'history', region: 'netherlands', significance: 3 },
  { id: 'gd041', year: 1815, endYear: 2030, title: '荷兰王国', description: '拿破仑战后重建的君主立宪制王国至今。', category: 'history', region: 'netherlands', significance: 1 },

  // ─── 波兰 ──────────────────────────────────
  { id: 'gd042', year: 966, endYear: 1795, title: '波兰王国·共和国', description: '皮亚斯特至雅盖隆王朝，波兰-立陶宛联邦曾是欧洲最大国家，1795年三次瓜分后亡国。', category: 'history', region: 'poland', significance: 2 },
  { id: 'gd043', year: 1918, endYear: 2030, title: '现代波兰', description: '一战后复国，二战被德苏瓜分，战后社会主义政权，1989年团结工会推动民主化。', category: 'history', region: 'poland', significance: 2 },

  // ─── 奥地利 ──────────────────────────────────
  { id: 'gd044', year: 1273, endYear: 1918, title: '哈布斯堡王朝', description: '哈布斯堡家族统治奥地利600余年，建立横跨中欧的多民族帝国。', category: 'history', region: 'austria', significance: 3 },
  { id: 'gd045', year: 1918, endYear: 2030, title: '奥地利共和国', description: '帝国解体后的小国，经历纳粹吞并和战后永久中立。', category: 'history', region: 'austria', significance: 1 },

  // ─── 葡萄牙 ──────────────────────────────────
  { id: 'gd046', year: 1139, endYear: 1910, title: '葡萄牙王国', description: '欧洲最古老的民族国家之一，大航海时代的先驱，建立了全球殖民帝国。', category: 'history', region: 'portugal', significance: 3 },
  { id: 'gd047', year: 1910, endYear: 2030, title: '葡萄牙共和国', description: '1910年推翻君主制，萨拉查独裁（1933-1974），1974年康乃馨革命民主化。', category: 'history', region: 'portugal', significance: 1 },

  // ─── 瑞典 ──────────────────────────────────
  { id: 'gd048', year: 1523, endYear: 1721, title: '瑞典帝国时代', description: '古斯塔夫·瓦萨独立建国，17世纪的瑞典帝国是北欧霸主。', category: 'history', region: 'sweden', significance: 2 },
  { id: 'gd049', year: 1721, endYear: 2030, title: '现代瑞典', description: '从军事大国转型为中立福利国家的典范。', category: 'history', region: 'sweden', significance: 1 },

  // ─── 丹麦 ──────────────────────────────────
  { id: 'gd050', year: 800, endYear: 1397, title: '维京-丹麦王国', description: '维京时代丹麦人征服英格兰，此后发展为北海强国。', category: 'history', region: 'denmark', significance: 2 },
  { id: 'gd051', year: 1397, endYear: 2030, title: '卡尔马联盟至现代丹麦', description: '北欧三国联盟、绝对君主制、1849年立宪、现代福利国家。', category: 'history', region: 'denmark', significance: 1 },

  // ─── 挪威 ──────────────────────────────────
  { id: 'gd052', year: 872, endYear: 1380, title: '挪威维京王国', description: '哈拉尔美发王统一挪威，维京探险家发现冰岛和格陵兰。', category: 'history', region: 'norway', significance: 2 },
  { id: 'gd053', year: 1380, endYear: 1905, title: '丹麦-瑞典联盟统治', description: '先与丹麦后与瑞典联盟统治500多年。', category: 'history', region: 'norway', significance: 1 },
  { id: 'gd054', year: 1905, endYear: 2030, title: '现代挪威', description: '1905年和平独立，北海石油使其成为世界最富裕国家之一。', category: 'history', region: 'norway', significance: 1 },

  // ─── 瑞士 ──────────────────────────────────
  { id: 'gd055', year: 1291, endYear: 2030, title: '瑞士邦联至联邦', description: '1291年三州永久同盟起始，发展为永久中立的联邦制国家。', category: 'history', region: 'switzerland', significance: 2 },

  // ─── 爱尔兰 ──────────────────────────────────
  { id: 'gd056', year: 1169, endYear: 1922, title: '英格兰/英国统治', description: '诺曼人入侵后爱尔兰逐步被英国控制，经历大饥荒和争取独立运动。', category: 'history', region: 'ireland', significance: 2 },
  { id: 'gd057', year: 1922, endYear: 2030, title: '爱尔兰自由邦/共和国', description: '1922年独立，1949年正式成为共和国，经济"凯尔特之虎"崛起。', category: 'history', region: 'ireland', significance: 1 },

  // ─── 匈牙利 ──────────────────────────────────
  { id: 'gd058', year: 1000, endYear: 1526, title: '匈牙利王国', description: '伊什特万一世建立基督教王国，中世纪匈牙利是中欧强国。', category: 'history', region: 'hungary', significance: 2 },
  { id: 'gd059', year: 1526, endYear: 2030, title: '奥斯曼-哈布斯堡至现代', description: '奥斯曼占领、哈布斯堡统治、奥匈帝国、两次大战、社会主义、1989年民主化。', category: 'history', region: 'hungary', significance: 1 },

  // ─── 塞尔维亚 ──────────────────────────────────
  { id: 'gd060', year: 1217, endYear: 1459, title: '塞尔维亚中世纪王国/帝国', description: '尼曼雅王朝建立塞尔维亚王国，杜尚大帝时达极盛，1389年科索沃战役后衰落。', category: 'history', region: 'serbia', significance: 2 },
  { id: 'gd061', year: 1459, endYear: 2030, title: '奥斯曼统治至现代', description: '近400年奥斯曼统治，19世纪独立，南斯拉夫时代，2006年独立。', category: 'history', region: 'serbia', significance: 1 },

  // ─── 乌克兰 ──────────────────────────────────
  { id: 'gd062', year: 882, endYear: 1240, title: '基辅罗斯', description: '东斯拉夫文明中心，988年皈依东正教，1240年蒙古入侵后衰落。', category: 'history', region: 'ukraine', significance: 2 },
  { id: 'gd063', year: 1240, endYear: 1991, title: '外国统治时期', description: '先后被蒙古、立陶宛、波兰、俄罗斯统治，哥萨克人短暂自治。', category: 'history', region: 'ukraine', significance: 1 },
  { id: 'gd064', year: 1991, endYear: 2030, title: '独立乌克兰', description: '苏联解体后独立，2014年克里米亚被吞并，2022年俄乌冲突。', category: 'history', region: 'ukraine', significance: 2 },

  // ─── 捷克 ──────────────────────────────────
  { id: 'gd065', year: 870, endYear: 1918, title: '波希米亚王国', description: '普热米斯尔至哈布斯堡统治，布拉格曾是神圣罗马帝国首都。', category: 'history', region: 'czech', significance: 2 },
  { id: 'gd066', year: 1918, endYear: 2030, title: '捷克斯洛伐克至捷克', description: '1918年建国，1938年被纳粹肢解，1968年布拉格之春，1989年天鹅绒革命，1993年和平分家。', category: 'history', region: 'czech', significance: 1 },

  // ─── 比利时 ──────────────────────────────────
  { id: 'gd067', year: 1830, endYear: 2030, title: '比利时王国', description: '1830年从荷兰独立，刚果殖民帝国，两次世界大战的主战场，欧盟总部所在地。', category: 'history', region: 'belgium', significance: 1 },

  // ─── 芬兰 ──────────────────────────────────
  { id: 'gd068', year: 1155, endYear: 1917, title: '瑞典-俄国统治', description: '先后被瑞典（1155-1809）和俄国（1809-1917）统治。', category: 'history', region: 'finland', significance: 1 },
  { id: 'gd069', year: 1917, endYear: 2030, title: '芬兰共和国', description: '1917年独立，冬季战争抗苏，战后发展为北欧福利国家和科技强国。', category: 'history', region: 'finland', significance: 1 },

  // ─── 罗马尼亚 ──────────────────────────────────
  { id: 'gd070', year: 1330, endYear: 1878, title: '瓦拉几亚·摩尔达维亚公国', description: '罗马尼亚前身的两个公国在奥斯曼宗主权下维持自治。弗拉德三世（"穿刺公"）是德古拉传说原型。', category: 'history', region: 'romania', significance: 1, figure: '弗拉德三世' },
  { id: 'gd071', year: 1878, endYear: 2030, title: '现代罗马尼亚', description: '1878年独立，经历两次大战、齐奥塞斯库独裁、1989年革命、2007年加入欧盟。', category: 'history', region: 'romania', significance: 1 },

  // ═══════════════ 美洲 ═══════════════════════════════════

  // ─── 美国 ──────────────────────────────────
  { id: 'gd072', year: 1607, endYear: 1776, title: '英属殖民地时期', description: '从詹姆斯敦建立到独立宣言，13个殖民地逐渐形成独特的美洲认同。', category: 'history', region: 'usa', significance: 2 },
  { id: 'gd073', year: 1776, endYear: 2030, title: '美利坚合众国', description: '从独立宣言到世界超级大国——经历内战、两次世界大战、冷战和全球霸权时代。', category: 'history', region: 'usa', significance: 3 },

  // ─── 墨西哥 ──────────────────────────────────
  { id: 'gd074', year: -1500, endYear: 1521, title: '美洲原住民文明', description: '奥尔梅克、玛雅、阿兹特克文明先后繁荣，特诺奇提特兰是当时世界最大城市之一。', category: 'history', region: 'mexico', significance: 3 },
  { id: 'gd075', year: 1521, endYear: 1821, title: '西班牙殖民地（新西班牙）', description: '科尔特斯灭阿兹特克，300年殖民统治期间天花等疫病消灭了90%原住民。', category: 'history', region: 'mexico', significance: 2 },
  { id: 'gd076', year: 1821, endYear: 2030, title: '独立至现代墨西哥', description: '1821年独立，美墨战争失去半壁江山，1910年革命，现代化进程。', category: 'history', region: 'mexico', significance: 2 },

  // ─── 巴西 ──────────────────────────────────
  { id: 'gd077', year: 1500, endYear: 1822, title: '葡萄牙殖民地', description: '卡布拉尔发现巴西后殖民322年，蔗糖和黄金经济依赖奴隶劳动。', category: 'history', region: 'brazil', significance: 2 },
  { id: 'gd078', year: 1822, endYear: 2030, title: '巴西帝国至共和国', description: '1822年和平独立为帝国，1889年成为共和国，经济大国崛起。', category: 'history', region: 'brazil', significance: 2 },

  // ─── 阿根廷 ──────────────────────────────────
  { id: 'gd079', year: 1816, endYear: 2030, title: '阿根廷共和国', description: '1816年独立，20世纪初曾是世界最富裕国家之一，庇隆主义深刻塑造国家。', category: 'history', region: 'argentina', significance: 1 },

  // ─── 秘鲁 ──────────────────────────────────
  { id: 'gd080', year: 1200, endYear: 1533, title: '印加帝国', description: '从库斯科扩张至整个安第斯山脉的庞大帝国，结绳记事，马丘比丘。', category: 'history', region: 'peru', significance: 3 },
  { id: 'gd081', year: 1533, endYear: 1824, title: '西班牙殖民地', description: '皮萨罗征服印加，利马成为南美殖民统治中心。', category: 'history', region: 'peru', significance: 1 },
  { id: 'gd082', year: 1824, endYear: 2030, title: '秘鲁共和国', description: '玻利瓦尔解放后独立至今。', category: 'history', region: 'peru', significance: 1 },

  // ─── 哥伦比亚 ──────────────────────────────────
  { id: 'gd083', year: 1819, endYear: 2030, title: '大哥伦比亚至哥伦比亚', description: '玻利瓦尔建立大哥伦比亚后分裂，长期内战与和平进程。', category: 'history', region: 'colombia', significance: 1 },

  // ─── 加拿大 ──────────────────────────────────
  { id: 'gd084', year: 1867, endYear: 2030, title: '加拿大联邦', description: '1867年英属北美法案建立联邦自治领，1982年宪法完全独立。', category: 'history', region: 'canada', significance: 1 },

  // ─── 古巴 ──────────────────────────────────
  { id: 'gd085', year: 1898, endYear: 2030, title: '独立至革命古巴', description: '1898年脱离西班牙，1959年卡斯特罗革命建立社会主义政权。', category: 'history', region: 'cuba', significance: 2, figure: '卡斯特罗' },

  // ═══════════════ 非洲 ═══════════════════════════════════

  // ─── 埃塞俄比亚 ──────────────────────────────
  { id: 'gd086', year: -1000, endYear: 940, title: '阿克苏姆王国', description: '非洲最早的基督教王国之一，控制红海贸易，方尖碑文明。', category: 'history', region: 'ethiopia', significance: 2 },
  { id: 'gd087', year: 1137, endYear: 1974, title: '所罗门王朝', description: '自称所罗门后裔的皇室统治800年，海尔·塞拉西是最后一位皇帝。', category: 'history', region: 'ethiopia', significance: 2, figure: '海尔·塞拉西' },
  { id: 'gd088', year: 1974, endYear: 2030, title: '现代埃塞俄比亚', description: '1974年革命推翻帝制，门格斯图红色恐怖，1991年后联邦制改革。', category: 'history', region: 'ethiopia', significance: 1 },

  // ─── 摩洛哥 ──────────────────────────────────
  { id: 'gd089', year: 788, endYear: 2030, title: '摩洛哥王朝', description: '从伊德里斯王朝到现代阿拉维王朝，摩洛哥是非洲最古老的延续性国家之一。', category: 'history', region: 'morocco', significance: 2 },

  // ─── 南非 ──────────────────────────────────
  { id: 'gd090', year: 1652, endYear: 1994, title: '殖民与种族隔离时代', description: '荷兰、英国殖民后建立种族隔离制度（1948-1994），曼德拉27年牢狱。', category: 'history', region: 'south-africa', significance: 3, figure: '曼德拉' },
  { id: 'gd091', year: 1994, endYear: 2030, title: '新南非', description: '1994年曼德拉当选首位黑人总统，结束种族隔离，"彩虹之国"。', category: 'history', region: 'south-africa', significance: 2, figure: '曼德拉' },

  // ─── 尼日利亚 ──────────────────────────────────
  { id: 'gd092', year: 1000, endYear: 1903, title: '尼日利亚前殖民王国', description: '豪萨城邦、贝宁王国、约鲁巴帝国和索科托哈里发国先后兴盛。', category: 'history', region: 'nigeria', significance: 1 },
  { id: 'gd093', year: 1960, endYear: 2030, title: '现代尼日利亚', description: '1960年独立，经历内战（比夫拉战争）、军政府和石油经济，非洲人口最多的国家。', category: 'history', region: 'nigeria', significance: 1 },

  // ═══════════════ 大洋洲 ═══════════════════════════════

  // ─── 澳大利亚 ──────────────────────────────
  { id: 'gd094', year: 1788, endYear: 1901, title: '英国殖民地', description: '1788年第一舰队抵达悉尼湾建立流放殖民地，原住民遭受毁灭性冲击。', category: 'history', region: 'australia', significance: 2 },
  { id: 'gd095', year: 1901, endYear: 2030, title: '澳大利亚联邦', description: '1901年联邦成立，两次世界大战参战，多元文化移民社会。', category: 'history', region: 'australia', significance: 1 },

  // ═══════════════ 剩余国家/地区补充 ═══════════════════════

  // 阿尔及利亚
  { id: 'gd096', year: 1830, endYear: 1962, title: '法国殖民阿尔及利亚', description: '1830年法国入侵，132年殖民统治，1954-1962年独立战争约百万人牺牲。', category: 'history', region: 'algeria', significance: 2 },
  { id: 'gd097', year: 1962, endYear: 2030, title: '阿尔及利亚共和国', description: '独立后走社会主义路线，1990年代内战，石油天然气经济。', category: 'history', region: 'algeria', significance: 1 },

  // 孟加拉国
  { id: 'gd098', year: 1947, endYear: 1971, title: '东巴基斯坦', description: '印巴分治时作为巴基斯坦东翼，语言文化差异巨大。', category: 'history', region: 'bangladesh', significance: 1 },
  { id: 'gd099', year: 1971, endYear: 2030, title: '孟加拉人民共和国', description: '1971年独立战争建国，服装业崛起但自然灾害频繁。', category: 'history', region: 'bangladesh', significance: 1 },

  // 不丹
  { id: 'gd100', year: 1907, endYear: 2030, title: '不丹王国', description: '旺楚克王朝建立的喜马拉雅小王国，以"国民幸福总值"闻名。', category: 'history', region: 'bhutan', significance: 1 },

  // 玻利维亚
  { id: 'gd101', year: 1825, endYear: 2030, title: '玻利维亚共和国', description: '以玻利瓦尔命名的安第斯山国，经历太平洋战争失去出海口。', category: 'history', region: 'bolivia', significance: 1 },

  // 加纳
  { id: 'gd102', year: 1957, endYear: 2030, title: '加纳共和国', description: '恩克鲁玛领导的撒哈拉以南非洲第一个独立国家。', category: 'history', region: 'ghana', significance: 1, figure: '恩克鲁玛' },

  // 中国香港
  { id: 'gd103', year: 1842, endYear: 1997, title: '英属香港', description: '鸦片战争后割让，发展为亚洲金融中心。', category: 'history', region: 'hong-kong', significance: 2 },
  { id: 'gd104', year: 1997, endYear: 2030, title: '香港特别行政区', description: '1997年回归中国，"一国两制"。', category: 'history', region: 'hong-kong', significance: 2 },

  // 哈萨克斯坦
  { id: 'gd105', year: 1465, endYear: 1847, title: '哈萨克汗国', description: '从金帐汗国分裂出的哈萨克三玉兹，草原游牧帝国。', category: 'history', region: 'kazakhstan', significance: 1 },
  { id: 'gd106', year: 1991, endYear: 2030, title: '哈萨克斯坦共和国', description: '苏联解体后独立，中亚最大经济体。', category: 'history', region: 'kazakhstan', significance: 1 },

  // 肯尼亚
  { id: 'gd107', year: 1895, endYear: 1963, title: '英属东非/肯尼亚殖民地', description: '英国殖民地，茅茅起义推动独立运动。', category: 'history', region: 'kenya', significance: 1 },
  { id: 'gd108', year: 1963, endYear: 2030, title: '肯尼亚共和国', description: '1963年独立，东非最大经济体。', category: 'history', region: 'kenya', significance: 1 },

  // 老挝
  { id: 'gd109', year: 1353, endYear: 1707, title: '澜沧王国', description: '法昂统一老挝建立的上座部佛教王国。', category: 'history', region: 'laos', significance: 1 },
  { id: 'gd110', year: 1893, endYear: 2030, title: '法属至现代老挝', description: '法国保护国，1975年成为社会主义共和国。', category: 'history', region: 'laos', significance: 1 },

  // 黎巴嫩
  { id: 'gd111', year: -1200, endYear: -539, title: '腓尼基城邦', description: '推罗、西顿等腓尼基城邦是古代地中海最伟大的航海贸易文明，发明了字母文字。', category: 'history', region: 'lebanon', significance: 2 },
  { id: 'gd112', year: 1920, endYear: 2030, title: '现代黎巴嫩', description: '法国托管后独立，内战（1975-1990）和教派政治。', category: 'history', region: 'lebanon', significance: 1 },

  // 中国澳门
  { id: 'gd113', year: 1557, endYear: 1999, title: '葡属澳门', description: '亚洲最早的欧洲殖民据点，东西方贸易枢纽。', category: 'history', region: 'macau', significance: 1 },
  { id: 'gd114', year: 1999, endYear: 2030, title: '澳门特别行政区', description: '1999年回归中国。', category: 'history', region: 'macau', significance: 1 },

  // 马里
  { id: 'gd115', year: 1235, endYear: 1600, title: '马里帝国', description: '曼萨·穆萨是中世纪最富有的人，1324年麦加朝圣途经开罗时金价暴跌。', category: 'history', region: 'mali', significance: 2, figure: '曼萨·穆萨' },
  { id: 'gd116', year: 1960, endYear: 2030, title: '马里共和国', description: '1960年独立，廷巴克图是伊斯兰学术中心。', category: 'history', region: 'mali', significance: 1 },

  // 尼泊尔
  { id: 'gd117', year: 1768, endYear: 2008, title: '尼泊尔王国（沙阿王朝）', description: '普里特维·纳拉扬·沙阿统一尼泊尔，延续240年的印度教王国。', category: 'history', region: 'nepal', significance: 1 },
  { id: 'gd118', year: 2008, endYear: 2030, title: '尼泊尔联邦民主共和国', description: '2008年废除君主制成为共和国。', category: 'history', region: 'nepal', significance: 1 },

  // 新西兰
  { id: 'gd119', year: 1840, endYear: 2030, title: '新西兰', description: '1840年《怀唐伊条约》后成为英国殖民地，1907年自治领，率先实行女性投票权。', category: 'history', region: 'new-zealand', significance: 1 },

  // 朝鲜
  { id: 'gd120', year: 1948, endYear: 2030, title: '朝鲜民主主义人民共和国', description: '1948年建国，金氏三代世袭统治，朝鲜战争和核武计划。', category: 'history', region: 'north-korea', significance: 2 },

  // 新加坡
  { id: 'gd121', year: 1819, endYear: 1965, title: '英属新加坡', description: '莱佛士1819年建立贸易港，发展为远东商业枢纽。', category: 'history', region: 'singapore', significance: 1 },
  { id: 'gd122', year: 1965, endYear: 2030, title: '新加坡共和国', description: '李光耀将弹丸小国打造为亚洲四小龙之一。', category: 'history', region: 'singapore', significance: 2, figure: '李光耀' },

  // 苏丹
  { id: 'gd123', year: 1504, endYear: 1885, title: '丰吉苏丹国至马赫迪国', description: '丰吉苏丹国统治苏丹300年，1885年马赫迪起义建立短暂的伊斯兰国家。', category: 'history', region: 'sudan', significance: 1 },
  { id: 'gd124', year: 1956, endYear: 2030, title: '现代苏丹', description: '1956年独立，南北内战，2011年南苏丹分离。', category: 'history', region: 'sudan', significance: 1 },

  // 中国台湾
  { id: 'gd125', year: 1624, endYear: 1895, title: '荷西-明郑-清朝统治', description: '荷兰、西班牙短暂殖民后郑成功收复，1683年纳入清朝版图。', category: 'history', region: 'taiwan', significance: 1 },
  { id: 'gd126', year: 1895, endYear: 1945, title: '日本殖民统治', description: '甲午战争后割让日本50年殖民统治。', category: 'history', region: 'taiwan', significance: 1 },
  { id: 'gd127', year: 1945, endYear: 2030, title: '战后台湾', description: '1949年国民政府迁台，经济奇迹，1990年代民主化。', category: 'history', region: 'taiwan', significance: 2 },

  // 乌兹别克斯坦
  { id: 'gd128', year: 1370, endYear: 1507, title: '帖木儿帝国', description: '帖木儿以撒马尔罕为中心建立横跨中亚的帝国，建筑艺术辉煌。', category: 'history', region: 'uzbekistan', significance: 2, figure: '帖木儿' },
  { id: 'gd129', year: 1991, endYear: 2030, title: '乌兹别克斯坦共和国', description: '苏联解体后独立，丝绸之路古城。', category: 'history', region: 'uzbekistan', significance: 1 },

  // 委内瑞拉
  { id: 'gd130', year: 1811, endYear: 2030, title: '委内瑞拉共和国', description: '玻利瓦尔的故乡，石油富国到经济危机。', category: 'history', region: 'venezuela', significance: 1 },
]

// 批量设置图片兜底
const makeEventImage = (eventId: string) => `https://picsum.photos/seed/chrono-${eventId}/1200/800`
for (const event of globalDynastyEvents) {
  if (!event.image) {
    event.image = makeEventImage(event.id)
  }
}
