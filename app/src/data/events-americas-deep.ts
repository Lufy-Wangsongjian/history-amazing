/**
 * 美洲深度扩充 — 拉美历史 + 原住民文明 + 美国文化线
 * Round 16: 覆盖拉美独立/现代化、原住民深化、爵士/好莱坞/硅谷
 */
import type { HistoricalEvent } from './types'

/* ═══════════════════════════════════════════════
   拉美历史深度（巴西 · 阿根廷 · 墨西哥 · 古巴 · 智利）
   ═══════════════════════════════════════════════ */
export const latinAmericaDeepEvents: HistoricalEvent[] = [
  // 墨西哥
  { id: 'la001', year: 1810, title: '墨西哥独立运动', description: '伊达尔戈神父敲响多洛雷斯教堂的钟声，发出"多洛雷斯呼声"，拉开了墨西哥独立战争的序幕。', category: 'history', region: 'mexico', significance: 3, figure: '伊达尔戈', details: '伊达尔戈是一位异端的天主教神父——他种葡萄、酿酒、读禁书、教原住民手工艺。1810年9月16日凌晨，他在教堂敲响钟声，号召会众起义。他的军队主要是手持弯刀和石块的印第安人和混血农民。虽然伊达尔戈本人在一年后被捕处死，但他点燃的独立之火再也无法熄灭。今天，9月16日是墨西哥的国庆日。' },
  { id: 'la002', year: 1910, title: '墨西哥革命', description: '推翻了迪亚兹35年独裁统治的墨西哥革命爆发，萨帕塔和潘乔·比利亚成为农民起义的象征。', category: 'history', region: 'mexico', significance: 3, figure: '萨帕塔,潘乔·比利亚', details: '墨西哥革命持续了十年（1910-1920），约100万人死亡。它不是一场统一的运动，而是多股力量的混战：马德罗要民主、萨帕塔要土地改革、比利亚要社会正义、卡兰萨要宪政秩序。1917年宪法是当时世界上最进步的宪法之一——它保障了土地权、劳工权和教育权。壁画运动（里维拉、奥罗斯科、西凯罗斯）将革命精神转化为视觉艺术，让墨西哥成为20世纪拉美文化的灯塔。' },
  { id: 'la003', year: 1929, title: '弗里达·卡罗与迭戈·里维拉', description: '弗里达嫁给了壁画大师里维拉——他们的婚姻和艺术成为了墨西哥最著名的文化符号。', category: 'art', region: 'mexico', significance: 2, figure: '弗里达·卡罗,里维拉' },
  // 巴西
  { id: 'la004', year: 1822, title: '巴西独立', description: '葡萄牙王子佩德罗在伊皮兰加河畔高喊"独立或死亡"，巴西以和平方式从葡萄牙独立。', category: 'history', region: 'brazil', significance: 2, figure: '佩德罗一世', details: '巴西的独立方式在美洲独一无二——不是通过暴力革命，而是由葡萄牙王室自己宣布的。拿破仑入侵葡萄牙后，王室逃到巴西；当葡萄牙要求王子回去时，佩德罗选择了留下并宣布独立。巴西是美洲唯一通过君主制实现独立的国家，也是最后一个废除奴隶制的西方国家（1888年）。' },
  { id: 'la005', year: 1888, title: '巴西废除奴隶制', description: '伊莎贝尔公主签署"金色法案"，巴西成为西半球最后一个正式废除奴隶制的国家。', category: 'history', region: 'brazil', significance: 3, details: '从1550年到1888年，约400万非洲人被贩卖到巴西——比美国多四倍。巴西的奴隶制废除得如此之晚（比美国晚23年、比英国晚55年），奴隶主甚至没有得到补偿——这导致了大庄园主的愤怒，他们支持推翻了帝制，巴西在废奴次年变成了共和国。' },
  { id: 'la006', year: 1960, title: '巴西利亚建城', description: '巴西在内陆荒原上从零开始建造了一座首都——巴西利亚。尼迈耶设计的未来主义建筑至今令人惊叹。', category: 'architecture', region: 'brazil', significance: 2, figure: '尼迈耶' },
  { id: 'la007', year: 1958, title: '巴西首夺世界杯', description: '17岁的贝利帮助巴西在瑞典世界杯上首次夺冠。此后巴西成为唯一五次赢得世界杯的国家，"足球王国"由此得名。', category: 'history', region: 'brazil', significance: 2, figure: '贝利' },
  // 阿根廷
  { id: 'la008', year: 1816, title: '阿根廷独立', description: '拉普拉塔联合省在圣米格尔-德图库曼宣布独立，圣马丁率军翻越安第斯山脉解放智利和秘鲁。', category: 'history', region: 'argentina', significance: 2, figure: '圣马丁' },
  { id: 'la009', year: 1946, title: '庇隆主义', description: '胡安·庇隆当选阿根廷总统，他和妻子艾薇塔推行的民粹主义政策至今深刻影响着阿根廷政治。', category: 'history', region: 'argentina', significance: 2, figure: '庇隆,艾薇塔', details: '艾薇塔·庇隆从贫民窟出身的演员变成了阿根廷最有权势的女性。她建立了庞大的社会福利体系，赢得了底层民众的狂热崇拜。她33岁去世时，整个阿根廷陷入了真正的悲痛。安德鲁·韦伯的音乐剧《艾薇塔》（"Don\'t Cry for Me Argentina"）将她的传奇带到了全世界。' },
  { id: 'la010', year: 1976, endYear: 1983, title: '阿根廷"肮脏战争"', description: '军政府发动"肮脏战争"，约3万人"失踪"。五月广场的母亲们的抗议成为人权运动的象征。', category: 'history', region: 'argentina', significance: 2 },
  // 古巴
  { id: 'la011', year: 1959, title: '古巴革命', description: '卡斯特罗和切·格瓦拉领导的革命推翻了巴蒂斯塔独裁政权，古巴成为西半球第一个社会主义国家。', category: 'history', region: 'cuba', significance: 3, figure: '卡斯特罗,格瓦拉', details: '1956年格瓦拉和卡斯特罗带领82人乘"格拉玛号"登陆古巴时，几乎全军覆没——只有12人幸存并撤入马埃斯特拉山脉。三年后他们推翻了巴蒂斯塔。格瓦拉那张戴贝雷帽的黑白照片成为了20世纪最广泛传播的肖像——从T恤到海报，从大学宿舍到第三世界的革命运动。' },
  // 智利
  { id: 'la012', year: 1973, title: '智利政变', description: '皮诺切特将军推翻了民选的阿连德总统。阿连德在被围困的总统府中自杀，智利进入了17年的军事独裁。', category: 'history', region: 'chile', significance: 2, figure: '阿连德,皮诺切特' },
  // 文学
  { id: 'la013', year: 1967, title: '《百年孤独》', description: '加西亚·马尔克斯出版《百年孤独》，魔幻现实主义将拉美文学推上了世界文学的巅峰。', category: 'literature', region: 'colombia', significance: 3, figure: '加西亚·马尔克斯', details: '马尔克斯说他只是在用他外祖母讲故事的方式写作——"用一种完全平静的语气讲述最不可思议的事情"。《百年孤独》出版首周就卖光了8000册初版，此后翻译成46种语言，销量超过5000万册。它创造了一种全新的叙事方式：在拉美的土壤上，历史与神话、现实与幻想之间的界限本来就不存在。' },
  { id: 'la014', year: 1971, title: '聂鲁达获诺贝尔文学奖', description: '智利诗人巴勃罗·聂鲁达获诺贝尔文学奖——他的诗歌从爱情到革命，从自然到正义，横跨人类情感的全部光谱。', category: 'literature', region: 'chile', significance: 2, figure: '聂鲁达' },
  { id: 'la015', year: 1899, title: '博尔赫斯出生', description: '豪尔赫·路易斯·博尔赫斯出生于布宜诺斯艾利斯。他将迷宫、镜子和无限的概念编织成短篇小说，被誉为"作家中的作家"。', category: 'literature', region: 'argentina', significance: 2, figure: '博尔赫斯' },
]

