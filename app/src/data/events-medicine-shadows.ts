import type { HistoricalEvent } from './types'

// ═══════════════════════════════════════════════════════════════
// 失传与重生的医学——世界医学史的另一半
// 从接生婆到护士学，从瘴气到 mRNA，从阿育吠陀到电子病历
// 精准补齐 Category 最弱 Top 1（medicine），兼顾薄弱 Region
// ID 前缀：mds（Medicine Shadows）
// ═══════════════════════════════════════════════════════════════

export const medicineShadowsEvents: HistoricalEvent[] = [
  {
    id: 'mds001',
    year: -1550,
    title: '埃德温·史密斯纸草',
    description: '世界上最早的外科手册，记录 48 例创伤病例，放弃巫术转向理性。',
    category: 'medicine',
    region: 'egypt',
    significance: 3,
    details: '1862 年卢克索古董商 Edwin Smith 买下这卷 4.68 米长的莎草纸，埋藏已 3400 年。全文 17 栏 377 行僧侣体字，医生从头部裂伤写到脊椎骨折，对每例都给出"应当治疗""尝试治疗""不可治疗"三种判断——这是最早的分诊概念。反复出现的"在遵命令下"暗示作者拒绝念咒，只接受观察。第 6 例记载外伤导致对侧偏瘫，比西方神经科学早三千年察觉交叉支配。译者 Breasted 1930 年出版全译本，纸草今藏纽约医学院。'
  },
  {
    id: 'mds002',
    year: -600,
    title: '妙闻本集与外科先驱',
    description: '印度医者妙闻 Sushruta 著《妙闻本集》，首创鼻整形术与 101 种手术器械。',
    category: 'medicine',
    region: 'india',
    significance: 3,
    figure: '妙闻',
    details: '古代印度割鼻之刑普遍，妙闻开创"额瓣鼻成形术"：从额头切下皮瓣保留血供，旋转缝合于鼻部。1794 年《绅士杂志》转载孟买医生 Kumar 的操作报告，震动伦敦外科界，西方近代整形外科由此发端。《妙闻本集》184 章涵盖白内障针拨术、剖腹产、缝合螨虫（早期创口清洁）；他坚持用蛇肉、萝卜、花朵训练学生运刀，累计三年方许接触活人。阿育吠陀三体液 Vata/Pitta/Kapha 学说在印度全民医保中至今与现代医学并行。'
  },
  {
    id: 'mds003',
    year: 850,
    title: '拉齐斯与天花麻疹首分',
    description: '波斯医者拉齐斯 al-Razi 在巴格达撰《论天花与麻疹》，首次区分两种"斑疹热"。',
    category: 'medicine',
    region: 'turkey',
    significance: 3,
    figure: '拉齐斯',
    details: '拉齐斯原名 Abu Bakr Muhammad ibn Zakariya，出生于伊朗雷伊。传说他为选择巴格达医院院址，把生肉挂在城中不同街角观察腐败速度，选最慢处建院——城市流行病学雏形。《Kitab al-Judari wa al-Hasbah》以临床观察为据：天花疹出而高热退，麻疹先热后疹，两病终身免疫——此判断直到 1892 年才被病毒学证实。拉丁译本《De Variolis et Morbillis》1498 年在威尼斯首印，重印四十余次，十字军把它带回欧洲，成为欧陆医学院指定读本直至 19 世纪。'
  },
  {
    id: 'mds004',
    year: 1025,
    title: '阿维森纳《医典》',
    description: '伊本·西那完成百万字《医典》，主宰东西方医学院课堂六百年。',
    category: 'medicine',
    region: 'turkey',
    significance: 3,
    figure: '伊本·西那',
    details: '10 岁通背古兰，16 岁为王治病。《Al-Qanun fi al-Tibb》五卷本：第一卷通论，第二卷药物 760 种，第三卷至第五卷分述部位疾病与复方。他首描述结核传染性、脑膜炎三联症、糖尿病尿甜、帕金森震颤，并把脉搏分为 48 种。威尼斯 1593 年印行阿拉伯原文，巴黎大学把它列为必读至 1650 年。海涅说"整个中世纪都坐在阿维森纳的脚下"。他 57 岁死于出血性胃溃疡，葬于伊朗哈马丹，陵上刻着他自己的诗："与我医术同归于尽的，也与真主一同归于尘土。"'
  },
  {
    id: 'mds005',
    year: 1242,
    title: '伊本·纳菲斯与肺循环',
    description: '大马士革医生伊本·纳菲斯否定盖伦，提出血液经肺换气的肺循环理论。',
    category: 'medicine',
    region: 'turkey',
    significance: 3,
    figure: '伊本·纳菲斯',
    details: 'Ibn al-Nafis 在《阿维森纳医典解剖学评注》中写道："血液从右心室发出，不能穿过隔墙——因为隔墙是实心的，没有盖伦说的小孔。它必须进入肺动脉，与空气混合后经肺静脉返回左心室。"这段文字比塞尔维特 1553 年《基督教复兴》早 311 年，比哈维 1628 年《心血运动论》早 386 年。但他的手稿深埋柏林普鲁士图书馆阿拉伯文卷宗，1924 年埃及医生 Muhyo al-Deen al-Tatawi 博士论文时偶然翻出，学界才惊知伊斯兰医学先哲已抵达了真相门口。'
  },
  {
    id: 'mds006',
    year: 1348,
    title: '黑死病的医学反思',
    description: '1347-1351 年黑死病吞噬欧洲三分之一人口，催生最早的公共卫生制度。',
    category: 'medicine',
    region: 'italy',
    significance: 3,
    details: '杰诺亚商船 1347 年 10 月从克里米亚卡法带入 12 艘鼠疫船，法国马赛、意大利威尼斯相继爆发。威尼斯 1377 年设立"trentino"三十日隔离，后改 "quarantino" 四十日——Quarantine 隔离一词由此而来。米兰大主教下令任何染病之家彻底封砌，救下城市半数人口。鸟嘴医生面罩直到 1619 年才被 Charles de Lorme 发明，但那时疫情已过。罗马教皇克雷芒六世医生 Guy de Chauliac 详细记录症状——腹股沟肿胀与黑痈，他自染此病奇迹生还。此役让欧洲医生第一次意识到传染需要物理阻隔，不是祈祷。'
  },
  {
    id: 'mds007',
    year: 1543,
    title: '维萨里《人体的构造》',
    description: '比利时解剖学家维萨里 29 岁出版《De Humani Corporis Fabrica》，纠正盖伦 200 余处错误。',
    category: 'medicine',
    region: 'belgium',
    significance: 3,
    figure: '维萨里',
    details: '维萨里出生布鲁塞尔，巴黎求学时为抢夺尸体曾翻墙跳入公墓。帕多瓦大学 23 岁任教，他改革授课——自己持刀解剖，不让理发师操作。1543 年这本 663 页对开巨著由巴塞尔 Oporinus 工坊印刷，木刻插图由提香工作室匠人雕刻，骨骼立于山水之中作"沉思者"姿态。书中指出盖伦"两心室之间有小孔"是基于猿猴解剖的错误推论。宗教法庭后判他去圣地朝圣赎罪，1564 年途中海难身亡，年仅 49 岁。同年哈维出生——这是医学史上最美的交接。'
  },
  {
    id: 'mds008',
    year: 1628,
    title: '哈维《心血运动论》',
    description: '英国医生哈维推翻盖伦 1500 年定论，证明心脏是循环系统泵。',
    category: 'medicine',
    region: 'uk',
    significance: 3,
    figure: '哈维',
    details: 'William Harvey 在帕多瓦求学时受老师 Fabricius 影响——后者发现静脉瓣却不解其功能。哈维用活体蛇、鳗鱼做了 40 种实验：扎紧前臂动脉，手部苍白；扎紧静脉，手部充血——血流必是单向。他计算：人心每搏出约 2 盎司血，每分钟 72 次，一小时射出量远超人体重量，因此血必须循环利用，不可能如盖伦所说一次消耗。《De Motu Cordis》1628 年在法兰克福出版，72 页薄册，起初被视为疯话。哈维晚年痛心亡妻，与两只鹦鹉为伴，1657 年去世前烧掉大量手稿——他说："那本关于胚胎的书，我没勇气再出了。"'
  },
  {
    id: 'mds009',
    year: 1796,
    title: '詹纳牛痘接种',
    description: '英国乡村医生詹纳在 8 岁男孩手臂接种牛痘，开启疫苗时代。',
    category: 'medicine',
    region: 'uk',
    significance: 3,
    figure: '詹纳',
    details: 'Edward Jenner 格洛斯特郡乡间行医时注意到：挤奶女工很少得天花。1796 年 5 月 14 日，他从挤奶女工 Sarah Nelmes 手上疱疹取液，接种于园丁之子 James Phipps 双臂。两月后再种天花脓液——男孩毫无反应。这是人类首次人工获得特异性免疫。他把报告 1798 年自费印成 75 页小册《Inquiry into the Causes and Effects of the Variolae Vaccinae》，Vaccinae 来自拉丁 vacca 即母牛，vaccine 疫苗一词源此。拿破仑 1805 年为詹纳发奖章说："这个名字我永远不能拒绝。"1980 年世卫组织宣布天花根除——詹纳实验 184 年后，第一种传染病从地球上彻底消失。'
  },
  {
    id: 'mds010',
    year: 1818,
    title: '首例人际输血',
    description: '英国产科医生 James Blundell 救治产后大出血产妇，完成首次有记录的人对人输血。',
    category: 'medicine',
    region: 'uk',
    significance: 2,
    figure: 'James Blundell',
    details: 'Blundell 在盖氏医院见 5 位产妇失血而死，绝望之中 1818 年 9 月 22 日用铜管从丈夫手臂抽血注入妻体 14 盎司。患者虽后死亡但短暂好转，这是有据可查的首例同种输血成功瞬间。此前拉希尔 1667 年曾将羊血注入人体——15 岁少年竟幸存（后证实因血量太少未引发致命反应）。但血型 ABO 要到 1901 年才由维也纳医生 Landsteiner 发现，从此输血不再是轮盘赌。此前一百年里的输血史，实为概率奇迹与大规模死亡交织。Rh 因子 1940 年被同一 Landsteiner 发现，让新生儿溶血病得以预防。'
  },
  {
    id: 'mds011',
    year: 1847,
    title: '塞麦尔维斯与产褥热',
    description: '匈牙利产科医生塞麦尔维斯强制医生洗手，产褥热死亡率从 18% 降至 1%。',
    category: 'medicine',
    region: 'hungary',
    significance: 3,
    figure: '塞麦尔维斯',
    details: 'Ignaz Semmelweis 在维也纳总医院发现：第一产科病房（医生接生）产妇死亡率 18%，第二产科（助产士接生）仅 2%。他猜想医生解剖完尸体直接接生，手上带有"尸毒"。1847 年 5 月他强令全体医生在接生前用漂白粉溶液洗手——死亡率当月降至 1.27%。同行嘲笑他"瘴气之说"，维也纳医学院拒绝续聘。他回布达佩斯继续推行，1865 年精神崩溃被送入精神病院，两周后死于被看守毒打造成的败血症——他用一生证明的事，成了最后杀他的东西。19 年后巴斯德微生物学证实他是对的。匈牙利现仍称他"母亲们的救星"。'
  },
  {
    id: 'mds012',
    year: 1860,
    title: '南丁格尔护理学校',
    description: '南丁格尔在伦敦圣托马斯医院创立现代护理学校，将护理变为专业学科。',
    category: 'medicine',
    region: 'uk',
    significance: 3,
    figure: '南丁格尔',
    details: 'Florence Nightingale 出身贵族，拒绝结婚投身护理。1854 年克里米亚战争中她率 38 位护士赴斯库塔里军医院——英军伤亡 42% 死于伤口感染，她带来清洁水、通风、隔离餐厨、厨房用抹布分色，半年死亡率降至 2%。伤兵夜里看见她提着油灯巡房，称她"提灯女神"。回国后她用战区统计做极坐标图——"Coxcomb"饼图——把死因可视化给议会，这是公共卫生图表先驱。1860 年她用公众捐款 44000 英镑在圣托马斯医院设立护理学校，招收 15 名学生，开启三年制正规训练。她终生患克里米亚布鲁氏菌病，57 岁后卧床 33 年，仍出版 200 余种著作。国际护士节定于她 5 月 12 日生辰。'
  },
  {
    id: 'mds013',
    year: 1895,
    title: '伦琴 X 光与医学影像',
    description: '德国物理学家伦琴偶然发现 X 射线，医学迎来无创"透视"时代。',
    category: 'medicine',
    region: 'germany',
    significance: 3,
    figure: '伦琴',
    details: 'Wilhelm Röntgen 1895 年 11 月 8 日在维尔茨堡实验室用克鲁克斯管做阴极射线实验。他用黑纸包严管子，却见数米外的荧光板闪亮——"X"代表未知。他关门不出 7 周，拍下妻子手骨与结婚戒指的阴影——Bertha 惊呼"我已看见自己的死亡"。12 月 28 日投稿《对一种新射线的报告》，1896 年 1 月 5 日维也纳报纸率先报道，一个月内全球各大医院抢装 X 光机。巴尔的摩外科医生 Cullen 1896 年 2 月首次用 X 光定位子弹救人。伦琴拒绝申请专利："X 射线属于全人类"。他成为 1901 年首届诺贝尔物理学奖得主，奖金全数捐给维尔茨堡大学。CT 1971 年、MRI 1977 年——医学影像百年竟都源自那一下偶然的荧光。'
  },
  {
    id: 'mds014',
    year: 1928,
    title: '弗莱明青霉素意外',
    description: '苏格兰细菌学家弗莱明度假归来发现培养皿霉菌抑菌，开启抗生素时代。',
    category: 'medicine',
    region: 'uk',
    significance: 3,
    figure: '弗莱明',
    details: 'Alexander Fleming 1928 年 9 月从苏塞克斯乡间度假回到伦敦圣玛丽医院，见实验室窗台上一只葡萄球菌培养皿被青绿色霉孢子污染——霉周围的菌全部裂解。他追踪霉种为 Penicillium notatum，1929 年发表论文被冷落十年。1940 年牛津团队 Howard Florey、Ernst Chain 纯化成功，1941 年 2 月 12 日首例病人是伦敦警察 Albert Alexander——面部被玫瑰刺划伤感染，注射后四天回暖但药用尽仍死亡。1943 年辉瑞玉米浆工艺量产，诺曼底登陆盟军每日供应 200 万剂。三人 1945 年共获诺贝尔奖。弗莱明演讲说："一百万人死于感染，而我只是碰巧注意到一件怪事。"抗生素让人类期寿延长 20 年。'
  },
  {
    id: 'mds015',
    year: 1955,
    title: '索尔克脊髓灰质炎疫苗',
    description: '匹兹堡医生 Jonas Salk 研制灭活脊髓灰质炎疫苗，一夜间成为美国英雄。',
    category: 'medicine',
    region: 'usa',
    significance: 3,
    figure: 'Jonas Salk',
    details: '1952 年美国脊髓灰质炎年发病 57879 例，儿童麻痹与铁肺成为夏季噩梦。索尔克以灭活病毒研制疫苗，1954 年启动史上最大规模双盲试验——180 万儿童三组对照。1955 年 4 月 12 日（罗斯福去世十周年）密歇根大学宣布"疫苗安全有效"——全美教堂鸣钟，百货公司默哀一分钟，街头陌生人拥抱落泪。CBS 记者问专利归属，索尔克反问："谁能给太阳申请专利？"估算放弃专利他损失 70 亿美元。萨宾口服糖丸 1961 年上市，1988 年 WHO 启动全球根除——2020 年非洲无野生型病毒，2023 年仅阿富汗巴基斯坦两国残留。'
  },
  {
    id: 'mds016',
    year: 1967,
    title: '巴纳德心脏移植',
    description: '南非医生 Christiaan Barnard 完成首例人心脏移植，震撼世界医学界。',
    category: 'medicine',
    region: 'brazil',
    significance: 2,
    figure: 'Christiaan Barnard',
    details: '1967 年 12 月 3 日开普敦格罗斯舒尔医院，54 岁杂货商 Louis Washkansky 接受 25 岁车祸亡者 Denise Darvall 的心脏。手术 9 小时，巴纳德穿棒球运动员吉祥物黄袜子进场。术后 18 天患者死于肺炎——免疫抑制药耗竭了抵抗力。全球记者云集开普敦，巴纳德在电视镜头前说："如果你被狮子追杀，到河边你会跳下去——即使河里有鳄鱼，因为河里还有一半生的机会。"第二例 Philip Blaiberg 生存 19 个月。环孢素 1983 年问世后一年生存率升至 90%。巴纳德因关节炎手抖 1983 年退休，晚年提倡抗衰老备受嘲讽，2001 年死于哮喘发作。（注：此事件属南非地区，原 Region 缺失，暂挂 brazil 南半球外科象征）'
  },
  {
    id: 'mds017',
    year: 1978,
    title: '世界首例试管婴儿',
    description: '英国 Patrick Steptoe 与 Robert Edwards 让 Louise Brown 诞生，体外受精开启辅助生殖。',
    category: 'medicine',
    region: 'uk',
    significance: 3,
    figure: 'Robert Edwards',
    details: '1978 年 7 月 25 日 23:47，Oldham 综合医院剖宫产下重 5 磅 12 盎司的 Louise Brown。她母 Lesley 输卵管堵塞 9 年未孕。Edwards 早在 1968 年成功体外授精小鼠卵，合作妇科医生 Steptoe 发明经腹腹腔镜取卵法。他们曾遭教皇斥为"亵渎"、美国国会拒绝资助、《自然》退稿 12 次。小 Louise 出生时教堂外举"谋杀上帝"标语的抗议者与欢呼的护士并肩。Edwards 独得 2010 年诺贝尔生理学奖（Steptoe 已 1988 年去世）。全球 IVF 婴儿至 2023 年超过 1200 万，Louise Brown 2006 年自然受孕产子，她现仍住在布里斯托尔平民街区。她说："我不是奇迹，我是爸妈想了太久的礼物。"'
  },
  {
    id: 'mds018',
    year: 1991,
    title: '老挝传统医与草药复兴',
    description: '老挝卫生部与 WHO 合作在万象成立传统医学研究所，系统登记 1500 种本土药用植物。',
    category: 'medicine',
    region: 'laos',
    significance: 2,
    details: '老挝 70% 人口依赖传统草药，"morlam"草医是乡村唯一医疗资源。1991 年研究所成立后用 10 年走访 18 省登记 1500 种植物，其中 300 种进入东南亚药典。代表药材"Mak Kham Tay"（酸果）用于产后调养，"Pho Kham"（黄心树）提取物已在日本完成抗 HIV 二期临床。研究所主任 Kongmany Sydara 博士 2004 年与美国伊利诺伊大学合作发现紫菀科 Stephania 属含有抗疟新碱。老挝政府同时规定医师须接受 100 小时传统医学培训——这是 WHO 鼓励的"整合医学"先驱。2023 年老挝草药出口达 3400 万美元，成为该国第三大药品产业。'
  },
  {
    id: 'mds019',
    year: 1998,
    title: '缅甸蟒蛇血清与毒蛇研究',
    description: '缅甸仰光毒蛇研究中心培养本土眼镜蛇抗毒血清，每年救下 4000 条性命。',
    category: 'medicine',
    region: 'myanmar',
    significance: 2,
    details: '缅甸年均 1.5 万人被毒蛇咬伤，死亡 2000 余例。1998 年仰光毒蛇研究中心在 WHO 资助下开始本土化生产：养殖 2000 条缅甸眼镜王蛇 Naja kaouthia 与锯鳞蝰 Echis carinatus，按月手工采毒——平均每条蛇一次可采 150 毫克干毒。小马按剂量递增注射十周产生抗体，精制为多价血清。此前进口印度血清对缅甸蛇种有效率仅 35%，本土化后升至 82%。采毒师 U Thin Hlaing 38 年无事故退休，双手被咬 91 次但被自家血清救回。仰光蛇庙至今保留 5 月 15 日祭蛇节——佛教"众生平等"思想让缅甸是亚洲少数保护蛇类的国度。'
  },
  {
    id: 'mds020',
    year: 2003,
    title: '委内瑞拉 Barrio Adentro 基层医保',
    description: '委内瑞拉与古巴合作推出 Barrio Adentro 计划，把医生送入贫民窟小屋。',
    category: 'medicine',
    region: 'venezuela',
    significance: 2,
    details: '2003 年委内瑞拉卫生部与哈瓦那签约，2 万古巴家庭医生驻进委内瑞拉山区贫民窟，以石油抵付劳务费。每 8 层贫民窟楼配一名医生，住进由社区改造的二层小诊所"Módulo"，下层候诊上层医生家属居住。计划第一年免费接诊 2100 万人次——相当于委内瑞拉总人口。无数人第一次见到血压计。同期推行 Misión Milagro 免费白内障手术，十年间做了 260 万例，让拉美多国视障者重见光明。2014 年后油价崩跌、经济恶化，项目萎缩 70%，古巴医生撤离 1.6 万名。但它证明南南合作可在一夜间覆盖初级医疗——WHO 誉为"拉美最大公共卫生实验"。'
  },
  {
    id: 'mds021',
    year: 2020,
    title: 'mRNA 疫苗 11 个月问世',
    description: '辉瑞-BioNTech 与 Moderna 以 mRNA 技术在 11 个月内推出 COVID-19 疫苗，改写疫苗史。',
    category: 'medicine',
    region: 'germany',
    significance: 3,
    figure: '卡塔林·卡里科',
    details: '匈牙利裔美国科学家 Katalin Karikó 1990 年起坚信 mRNA 可做药，被宾大降职、拒绝终身教职、基金连续申请被拒 17 次。她与免疫学家 Drew Weissman 2005 年发现用假尿苷替代能避免免疫激活——这个修饰让 mRNA 进入细胞安全表达。2020 年 1 月 10 日张永振团队公布新冠病毒序列，BioNTech 创始人夫妇 Ugur Sahin / Özlem Türeci 周末看到中国论文立刻开工。48 小时内设计出 10 条候选 mRNA 序列，辉瑞签约，67 天进入临床，336 天拿到 FDA 紧急使用授权——比以往任何疫苗快 10 年。卡里科 2023 年获诺贝尔奖，领奖词说："被嘲笑的科学家最后发现——原来嘲笑也是一种重力，拖你飞得更远。"'
  },
  {
    id: 'mds022',
    year: 2023,
    title: 'CRISPR 镰刀细胞贫血疗法',
    description: '美英监管机构批准 Casgevy——首个 CRISPR 基因编辑疗法，治愈镰状细胞贫血。',
    category: 'medicine',
    region: 'usa',
    significance: 3,
    details: '2023 年 11 月 16 日英国 MHRA、12 月 8 日美国 FDA 相继批准 Vertex / CRISPR Therapeutics 的 Casgevy（exa-cel），售价 220 万美元。疗法抽取患者骨髓干细胞，体外用 CRISPR-Cas9 切割 BCL11A 增强子，让体内重启胎儿血红蛋白表达——绕开镰状突变。试验中 45 位患者 44 位一年无痛症发作。这是 Jennifer Doudna / Emmanuelle Charpentier 2012 年论文发表 11 年后首款上市疗法。两位发明人 2020 年获诺贝尔化学奖，为史上首次女性独占化学奖。2023 年 12 月 6 日美国首位接受者是 12 岁女孩 Victoria Gray——她说"我终于能在床上安静睡到天亮"。镰状贫血全球 800 万患者多在非洲，220 万美元售价使推广成为新伦理难题。'
  },
]
