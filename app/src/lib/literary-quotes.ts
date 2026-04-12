/**
 * 经典诗句/引文数据库
 * 基于事件 ID 或关键词匹配，为文学类事件（尤其诗歌）提供代表性原文引用
 */

export interface LiteraryQuote {
  text: string
  source: string
  translation?: string
}

/** 按事件 ID 精确匹配的引用 */
const QUOTES_BY_ID: Record<string, LiteraryQuote[]> = {
  // 诗经
  poe001: [
    { text: '关关雎鸠，在河之洲。\n窈窕淑女，君子好逑。', source: '《诗经·关雎》' },
    { text: '蒹葭苍苍，白露为霜。\n所谓伊人，在水一方。', source: '《诗经·蒹葭》' },
  ],
  // 离骚/屈原
  poe003: [
    { text: '路漫漫其修远兮，吾将上下而求索。', source: '屈原《离骚》' },
    { text: '长太息以掩涕兮，哀民生之多艰。', source: '屈原《离骚》' },
  ],
  // 苏轼
  poe005: [
    { text: '大江东去，浪淘尽，千古风流人物。', source: '苏轼《念奴娇·赤壁怀古》' },
    { text: '但愿人长久，千里共婵娟。', source: '苏轼《水调歌头》' },
  ],
  // 鲁米
  poe006: [
    { text: 'The wound is the place where the Light enters you.', source: 'Rumi', translation: '伤口是光进入你内心的地方。' },
  ],
  // 莎翁十四行诗
  poe008: [
    { text: 'Shall I compare thee to a summer\'s day?\nThou art more lovely and more temperate.', source: 'Shakespeare, Sonnet 18', translation: '我能否将你比作夏日？\n你比夏日更可爱更温润。' },
  ],
  // 松尾芭蕉
  poe009: [
    { text: '古池や蛙飛び込む水の音', source: '松尾芭蕉', translation: '古池塘，青蛙跳入，水之声。' },
  ],
  // 惠特曼
  poe011: [
    { text: 'I celebrate myself, and sing myself,\nAnd what I assume you shall assume.', source: 'Walt Whitman, "Song of Myself"', translation: '我歌颂自己，歌唱自己，\n我所承受的你也将承受。' },
  ],
  // 泰戈尔
  poe012: [
    { text: 'Where the mind is without fear\nand the head is held high...', source: 'Rabindranath Tagore, Gitanjali', translation: '在那里，心是无畏的，\n头也抬得高高...' },
  ],
  // 艾略特
  poe013: [
    { text: 'April is the cruellest month, breeding\nLilacs out of the dead land.', source: 'T.S. Eliot, "The Waste Land"', translation: '四月是最残忍的月份，从死去的\n土地里滋生丁香。' },
  ],
  // 金斯堡
  poe014: [
    { text: 'I saw the best minds of my generation\ndestroyed by madness.', source: 'Allen Ginsberg, "Howl"', translation: '我看见这一代最优秀的头脑\n被疯狂所毁。' },
  ],
  // 李白/杜甫
  cn010: [
    { text: '君不见黄河之水天上来，奔流到海不复回。', source: '李白《将进酒》' },
    { text: '国破山河在，城春草木深。', source: '杜甫《春望》' },
  ],
  // 唐诗
  e062: [
    { text: '海内存知己，天涯若比邻。', source: '王勃《送杜少府之任蜀州》' },
    { text: '春眠不觉晓，处处闻啼鸟。', source: '孟浩然《春晓》' },
  ],
  // 但丁
  lit001: [
    { text: 'Nel mezzo del cammin di nostra vita\nmi ritrovai per una selva oscura.', source: 'Dante, Inferno I', translation: '在人生旅程的半途中，\n我发现自己置身于一片幽暗的森林。' },
  ],
  // 莎士比亚
  lit002: [
    { text: 'To be, or not to be, that is the question.', source: 'Shakespeare, Hamlet', translation: '生存还是毁灭，这是个问题。' },
    { text: 'What\'s in a name? That which we call a rose\nBy any other name would smell as sweet.', source: 'Shakespeare, Romeo and Juliet', translation: '名字有什么关系？我们叫做玫瑰的，\n换个名字一样芬芳。' },
  ],
  // 堂吉诃德
  lit003: [
    { text: 'En un lugar de la Mancha, de cuyo nombre\nno quiero acordarme...', source: 'Cervantes, Don Quixote', translation: '在拉曼恰的一个地方，\n我不愿提起它的名字...' },
  ],
  // 卡夫卡
  lit004: [
    { text: 'Als Gregor Samsa eines Morgens aus unruhigen\nTräumen erwachte, fand er sich in seinem Bett\nzu einem ungeheuren Ungeziefer verwandelt.', source: 'Kafka, Die Verwandlung', translation: '一天早晨，格里高尔·萨姆沙从不安的\n梦中醒来，发现自己变成了一只巨大的甲虫。' },
  ],
  // 鲁迅
  lit008: [
    { text: '横眉冷对千夫指，俯首甘为孺子牛。', source: '鲁迅《自嘲》' },
    { text: '不在沉默中爆发，就在沉默中灭亡。', source: '鲁迅《记念刘和珍君》' },
  ],
  // 四大体裁
  sj001: [{ text: '呦呦鹿鸣，食野之苹。\n我有嘉宾，鼓瑟吹笙。', source: '《诗经·鹿鸣》' }],
  sj002: [{ text: '知我者，谓我心忧；\n不知我者，谓我何求。', source: '《诗经·黍离》' }],
  ts001: [{ text: '落霞与孤鹜齐飞，秋水共长天一色。', source: '王勃《滕王阁序》' }],
  ts002: [{ text: '故人西辞黄鹤楼，烟花三月下扬州。', source: '李白《送孟浩然之广陵》' }],
  ts003: [{ text: '感时花溅泪，恨别鸟惊心。', source: '杜甫《春望》' }],
  ts004: [{ text: '空山新雨后，天气晚来秋。\n明月松间照，清泉石上流。', source: '王维《山居秋暝》' }],
  ts005: [{ text: '在天愿作比翼鸟，在地愿为连理枝。', source: '白居易《长恨歌》' }],
  sc001: [{ text: '今宵酒醒何处？杨柳岸，晓风残月。', source: '柳永《雨霖铃》' }],
  sc002: [{ text: '大江东去，浪淘尽，千古风流人物。', source: '苏轼《念奴娇·赤壁怀古》' }],
  sc003: [{ text: '寻寻觅觅，冷冷清清，\n凄凄惨惨戚戚。', source: '李清照《声声慢》' }],
  sc004: [{ text: '醉里挑灯看剑，梦回吹角连营。', source: '辛弃疾《破阵子》' }],
  sc005: [{ text: '死去元知万事空，但悲不见九州同。', source: '陆游《示儿》' }],
  yq001: [{ text: '地也，你不分好歹何为地！\n天也，你错勘贤愚枉做天！', source: '关汉卿《窦娥冤》' }],
  yq002: [{ text: '枯藤老树昏鸦，小桥流水人家，\n古道西风瘦马。', source: '马致远《天净沙·秋思》' }],
  yq003: [{ text: '愿天下有情人终成眷属。', source: '王实甫《西厢记》' }],
  yq004: [{ text: '原来姹紫嫣红开遍，\n似这般都付与断井颓垣。', source: '汤显祖《牡丹亭》' }],
}

