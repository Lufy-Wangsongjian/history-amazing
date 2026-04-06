import type { HistoricalEvent } from './types'

// ============================================================
// Round 6 扩充包（特性 136-170）
// 深度地区扩充：中亚/高加索 + 巴尔干深化 + 加勒比/太平洋岛国
// + 西非王国 + 东非 + 北非 + 中国近现代补充 + 科学家深化
// + 数学家 + 发明家 + 哲学深化 + 宗教改革深化 + 冷战
// ============================================================

// ── 特性136-138: 中亚与高加索 ──────────────────────────
export const centralAsiaEvents: HistoricalEvent[] = [
  { id: 'cas001', year: -500, title: '斯基泰游牧帝国', description: '斯基泰人在中亚草原建立了横跨数千公里的游牧帝国，精湛的骑术和金器工艺举世闻名。', category: 'history', region: 'kazakhstan', significance: 2 },
  { id: 'cas002', year: 329, title: '亚历山大到达中亚', description: '亚历山大大帝征服中亚，建立了多座"亚历山大城"，希腊文化与东方文化在此交融。', category: 'warfare', region: 'uzbekistan', significance: 2, figure: '亚历山大' },
  { id: 'cas003', year: 751, title: '怛罗斯之战', description: '唐朝与阿拔斯王朝在怛罗斯交战，造纸术经战俘西传，改变了世界文明进程。', category: 'warfare', region: 'kazakhstan', significance: 3 },
  { id: 'cas004', year: 1370, title: '帖木儿帝国', description: '帖木儿从撒马尔罕崛起，建立了从德里到大马士革的庞大帝国，撒马尔罕成为世界最华丽的城市之一。', category: 'history', region: 'uzbekistan', significance: 3, figure: '帖木儿' },
  { id: 'cas005', year: 1500, title: '撒马尔罕天文台', description: '兀鲁伯在撒马尔罕建造了当时世界上最先进的天文台，编制了精确的星表。', category: 'science', region: 'uzbekistan', significance: 2, figure: '兀鲁伯' },
  { id: 'cas006', year: 1813, title: '高加索战争开始', description: '俄罗斯帝国开始征服高加索地区，山民在沙米尔领导下进行了长达数十年的抵抗。', category: 'warfare', region: 'russia', significance: 2 },
  { id: 'cas007', year: 1991, title: '中亚五国独立', description: '苏联解体后哈萨克斯坦等五国独立，中亚重新登上世界地缘政治舞台。', category: 'history', region: 'kazakhstan', significance: 2 },
]

// ── 特性139-141: 巴尔干深化 ──────────────────────────
export const balkanEvents: HistoricalEvent[] = [
  { id: 'blk001', year: -168, title: '罗马征服马其顿', description: '罗马在皮德纳战役中击败马其顿，希腊世界纳入罗马版图。', category: 'warfare', region: 'greece', significance: 2 },
  { id: 'blk002', year: 395, title: '罗马帝国分裂', description: '狄奥多西一世死后罗马永久分裂为东西两部，巴尔干成为拜占庭帝国核心。', category: 'history', region: 'italy', significance: 3 },
  { id: 'blk003', year: 1389, title: '科索沃战役', description: '塞尔维亚与奥斯曼帝国在科索沃决战，此役决定了巴尔干500年的命运。', category: 'warfare', region: 'serbia', significance: 2 },
  { id: 'blk004', year: 1453, title: '拜占庭帝国灭亡', description: '奥斯曼苏丹穆罕默德二世攻陷君士坦丁堡，延续千年的东罗马帝国终结。', category: 'warfare', region: 'turkey', significance: 3 },
  { id: 'blk005', year: 1878, title: '柏林会议', description: '欧洲列强在柏林重新划分巴尔干版图，塞尔维亚、罗马尼亚、黑山获得独立。', category: 'history', region: 'germany', significance: 2 },
  { id: 'blk006', year: 1914, title: '萨拉热窝事件', description: '波斯尼亚青年普林西普刺杀奥匈太子，直接引爆了第一次世界大战。', category: 'warfare', region: 'serbia', significance: 3 },
  { id: 'blk007', year: 1991, title: '南斯拉夫解体', description: '南斯拉夫联邦解体引发惨烈内战，波黑冲突造成十万人死亡。', category: 'warfare', region: 'serbia', significance: 2 },
]

