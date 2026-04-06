import type { HistoricalEvent } from './types'

// ============================================================
// 事件丰富度扩充包 Part 2
// 特性4: 音乐史 + 特性5: 医学史 + 特性6: 探索与地理发现
// ============================================================

export const musicEnrichmentEvents: HistoricalEvent[] = [
  { id: 'mus001', year: -2000, title: '苏美尔赞美诗', description: '苏美尔人创作了最早有记录的音乐作品——赞美诗和宗教歌曲，记录在泥板上。', category: 'music', region: 'iraq', significance: 2 },
  { id: 'mus002', year: -500, title: '毕达哥拉斯音律', description: '毕达哥拉斯发现弦长比例与音程的数学关系，奠定西方音乐理论基础。', category: 'music', region: 'greece', significance: 3, figure: '毕达哥拉斯' },
  { id: 'mus003', year: 600, title: '格里高利圣咏', description: '教皇格里高利一世整理推广教会圣咏，奠定了西方音乐记谱和调式体系基础。', category: 'music', region: 'italy', significance: 3 },
  { id: 'mus004', year: 800, title: '唐代音乐鼎盛', description: '唐朝音乐达到顶峰，宫廷设立太常寺和梨园，融合西域音乐，影响东亚。', category: 'music', region: 'china', significance: 2 },
  { id: 'mus005', year: 1030, title: '圭多发明五线谱', description: '意大利僧侣圭多·达雷佐发明五线谱记谱法和唱名法（Do-Re-Mi），音乐史上最重要的技术革新之一。', category: 'music', region: 'italy', significance: 3, figure: '圭多·达雷佐' },
  { id: 'mus006', year: 1200, title: '游吟诗人文化', description: '法国南部游吟诗人用奥克语吟唱爱情歌曲，开创了世俗音乐传统。', category: 'music', region: 'france', significance: 2 },
  { id: 'mus007', year: 1597, title: '歌剧诞生', description: '世界上第一部歌剧《达芙妮》在佛罗伦萨上演，音乐戏剧艺术由此诞生。', category: 'music', region: 'italy', significance: 3 },
  { id: 'mus008', year: 1685, title: '巴赫与亨德尔诞生', description: '巴洛克两位巨匠同年出生。巴赫将复调推至极致，被尊为"音乐之父"。', category: 'music', region: 'germany', significance: 3, figure: '巴赫' },
  { id: 'mus009', year: 1756, title: '莫扎特诞生', description: '莫扎特诞生于萨尔茨堡，5岁作曲，35年短暂生命留下600多部作品。', category: 'music', region: 'austria', significance: 3, figure: '莫扎特' },
  { id: 'mus010', year: 1865, title: '瓦格纳乐剧革新', description: '瓦格纳的"特里斯坦和弦"突破传统和声边界，预示了现代音乐的诞生。', category: 'music', region: 'germany', significance: 2, figure: '瓦格纳' },
  { id: 'mus011', year: 1900, title: '爵士乐萌芽', description: '新奥尔良非裔美国人融合蓝调和拉格泰姆，创造了爵士乐——自由与即兴的最高形式。', category: 'music', region: 'usa', significance: 3 },
  { id: 'mus012', year: 1913, title: '斯特拉文斯基《春之祭》', description: '《春之祭》首演引发骚乱，原始节奏和不协和音开启了现代音乐革命。', category: 'music', region: 'france', significance: 3, figure: '斯特拉文斯基' },
  { id: 'mus013', year: 1955, title: '摇滚乐诞生', description: '查克·贝里和猫王将节奏布鲁斯与乡村音乐融合，摇滚乐诞生并席卷全球。', category: 'music', region: 'usa', significance: 3 },
  { id: 'mus014', year: 1964, title: '披头士入侵美国', description: '披头士在《埃德·沙利文秀》亮相，7300万人观看，流行音乐全球化的标志。', category: 'music', region: 'uk', significance: 3 },
  { id: 'mus015', year: 1979, title: '嘻哈文化诞生', description: '纽约布朗克斯诞生了嘻哈文化——说唱、DJ、涂鸦和霹雳舞，后发展成全球最大的音乐类型。', category: 'music', region: 'usa', significance: 3 },
  { id: 'mus016', year: 1000, title: '阿拉伯音乐理论', description: '法拉比撰写《音乐大全》，系统阐述阿拉伯音乐理论，影响整个伊斯兰世界。', category: 'music', region: 'iraq', significance: 2, figure: '法拉比' },
  { id: 'mus017', year: 1700, title: '维瓦尔第与协奏曲', description: '维瓦尔第创作数百首协奏曲，其《四季》成为巴洛克音乐最广为人知的作品。', category: 'music', region: 'italy', significance: 2, figure: '维瓦尔第' },
  { id: 'mus018', year: 1877, title: '爱迪生发明留声机', description: '人类第一次可以录制和回放声音，音乐不再只是现场体验。', category: 'music', region: 'usa', significance: 3, figure: '爱迪生' },
  { id: 'mus019', year: 1950, title: '印度古典音乐走向世界', description: '拉维·香卡将西塔琴和拉格音乐带到西方，深刻影响了披头士等音乐人。', category: 'music', region: 'india', significance: 2, figure: '拉维·香卡' },
  { id: 'mus020', year: 1990, title: 'K-Pop崛起', description: '韩国流行音乐产业开始系统化发展，"练习生"体系培养出全球性偶像团体。', category: 'music', region: 'korea', significance: 2 },
  // ── 新增音乐事件补充 ──
  { id: 'mus021', year: 1935, title: '聂耳《义勇军进行曲》', description: '聂耳为电影《风云儿女》作曲，这首歌后来成为中华人民共和国国歌。', category: 'music', region: 'china', significance: 3, figure: '聂耳' },
  { id: 'mus022', year: 1959, title: '迈尔斯·戴维斯《Kind of Blue》', description: '迈尔斯·戴维斯录制了爵士乐历史上销量最高的专辑，开创了模态爵士风格。', category: 'music', region: 'usa', significance: 2, figure: '迈尔斯·戴维斯' },
  { id: 'mus023', year: 1970, title: '费拉·库蒂与非洲节奏', description: '尼日利亚音乐家费拉·库蒂创造了"非洲节奏"（Afrobeat），融合了爵士、放克和约鲁巴传统音乐。', category: 'music', region: 'nigeria', significance: 2, figure: '费拉·库蒂' },
  { id: 'mus024', year: 1970, title: '桑巴与波萨诺瓦黄金期', description: '若昂·吉尔贝托和安东尼奥·卡洛斯·若宾将巴西波萨诺瓦推向全球，《伊帕内玛的女孩》成为最广为人知的巴西歌曲。', category: 'music', region: 'brazil', significance: 2, figure: '若宾' },
  { id: 'mus025', year: 1977, title: '电子音乐先驱·Kraftwerk', description: '德国乐队 Kraftwerk 发行《跨欧快车》，开创了电子音乐和合成器流行的先河。', category: 'music', region: 'germany', significance: 2, figure: 'Kraftwerk' },
  { id: 'mus026', year: 1988, title: '酸性浩室与电子舞曲爆发', description: '芝加哥和底特律的地下俱乐部催生了浩室和科技舞曲，电子舞曲席卷全球。', category: 'music', region: 'usa', significance: 2 },
  { id: 'mus027', year: 1986, title: '崔健《一无所有》', description: '崔健在北京工人体育馆唱出中国第一首摇滚歌曲，被誉为"中国摇滚之父"。', category: 'music', region: 'china', significance: 2, figure: '崔健' },
  { id: 'mus028', year: 2004, title: '周杰伦与华语流行音乐新纪元', description: '周杰伦以融合中国风和嘻哈的独特风格重新定义了华语流行音乐。', category: 'music', region: 'china', significance: 2, figure: '周杰伦' },
  { id: 'mus029', year: 2015, title: '流媒体革命', description: 'Spotify 和 Apple Music 等流媒体平台超越实体唱片销售，音乐消费模式被彻底颠覆。', category: 'music', region: 'global', significance: 2 },
  { id: 'mus030', year: 1936, title: '罗伯特·约翰逊与十字路口传说', description: '传说密西西比三角洲蓝调吉他手罗伯特·约翰逊在十字路口与魔鬼交易了灵魂，换取了超凡的吉他技艺。他的29首录音成为所有摇滚和蓝调音乐的精神源头。', category: 'music', region: 'usa', significance: 2, figure: '罗伯特·约翰逊' },
  { id: 'mus031', year: 1842, title: '维也纳爱乐乐团成立', description: '世界上最负盛名的管弦乐团之一在维也纳成立，延续了莫扎特、贝多芬的音乐传统。', category: 'music', region: 'austria', significance: 2 },
]

