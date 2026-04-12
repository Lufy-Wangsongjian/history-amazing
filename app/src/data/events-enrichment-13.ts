import type { HistoricalEvent } from './types'

// ============================================================
// 事件丰富度扩充包 Part 13
// 诗歌里程碑 + 音乐剧里程碑
// ============================================================

export const poetryEvents: HistoricalEvent[] = [
  { id: 'poe001', year: -1000, title: '《诗经》编纂', description: '中国最早的诗歌总集，收录 305 篇从西周初年到春秋中叶的诗歌，是中华文明最古老的文学遗产。', category: 'literature', region: 'china', significance: 3 },
  { id: 'poe002', year: -600, title: '萨福与莱斯博斯岛诗歌', description: '古希腊女诗人萨福创作了大量抒情诗，被柏拉图称为"第十缪斯"。', category: 'literature', region: 'greece', significance: 2, figure: '萨福' },
  { id: 'poe003', year: -340, title: '屈原《离骚》', description: '战国楚国诗人屈原创作长篇抒情诗《离骚》，开创了中国浪漫主义诗歌传统。', category: 'literature', region: 'china', significance: 3, figure: '屈原' },
  { id: 'poe004', year: 19, title: '维吉尔《埃涅阿斯纪》', description: '罗马诗人维吉尔创作的民族史诗，叙述特洛伊英雄埃涅阿斯建立罗马的旅程。', category: 'literature', region: 'italy', significance: 2, figure: '维吉尔' },
  { id: 'poe005', year: 1094, title: '苏轼词作巅峰', description: '苏轼以"大江东去"为代表的豪放词开创了宋词新境界，与李清照的婉约词共同构成宋词双峰。', category: 'literature', region: 'china', significance: 3, figure: '苏轼' },
  { id: 'poe006', year: 1273, title: '鲁米《玛斯纳维》', description: '波斯苏菲派诗人鲁米创作了六卷本诗集，被誉为"东方的但丁"，其诗歌至今在西方畅销。', category: 'literature', region: 'iran', significance: 3, figure: '鲁米' },
  { id: 'poe007', year: 1374, title: '彼特拉克十四行诗', description: '彼特拉克的《歌集》确立了十四行诗（Sonnet）的经典形式，被称为"抒情诗之父"。', category: 'literature', region: 'italy', significance: 2, figure: '彼特拉克' },
  { id: 'poe008', year: 1609, title: '莎士比亚十四行诗出版', description: '莎士比亚 154 首十四行诗出版，探讨时间、美、爱与死亡，是英语诗歌的巅峰之作。', category: 'literature', region: 'uk', significance: 2, figure: '莎士比亚' },
  { id: 'poe009', year: 1689, title: '松尾芭蕉与俳句', description: '日本俳圣松尾芭蕉开创了以"古池蛙跳水"为代表的俳句艺术，以 17 个音节捕捉永恒瞬间。', category: 'literature', region: 'japan', significance: 2, figure: '松尾芭蕉' },
  { id: 'poe010', year: 1798, title: '《抒情歌谣集》与浪漫主义诗歌', description: '华兹华斯和柯尔律治合作出版《抒情歌谣集》，宣告了英国浪漫主义诗歌运动的诞生。', category: 'literature', region: 'uk', significance: 2, figure: '华兹华斯' },
  { id: 'poe011', year: 1855, title: '惠特曼《草叶集》', description: '沃尔特·惠特曼出版自由体诗集《草叶集》，打破传统格律，被誉为"美国诗歌之父"。', category: 'literature', region: 'usa', significance: 3, figure: '惠特曼' },
  { id: 'poe012', year: 1913, title: '泰戈尔获诺贝尔文学奖', description: '印度诗人泰戈尔凭《吉檀迦利》成为亚洲首位诺贝尔文学奖得主，东方诗歌首次获得世界承认。', category: 'literature', region: 'india', significance: 3, figure: '泰戈尔' },
  { id: 'poe013', year: 1922, title: 'T.S.艾略特《荒原》', description: '艾略特发表现代主义长诗《荒原》，碎片化叙事和大量典故开创了诗歌的新纪元。', category: 'literature', region: 'uk', significance: 3, figure: 'T.S.艾略特' },
  { id: 'poe014', year: 1956, title: '金斯堡《嚎叫》与垮掉一代', description: '艾伦·金斯堡朗诵《嚎叫》，垮掉一代诗人用狂野的韵律挑战战后美国的保守文化。', category: 'literature', region: 'usa', significance: 2, figure: '金斯堡' },
  { id: 'poe015', year: 1996, title: '维斯瓦娃·辛波斯卡获诺贝尔奖', description: '波兰女诗人辛波斯卡以"诗意的精确"获诺贝尔奖，她用日常语言写出了存在的惊奇。', category: 'literature', region: 'poland', significance: 2, figure: '辛波斯卡' },
]