// ── 特性142-144: 加勒比与太平洋岛国 ──────────────────
export const caribbeanPacificEvents: HistoricalEvent[] = [
  { id: 'cbp001', year: -400, title: '波利尼西亚大航海', description: '波利尼西亚人仅凭星象和洋流在太平洋上航行数千公里，发现了从夏威夷到新西兰的无数岛屿。', category: 'exploration', region: 'new-zealand', significance: 2 },
  { id: 'cbp002', year: 1492, title: '哥伦布到达加勒比', description: '哥伦布登陆巴哈马，开启了欧洲人对加勒比地区长达数百年的殖民历史。', category: 'exploration', region: 'cuba', significance: 3, figure: '哥伦布' },
  { id: 'cbp003', year: 1655, title: '海盗黄金时代', description: '加勒比海盗活动达到鼎盛，皇家港成为"世界上最邪恶的城市"。', category: 'history', region: 'cuba', significance: 1 },
  { id: 'cbp004', year: 1791, title: '海地革命', description: '海地的被奴役者发动起义，建立了世界上第一个由前奴隶建立的独立国家。', category: 'history', region: 'cuba', significance: 3 },
  { id: 'cbp005', year: 1868, title: '复活节岛之谜', description: '智利吞并复活节岛，但岛上900多尊巨大石像的建造之谜至今令人着迷。', category: 'history', region: 'chile', significance: 1 },
  { id: 'cbp006', year: 1946, title: '比基尼环礁核试验', description: '美国在太平洋比基尼环礁进行核试验，迫使岛民永久搬迁。', category: 'warfare', region: 'usa', significance: 2 },
  { id: 'cbp007', year: 1959, title: '古巴革命', description: '卡斯特罗率领游击队推翻巴蒂斯塔政权，建立了西半球第一个社会主义国家。', category: 'history', region: 'cuba', significance: 3, figure: '卡斯特罗' },
]

// ── 特性145-148: 非洲深化（西非王国/东非/北非）──────
export const africaDeepEvents: HistoricalEvent[] = [
  { id: 'afd001', year: -800, title: '库施王国', description: '尼罗河上游的库施王国发展出独立的努比亚文明，一度征服了埃及并建立第二十五王朝。', category: 'history', region: 'sudan', significance: 2 },
  { id: 'afd002', year: 300, title: '阿克苏姆帝国', description: '位于今埃塞俄比亚的阿克苏姆帝国是古代世界四大强国之一，率先接受基督教为国教。', category: 'history', region: 'ethiopia', significance: 2 },
  { id: 'afd003', year: 1000, title: '大津巴布韦', description: '石头城大津巴布韦是撒哈拉以南非洲最大的中世纪石造建筑群，繁盛的贸易网络连接印度洋。', category: 'architecture', region: 'south-africa', significance: 2 },
  { id: 'afd004', year: 1235, title: '曼丁哥帝国', description: '松迪亚塔击败苏索人建立马里帝国，疆域横跨西非，黄金贸易使之成为世界最富有的国家之一。', category: 'history', region: 'mali', significance: 2, figure: '松迪亚塔' },
  { id: 'afd005', year: 1324, title: '曼萨·穆萨朝圣', description: '马里帝国皇帝穆萨途经开罗前往麦加朝圣，沿途散金之多使当地金价暴跌。', category: 'history', region: 'mali', significance: 3, figure: '穆萨' },
  { id: 'afd006', year: 1500, title: '贝宁王国青铜', description: '西非贝宁王国的铸铜艺术达到巅峰，精美的青铜头像和浮雕震惊了后来的欧洲人。', category: 'art', region: 'nigeria', significance: 2 },
  { id: 'afd007', year: 1652, title: '好望角荷兰殖民地', description: '荷兰东印度公司在好望角建立补给站，开启了南非长达数百年的殖民时代。', category: 'history', region: 'south-africa', significance: 2 },
  { id: 'afd008', year: 1807, title: '英国废除奴隶贸易', description: '英国议会通过法案禁止跨大西洋奴隶贸易，开始了全球废奴运动。', category: 'history', region: 'uk', significance: 3 },
  { id: 'afd009', year: 1884, title: '柏林会议瓜分非洲', description: '欧洲列强在柏林会议上瓜分了90%的非洲领土，非洲人民完全被排除在讨论之外。', category: 'history', region: 'germany', significance: 3 },
  { id: 'afd010', year: 1963, title: '非洲统一组织', description: '32个非洲国家在亚的斯亚贝巴成立非洲统一组织（OAU），推动非洲大陆的团结和独立。', category: 'history', region: 'ethiopia', significance: 2 },
  { id: 'afd011', year: 1990, title: '曼德拉获释', description: '纳尔逊·曼德拉在监禁27年后获释，四年后当选南非首位黑人总统。', category: 'history', region: 'south-africa', significance: 3, figure: '曼德拉' },
  { id: 'afd012', year: 1994, title: '卢旺达大屠杀', description: '100天内约80万图西族人被杀害，成为20世纪最惨烈的种族灭绝事件之一。', category: 'history', region: 'kenya', significance: 3 },
]