/* ═══════════════════════════════════════════════
   美洲原住民文明深化
   ═══════════════════════════════════════════════ */
export const nativeAmericasEvents: HistoricalEvent[] = [
  // 北美原住民
  { id: 'na001', year: 700, title: '卡霍基亚城', description: '密西西比河畔的卡霍基亚（今伊利诺伊州）发展为北美最大的前哥伦布城市，人口约2万，拥有120座土丘。', category: 'architecture', region: 'usa', significance: 2, details: '卡霍基亚的中心是僧侣丘——底面积比吉萨大金字塔还大。这座城市约在公元1050年达到巅峰，人口可能超过同时期的伦敦。但到1400年它已被废弃，原因至今成谜——过度砍伐、干旱和政治动荡可能都是因素。大多数美国人不知道这座曾经的"美洲纽约"就在圣路易斯对面。' },
  { id: 'na002', year: 1100, title: '易洛魁联盟', description: '北美五（后来六）个易洛魁部落建立了大和平联盟——可能是人类最早的联邦制政府之一。', category: 'history', region: 'usa', significance: 2, details: '易洛魁联盟的大和平法（Great Law of Peace）确立了代议制、权力制衡和妇女参政权（氏族母亲可以罢免酋长）。本杰明·富兰克林在1754年提出的"奥尔巴尼联合计划"直接受到易洛魁联盟的启发。有学者认为美国宪法的联邦制设计也部分借鉴了易洛魁模式——虽然制宪者们从未正式承认这一点。' },
  { id: 'na003', year: 1200, title: '查科文化·悬崖居', description: '普韦布洛人在美国西南部建造了复杂的石砌悬崖居——梅萨维德和查科峡谷的建筑群至今令人惊叹。', category: 'architecture', region: 'usa', significance: 2 },
  // 中美洲深化
  { id: 'na004', year: -600, title: '萨波特克文明', description: '萨波特克人在墨西哥瓦哈卡州蒙特阿尔班建造了美洲最早的城市之一，发展出了可能是美洲最早的文字系统。', category: 'history', region: 'mexico', significance: 2 },
  { id: 'na005', year: 100, title: '特奥蒂瓦坎', description: '特奥蒂瓦坎在公元前后发展为美洲最大的城市——太阳金字塔高63米，"死者大道"宽40米长2.5公里，人口达12万。', category: 'architecture', region: 'mexico', significance: 3, details: '特奥蒂瓦坎不是某个已知民族的作品——我们甚至不知道它的居民如何自称。"特奥蒂瓦坎"是后来的阿兹特克人起的名字，意为"众神诞生之地"。这座城市的规划之严谨令人惊叹：主轴线偏离正北15.5度，精确对准日落方向。它的影响力辐射整个中美洲——在玛雅城市中都发现了特奥蒂瓦坎风格的建筑和陶器。' },
  { id: 'na006', year: 615, title: '帕伦克的帕卡尔大帝', description: '玛雅城邦帕伦克在帕卡尔大帝统治下进入黄金时代。他修建的铭文神庙和石棺浮雕是玛雅艺术的巅峰。', category: 'history', region: 'mexico', significance: 2, figure: '帕卡尔' },
  { id: 'na007', year: 900, title: '玛雅古典文明崩溃', description: '9世纪末玛雅低地城市相继被废弃——数百万人口在几代人内消失。这是人类历史上最神秘的文明崩溃之一。', category: 'history', region: 'mexico', significance: 2, details: '考古学和古气候学研究表明，极端干旱可能是触发因素——9世纪末的干旱持续了近百年。但干旱只是最后一击：长期的过度砍伐（建造石灰岩建筑需要大量木材来烧石灰）、人口膨胀、战争升级和精英阶层的政治危机共同导致了这场崩溃。值得注意的是，玛雅人并没有"灭绝"——北部尤卡坦半岛的玛雅城邦在南部崩溃后又繁荣了数百年，而玛雅后裔至今仍生活在中美洲。' },
  // 南美深化
  { id: 'na008', year: -3000, title: '卡拉尔文明', description: '秘鲁的卡拉尔-苏佩文明是美洲最古老的城市文明——与古埃及金字塔几乎同时期，却没有任何证据表明他们制造过陶器或武器。', category: 'history', region: 'peru', significance: 2, details: '卡拉尔挑战了"文明起源于战争"的传统理论——这里没有发现任何武器、防御工事或战争证据。他们的纪念性金字塔和广场似乎完全服务于宗教仪式和贸易。卡拉尔人用奇普（结绳记事）记录信息，这个系统后来被印加人继承和发展。' },
  { id: 'na009', year: 1470, title: '印加道路系统', description: '印加帝国建造了总长约4万公里的道路网络——比罗马道路更长，翻越安第斯山脉的最高处超过5000米。', category: 'technology', region: 'peru', significance: 2, details: '印加道路穿过沙漠、丛林和海拔5000米的高山隘口。信使（查斯基）通过接力跑可以在5天内将消息从库斯科传到基多（约2000公里）——比西班牙殖民者的邮政系统还快。吊桥横跨深谷，最长的超过60米。西班牙征服者正是沿着这些道路征服了印加帝国。' },
]