export const medicineEnrichmentEvents: HistoricalEvent[] = [
  { id: 'med001', year: -1600, title: '埃伯斯纸草文献', description: '古埃及最重要的医学文献，记录了700多种草药配方和外科治疗方法。', category: 'medicine', region: 'egypt', significance: 2 },
  { id: 'med002', year: -400, title: '希波克拉底誓言', description: '希波克拉底将医学从巫术中分离，确立理性诊断传统，被称为"医学之父"。', details: '"首先，不造成伤害"——这一原则至今是医生职业道德的基石。', category: 'medicine', region: 'greece', significance: 3, figure: '希波克拉底' },
  { id: 'med003', year: -200, title: '《黄帝内经》', description: '中国最早的医学典籍，系统阐述了阴阳五行、经络和针灸理论。', category: 'medicine', region: 'china', significance: 3 },
  { id: 'med004', year: 100, title: '盖伦解剖学', description: '罗马医生盖伦系统研究人体解剖和生理学，其理论主导西方医学1500年。', category: 'medicine', region: 'italy', significance: 3, figure: '盖伦' },
  { id: 'med005', year: 200, title: '华佗麻沸散', description: '中国医生华佗发明麻沸散用于外科手术麻醉，比西方全身麻醉早1600年。', category: 'medicine', region: 'china', significance: 2, figure: '华佗' },
  { id: 'med006', year: 1025, title: '伊本·西纳《医典》', description: '波斯医学家编著《医典》，成为东西方医学教科书长达600年。', category: 'medicine', region: 'iran', significance: 3, figure: '伊本·西纳' },
  { id: 'med007', year: 1347, title: '黑死病大爆发', description: '鼠疫从中亚传入欧洲，三年内夺去欧洲三分之一到二分之一人口，瓦解了封建经济。', category: 'medicine', region: 'global', significance: 3 },
  { id: 'med008', year: 1543, title: '维萨里《人体的构造》', description: '维萨里通过实际解剖纠正了盖伦大量错误，开创现代解剖学。', category: 'medicine', region: 'belgium', significance: 3, figure: '维萨里' },
  { id: 'med009', year: 1628, title: '哈维血液循环', description: '威廉·哈维发现血液循环系统，推翻盖伦血液理论，开启现代生理学。', category: 'medicine', region: 'uk', significance: 3, figure: '哈维' },
  { id: 'med010', year: 1676, title: '列文虎克发现微生物', description: '列文虎克用自制显微镜首次观察到细菌和原生动物，打开了微观生命世界的大门。', category: 'medicine', region: 'netherlands', significance: 3, figure: '列文虎克' },
  { id: 'med011', year: 1796, title: '詹纳牛痘疫苗', description: '詹纳用牛痘接种预防天花，开创疫苗学——天花在1980年被正式消灭。', category: 'medicine', region: 'uk', significance: 3, figure: '詹纳' },
  { id: 'med012', year: 1846, title: '乙醚麻醉首次公开演示', description: '麻省总医院公开演示乙醚麻醉术，外科手术从此告别无麻醉时代。', category: 'medicine', region: 'usa', significance: 3 },
  { id: 'med013', year: 1918, title: '西班牙大流感', description: '全球大流感造成约5000万至1亿人死亡，超过一战的战场死亡人数。', category: 'medicine', region: 'global', significance: 3 },
  { id: 'med014', year: 1928, title: '弗莱明发现青霉素', description: '弗莱明意外发现青霉素的抗菌作用，抗生素时代拉开序幕，拯救了人类历史上最多的生命之一。', category: 'medicine', region: 'uk', significance: 3, figure: '弗莱明' },
  { id: 'med015', year: 1953, title: 'DNA双螺旋结构', description: '沃森和克里克发现DNA双螺旋结构，揭示了生命遗传信息的编码方式。', category: 'medicine', region: 'uk', significance: 3, figure: '沃森和克里克' },
  { id: 'med016', year: 2020, title: 'mRNA疫苗突破', description: 'mRNA新冠疫苗创纪录地在不到一年内研发成功，开启疫苗技术新纪元。', category: 'medicine', region: 'usa', significance: 3 },
]