// ── 特性149-152: 中国近现代补充 ──────────────────────
export const chinaModernEvents: HistoricalEvent[] = [
  { id: 'chm001', year: 1839, title: '鸦片战争', description: '英国为维护鸦片贸易对清朝开战，中国被迫签订《南京条约》，近代屈辱史的开端。', category: 'warfare', region: 'china', significance: 3 },
  { id: 'chm002', year: 1851, title: '太平天国运动', description: '洪秀全领导的太平天国起义持续14年，造成数千万人死亡，是19世纪最大规模的内战。', category: 'warfare', region: 'china', significance: 3, figure: '洪秀全' },
  { id: 'chm003', year: 1894, title: '甲午战争', description: '清朝在与日本的甲午战争中惨败，签订《马关条约》割让台湾，东亚格局彻底改变。', category: 'warfare', region: 'china', significance: 3 },
  { id: 'chm004', year: 1911, title: '辛亥革命', description: '武昌起义推翻了清朝统治，结束了两千多年的封建帝制，中华民国成立。', category: 'history', region: 'china', significance: 3, figure: '孙中山' },
  { id: 'chm005', year: 1937, title: '全面抗日战争', description: '卢沟桥事变后中国开始全面抗日战争，八年浴血奋战最终取得胜利。', category: 'warfare', region: 'china', significance: 3 },
  { id: 'chm006', year: 1949, title: '中华人民共和国成立', description: '1949年10月1日，毛泽东在天安门城楼宣告中华人民共和国成立。', category: 'history', region: 'china', significance: 3 },
  { id: 'chm007', year: 1964, title: '中国第一颗原子弹', description: '中国成功试爆第一颗原子弹，成为世界上第五个拥有核武器的国家。', category: 'technology', region: 'china', significance: 3 },
  { id: 'chm008', year: 2001, title: '中国加入WTO', description: '经过15年谈判，中国正式加入世界贸易组织，中国经济全面融入全球化。', category: 'history', region: 'china', significance: 3 },
  { id: 'chm009', year: 2003, title: '中国首次载人航天', description: '杨利伟乘坐神舟五号飞船进入太空，中国成为第三个独立掌握载人航天技术的国家。', category: 'exploration', region: 'china', significance: 3, figure: '杨利伟' },
]

// ── 特性153-155: 科学家群像 ──────────────────────────
export const scientistEvents: HistoricalEvent[] = [
  { id: 'sci001', year: -250, title: '阿基米德的发现', description: '古希腊数学家阿基米德发现浮力原理、杠杆原理和圆周率估算，是科学史上最伟大的天才之一。', category: 'science', region: 'italy', significance: 3, figure: '阿基米德' },
  { id: 'sci002', year: 1609, title: '开普勒行星运动定律', description: '约翰内斯·开普勒发表行星椭圆轨道运动定律，奠定了天文物理学基础。', category: 'science', region: 'germany', significance: 3, figure: '开普勒' },
  { id: 'sci003', year: 1665, title: '牛顿的奇迹年', description: '躲避瘟疫的牛顿在家乡完成了微积分、光学和万有引力三项革命性发现。', category: 'science', region: 'uk', significance: 3, figure: '牛顿' },
  { id: 'sci004', year: 1831, title: '法拉第发现电磁感应', description: '法拉第证明了磁场变化可以产生电流，为发电机和电动机的发明奠定了基础。', category: 'science', region: 'uk', significance: 3, figure: '法拉第' },
  { id: 'sci005', year: 1859, title: '达尔文《物种起源》', description: '达尔文的进化论彻底改变了人类对生命起源的理解，是生物学最重要的思想革命。', category: 'science', region: 'uk', significance: 3, figure: '达尔文' },
  { id: 'sci006', year: 1865, title: '孟德尔遗传定律', description: '修道院的孟德尔通过豌豆实验发现了遗传学的基本规律，但成果在他生前未受重视。', category: 'science', region: 'czech', significance: 3, figure: '孟德尔' },
  { id: 'sci007', year: 1895, title: '伦琴发现X射线', description: '威廉·伦琴发现X射线并拍摄了妻子手骨的照片，获得了第一届诺贝尔物理学奖。', category: 'science', region: 'germany', significance: 3, figure: '伦琴' },
  { id: 'sci008', year: 1898, title: '居里夫妇发现镭', description: '皮埃尔和玛丽·居里从铀矿渣中提取出放射性元素镭和钋，开创了放射学。', category: 'science', region: 'france', significance: 2, figure: '居里夫妇' },
  { id: 'sci009', year: 1928, title: '弗莱明发现青霉素', description: '亚历山大·弗莱明偶然发现青霉素的杀菌作用，开启了抗生素时代。', category: 'medicine', region: 'uk', significance: 3, figure: '弗莱明' },
  { id: 'sci010', year: 1953, title: 'DNA双螺旋', description: '沃森和克里克发现DNA双螺旋结构，揭示了生命遗传的分子机制。', category: 'science', region: 'uk', significance: 3, figure: '沃森与克里克' },
]