/* ═══════════════════════════════════════════════
   美国文化线（爵士 · 好莱坞 · 硅谷深度）
   ═══════════════════════════════════════════════ */
export const usaCultureDeepEvents: HistoricalEvent[] = [
  // 爵士乐深度
  { id: 'uc001', year: 1917, title: '第一张爵士唱片', description: '原创迪克西兰爵士乐队录制了第一张爵士唱片，新奥尔良的声音从此传遍全国。', category: 'music', region: 'usa', significance: 2 },
  { id: 'uc002', year: 1924, title: '路易斯·阿姆斯特朗与芝加哥爵士', description: '阿姆斯特朗从新奥尔良北上芝加哥，他的独奏即兴将爵士乐从集体演奏推向了个人表达的新高度。', category: 'music', region: 'usa', significance: 2, figure: '阿姆斯特朗' },
  { id: 'uc003', year: 1935, title: '摇摆乐时代', description: '本尼·古德曼在帕洛马尔舞厅的演出引爆了摇摆乐热潮——爵士乐成为了整个美国的流行音乐。', category: 'music', region: 'usa', significance: 2, figure: '本尼·古德曼' },
  { id: 'uc004', year: 1945, title: '比波普革命', description: '查理·帕克和迪兹·吉莱斯皮创造了比波普——更快、更复杂、更叛逆的爵士乐，将爵士从舞曲推向了艺术音乐。', category: 'music', region: 'usa', significance: 2, figure: '查理·帕克' },
  // 好莱坞深度
  { id: 'uc005', year: 1910, title: '好莱坞电影工业起步', description: '电影制作人涌入加州好莱坞，这里阳光充沛、风景多样且远离爱迪生的专利执法。好莱坞从此成为全球电影之都。', category: 'art', region: 'usa', significance: 2 },
  { id: 'uc006', year: 1939, title: '好莱坞黄金年', description: '《乱世佳人》《绿野仙踪》《关山飞渡》在同一年上映——1939年被誉为好莱坞的"奇迹之年"。', category: 'art', region: 'usa', significance: 2 },
  { id: 'uc007', year: 1967, title: '新好莱坞运动', description: '《毕业生》和《雌雄大盗》打破了旧好莱坞的审查制度。科波拉、斯科塞斯、斯皮尔伯格等年轻导演重新定义了美国电影。', category: 'art', region: 'usa', significance: 2 },
  // 硅谷深度
  { id: 'uc008', year: 1957, title: '"八叛逆"与硅谷诞生', description: '八位年轻工程师离开肖克利半导体实验室，创立了仙童半导体公司——硅谷的创业文化和风险投资模式由此诞生。', category: 'technology', region: 'usa', significance: 2, details: '肖克利是晶体管的发明者之一，但他的管理方式极其专制。八个最有才华的工程师集体辞职——在当时的公司文化中这几乎等于叛变。仙童半导体后来培育出了英特尔、AMD等数十家公司，被称为"硅谷的费尔马翁"。"八叛逆"证明了一个原则：在硅谷，好的想法比忠诚更重要，创业比打工更有价值。' },
  { id: 'uc009', year: 1998, title: '谷歌车库', description: '拉里·佩奇和谢尔盖·布林在斯坦福大学的宿舍里创建了谷歌。他们的PageRank算法用数学重新定义了"搜索"。', category: 'technology', region: 'usa', significance: 2, figure: '佩奇,布林' },
  { id: 'uc010', year: 2004, title: 'Facebook改变社交', description: '扎克伯格在哈佛宿舍创建Facebook。到2024年，Meta平台每天有超过30亿活跃用户——它改变了人类社交的基本方式。', category: 'technology', region: 'usa', significance: 2, figure: '扎克伯格' },
]