/** 按标题关键词模糊匹配的引用（当 ID 精确匹配失败时使用） */
const QUOTES_BY_KEYWORD: Array<{ keywords: string[]; quotes: LiteraryQuote[] }> = [
  {
    keywords: ['荷马', '伊利亚特', '奥德赛'],
    quotes: [{ text: 'Sing, O goddess, the anger of Achilles...', source: 'Homer, Iliad', translation: '歌唱吧，女神，阿喀琉斯的愤怒...' }],
  },
  {
    keywords: ['维吉尔', '埃涅阿斯'],
    quotes: [{ text: 'Arma virumque cano...', source: 'Virgil, Aeneid', translation: '我歌唱武器与英雄...' }],
  },
  {
    keywords: ['悲惨世界', '雨果'],
    quotes: [{ text: 'Even the darkest night will end\nand the sun will rise.', source: 'Victor Hugo, Les Mis\u00E9rables', translation: '即使最黑暗的夜也会结束，\n太阳将会升起。' }],
  },
  {
    keywords: ['战争与和平', '托尔斯泰'],
    quotes: [{ text: 'The highest wisdom has but one science\n\u2014 the science of the whole.', source: 'Leo Tolstoy, War and Peace', translation: '最高的智慧只有一门科学——\n关于整体的科学。' }],
  },
  {
    keywords: ['红楼梦', '曹雪芹'],
    quotes: [{ text: '满纸荒唐言，一把辛酸泪。\n都云作者痴，谁解其中味？', source: '曹雪芹《红楼梦》' }],
  },
  {
    keywords: ['尤利西斯', '乔伊斯'],
    quotes: [{ text: 'yes I said yes I will Yes.', source: 'James Joyce, Ulysses', translation: '是的我说是的我愿意 是的。' }],
  },
  {
    keywords: ['百年孤独', '马尔克斯'],
    quotes: [{ text: 'Many years later, as he faced the firing squad,\nColonel Aureliano Buend\u00EDa was to remember\nthat distant afternoon...', source: 'Gabriel Garc\u00EDa M\u00E1rquez', translation: '多年以后，面对行刑队，\n奥雷里亚诺·布恩迪亚上校将会回想起\n那个遥远的下午...' }],
  },
  {
    keywords: ['源氏物语', '紫式部'],
    quotes: [{ text: '人の親の心は闇にあらねども\n子を思ふ道に惑ひぬるかな', source: '紫式部《源氏物语》', translation: '为人父母心虽非暗\n却在思子之路上迷失方向' }],
  },
  {
    keywords: ['九歌'],
    quotes: [{ text: '帝子降兮北渚，目眇眇兮愁予。', source: '屈原《九歌·湘夫人》' }],
  },
  {
    keywords: ['西区故事', 'West Side'],
    quotes: [{ text: 'Tonight, tonight, the world is full of light...', source: 'West Side Story', translation: '今夜，今夜，世界满是光芒...' }],
  },
  {
    keywords: ['歌剧魅影', 'Phantom'],
    quotes: [{ text: 'The Phantom of the Opera is there,\ninside my mind...', source: 'The Phantom of the Opera', translation: '歌剧院的魅影就在那里，\n在我心中...' }],
  },
  {
    keywords: ['汉密尔顿', 'Hamilton'],
    quotes: [{ text: 'I am not throwing away my shot!', source: 'Hamilton', translation: '我不会放弃我的机会！' }],
  },
  {
    keywords: ['悲惨世界', 'Les Mis'],
    quotes: [{ text: 'Do you hear the people sing?\nSinging the song of angry men?', source: 'Les Mis\u00E9rables (Musical)', translation: '你听到人民在歌唱吗？\n那是愤怒者的歌声。' }],
  },
]

/**
 * 为事件查找匹配的经典引用
 * 优先精确 ID 匹配，再尝试关键词匹配
 */
export function findQuotesForEvent(event: { id: string; title: string; description: string; category: string }): LiteraryQuote[] {
  // 仅对文学和音乐类事件生成引用
  if (event.category !== 'literature' && event.category !== 'music') return []

  // ID 精确匹配
  const byId = QUOTES_BY_ID[event.id]
  if (byId && byId.length > 0) return byId

  // 关键词匹配
  const combined = `${event.title} ${event.description}`
  for (const entry of QUOTES_BY_KEYWORD) {
    if (entry.keywords.some(kw => combined.includes(kw))) {
      return entry.quotes
    }
  }

  return []
}