// ── 特性156-158: 发明家群像 ──────────────────────────
export const inventorEvents: HistoricalEvent[] = [
  { id: 'inv001', year: -100, title: '安提基特拉机械', description: '古希腊制造的安提基特拉机械是已知最早的模拟计算机，可预测天文事件和奥运会日期。', category: 'technology', region: 'greece', significance: 2 },
  { id: 'inv002', year: 105, title: '蔡伦改进造纸术', description: '蔡伦用树皮、麻头等材料改进了造纸工艺，纸张逐渐取代竹简成为主要书写材料。', category: 'technology', region: 'china', significance: 3, figure: '蔡伦' },
  { id: 'inv003', year: 1455, title: '古腾堡印刷术', description: '古腾堡发明的活字印刷机使书籍大规模生产成为可能，引发了知识传播的革命。', category: 'technology', region: 'germany', significance: 3, figure: '古腾堡' },
  { id: 'inv004', year: 1712, title: '纽科门蒸汽机', description: '纽科门发明的蒸汽机用于矿井抽水，是瓦特改良蒸汽机的前驱。', category: 'technology', region: 'uk', significance: 2 },
  { id: 'inv005', year: 1879, title: '爱迪生电灯泡', description: '爱迪生团队研制出实用化的碳丝灯泡，点亮了人类的夜晚。', category: 'technology', region: 'usa', significance: 3, figure: '爱迪生' },
  { id: 'inv006', year: 1886, title: '汽车发明', description: '卡尔·本茨获得了世界上第一辆汽油动力汽车的专利，个人交通的革命开始了。', category: 'technology', region: 'germany', significance: 3, figure: '本茨' },
  { id: 'inv007', year: 1903, title: '莱特兄弟首飞', description: '莱特兄弟在北卡罗来纳驾驶飞行者一号完成了人类首次动力飞行，仅持续12秒。', category: 'technology', region: 'usa', significance: 3, figure: '莱特兄弟' },
  { id: 'inv008', year: 1947, title: '晶体管发明', description: '贝尔实验室的巴丁、布拉顿和肖克利发明了晶体管，开启了电子时代。', category: 'technology', region: 'usa', significance: 3 },
  { id: 'inv009', year: 2007, title: 'iPhone发布', description: '乔布斯发布iPhone，将触摸屏智能手机推向大众，彻底改变了人类与数字世界的互动方式。', category: 'technology', region: 'usa', significance: 3, figure: '乔布斯' },
]

