import type { HistoricalEvent } from './types'

// ============================================================
// 非洲文明早期事件补充
// 填补非洲文明圈在远古至中世纪时期的空白
// ============================================================

export const africaEarlyEvents: HistoricalEvent[] = [
  // ── 远古与史前 ─────────────────────────────────
  { id: 'afe001', year: -3300, title: '努比亚王国兴起', description: '尼罗河上游的努比亚地区出现了最早的王国（克尔马文化），与古埃及并行发展，拥有独立的文字和建筑传统。', category: 'history', region: 'sudan', significance: 2 },
  { id: 'afe002', year: -2500, title: '库施文明繁荣', description: '库施王国在今苏丹境内崛起，控制了尼罗河上游的金矿和贸易通道，与埃及既贸易又竞争。', category: 'history', region: 'sudan', significance: 2 },
  { id: 'afe003', year: -1500, title: '班图人开始迁徙', description: '班图语族人群从西非的尼日利亚-喀麦隆边境开始向东方和南方大规模迁徙，历时两千年，改变了整个撒哈拉以南非洲的语言和文化版图。', category: 'history', region: 'nigeria', significance: 3 },
  { id: 'afe004', year: -750, title: '库施征服埃及', description: '库施国王皮安基率军北征，征服了整个埃及，建立了埃及第二十五王朝（努比亚王朝），统治埃及近一个世纪。', category: 'warfare', region: 'sudan', significance: 3 },
  { id: 'afe005', year: -500, title: '诺克文化', description: '尼日利亚中部的诺克文化创造了撒哈拉以南非洲最早的赤陶雕塑，展现了高超的冶铁技术和艺术造诣。', category: 'art', region: 'nigeria', significance: 2 },
  { id: 'afe006', year: -300, title: '麦罗埃铁器时代', description: '库施王国的新都城麦罗埃成为非洲最重要的冶铁中心之一，铁器技术从这里传播到非洲各地。', category: 'technology', region: 'sudan', significance: 2 },

  // ── 古典时代 ──────────────────────────────────
  { id: 'afe007', year: 100, title: '东非海岸贸易', description: '东非海岸与罗马帝国、印度和阿拉伯商人建立了繁荣的海上贸易网络，《厄立特利亚海航行记》记录了这些贸易路线。', category: 'exploration', region: 'kenya', significance: 2 },
  { id: 'afe008', year: 500, title: '加纳帝国兴起', description: '西非的加纳帝国（瓦加杜帝国）控制了撒哈拉黄金贸易，被阿拉伯人称为"黄金之国"。', category: 'history', region: 'ghana', significance: 2 },
  { id: 'afe009', year: 700, title: '斯瓦希里城邦', description: '东非海岸兴起了一系列斯瓦希里城邦——基尔瓦、蒙巴萨、马林迪，成为印度洋贸易网络的重要节点。', category: 'history', region: 'tanzania', significance: 2 },
  { id: 'afe010', year: 750, title: '加纳帝国鼎盛', description: '加纳帝国达到鼎盛，首都昆比-萨利赫拥有数万人口，国王坐拥数以吨计的黄金储备。', category: 'history', region: 'ghana', significance: 2 },

  // ── 中世纪繁荣 ─────────────────────────────────
  { id: 'afe011', year: 1100, title: '基尔瓦苏丹国', description: '东非的基尔瓦苏丹国成为印度洋上最繁华的贸易城市之一，铸造了撒哈拉以南非洲最早的硬币。', category: 'history', region: 'tanzania', significance: 2 },
  { id: 'afe012', year: 1180, title: '拉利贝拉岩石教堂', description: '埃塞俄比亚国王拉利贝拉下令在岩石中凿出11座教堂，整体从巨石中雕刻而成，被称为"新耶路撒冷"。', category: 'architecture', region: 'ethiopia', significance: 3 },
  { id: 'afe013', year: 1400, title: '大津巴布韦鼎盛', description: '大津巴布韦城达到鼎盛，石造城墙高达11米，控制着东南非洲的黄金和象牙贸易。', category: 'architecture', region: 'south-africa', significance: 2 },
  { id: 'afe014', year: 1464, title: '桑海帝国', description: '桑尼·阿里征服廷巴克图和杰内，建立了西非历史上最大的桑海帝国，面积超过今天的西欧。', category: 'history', region: 'mali', significance: 2, figure: '桑尼·阿里' },
  { id: 'afe015', year: 1530, title: '廷巴克图大学', description: '廷巴克图的桑科雷清真寺大学拥有数十万册手稿，是中世纪世界最重要的学术中心之一。', category: 'literature', region: 'mali', significance: 2 },

  // ── 近现代 ────────────────────────────────────
  { id: 'afe016', year: 1818, title: '祖鲁王国', description: '恰卡·祖鲁统一了南非东部的祖鲁各部落，建立了强大的军事王国，创造了新的战术体系。', category: 'warfare', region: 'south-africa', significance: 2, figure: '恰卡' },
  { id: 'afe017', year: 1896, title: '阿杜瓦战役', description: '埃塞俄比亚在阿杜瓦击败意大利侵略军，成为非洲唯一成功抵抗欧洲殖民的国家，极大地鼓舞了全球反殖民运动。', category: 'warfare', region: 'ethiopia', significance: 3 },
  { id: 'afe018', year: 1960, title: '尼日利亚独立', description: '尼日利亚从英国独立，成为非洲人口最多的国家，此后经历了内战和石油繁荣。', category: 'history', region: 'nigeria', significance: 2 },
  { id: 'afe019', year: 2002, title: '非洲联盟成立', description: '非洲联盟在亚的斯亚贝巴正式成立，取代非洲统一组织，推动非洲大陆的政治经济一体化。', category: 'history', region: 'ethiopia', significance: 2 },
  { id: 'afe020', year: -4000, title: '非洲：人类的摇篮', description: '非洲是现代人类（Homo sapiens）的起源地。20万年前的化石发现于今埃塞俄比亚和摩洛哥。从非洲出发，人类用了数万年走遍全球每一个角落。', category: 'science', region: 'ethiopia', significance: 3 },
]