export const explorationEnrichmentEvents: HistoricalEvent[] = [
  { id: 'exp001', year: -600, title: '腓尼基人环航非洲', description: '法老尼科二世委派腓尼基水手从红海出发环航非洲，历时三年。', category: 'exploration', region: 'egypt', significance: 2 },
  { id: 'exp002', year: 700, title: '波利尼西亚人航海', description: '波利尼西亚人仅凭星象和洋流导航，在太平洋上发现并定居了数千个岛屿——人类最伟大的航海壮举之一。', category: 'exploration', region: 'new-zealand', significance: 3 },
  { id: 'exp003', year: 1000, title: '维京人发现北美', description: '莱夫·埃里克松率维京人抵达北美"文兰"，比哥伦布早近500年。', category: 'exploration', region: 'norway', significance: 2, figure: '莱夫·埃里克松' },
  { id: 'exp004', year: 1405, title: '郑和下西洋', description: '明朝太监郑和率300多艘船舰和2.7万人七次远航，足迹遍及东南亚、印度、阿拉伯和东非。', details: '郑和旗舰据载长约120米，是哥伦布船的5倍。如果明朝没在1433年终止海上探险，世界史可能完全不同。', category: 'exploration', region: 'china', significance: 3, figure: '郑和' },
  { id: 'exp005', year: 1488, title: '迪亚士绕过好望角', description: '葡萄牙航海家迪亚士绕过非洲最南端，打开通往印度的海上航路。', category: 'exploration', region: 'portugal', significance: 2, figure: '迪亚士' },
  { id: 'exp006', year: 1492, title: '哥伦布发现新大陆', description: '哥伦布横渡大西洋到达美洲，永久连接了新旧世界，引发"哥伦布大交换"。', category: 'exploration', region: 'spain', significance: 3, figure: '哥伦布' },
  { id: 'exp007', year: 1498, title: '达·伽马抵达印度', description: '达·伽马经好望角抵达印度卡利卡特，开辟欧洲到亚洲的直航路线。', category: 'exploration', region: 'portugal', significance: 3, figure: '达·伽马' },
  { id: 'exp008', year: 1519, title: '麦哲伦环球航行', description: '麦哲伦率船队开始人类首次环球航行，本人在菲律宾殉命，但船队完成壮举。', category: 'exploration', region: 'spain', significance: 3, figure: '麦哲伦' },
  { id: 'exp009', year: 1768, title: '库克船长太平洋探险', description: '詹姆斯·库克三次太平洋航行，绘制了澳大利亚和太平洋岛屿的精确海图。', category: 'exploration', region: 'uk', significance: 2, figure: '库克船长' },
  { id: 'exp010', year: 1831, title: '达尔文小猎犬号航行', description: '达尔文搭乘小猎犬号环球航行五年，收集的观察数据催生了进化论。', category: 'exploration', region: 'uk', significance: 3, figure: '达尔文' },
  { id: 'exp011', year: 1911, title: '阿蒙森到达南极点', description: '挪威探险家阿蒙森率队首先到达南极点，比斯科特早了35天。', category: 'exploration', region: 'norway', significance: 3, figure: '阿蒙森' },
  { id: 'exp012', year: 1953, title: '首次登顶珠峰', description: '希拉里和丹增·诺盖首次登顶世界最高峰珠穆朗玛峰。', category: 'exploration', region: 'nepal', significance: 3, figure: '希拉里' },
  { id: 'exp013', year: 1961, title: '加加林太空飞行', description: '苏联宇航员加加林成为第一个进入太空的人类，完成108分钟轨道飞行。', category: 'exploration', region: 'russia', significance: 3, figure: '加加林' },
  { id: 'exp014', year: 1969, title: '人类登月', description: '阿波罗11号载人登月，阿姆斯特朗说出"这是个人的一小步，却是人类的一大步"。', category: 'exploration', region: 'usa', significance: 3, figure: '阿姆斯特朗' },
  { id: 'exp015', year: 1990, title: '哈勃太空望远镜升空', description: '哈勃望远镜为人类提供了前所未有的深空图像，改变了宇宙学认知。', category: 'exploration', region: 'usa', significance: 2 },
]