// ── 特性159-162: 哲学深化 ──────────────────────────────
export const philosophyDeepEvents: HistoricalEvent[] = [
  { id: 'phd001', year: -563, title: '释迦牟尼出生', description: '佛教创始人悉达多·乔达摩（释迦牟尼）出生于今尼泊尔蓝毗尼。', category: 'religion', region: 'nepal', significance: 3, figure: '释迦牟尼' },
  { id: 'phd002', year: -350, title: '亚里士多德《形而上学》', description: '亚里士多德的哲学百科全书涵盖逻辑、伦理、物理、生物，深刻影响了西方思想2000年。', category: 'philosophy', region: 'greece', significance: 3, figure: '亚里士多德' },
  { id: 'phd003', year: -300, title: '斯多葛学派', description: '芝诺创立斯多葛学派，主张理性生活和内心平静，影响了罗马帝国的精英阶层。', category: 'philosophy', region: 'greece', significance: 2 },
  { id: 'phd004', year: 400, title: '奥古斯丁《忏悔录》', description: '基督教哲学家奥古斯丁的自传体著作，首创了西方文学中的内在自我叙事传统。', category: 'philosophy', region: 'algeria', significance: 2, figure: '奥古斯丁' },
  { id: 'phd005', year: 1130, title: '阿维罗伊斯注释亚里士多德', description: '伊斯兰哲学家阿维罗伊斯的亚里士多德注释传入欧洲，催化了经院哲学和文艺复兴。', category: 'philosophy', region: 'spain', significance: 2, figure: '阿维罗伊斯' },
  { id: 'phd006', year: 1274, title: '托马斯·阿奎那《神学大全》', description: '阿奎那将亚里士多德哲学与基督教神学融合，成为天主教官方哲学的基础。', category: 'philosophy', region: 'italy', significance: 2, figure: '阿奎那' },
  { id: 'phd007', year: 1651, title: '霍布斯《利维坦》', description: '霍布斯论证了社会契约和国家主权的必要性，是现代政治哲学的奠基之作。', category: 'philosophy', region: 'uk', significance: 2, figure: '霍布斯' },
  { id: 'phd008', year: 1689, title: '洛克《政府论》', description: '洛克提出自然权利和政府合法性基于被统治者同意的思想，直接影响了美国独立宣言。', category: 'philosophy', region: 'uk', significance: 3, figure: '洛克' },
  { id: 'phd009', year: 1848, title: '马克思《共产党宣言》', description: '马克思和恩格斯的宣言提出阶级斗争是历史推动力，深刻改变了20世纪的世界格局。', category: 'philosophy', region: 'germany', significance: 3, figure: '马克思' },
  { id: 'phd010', year: 1943, title: '萨特《存在与虚无》', description: '萨特的存在主义哲学宣称"存在先于本质"，人必须在自由中承担选择的责任。', category: 'philosophy', region: 'france', significance: 2, figure: '萨特' },
]

// ── 特性163-165: 冷战关键事件 ──────────────────────────
export const coldWarEvents: HistoricalEvent[] = [
  { id: 'cwd001', year: 1947, title: '杜鲁门主义', description: '美国宣布遏制共产主义扩张的杜鲁门主义，冷战正式开始。', category: 'history', region: 'usa', significance: 3 },
  { id: 'cwd002', year: 1948, title: '柏林封锁', description: '苏联封锁西柏林，西方盟国通过空运维持了近一年的物资供应。', category: 'history', region: 'germany', significance: 2 },
  { id: 'cwd003', year: 1957, title: '斯普特尼克卫星', description: '苏联发射人类第一颗人造卫星斯普特尼克号，太空竞赛由此拉开帷幕。', category: 'technology', region: 'russia', significance: 3 },
  { id: 'cwd004', year: 1961, title: '柏林墙建造', description: '东德在一夜之间建起柏林墙，将柏林一分为二，成为冷战最鲜明的象征。', category: 'history', region: 'germany', significance: 3 },
  { id: 'cwd005', year: 1962, title: '古巴导弹危机', description: '美苏核对峙将世界推到核战争边缘，最终以苏联撤走导弹、美国承诺不入侵古巴收场。', category: 'warfare', region: 'cuba', significance: 3 },
  { id: 'cwd006', year: 1969, title: '阿波罗11号登月', description: '阿姆斯特朗踏上月球表面，宣称"这是个人的一小步，人类的一大步"。', category: 'exploration', region: 'usa', significance: 3, figure: '阿姆斯特朗' },
  { id: 'cwd007', year: 1985, title: '戈尔巴乔夫改革', description: '戈尔巴乔夫推行"公开性"和"改革"政策，试图挽救苏联但最终加速了其解体。', category: 'history', region: 'russia', significance: 3, figure: '戈尔巴乔夫' },
  { id: 'cwd008', year: 1989, title: '柏林墙倒塌', description: '11月9日东德开放边境，柏林墙被欢呼的人群推倒，冷战走向终结。', category: 'history', region: 'germany', significance: 3 },
]

