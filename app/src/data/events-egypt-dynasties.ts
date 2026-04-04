import type { HistoricalEvent } from './types'

// ═══════════════════════════════════════════════════════════════════
//  古埃及王朝历史事件（按王朝脉络系统细化）
//
//  ID 规则: eg + 三位数字，从 eg001 开始
//  所有 region 统一为 'egypt'
// ═══════════════════════════════════════════════════════════════════

export const egyptDynastyEvents: HistoricalEvent[] = [

  // ─── 前王朝时期（约前 5500 – 前 3100）──────────────────────
  {
    id: 'eg001', year: -5500, title: '巴达里文化',
    description: '上埃及巴达里地区出现定居农业社区，制作精美黑顶红陶，是已知最早的尼罗河谷农业文化之一。',
    details: '巴达里文化的居民种植小麦和大麦，饲养牛羊，使用象牙和骨头制作工具与饰品。他们的墓葬中已出现随葬品等级差异，暗示社会分化的萌芽。',
    category: 'history', region: 'egypt', significance: 1,
  },
  {
    id: 'eg002', year: -4400, title: '涅伽达文化 I 期（阿姆拉期）',
    description: '上埃及涅伽达地区出现更复杂的社会组织，陶器上开始出现动物和人形纹饰。',
    details: '涅伽达 I 期标志着酋邦社会的形成，铜器开始出现，长距离贸易网络逐渐建立，将尼罗河谷与西奈半岛、努比亚和利比亚连接起来。',
    category: 'history', region: 'egypt', significance: 1,
  },
  {
    id: 'eg003', year: -3500, title: '涅伽达文化 II 期（格尔津期）',
    description: '上埃及酋邦急剧扩张，涅伽达、希拉孔波利斯和阿拜多斯成为权力中心，出现最早的城墙和宫殿遗迹。',
    details: '格尔津期的陶器和石器工艺显著提升，调色板上出现庆祝军事胜利的浮雕，说明酋邦之间的兼并战争日益频繁。这一时期的社会复杂性为统一国家的诞生奠定了基础。',
    category: 'history', region: 'egypt', significance: 2,
  },
  {
    id: 'eg004', year: -3200, title: '涅伽达文化 III 期·王朝前夜',
    description: '上埃及完成内部统一，"蝎子王"等早期统治者开始向下埃及（三角洲）扩张，国家形成进入最后阶段。',
    details: '蝎子权标头上描绘了一位戴白冠的统治者主持灌溉工程，表明王权已与农业管理紧密结合。这一时期还出现了最早的王名框（serekh），王权的象征体系日趋成熟。',
    category: 'history', region: 'egypt', significance: 2, figure: '蝎子王',
  },

  // ─── 早王朝时期：第一 — 第二王朝（约前 3100 – 前 2686）────
  {
    id: 'eg005', year: -3100, endYear: -2890, title: '第一王朝建立·纳尔迈统一埃及',
    description: '纳尔迈（传统记为美尼斯）统一上下埃及，建立第一王朝，定都孟菲斯，开创了延续三千年的法老制度。',
    details: '纳尔迈调色板正面描绘他戴上埃及白冠，背面戴下埃及红冠，象征着两地的统一。第一王朝的法老们在阿拜多斯建造了巨大的泥砖墓葬，周围有殉葬者的墓穴——这一做法在第二王朝后逐渐废止。统一国家的建立使大规模灌溉工程、税收体系和行政官僚成为可能。',
    category: 'history', region: 'egypt', significance: 3, figure: '纳尔迈/美尼斯',
    image: 'https://picsum.photos/seed/chrono-eg005/1200/800',
  },
  {
    id: 'eg006', year: -2890, endYear: -2686, title: '第二王朝·早期王权巩固',
    description: '第二王朝经历了内部动荡与权力斗争，末代法老卡塞凯姆威重新统一国家，为古王国的辉煌奠定基础。',
    details: '第二王朝的记录相对稀少，但从墓葬和铭文中可以看出王权在上下埃及之间反复角力。卡塞凯姆威是唯一同时在王名框中使用荷鲁斯与塞特两个神名的法老，暗示他成功调和了两地的宗教与政治矛盾。',
    category: 'history', region: 'egypt', significance: 1, figure: '卡塞凯姆威',
  },

  // ─── 古王国（金字塔时代）：第三 — 第六王朝（前 2686 – 前 2181）──
  {
    id: 'eg007', year: -2686, title: '第三王朝·左塞尔与阶梯金字塔',
    description: '法老左塞尔委托建筑师伊姆霍特普设计萨卡拉阶梯金字塔——人类历史上第一座大型全石造建筑。',
    details: '伊姆霍特普将传统的泥砖马斯塔巴墓一层层垒高为六层台阶，外层包覆打磨石灰石，高达62米。整座建筑群包含祭庙、庭院和模拟建筑，是来世概念的物质化表达。伊姆霍特普后来被神化为智慧与医药之神。',
    category: 'architecture', region: 'egypt', significance: 3, figure: '伊姆霍特普',
    image: 'https://picsum.photos/seed/chrono-eg007/1200/800',
    relatedIds: ['eg008'],
  },
  {
    id: 'eg008', year: -2613, endYear: -2494, title: '第四王朝·金字塔的巅峰',
    description: '第四王朝法老斯尼夫鲁、胡夫、卡夫拉和门卡乌拉将金字塔建造推向极致，吉萨三大金字塔至今屹立。',
    details: '斯尼夫鲁一人便建造了三座金字塔（梅杜姆、弯曲和红色金字塔），摸索出从阶梯到真正锥形的技术路线。他的儿子胡夫在吉萨建造了大金字塔——原高146.5米，底边长230米，230万块石灰岩精确组装，四面朝向几乎完美指向正南北。卡夫拉金字塔旁的狮身人面像由一整块石灰岩雕成，是世界上最大的单体雕像。',
    category: 'architecture', region: 'egypt', significance: 3, figure: '胡夫',
    image: 'https://picsum.photos/seed/chrono-eg008/1200/800',
    relatedIds: ['eg007'],
  },
  {
    id: 'eg009', year: -2494, endYear: -2345, title: '第五王朝·太阳神崇拜兴起',
    description: '第五王朝法老大力推广太阳神拉的崇拜，建造了多座太阳神庙，金字塔文献首次出现。',
    details: '从乌瑟卡夫开始，法老在阿布西尔建造太阳神庙，中央矗立着象征太阳的方尖碑。第五王朝末期的乌尼斯金字塔内壁刻满了"金字塔文"——这是人类最古老的宗教文献，描述了法老灵魂升入星空的来世之旅。',
    category: 'religion', region: 'egypt', significance: 2,
    image: 'https://picsum.photos/seed/chrono-eg009/1200/800',
  },
  {
    id: 'eg010', year: -2345, endYear: -2181, title: '第六王朝·古王国的衰落',
    description: '佩皮二世在位约94年（史上最长在位记录之一），统治后期中央权力严重削弱，地方贵族崛起，古王国走向终结。',
    details: '佩皮二世即位时年仅6岁，漫长的统治使王权逐渐空心化。各州的诺马赫（州长）将职位世袭化，实际上成为独立的地方领主。加之尼罗河水位异常导致农业歉收，社会动荡加剧，古王国最终在前2181年左右瓦解。',
    category: 'history', region: 'egypt', significance: 2, figure: '佩皮二世',
    image: 'https://picsum.photos/seed/chrono-eg010/1200/800',
  },

  // ─── 第一中间期（前 2181 – 前 2055）──────────────────────
  {
    id: 'eg011', year: -2181, endYear: -2055, title: '第一中间期·分裂与动荡',
    description: '中央政权瓦解后，埃及进入长达一百多年的分裂时期。赫拉克利奥波利斯（第九/十王朝）与底比斯（第十一王朝）南北对峙。',
    details: '第一中间期的文学作品（如《善辩的农夫》《伊普味尔训诫》）生动描绘了社会混乱：尼罗河干枯、饥荒蔓延、盗匪横行、贫民闯入贵族墓穴。但这一时期也催生了地方艺术风格的多样化和个人墓葬铭文的繁荣——普通人开始拥有来世权利，不再是法老的专属。',
    category: 'history', region: 'egypt', significance: 2,
    image: 'https://picsum.photos/seed/chrono-eg011/1200/800',
  },

  // ─── 中王国：第十一 — 第十三王朝（前 2055 – 前 1650）────
  {
    id: 'eg012', year: -2055, title: '第十一王朝·门图霍特普二世重新统一埃及',
    description: '底比斯统治者门图霍特普二世击败赫拉克利奥波利斯政权，重新统一上下埃及，开启中王国时代。',
    details: '门图霍特普二世在代尔巴赫里修建了独特的梯形祭庙，将山崖地形与建筑融为一体，后来启发了新王国时期哈特谢普苏特的祭庙设计。他的统一结束了百年动荡，底比斯的阿蒙神崇拜从此开始走向全国性地位。',
    category: 'history', region: 'egypt', significance: 3, figure: '门图霍特普二世',
    image: 'https://picsum.photos/seed/chrono-eg012/1200/800',
  },
  {
    id: 'eg013', year: -1985, endYear: -1773, title: '第十二王朝·中王国的黄金时代',
    description: '阿蒙涅姆赫特一世迁都至伊塔威，第十二王朝成为中王国最强盛的时期，文学、艺术和对外扩张全面繁荣。',
    details: '辛努塞尔特三世向南征服努比亚至第二瀑布，建造了一系列军事要塞。法尤姆绿洲的大规模农业开发使耕地面积大幅增长。文学上，《辛努亥的故事》被誉为古埃及文学的巅峰之作，其叙事技巧和情感深度令后世惊叹。',
    category: 'history', region: 'egypt', significance: 2, figure: '辛努塞尔特三世',
    image: 'https://picsum.photos/seed/chrono-eg013/1200/800',
  },

  // ─── 第二中间期：第十五 — 第十七王朝（前 1650 – 前 1550）──
  {
    id: 'eg014', year: -1650, endYear: -1550, title: '希克索斯人统治·第十五王朝',
    description: '来自迦南地区的希克索斯人渗透并控制了下埃及，建都阿瓦里斯，引入了马拉战车和复合弓等新式武器。',
    details: '希克索斯人并非突然入侵，而是经过数代人的渐进式移民和渗透。他们采用了埃及的王号和行政制度，但同时保留了西亚的宗教和文化传统。这一时期推动了埃及军事技术的革新——马拉战车和青铜武器的引入最终帮助埃及人自己驱逐了外来统治者。',
    category: 'warfare', region: 'egypt', significance: 2,
    image: 'https://picsum.photos/seed/chrono-eg014/1200/800',
  },
  {
    id: 'eg015', year: -1555, title: '塞肯恩拉·陶与底比斯抵抗运动',
    description: '底比斯第十七王朝法老塞肯恩拉·陶率军反抗希克索斯统治，战死沙场，其木乃伊头骨上的致命伤痕记录了惨烈战斗。',
    details: '塞肯恩拉的木乃伊是古埃及考古中最震撼的发现之一——头骨上有至少五处致命伤口，包括斧劈和矛刺，表明他在近距离格斗中阵亡。他的牺牲激发了底比斯人的抵抗意志，儿子卡摩斯和孙子阿赫摩斯继承了他的未竟事业。',
    category: 'warfare', region: 'egypt', significance: 1, figure: '塞肯恩拉·陶',
    image: 'https://picsum.photos/seed/chrono-eg015/1200/800',
  },

  // ─── 新王国：第十八 — 第二十王朝（前 1550 – 前 1069）────
  {
    id: 'eg016', year: -1550, title: '第十八王朝·阿赫摩斯一世驱逐希克索斯',
    description: '阿赫摩斯一世攻陷阿瓦里斯，将希克索斯人彻底驱逐出埃及，建立第十八王朝，开启新王国帝国时代。',
    details: '阿赫摩斯利用从希克索斯人那里学来的马拉战车和复合弓技术反戈一击，攻破了阿瓦里斯城。此后他南征努比亚、北至迦南，恢复了埃及对周边地区的控制。第十八王朝由此成为古埃及最辉煌的朝代。',
    category: 'warfare', region: 'egypt', significance: 3, figure: '阿赫摩斯一世',
    image: 'https://picsum.photos/seed/chrono-eg016/1200/800',
  },
  {
    id: 'eg017', year: -1479, endYear: -1458, title: '哈特谢普苏特·女法老执政',
    description: '哈特谢普苏特以女性之身成为法老，执政22年间推行和平贸易政策，派遣舰队远征蓬特之地，建造了代尔巴赫里祭庙。',
    details: '哈特谢普苏特在官方雕像中常以男性形象出现，佩戴假胡须和法老冠冕。她的统治以贸易和建筑为主轴，代尔巴赫里祭庙以其优雅的三层台阶式设计成为古埃及建筑的杰作。蓬特远征带回了乳香树、黄金和珍奇动物。',
    category: 'history', region: 'egypt', significance: 2, figure: '哈特谢普苏特',
    image: 'https://picsum.photos/seed/chrono-eg017/1200/800',
  },
  {
    id: 'eg018', year: -1458, endYear: -1425, title: '图特摩斯三世·埃及的拿破仑',
    description: '图特摩斯三世发动至少17次军事远征，将埃及帝国版图扩展至叙利亚北部的幼发拉底河畔，达到历史最大。',
    details: '图特摩斯三世在米吉多战役中以出其不意的山隘行军击败了迦南联军，此战被认为是有详细记载的最早的战役之一。他的战功铭刻在卡纳克神庙的"年鉴厅"中，详细记录了缴获的战利品和征服的城市清单。',
    category: 'warfare', region: 'egypt', significance: 3, figure: '图特摩斯三世',
    image: 'https://picsum.photos/seed/chrono-eg018/1200/800',
  },
  {
    id: 'eg019', year: -1353, endYear: -1336, title: '阿肯那顿宗教改革·阿玛尔纳革命',
    description: '法老阿肯那顿废除传统多神教，推行对太阳神阿顿的独尊崇拜，迁都至新建的阿赫塔顿（阿玛尔纳），引发人类历史上最早的一神教实验。',
    details: '阿肯那顿关闭了阿蒙神庙，没收祭司财产，在沙漠中从零建造新首都阿赫塔顿。阿玛尔纳艺术一反传统的僵硬范式，以写实甚至夸张的手法描绘王室生活——法老亲吻妻子纳芙蒂蒂、抱着女儿在阳光下嬉戏。但改革触动了强大的阿蒙祭司集团利益，他死后不久一切便被推翻，阿赫塔顿被废弃，他的名字从纪念碑上被凿除。',
    category: 'religion', region: 'egypt', significance: 3, figure: '阿肯那顿',
    image: 'https://picsum.photos/seed/chrono-eg019/1200/800',
    relatedIds: ['eg020'],
  },
  {
    id: 'eg020', year: -1332, endYear: -1323, title: '图坦卡蒙·少年法老',
    description: '图坦卡蒙9岁即位，恢复了传统多神教崇拜，19岁英年早逝。其陵墓是帝王谷中唯一几乎未被盗掘的法老墓。',
    details: '1922年霍华德·卡特在帝王谷发现了图坦卡蒙墓，震惊世界。墓中5000多件随葬品包括黄金面具（重11公斤纯金）、三层套棺、战车和大量生活用品。2010年的DNA分析表明图坦卡蒙是阿肯那顿之子，患有多种遗传性疾病，可能死于疟疾合并骨折感染。',
    category: 'history', region: 'egypt', significance: 2, figure: '图坦卡蒙',
    image: 'https://picsum.photos/seed/chrono-eg020/1200/800',
    relatedIds: ['eg019'],
  },
  {
    id: 'eg021', year: -1279, endYear: -1213, title: '拉美西斯二世·伟大建筑者',
    description: '拉美西斯二世在位67年，是古埃及在位最久的法老之一。他建造了阿布辛贝神庙、拉美西姆祭庙等大量纪念性建筑，并与赫梯签署了人类最早的和平条约。',
    details: '卡迭什战役（前1274年）是拉美西斯二世最著名的军事行动——尽管实际上双方未分胜负，但他在多座神庙中将其描绘为伟大胜利。此后埃及与赫梯签署的和约原文分别以象形文字和楔形文字保存至今。阿布辛贝神庙门口四尊高达20米的法老坐像展示了新王国的鼎盛气象。',
    category: 'architecture', region: 'egypt', significance: 3, figure: '拉美西斯二世',
    image: 'https://picsum.photos/seed/chrono-eg021/1200/800',
  },
  {
    id: 'eg022', year: -1208, title: '梅伦普塔赫石碑·最早提及"以色列"',
    description: '法老梅伦普塔赫的胜利石碑上出现了对"以色列"的最早已知文字记录。',
    details: '石碑记载了梅伦普塔赫对迦南的军事远征，其中一行写道"以色列已被摧毁，其种子不复存在"。这是"以色列"一词在古代文献中的首次出现，对《圣经》考古学具有重大意义。',
    category: 'history', region: 'egypt', significance: 2, figure: '梅伦普塔赫',
    image: 'https://picsum.photos/seed/chrono-eg022/1200/800',
  },
  {
    id: 'eg023', year: -1186, endYear: -1155, title: '拉美西斯三世·抵御海上民族',
    description: '第二十王朝法老拉美西斯三世在尼罗河三角洲海战中击退了"海上民族"的大规模入侵，保住了埃及免于青铜时代晚期大崩溃的命运。',
    details: '约前1178年，一支由多个族群组成的"海上民族"联盟从海陆两路进攻埃及。拉美西斯三世在尼罗河入海口设下埋伏，用弓箭手从岸上射击敌船，取得了决定性胜利。麦迪奈哈布神庙墙壁上详细描绘了这场海战。但这位法老最终可能死于后宫阴谋——他的木乃伊喉部有深深的刀伤。',
    category: 'warfare', region: 'egypt', significance: 2, figure: '拉美西斯三世',
    image: 'https://picsum.photos/seed/chrono-eg023/1200/800',
  },

  // ─── 第三中间期：第二十一 — 第二十五王朝（前 1069 – 前 664）──
  {
    id: 'eg024', year: -1069, endYear: -945, title: '第二十一王朝·南北分治',
    description: '新王国崩溃后，埃及再次分裂：塔尼斯的法老统治下埃及，底比斯的阿蒙大祭司实际控制上埃及。',
    details: '阿蒙大祭司利用神谕来执行政治决策，形成了一种独特的神权政治。这一时期法老们将前代法老的木乃伊从帝王谷转移到代尔巴赫里的秘密墓穴中，以防止盗墓——这批"皇家木乃伊宝藏"在1881年被重新发现。',
    category: 'history', region: 'egypt', significance: 1,
    image: 'https://picsum.photos/seed/chrono-eg024/1200/800',
  },
  {
    id: 'eg025', year: -945, endYear: -715, title: '第二十二至二十三王朝·利比亚法老',
    description: '利比亚裔军事领袖舍顺克一世建立第二十二王朝，利比亚血统的法老统治埃及长达两百多年。',
    details: '舍顺克一世即《圣经》中入侵耶路撒冷的"示撒"，他在卡纳克神庙留下了记录这次远征的铭文。但利比亚王朝后期中央权力再度碎片化，多个王朝和地方势力并存。',
    category: 'history', region: 'egypt', significance: 1, figure: '舍顺克一世',
    image: 'https://picsum.photos/seed/chrono-eg025/1200/800',
  },
  {
    id: 'eg026', year: -747, endYear: -656, title: '第二十五王朝·努比亚/库施法老',
    description: '来自努比亚的库施王国统治者皮安基北上征服了埃及，建立了第二十五"黑法老"王朝，统一了从喀土穆到尼罗河三角洲的广大区域。',
    details: '库施法老们自认是埃及文明的正统继承者，大力复兴古王国和中王国时期的艺术风格和宗教传统。塔哈尔卡在卡纳克神庙增建了宏伟的立柱大厅。但前671年亚述帝国入侵，阿萨尔哈东攻占孟菲斯，最终将库施法老逐回南方。',
    category: 'history', region: 'egypt', significance: 2, figure: '皮安基/塔哈尔卡',
    image: 'https://picsum.photos/seed/chrono-eg026/1200/800',
  },

  // ─── 晚期埃及：第二十六 — 第三十王朝（前 664 – 前 332）────
  {
    id: 'eg027', year: -664, endYear: -525, title: '第二十六王朝·赛易特文艺复兴',
    description: '三角洲城市赛易斯的统治者驱逐亚述势力，建立第二十六王朝。埃及在普萨美提克一世领导下经历了最后一次本土文化复兴。',
    details: '赛易特王朝复古运动深入各个领域：艺术风格刻意模仿古王国时期的简洁庄重，墓葬铭文重新启用了千年前的古体文字。普萨美提克一世还引入希腊雇佣兵，在尼罗河三角洲的瑙克拉提斯建立了希腊商人聚居点，开启了希腊-埃及文化交流的新纪元。',
    category: 'history', region: 'egypt', significance: 2, figure: '普萨美提克一世',
    image: 'https://picsum.photos/seed/chrono-eg027/1200/800',
  },
  {
    id: 'eg028', year: -525, title: '波斯征服埃及·第二十七王朝',
    description: '波斯阿契美尼德帝国的冈比西斯二世在佩鲁西翁战役中击败法老普萨美提克三世，埃及成为波斯帝国的一个行省。',
    details: '传说冈比西斯在攻城时命令士兵将猫绑在盾牌上——因为埃及人崇拜猫神巴斯特特，不敢向猫射箭。波斯统治引发了埃及人的多次起义，但直到前404年埃及才短暂恢复独立（第二十八至第三十王朝）。',
    category: 'warfare', region: 'egypt', significance: 2, figure: '冈比西斯二世',
    image: 'https://picsum.photos/seed/chrono-eg028/1200/800',
  },
  {
    id: 'eg029', year: -404, endYear: -343, title: '最后的本土王朝（第二十八至第三十王朝）',
    description: '埃及短暂恢复独立，第三十王朝的奈科坦尼布二世成为最后一位本土埃及法老。',
    details: '奈科坦尼布二世在各地修建了大量神庙，努力维护埃及文化传统。但前343年波斯再次征服埃及（第三十一王朝/第二次波斯统治），法老制度在延续近三千年后，本土王权就此终结。',
    category: 'history', region: 'egypt', significance: 2, figure: '奈科坦尼布二世',
    image: 'https://picsum.photos/seed/chrono-eg029/1200/800',
  },

  // ─── 希腊化时期：托勒密王朝（前 332 – 前 30）──────────
  {
    id: 'eg030', year: -332, title: '亚历山大大帝征服埃及',
    description: '亚历山大大帝从波斯手中接管埃及，在锡瓦绿洲被阿蒙神谕承认为法老，并在地中海沿岸规划了亚历山大城。',
    details: '亚历山大将埃及视为自己帝国的重要组成部分。他特意前往锡瓦绿洲请求阿蒙神谕，获得了"阿蒙之子"的称号，从而在宗教层面获得了埃及人的承认。亚历山大城的规划体现了希腊城市规划的理念，但位置选择巧妙地利用了尼罗河三角洲的西端和法罗斯岛之间的天然港湾。',
    category: 'history', region: 'egypt', significance: 3, figure: '亚历山大大帝',
    image: 'https://picsum.photos/seed/chrono-eg030/1200/800',
    relatedIds: ['eg031'],
  },
  {
    id: 'eg031', year: -305, endYear: -30, title: '托勒密王朝建立',
    description: '亚历山大部将托勒密一世自立为埃及法老，建立托勒密王朝，亚历山大城成为地中海世界的文化和学术中心。',
    details: '托勒密一世建立了亚历山大图书馆和博物学院（Mouseion），吸引了当时最杰出的学者。他采用了双重体制：对希腊人以希腊方式统治，对埃及人以法老身份出现，修建传统神庙。这种文化共存模式维持了近三百年。',
    category: 'history', region: 'egypt', significance: 3, figure: '托勒密一世',
    image: 'https://picsum.photos/seed/chrono-eg031/1200/800',
    relatedIds: ['eg030'],
  },
  {
    id: 'eg032', year: -280, title: '亚历山大灯塔建造',
    description: '法罗斯灯塔在亚历山大港建成，高约120米，是古代世界七大奇迹之一，用火光和铜镜反射为地中海航船导航。',
    details: '灯塔由建筑师索斯特拉托斯设计，分三层：底部为方形，中部为八角形，顶部为圆形。塔顶的火焰通过巨大的弧形铜镜反射，据称在50公里外都能看见。灯塔在14世纪的地震中倒塌，其遗迹在1994年被潜水考古学家在海底重新发现。',
    category: 'architecture', region: 'egypt', significance: 2,
    image: 'https://picsum.photos/seed/chrono-eg032/1200/800',
  },
  {
    id: 'eg033', year: -196, title: '罗塞塔石碑刻立',
    description: '托勒密五世以象形文字、世俗体和希腊文三种文字刻立法令，这块石碑在1799年被拿破仑远征军发现后成为破解象形文字的关键。',
    details: '石碑内容是孟菲斯祭司颁布的一道赞颂托勒密五世的法令，但其真正的历史价值在于让商博良在1822年通过对比三种文字最终破解了失落千年的象形文字，打开了理解整个古埃及文明的大门。',
    category: 'literature', region: 'egypt', significance: 2,
    image: 'https://picsum.photos/seed/chrono-eg033/1200/800',
  },
  {
    id: 'eg034', year: -51, endYear: -30, title: '克利奥帕特拉七世·最后的法老',
    description: '克利奥帕特拉七世是托勒密王朝的末代女王，她先后与凯撒和安东尼结盟试图维持埃及独立，最终在屋大维进军后自杀身亡。',
    details: '克利奥帕特拉是托勒密王室中唯一学会埃及语的统治者（她精通九种语言）。她与凯撒育有一子（小凯撒/恺撒里昂），凯撒遇刺后又与安东尼建立政治和感情联盟。前31年亚克兴海战中安东尼和克利奥帕特拉联军惨败于屋大维，次年两人先后自杀。埃及随之成为罗马行省，法老时代彻底终结。',
    category: 'history', region: 'egypt', significance: 3, figure: '克利奥帕特拉七世',
    image: 'https://picsum.photos/seed/chrono-eg034/1200/800',
  },

  // ─── 罗马与拜占庭统治（前 30 – 公元 641）──────────────
  {
    id: 'eg035', year: -30, title: '埃及成为罗马行省',
    description: '屋大维（奥古斯都）将埃及纳入罗马直辖，作为帝国最重要的粮仓，由元首直接任命总督管理。',
    details: '罗马统治时期，埃及每年向罗马输出约三分之一的粮食供应。亚历山大城继续繁荣，成为罗马帝国仅次于罗马的第二大城市。法尤姆绿洲出土的大量"法尤姆肖像"——画在木板上的逝者面部写实肖像——展现了希腊-罗马-埃及文化交融的独特艺术风格。',
    category: 'history', region: 'egypt', significance: 2,
    image: 'https://picsum.photos/seed/chrono-eg035/1200/800',
  },
  {
    id: 'eg036', year: 45, title: '基督教传入埃及',
    description: '传统上认为使徒马可约在公元45年将基督教带入亚历山大，建立了科普特教会的基础。',
    details: '亚历山大很快成为早期基督教最重要的神学中心之一。亚历山大学派培养了克莱门特和奥利金等重要神学家。3世纪开始，埃及沙漠中出现了世界上最早的基督教修道运动——安东尼和帕科米乌斯被视为修道制度的创始人，他们的模式后来传遍了整个基督教世界。',
    category: 'religion', region: 'egypt', significance: 2,
    image: 'https://picsum.photos/seed/chrono-eg036/1200/800',
  },

  // ─── 伊斯兰时期（641 – 1517）──────────────────────
  {
    id: 'eg037', year: 641, title: '阿拉伯征服埃及',
    description: '阿拉伯将领阿穆尔·伊本·阿斯攻占亚历山大，埃及从拜占庭手中转入伊斯兰世界，福斯塔特城（后来开罗的前身）建立。',
    details: '阿穆尔的军队只有约4000人，但当时的科普特基督徒对拜占庭的宗教迫害（强制执行迦克墩信条）深感不满，对阿拉伯人的到来未作强烈抵抗。新统治者最初对基督徒和犹太人相对宽容，收取吉兹亚（人头税）后允许其保留信仰。',
    category: 'history', region: 'egypt', significance: 3,
    image: 'https://picsum.photos/seed/chrono-eg037/1200/800',
  },
  {
    id: 'eg038', year: 969, title: '法蒂玛王朝建立开罗',
    description: '什叶派法蒂玛王朝征服埃及后建造新都开罗（al-Qahira，意为"胜利之城"），并创建了爱资哈尔清真寺和大学。',
    details: '爱资哈尔大学（建于公元970年）至今仍在运行，被认为是世界上持续运营时间最长的大学之一。法蒂玛时期的开罗成为伊斯兰世界最繁华的城市之一，商业和学术极度发达。',
    category: 'architecture', region: 'egypt', significance: 2,
    image: 'https://picsum.photos/seed/chrono-eg038/1200/800',
  },
  {
    id: 'eg039', year: 1171, title: '萨拉丁建立阿尤布王朝',
    description: '库尔德裔将领萨拉丁废除法蒂玛王朝，建立阿尤布王朝，统一了埃及和叙利亚，并于1187年收复耶路撒冷。',
    details: '萨拉丁在开罗修建了萨拉丁城堡，至今仍是开罗的地标建筑。他在哈丁战役中歼灭十字军主力后收复耶路撒冷，但对基督徒展现了骑士风度——允许平民交赎金离开，并亲自照顾英王理查德的病情。他的品格赢得了敌友双方的尊敬。',
    category: 'warfare', region: 'egypt', significance: 3, figure: '萨拉丁',
    image: 'https://picsum.photos/seed/chrono-eg039/1200/800',
  },
  {
    id: 'eg040', year: 1250, endYear: 1517, title: '马穆鲁克苏丹国',
    description: '奴隶出身的马穆鲁克军事精英推翻阿尤布王朝，建立了独特的"奴隶兵国家"，在艾因贾鲁特战役中击败蒙古人，拯救了伊斯兰世界。',
    details: '1260年的艾因贾鲁特战役是世界史上的关键转折——马穆鲁克苏丹忽突兹和将领拜巴尔斯率军在巴勒斯坦击败了此前所向披靡的蒙古军队，终结了蒙古西征的势头。马穆鲁克时期的开罗成为伊斯兰世界的中心，建筑艺术尤其辉煌。但16世纪初面对奥斯曼帝国的火器优势，马穆鲁克骑兵终究无力抵挡。',
    category: 'history', region: 'egypt', significance: 3,
    image: 'https://picsum.photos/seed/chrono-eg040/1200/800',
  },

  // ─── 奥斯曼与近现代（1517 – 至今）──────────────────
  {
    id: 'eg041', year: 1517, title: '奥斯曼帝国征服埃及',
    description: '奥斯曼苏丹塞利姆一世在里达尼亚战役中击败马穆鲁克末代苏丹，埃及成为奥斯曼帝国的一个行省。',
    details: '塞利姆一世此次远征还从马穆鲁克手中夺取了对麦加和麦地那两座圣城的保护权，使奥斯曼苏丹获得了伊斯兰世界哈里发的地位。埃及在奥斯曼统治下度过了相对平静的三百年，但政治自主性大大降低。',
    category: 'warfare', region: 'egypt', significance: 2, figure: '塞利姆一世',
    image: 'https://picsum.photos/seed/chrono-eg041/1200/800',
  },
  {
    id: 'eg042', year: 1798, title: '拿破仑远征埃及',
    description: '拿破仑率军入侵埃及，虽军事上最终撤退，但随行的167位学者对埃及进行了全面科学考察，催生了现代埃及学。',
    details: '远征军在吉萨金字塔下击败马穆鲁克骑兵（金字塔战役），但舰队在阿布基尔湾被纳尔逊摧毁。远征最持久的遗产不是军事而是学术——随行学者编写的《埃及记述》(Description de l\'Egypte)多达23卷，系统记录了埃及的古迹、自然和社会，罗塞塔石碑也是在此期间被发现的。',
    category: 'history', region: 'egypt', significance: 2, figure: '拿破仑',
    image: 'https://picsum.photos/seed/chrono-eg042/1200/800',
  },
  {
    id: 'eg043', year: 1805, endYear: 1848, title: '穆罕默德·阿里·现代埃及之父',
    description: '阿尔巴尼亚裔军官穆罕默德·阿里夺取埃及政权，屠灭马穆鲁克残余势力，推行全面近代化改革，被誉为"现代埃及之父"。',
    details: '穆罕默德·阿里建立了新式军队和海军，创办了工厂、学校和医院，派遣留学生赴欧洲学习。他的军事扩张一度控制了叙利亚和阿拉伯半岛，威胁奥斯曼帝国本身。虽然列强最终限制了他的野心，但他为埃及奠定了近代化的基础，其后裔统治埃及直到1952年革命。',
    category: 'history', region: 'egypt', significance: 3, figure: '穆罕默德·阿里',
    image: 'https://picsum.photos/seed/chrono-eg043/1200/800',
  },
  {
    id: 'eg044', year: 1922, title: '埃及独立',
    description: '在长期的民族主义运动后，英国被迫承认埃及独立，福阿德一世成为国王，但英国保留了对苏伊士运河和国防的控制权。',
    details: '1919年萨阿德·扎格卢尔领导的民族起义（华夫脱运动）迫使英国做出让步。但1922年的"独立"是有限的——英国仍驻军苏伊士运河区，控制着苏丹事务和外国人特权。真正的完全独立要等到1952年革命和1956年苏伊士运河国有化之后。',
    category: 'history', region: 'egypt', significance: 2, figure: '萨阿德·扎格卢尔',
    image: 'https://picsum.photos/seed/chrono-eg044/1200/800',
  },
  {
    id: 'eg045', year: 1952, title: '自由军官革命·纳赛尔崛起',
    description: '纳赛尔等"自由军官"发动政变推翻法鲁克国王，建立共和国。纳赛尔于1956年将苏伊士运河国有化，成为阿拉伯世界的标志性领袖。',
    details: '苏伊士运河国有化引发了1956年苏伊士危机——英法以三国联合进攻埃及，但在美苏共同压力下被迫撤军。这场危机标志着旧殖民帝国的落幕和冷战格局的确立，纳赛尔则成为反殖民主义和泛阿拉伯主义的象征。',
    category: 'history', region: 'egypt', significance: 3, figure: '纳赛尔',
    image: 'https://picsum.photos/seed/chrono-eg045/1200/800',
  },
]

// 批量设置图片兜底
const makeEventImage = (eventId: string) => `https://picsum.photos/seed/chrono-${eventId}/1200/800`
for (const event of egyptDynastyEvents) {
  if (!event.image) {
    event.image = makeEventImage(event.id)
  }
}