export const musicalTheaterEvents: HistoricalEvent[] = [
  { id: 'mst001', year: 1728, title: '《乞丐歌剧》', description: '约翰·盖伊创作的讽刺歌剧，用民间小调嘲笑上流社会，是音乐剧的重要先驱。', category: 'music', region: 'uk', significance: 2, figure: '约翰·盖伊' },
  { id: 'mst002', year: 1866, title: '《黑钩子》·美国音乐剧诞生', description: '纽约上演长达五小时的《黑钩子》，融合歌唱、舞蹈和壮观布景，被视为美国音乐剧的开端。', category: 'music', region: 'usa', significance: 2 },
  { id: 'mst003', year: 1927, title: '《演艺船》', description: '杰罗姆·科恩和奥斯卡·汉默斯坦二世的《演艺船》首次将严肃社会议题融入音乐剧叙事。', category: 'music', region: 'usa', significance: 2, figure: '汉默斯坦二世' },
  { id: 'mst004', year: 1957, title: '《西区故事》', description: '伯恩斯坦作曲、桑德海姆填词，将莎士比亚《罗密欧与朱丽叶》搬到纽约街头帮派战争中。', category: 'music', region: 'usa', significance: 3, figure: '伯恩斯坦' },
  { id: 'mst005', year: 1971, title: '《耶稣基督超级巨星》', description: '安德鲁·劳埃德·韦伯和蒂姆·赖斯的摇滚音乐剧，将宗教题材与流行音乐结合。', category: 'music', region: 'uk', significance: 2, figure: '韦伯' },
  { id: 'mst006', year: 1975, title: '《歌舞线上》', description: '百老汇最长寿的音乐剧之一（至1990年），以舞者选角的幕后故事致敬百老汇本身。', category: 'music', region: 'usa', significance: 2 },
  { id: 'mst007', year: 1981, title: '《猫》', description: '韦伯根据 T.S.艾略特诗集创作，连演 21 年，《回忆》成为音乐剧史上最著名的歌曲之一。', category: 'music', region: 'uk', significance: 3, figure: '韦伯' },
  { id: 'mst008', year: 1986, title: '《歌剧魅影》', description: '韦伯创作的史上最卖座音乐剧，百老汇连演超过 13,000 场，全球票房超 60 亿美元。', category: 'music', region: 'uk', significance: 3, figure: '韦伯' },
  { id: 'mst009', year: 1985, title: '《悲惨世界》音乐剧版', description: '勋伯格和鲍伯利将雨果巨著搬上音乐剧舞台，"Do You Hear the People Sing"成为全球传唱的自由之歌。', category: 'music', region: 'uk', significance: 3, figure: '勋伯格' },
  { id: 'mst010', year: 1996, title: '《芝加哥》复排', description: '鲍勃·福斯风格的《芝加哥》复排大获成功，成为百老汇最长寿的复排音乐剧。', category: 'music', region: 'usa', significance: 2 },
  { id: 'mst011', year: 2015, title: '《汉密尔顿》', description: '林-曼努尔·米兰达用嘻哈音乐讲述美国国父的故事，彻底颠覆了音乐剧的形式和观众群体。', category: 'music', region: 'usa', significance: 3, figure: '米兰达' },
  { id: 'mst012', year: 2003, title: '《魔法坏女巫》', description: '斯蒂芬·施瓦茨创作的《魔法坏女巫》从"绿女巫"视角重述《绿野仙踪》，成为 21 世纪最卖座的百老汇原创音乐剧之一。', category: 'music', region: 'usa', significance: 2, figure: '施瓦茨' },
]