// ── 特性166-168: 宗教改革与宗教运动深化 ──────────────
export const religionDeepEvents: HistoricalEvent[] = [
  { id: 'rld001', year: -1300, title: '出埃及记', description: '传说中摩西带领以色列人逃出埃及的奴役，十诫成为犹太教和西方法律的基础。', category: 'religion', region: 'egypt', significance: 3, figure: '摩西' },
  { id: 'rld002', year: -528, title: '佛陀悟道', description: '释迦牟尼在菩提树下经过49天冥想获得觉悟，创立了影响数十亿人的佛教。', category: 'religion', region: 'india', significance: 3, figure: '释迦牟尼' },
  { id: 'rld003', year: 30, title: '耶稣受难', description: '耶稣在耶路撒冷被钉十字架，其复活信仰成为基督教的核心教义。', category: 'religion', region: 'israel', significance: 3, figure: '耶稣' },
  { id: 'rld004', year: 570, title: '穆罕默德出生', description: '伊斯兰教先知穆罕默德出生于麦加，后来建立了一个横跨三大洲的文明。', category: 'religion', region: 'saudi-arabia', significance: 3, figure: '穆罕默德' },
  { id: 'rld005', year: 1054, title: '基督教大分裂', description: '罗马天主教会与东正教会正式决裂，基督教世界分为东西两大阵营。', category: 'religion', region: 'turkey', significance: 3 },
  { id: 'rld006', year: 1517, title: '马丁·路德九十五条', description: '路德在维滕堡教堂门前张贴《九十五条论纲》，引发新教改革，改变了欧洲宗教版图。', category: 'religion', region: 'germany', significance: 3, figure: '马丁·路德' },
  { id: 'rld007', year: 1534, title: '英国国教会', description: '亨利八世与罗马教廷决裂，建立英国国教会，教会改革与王权扩张相互交织。', category: 'religion', region: 'uk', significance: 2, figure: '亨利八世' },
  { id: 'rld008', year: 1869, title: '甘地出生', description: '甘地出生于印度古吉拉特邦，后来以非暴力不合作运动领导印度独立。', category: 'philosophy', region: 'india', significance: 3, figure: '甘地' },
]

// ── 特性169-170: 数学里程碑 ──────────────────────────
export const mathEvents: HistoricalEvent[] = [
  { id: 'mth001', year: -300, title: '欧几里得《几何原本》', description: '欧几里得编纂的《几何原本》是数学史上最有影响力的教科书，使用了2000多年。', category: 'science', region: 'egypt', significance: 3, figure: '欧几里得' },
  { id: 'mth002', year: 628, title: '布拉马古塔的零', description: '印度数学家布拉马古塔首次为零制定了运算规则，零从占位符号变为了真正的数。', category: 'science', region: 'india', significance: 3 },
  { id: 'mth003', year: 820, title: '花拉子密代数学', description: '波斯数学家花拉子密的著作给出了"代数"(algebra)这个名称，系统化了方程求解。', category: 'science', region: 'iran', significance: 3, figure: '花拉子密' },
  { id: 'mth004', year: 1202, title: '斐波那契《算盘书》', description: '斐波那契将印度-阿拉伯数字系统介绍给欧洲，以他命名的数列出现在自然界各处。', category: 'science', region: 'italy', significance: 2, figure: '斐波那契' },
  { id: 'mth005', year: 1654, title: '帕斯卡与费马的概率论', description: '帕斯卡和费马通信讨论赌博问题，建立了概率论的数学基础。', category: 'science', region: 'france', significance: 2, figure: '帕斯卡' },
  { id: 'mth006', year: 1821, title: '高斯《算术研究》', description: '高斯被称为"数学王子"，在数论、统计、天文等领域做出了划时代贡献。', category: 'science', region: 'germany', significance: 2, figure: '高斯' },
  { id: 'mth007', year: 1931, title: '哥德尔不完备定理', description: '哥德尔证明了任何一致的形式系统都存在不可证明的真命题，动摇了数学的基础。', category: 'science', region: 'austria', significance: 3, figure: '哥德尔' },
  { id: 'mth008', year: 1994, title: '怀尔斯证明费马大定理', description: '安德鲁·怀尔斯在350年后终于证明了费马大定理，这是数学史上最著名的未解问题。', category: 'science', region: 'uk', significance: 2, figure: '怀尔斯' },
]
