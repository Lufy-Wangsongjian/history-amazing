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
  // ═══ 科学家 ═══
  h005: [{ text: '给我一个支点，我就能撬动整个地球。', source: '阿基米德' }],
  h006: [{ text: 'Eureka! Eureka!', source: 'Archimedes', translation: '我发现了！我发现了！' }],
  // ═══ 音乐 ═══
  mus008: [{ text: 'Without music, life would be a mistake.', source: 'Friedrich Nietzsche', translation: '没有音乐，人生就是一个错误。' }],
  mus003: [{ text: 'Music is the universal language of mankind.', source: 'Henry Wadsworth Longfellow', translation: '音乐是人类的通用语言。' }],
  // ═══ 哲学家 ═══
  e042: [{ text: '未经审视的人生不值得活。', source: '苏格拉底' }],
  e041: [{ text: '己所不欲，勿施于人。', source: '孔子《论语·颜渊》' }],
  e044: [{ text: '吾爱吾师，吾更爱真理。', source: '亚里士多德' }],
  // ═══ 宗教经典 ═══
  e037: [{ text: '色即是空，空即是色。', source: '《般若波罗蜜多心经》' }],
  // ═══ 战争 ═══
  e056: [{ text: '兵者，国之大事，死生之地，存亡之道，不可不察也。', source: '《孙子兵法》' }],
  // ═══ 经济 ═══
  e065: [{ text: 'It is not from the benevolence of the butcher, the brewer, or the baker that we expect our dinner.', source: 'Adam Smith', translation: '我们的晚餐并非来自屠夫、酿酒师或面包师的恩惠。' }],
  // ═══ 美国历史演说 ═══
  us005: [{ text: 'The shot heard round the world.', source: 'Ralph Waldo Emerson, "Concord Hymn"', translation: '响彻世界的一枪。' }],
  us007: [{ text: 'We the People of the United States, in Order to form a more perfect Union...', source: 'U.S. Constitution, Preamble', translation: '我们合众国人民，为建设一个更完善的联邦...' }],
  us020: [{ text: 'And so, my fellow Americans: ask not what your country can do for you — ask what you can do for your country.', source: 'John F. Kennedy, Inaugural Address, 1961', translation: '不要问你的国家能为你做什么——问你能为你的国家做什么。' }],
  us018: [{ text: '...that this nation, under God, shall have a new birth of freedom — and that government of the people, by the people, for the people, shall not perish from the earth.', source: 'Abraham Lincoln, Gettysburg Address, 1863', translation: '......这个国家在上帝的护佑下，将获得自由的新生——而那民有、民治、民享的政府，永远不会从地球上消失。' }],
  // ═══ 美国文学 ═══
  us015: [{ text: 'So we beat on, boats against the current, borne back ceaselessly into the past.', source: 'F. Scott Fitzgerald, The Great Gatsby', translation: '于是我们奋力前行，逆水行舟，不断被浪潮推回到过去。' }],
  us022: [{ text: 'The report of my death was an exaggeration.', source: 'Mark Twain', translation: '关于我的死亡的报道过于夸张了。' },
    { text: 'Whenever you find yourself on the side of the majority, it is time to pause and reflect.', source: 'Mark Twain', translation: '每当你发现自己站在多数人那一边时，就该停下来反思了。' }],
  // ═══ 拉美文学 ═══
  la013: [
    { text: 'Muchos años después, frente al pelotón de fusilamiento, el coronel Aureliano Buendía había de recordar aquella tarde remota en que su padre lo llevó a conocer el hielo.', source: 'Gabriel García Márquez, Cien años de soledad', translation: '多年以后，面对行刑队，奥雷里亚诺·布恩迪亚上校将会回想起父亲带他去见识冰块的那个遥远的下午。' },
    { text: 'La vida no es la que uno vivió, sino la que uno recuerda y cómo la recuerda para contarla.', source: 'Gabriel García Márquez', translation: '生活不是我们活过的日子，而是我们记住的日子，以及我们为了讲述它而记住它的方式。' },
  ],
  la014: [
    { text: 'Puedo escribir los versos más tristes esta noche.', source: 'Pablo Neruda, Veinte poemas de amor', translation: '今夜我可以写下最悲伤的诗句。' },
    { text: 'You can cut all the flowers but you cannot keep Spring from coming.', source: 'Pablo Neruda', translation: '你可以摘掉所有的花，但你无法阻止春天的到来。' },
  ],
  la015: [{ text: 'I have always imagined that Paradise will be a kind of library.', source: 'Jorge Luis Borges', translation: '我一直想象天堂应该是某种图书馆的样子。' }],
  la011: [{ text: 'Hasta la victoria siempre.', source: 'Ernesto "Che" Guevara', translation: '直到胜利，永远。' }],
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
  // ═══ 哲学 ═══
  {
    keywords: ['苏格拉底'],
    quotes: [{ text: 'The unexamined life is not worth living.', source: 'Socrates (Apology)', translation: '未经审视的人生不值得过。' }],
  },
  {
    keywords: ['柏拉图', '理想国'],
    quotes: [{ text: 'The measure of a man is what he does with power.', source: 'Plato (Republic)', translation: '衡量一个人的标准，是看他拥有权力时怎样行事。' }],
  },
  {
    keywords: ['亚里士多德'],
    quotes: [{ text: 'We are what we repeatedly do. Excellence, then, is not an act, but a habit.', source: 'Aristotle', translation: '我们重复做的事造就了我们。因此，卓越不是行为，而是习惯。' }],
  },
  {
    keywords: ['孔子', '论语'],
    quotes: [{ text: '三人行，必有我师焉。', source: '《论语·述而》' }],
  },
  {
    keywords: ['老子', '道德经'],
    quotes: [{ text: '道可道，非常道。名可名，非常名。', source: '《道德经·第一章》' }],
  },
  {
    keywords: ['庄子'],
    quotes: [{ text: '昔者庄周梦为蝴蝶，栩栩然蝴蝶也。', source: '《庄子·齐物论》' }],
  },
  {
    keywords: ['康德'],
    quotes: [{ text: 'Two things fill the mind with ever new and increasing admiration and awe: the starry heavens above me and the moral law within me.', source: 'Immanuel Kant (Critique of Practical Reason)', translation: '有两样东西令我越思索越充满敬畏——头顶的星空和心中的道德律。' }],
  },
  {
    keywords: ['尼采'],
    quotes: [{ text: 'He who has a why to live can bear almost any how.', source: 'Friedrich Nietzsche', translation: '知道为什么而活的人，几乎可以忍受一切。' }],
  },
  {
    keywords: ['马克思'],
    quotes: [{ text: 'Philosophers have hitherto only interpreted the world; the point is to change it.', source: 'Karl Marx (Theses on Feuerbach)', translation: '哲学家们只是用不同的方式解释世界，而问题在于改变世界。' }],
  },
  {
    keywords: ['波伏瓦', '存在主义'],
    quotes: [{ text: 'One is not born, but rather becomes, a woman.', source: 'Simone de Beauvoir (The Second Sex)', translation: '女人不是天生的，而是后天成为的。' }],
  },
  // ═══ 科学 ═══
  {
    keywords: ['爱因斯坦', '相对论'],
    quotes: [{ text: 'Imagination is more important than knowledge. Knowledge is limited. Imagination encircles the world.', source: 'Albert Einstein', translation: '想象力比知识更重要。知识是有限的，想象力则环绕世界。' }],
  },
  {
    keywords: ['牛顿', '引力', '万有引力'],
    quotes: [{ text: 'If I have seen further, it is by standing on the shoulders of giants.', source: 'Isaac Newton', translation: '如果我看得更远，那是因为站在巨人的肩膀上。' }],
  },
  {
    keywords: ['达尔文', '进化', '物种起源'],
    quotes: [{ text: 'There is grandeur in this view of life, with its several powers, having been originally breathed into a few forms or into one.', source: 'Charles Darwin (On the Origin of Species)', translation: '生命的这种观点有一种壮丽——几种或一种原初形式被赋予了生命力。' }],
  },
  {
    keywords: ['哥白尼', '日心说'],
    quotes: [{ text: 'Finally we shall place the Sun himself at the center of the Universe.', source: 'Nicolaus Copernicus (De Revolutionibus)', translation: '最终我们应将太阳置于宇宙的中心。' }],
  },
  {
    keywords: ['伽利略', '望远镜'],
    quotes: [{ text: 'E pur si muove.', source: 'Galileo Galilei (attributed)', translation: '可是它确实在动啊。' }],
  },
  {
    keywords: ['居里', '放射性'],
    quotes: [{ text: 'Nothing in life is to be feared, it is only to be understood.', source: 'Marie Curie', translation: '生活中没有什么可怕的，只有需要理解的。' }],
  },
  {
    keywords: ['图灵', '计算机', 'Enigma'],
    quotes: [{ text: 'We can only see a short distance ahead, but we can see plenty there that needs to be done.', source: 'Alan Turing', translation: '我们只能看到前方不远处，但已经能看到那里有大量需要做的事。' }],
  },
  {
    keywords: ['DNA', '双螺旋', '基因组'],
    quotes: [{ text: 'We have discovered the secret of life.', source: 'Francis Crick (1953)', translation: '我们发现了生命的秘密。' }],
  },
  // ═══ 宗教 ═══
  {
    keywords: ['佛陀', '释迦牟尼', '佛教', '悟道'],
    quotes: [{ text: '诸行无常，是生灭法。\n生灭灭已，寂灭为乐。', source: '《大般涅槃经》' }],
  },
  {
    keywords: ['耶稣', '基督', '圣经'],
    quotes: [{ text: 'Love your neighbor as yourself.', source: 'Jesus Christ (Mark 12:31)', translation: '要爱人如己。' }],
  },
  {
    keywords: ['穆罕默德', '伊斯兰', '古兰经'],
    quotes: [{ text: 'Read! In the name of your Lord who created.', source: 'Quran 96:1', translation: '你应当奉你的创造主的名义而宣读。' }],
  },
  // ═══ 现代世界文学 ═══
  {
    keywords: ['马尔克斯', '百年孤独'],
    quotes: [{ text: '多年以后，面对行刑队，奥雷里亚诺·布恩迪亚上校将会回想起父亲带他去见识冰块的那个遥远的下午。', source: '加西亚·马尔克斯《百年孤独》' }],
  },
  {
    keywords: ['博尔赫斯'],
    quotes: [{ text: '我心里一直都在暗暗设想，天堂应该是图书馆的模样。', source: 'Jorge Luis Borges', translation: '' }],
  },
  {
    keywords: ['雨果', '悲惨世界'],
    quotes: [{ text: '世界上最广阔的是海洋，比海洋更广阔的是天空，比天空更广阔的是人的心灵。', source: '雨果《悲惨世界》' }],
  },
  {
    keywords: ['托尔斯泰', '战争与和平', '安娜'],
    quotes: [{ text: '幸福的家庭都是相似的，不幸的家庭各有各的不幸。', source: '托尔斯泰《安娜·卡列尼娜》' }],
  },
  {
    keywords: ['普鲁斯特', '追忆'],
    quotes: [{ text: 'The real voyage of discovery consists not in seeking new landscapes, but in having new eyes.', source: 'Marcel Proust', translation: '真正的发现之旅，不在于寻找新的风景，而在于拥有新的眼光。' }],
  },
  {
    keywords: ['加缪', '局外人', '荒诞'],
    quotes: [{ text: 'In the midst of winter, I found there was, within me, an invincible summer.', source: 'Albert Camus', translation: '在隆冬，我终于发现，在我心中有一个不可战胜的夏天。' }],
  },
  // ═══ 历史与政治名言 ═══
  {
    keywords: ['独立宣言', '杰斐逊'],
    quotes: [{ text: 'We hold these truths to be self-evident, that all men are created equal.', source: 'Thomas Jefferson (Declaration of Independence)', translation: '我们认为这些真理是不言而喻的：人人生而平等。' }],
  },
  {
    keywords: ['甘地', '非暴力'],
    quotes: [{ text: 'Be the change that you wish to see in the world.', source: 'Mahatma Gandhi', translation: '成为你希望在世界上看到的改变。' }],
  },
  {
    keywords: ['曼德拉', '种族隔离'],
    quotes: [{ text: 'It always seems impossible until it is done.', source: 'Nelson Mandela', translation: '事情在完成之前，总看起来不可能。' }],
  },
  {
    keywords: ['马丁·路德·金', '民权', 'I have a dream'],
    quotes: [{ text: 'I have a dream that one day this nation will rise up and live out the true meaning of its creed.', source: 'Martin Luther King Jr. (1963)', translation: '我有一个梦想，有一天这个国家会站起来，实现其信条的真正含义。' }],
  },
  {
    keywords: ['丘吉尔', '二战'],
    quotes: [{ text: 'We shall fight on the beaches, we shall fight on the landing grounds, we shall never surrender.', source: 'Winston Churchill (1940)', translation: '我们将在海滩上战斗，我们将在登陆场上战斗，我们永不投降。' }],
  },
  // ═══ 技术与发明 ═══
  {
    keywords: ['马克·吐温', 'Mark Twain', '哈克贝利', '汤姆·索亚'],
    quotes: [
      { text: 'All modern American literature comes from one book by Mark Twain called Huckleberry Finn.', source: 'Ernest Hemingway', translation: '所有现代美国文学都来自马克·吐温的一本书，叫《哈克贝利·费恩历险记》。' },
      { text: 'The secret of getting ahead is getting started.', source: 'Mark Twain', translation: '领先的秘诀是开始行动。' },
    ],
  },
  {
    keywords: ['狄金森', 'Dickinson', '艾米莉'],
    quotes: [
      { text: 'Because I could not stop for Death —\nHe kindly stopped for me —', source: 'Emily Dickinson', translation: '因为我无法为死亡停步——\n他便善意地为我停留——' },
      { text: 'I dwell in Possibility —\nA fairer House than Prose —', source: 'Emily Dickinson', translation: '我住在可能性里——\n一栋比散文更美的房子——' },
    ],
  },
  {
    keywords: ['蒸汽机', '瓦特'],
    quotes: [{ text: 'I can think of nothing else but this machine.', source: 'James Watt', translation: '我满脑子想的都是这台机器。' }],
  },
  {
    keywords: ['爱迪生', '电灯', '电力'],
    quotes: [{ text: 'I have not failed. I have just found 10,000 ways that will not work.', source: 'Thomas Edison', translation: '我没有失败过，我只是发现了一万种行不通的方法。' }],
  },
  {
    keywords: ['莱特兄弟', '飞行', '飞机'],
    quotes: [{ text: 'If we worked on the assumption that what is accepted as true really is true, then there would be little hope for advance.', source: 'Orville Wright', translation: '如果我们以被接受的真理作为前提，那进步就没什么希望了。' }],
  },
  {
    keywords: ['古腾堡', '印刷', '活字'],
    quotes: [{ text: 'It is a press, certainly, but a press from which shall flow in inexhaustible streams the most abundant and most marvelous liquor that has ever flowed to relieve the thirst of men.', source: 'Johannes Gutenberg', translation: '这是一台印刷机，但从中将涌出最丰富、最奇妙的甘泉，来解人类对知识的渴求。' }],
  },
  {
    keywords: ['乔布斯', 'iPhone', '苹果'],
    quotes: [{ text: 'Stay hungry, stay foolish.', source: 'Steve Jobs (2005)', translation: '求知若饥，虚心若愚。' }],
  },
  {
    keywords: ['互联网', '万维网', 'ARPANET'],
    quotes: [{ text: 'The Web as I envisaged it, we have not seen it yet. The future is still so much bigger than the past.', source: 'Tim Berners-Lee', translation: '我设想的网络，我们还未真正看到。未来远比过去广阔。' }],
  },
  {
    keywords: ['特斯拉', '交流电'],
    quotes: [{ text: 'The present is theirs; the future, for which I really worked, is mine.', source: 'Nikola Tesla', translation: '现在是他们的；而我真正为之工作的未来，是属于我的。' }],
  },
  {
    keywords: ['火药', '造纸', '指南针'],
    quotes: [{ text: '这三种发明已经在世界范围内把事物的全部面貌和情况都改变了。', source: '弗朗西斯·培根《新工具》' }],
  },
  {
    keywords: ['铁路', '蒸汽机车', '火车'],
    quotes: [{ text: 'What can be more palpably absurd than the prospect held out of locomotives traveling twice as fast as stagecoaches?', source: 'The Quarterly Review (1825)', translation: '还有什么比机车跑得比马车快两倍的前景更荒谬的？' }],
  },
  {
    keywords: ['电报', '莫尔斯'],
    quotes: [{ text: 'What hath God wrought!', source: 'First telegraph message (1844)', translation: '上帝创造了什么奇迹！' }],
  },
  {
    keywords: ['核能', '核反应', '原子弹', '曼哈顿'],
    quotes: [{ text: 'Now I am become Death, the destroyer of worlds.', source: 'J. Robert Oppenheimer (1945)', translation: '现在我成了死神，世界的毁灭者。' }],
  },
  {
    keywords: ['人工智能', 'ChatGPT', 'AlphaGo', 'AI'],
    quotes: [{ text: 'The question of whether machines can think is about as relevant as the question of whether submarines can swim.', source: 'Edsger Dijkstra', translation: '机器能否思考这个问题，就像问潜水艇能否游泳一样。' }],
  },
  // ═══ 探索与地理发现 ═══
  {
    keywords: ['哥伦布', '新大陆'],
    quotes: [{ text: 'You can never cross the ocean until you have the courage to lose sight of the shore.', source: 'Christopher Columbus', translation: '你永远无法横渡大洋，除非你有勇气让海岸消失在视线中。' }],
  },
  {
    keywords: ['麦哲伦', '环球'],
    quotes: [{ text: 'The sea is dangerous and its storms terrible, but these obstacles have never been sufficient reason to remain ashore.', source: 'Ferdinand Magellan', translation: '大海是危险的，风暴是可怕的，但这些障碍从来不是留在岸上的充分理由。' }],
  },
  {
    keywords: ['郑和', '下西洋'],
    quotes: [{ text: '欲国家富强，不可置海洋于不顾。', source: '（明代航海思想）' }],
  },
  {
    keywords: ['登月', '阿波罗', '阿姆斯特朗'],
    quotes: [{ text: "That's one small step for man, one giant leap for mankind.", source: 'Neil Armstrong (1969)', translation: '这是个人的一小步，却是人类的一大步。' }],
  },
  {
    keywords: ['加加林', '太空'],
    quotes: [{ text: 'I see Earth! It is so beautiful!', source: 'Yuri Gagarin (1961)', translation: '我看到了地球！她真美！' }],
  },
  {
    keywords: ['南极', '探险', '沙克尔顿'],
    quotes: [{ text: 'Difficulties are just things to overcome, after all.', source: 'Ernest Shackleton', translation: '困难不过是需要克服的东西罢了。' }],
  },
  {
    keywords: ['哈勃', '望远镜', '宇宙膨胀'],
    quotes: [{ text: 'Equipped with his five senses, man explores the universe around him and calls the adventure Science.', source: 'Edwin Hubble', translation: '凭借五种感官，人探索周围的宇宙，并将这种冒险称为科学。' }],
  },
  {
    keywords: ['丝绸之路', '张骞'],
    quotes: [{ text: '凿空西域，通天下之利。', source: '（汉代评张骞通西域）' }],
  },
  // ═══ 医学 ═══
  {
    keywords: ['希波克拉底', '医学之父'],
    quotes: [{ text: 'First, do no harm.', source: 'Hippocrates', translation: '首先，不要伤害。' }],
  },
  {
    keywords: ['疫苗', '詹纳', '天花'],
    quotes: [{ text: 'The deviation of man from the state in which he was originally placed by nature seems to have proved to him a prolific source of diseases.', source: 'Edward Jenner', translation: '人类偏离了自然赋予的原始状态，这似乎成了疾病的丰富来源。' }],
  },
  {
    keywords: ['青霉素', '弗莱明'],
    quotes: [{ text: 'One sometimes finds what one is not looking for.', source: 'Alexander Fleming', translation: '人有时会发现自己并未寻找的东西。' }],
  },
  {
    keywords: ['黑死病', '鼠疫', '瘟疫'],
    quotes: [{ text: 'In the year of our Lord 1348, the deadly plague broke out in the great city of Florence.', source: 'Giovanni Boccaccio, Decameron', translation: '在主的1348年，致命的瘟疫在佛罗伦萨爆发。' }],
  },
  {
    keywords: ['DNA双螺旋', '沃森', '克里克'],
    quotes: [{ text: 'It has not escaped our notice that the specific pairing we have postulated immediately suggests a possible copying mechanism for the genetic material.', source: 'Watson & Crick (1953)', translation: '我们注意到，我们假设的特定配对立即暗示了遗传物质的可能复制机制。' }],
  },
  {
    keywords: ['华佗', '扁鹊', '黄帝内经'],
    quotes: [{ text: '上医治未病，中医治欲病，下医治已病。', source: '《黄帝内经》' }],
  },
  // ═══ 建筑 ═══
  {
    keywords: ['金字塔', '法老', '吉萨'],
    quotes: [{ text: 'Man fears Time, but Time fears the Pyramids.', source: 'Arab proverb', translation: '人惧怕时间，但时间惧怕金字塔。' }],
  },
  {
    keywords: ['巴特农', '帕特农', '雅典'],
    quotes: [{ text: 'What makes a building is not the walls but the spaces in between.', source: '（古希腊建筑思想）', translation: '建筑不在于墙壁，而在于空间。' }],
  },
  {
    keywords: ['哥特', '教堂', '圣母院'],
    quotes: [{ text: 'Architecture is frozen music.', source: 'Johann Wolfgang von Goethe', translation: '建筑是凝固的音乐。' }],
  },
  {
    keywords: ['紫禁城', '故宫'],
    quotes: [{ text: '九千九百九十九间半，天下第一宫。', source: '（民间对紫禁城的描述）' }],
  },
  {
    keywords: ['万里长城', '长城'],
    quotes: [{ text: '不到长城非好汉。', source: '毛泽东《清平乐·六盘山》' }],
  },
  {
    keywords: ['埃菲尔铁塔'],
    quotes: [{ text: 'I ought to be jealous of the tower. She is more famous than I am.', source: 'Gustave Eiffel', translation: '我应该嫉妒那座塔，她比我还出名。' }],
  },
  // ═══ 艺术 ═══
  {
    keywords: ['达芬奇', '蒙娜丽莎', '文艺复兴'],
    quotes: [{ text: 'Art is never finished, only abandoned.', source: 'Leonardo da Vinci', translation: '艺术永远不会完成，只会被放弃。' }],
  },
  {
    keywords: ['米开朗基罗', '西斯廷', '大卫'],
    quotes: [{ text: 'I saw the angel in the marble and carved until I set him free.', source: 'Michelangelo', translation: '我在大理石中看到了天使，于是不停雕刻直到将他释放。' }],
  },
  {
    keywords: ['毕加索', '立体主义'],
    quotes: [{ text: 'Every child is an artist. The problem is how to remain an artist once we grow up.', source: 'Pablo Picasso', translation: '每个孩子都是艺术家，问题是长大后如何保持艺术家的身份。' }],
  },
  {
    keywords: ['梵高', '星夜', '向日葵'],
    quotes: [{ text: 'I dream my painting and I paint my dream.', source: 'Vincent van Gogh', translation: '我梦见我的画，然后画出我的梦。' }],
  },
  {
    keywords: ['莫奈', '印象派'],
    quotes: [{ text: 'Color is my day-long obsession, joy and torment.', source: 'Claude Monet', translation: '色彩是我整日的痴迷、欢乐和折磨。' }],
  },
  {
    keywords: ['杜尚', '现代艺术', '泉'],
    quotes: [{ text: 'I am interested in ideas, not merely in visual products.', source: 'Marcel Duchamp', translation: '我感兴趣的是观念，而不仅仅是视觉产品。' }],
  },
  {
    keywords: ['浮世绘', '葛饰北斋'],
    quotes: [{ text: '七十三年的画业中，我六十岁以前所画的东西都不值一提。', source: '葛饰北斋' }],
  },
  {
    keywords: ['敦煌', '壁画', '石窟'],
    quotes: [{ text: '大漠深处藏绝世，千佛洞中见人间。', source: '（敦煌题咏）' }],
  },
  // ═══ 哲学补充 ═══
  {
    keywords: ['康德', '纯粹理性'],
    quotes: [{ text: 'Two things fill the mind with ever new and increasing admiration: the starry heavens above me and the moral law within me.', source: 'Immanuel Kant', translation: '有两件事物让我心中常怀越来越新的惊叹：头顶的星空和内心的道德律。' }],
  },
  {
    keywords: ['尼采', '超人', '查拉图斯特拉'],
    quotes: [{ text: 'He who has a why to live can bear almost any how.', source: 'Friedrich Nietzsche', translation: '知道为什么而活的人，几乎可以忍受任何生活方式。' }],
  },
  {
    keywords: ['黑格尔', '辩证法'],
    quotes: [{ text: 'The only thing we learn from history is that we learn nothing from history.', source: 'Georg Wilhelm Friedrich Hegel', translation: '我们从历史中学到的唯一教训是：我们从未从历史中学到任何教训。' }],
  },
  {
    keywords: ['马克思', '共产主义宣言', '资本论'],
    quotes: [{ text: 'The philosophers have only interpreted the world; the point is to change it.', source: 'Karl Marx', translation: '哲学家们只是用不同的方式解释世界，而问题在于改变世界。' }],
  },
  {
    keywords: ['老子', '道德经', '道家'],
    quotes: [{ text: '道可道，非常道。名可名，非常名。', source: '老子《道德经》' }],
  },
  {
    keywords: ['庄子', '逍遥游', '蝴蝶'],
    quotes: [{ text: '昔者庄周梦为蝴蝶，栩栩然蝴蝶也。', source: '《庄子·齐物论》' }],
  },
  {
    keywords: ['笛卡尔', '方法论'],
    quotes: [{ text: 'Cogito, ergo sum.', source: 'Rene Descartes', translation: '我思故我在。' }],
  },
  {
    keywords: ['伏尔泰', '启蒙'],
    quotes: [{ text: 'I disapprove of what you say, but I will defend to the death your right to say it.', source: '(attributed to Voltaire)', translation: '我不同意你说的话，但我誓死捍卫你说话的权利。' }],
  },
  {
    keywords: ['卢梭', '社会契约'],
    quotes: [{ text: 'Man is born free, and everywhere he is in chains.', source: 'Jean-Jacques Rousseau', translation: '人生而自由，却无往不在枷锁之中。' }],
  },
  // ═══ 科学补充 ═══
  {
    keywords: ['哥白尼', '日心说'],
    quotes: [{ text: 'Finally we shall place the Sun himself at the center of the Universe.', source: 'Nicolaus Copernicus', translation: '最终，我们将太阳本身置于宇宙的中心。' }],
  },
  {
    keywords: ['伽利略', '天文', '望远镜'],
    quotes: [{ text: 'And yet it moves!', source: 'Galileo Galilei (attributed)', translation: '但它仍然在转！' }],
  },
  {
    keywords: ['牛顿', '万有引力', '运动定律'],
    quotes: [{ text: 'If I have seen further, it is by standing on the shoulders of giants.', source: 'Isaac Newton', translation: '如果我看得更远，那是因为我站在了巨人的肩膀上。' }],
  },
  {
    keywords: ['居里夫人', '镭', '放射性'],
    quotes: [{ text: 'Nothing in life is to be feared, it is only to be understood.', source: 'Marie Curie', translation: '生活中没有什么是可怕的，只需要去理解。' }],
  },
  {
    keywords: ['霍金', '时间简史', '黑洞'],
    quotes: [{ text: 'However difficult life may seem, there is always something you can do and succeed at.', source: 'Stephen Hawking', translation: '无论生活看起来多么困难，总有你能做的和可以成功的事情。' }],
  },
  {
    keywords: ['费曼', '量子'],
    quotes: [{ text: 'If you think you understand quantum mechanics, you do not understand quantum mechanics.', source: 'Richard Feynman', translation: '如果你认为你理解了量子力学，那你就没有理解量子力学。' }],
  },
  // ═══ 战争与军事补充 ═══
  {
    keywords: ['孙子', '孙武', '兵法'],
    quotes: [{ text: '知彼知己，百战不殆。', source: '《孙子兵法》' }],
  },
  {
    keywords: ['拿破仑', '滑铁卢'],
    quotes: [{ text: 'History is a set of lies agreed upon.', source: 'Napoleon Bonaparte', translation: '历史是一组被一致同意的谎言。' }],
  },
  {
    keywords: ['亚历山大', '大帝'],
    quotes: [{ text: 'There is nothing impossible to him who will try.', source: 'Alexander the Great', translation: '对敢于尝试的人来说，没有什么是不可能的。' }],
  },
  {
    keywords: ['凯撒', '罗马'],
    quotes: [{ text: 'Veni, vidi, vici.', source: 'Julius Caesar', translation: '我来，我见，我征服。' }],
  },
  {
    keywords: ['诺曼底', 'D-Day', '艾森豪威尔'],
    quotes: [{ text: 'The eyes of the world are upon you.', source: 'Dwight D. Eisenhower (June 6, 1944)', translation: '全世界的目光都注视着你们。' }],
  },
  // ═══ 宗教补充 ═══
  {
    keywords: ['宗教改革', '路德', '九十五条'],
    quotes: [{ text: 'Here I stand. I can do no other. God help me.', source: 'Martin Luther (1521)', translation: '我站在这里，别无选择。求上帝帮助我。' }],
  },
  {
    keywords: ['犹太教', '摩西', '出埃及'],
    quotes: [{ text: 'Let my people go.', source: 'Moses (Exodus 5:1)', translation: '让我的人民离去。' }],
  },
  {
    keywords: ['达摩', '禅宗', '少林'],
    quotes: [{ text: '不立文字，教外别传，直指人心，见性成佛。', source: '禅宗纲要' }],
  },
  // ═══ 历史补充 ═══
  {
    keywords: ['秦始皇', '统一', '焚书'],
    quotes: [{ text: '六王毕，四海一。', source: '杜牧《阿房宫赋》' }],
  },
  {
    keywords: ['法国大革命', '巴士底', '自由平等'],
    quotes: [{ text: 'Liberty, Equality, Fraternity.', source: 'French Revolution motto', translation: '自由、平等、博爱。' }],
  },
  {
    keywords: ['柏林墙', '冷战结束'],
    quotes: [{ text: 'Mr. Gorbachev, tear down this wall!', source: 'Ronald Reagan (1987)', translation: '戈尔巴乔夫先生，拆掉这堵墙！' }],
  },
  {
    keywords: ['联合国', '人权宣言'],
    quotes: [{ text: 'All human beings are born free and equal in dignity and rights.', source: 'Universal Declaration of Human Rights (1948)', translation: '人人生而自由，在尊严和权利上一律平等。' }],
  },
  {
    keywords: ['司马迁', '史记'],
    quotes: [{ text: '究天人之际，通古今之变，成一家之言。', source: '司马迁《报任安书》' }],
  },
  // ═══ 更多科学与技术 ═══
  {
    keywords: ['相对论', '光速'],
    quotes: [{ text: 'Imagination is more important than knowledge.', source: 'Albert Einstein', translation: '想象力比知识更重要。' }],
  },
  {
    keywords: ['进化论', '物种起源', '达尔文'],
    quotes: [{ text: 'It is not the strongest of the species that survives, nor the most intelligent, but the one most responsive to change.', source: 'Charles Darwin (attributed)', translation: '能生存下来的不是最强的物种，也不是最聪明的，而是最能适应变化的。' }],
  },
  {
    keywords: ['门捷列夫', '元素周期表'],
    quotes: [{ text: 'I saw in a dream a table where all elements fell into place as required.', source: 'Dmitri Mendeleev', translation: '我在梦中看到一张表，所有元素都按要求各就其位。' }],
  },
  {
    keywords: ['巴斯德', '消毒', '微生物'],
    quotes: [{ text: 'In the fields of observation, chance favors only the prepared mind.', source: 'Louis Pasteur', translation: '在观察的领域中，机遇只青睐有准备的头脑。' }],
  },
  {
    keywords: ['拉瓦锡', '化学', '氧气'],
    quotes: [{ text: 'Nothing is lost, nothing is created, everything is transformed.', source: 'Antoine Lavoisier', translation: '什么都不会消失，什么都不会创造，一切都在转化。' }],
  },
  {
    keywords: ['法拉第', '电磁'],
    quotes: [{ text: 'Nothing is too wonderful to be true, if it be consistent with the laws of nature.', source: 'Michael Faraday', translation: '只要符合自然法则，再奇妙的事也可能是真的。' }],
  },
  // ═══ 更多世界文学 ═══
  {
    keywords: ['陀思妥耶夫斯基', '罪与罚', '卡拉马佐夫'],
    quotes: [{ text: '美将拯救世界。', source: '陀思妥耶夫斯基《白痴》' }],
  },
  {
    keywords: ['狄更斯', '双城记', '雾都孤儿'],
    quotes: [{ text: 'It was the best of times, it was the worst of times.', source: 'Charles Dickens, A Tale of Two Cities', translation: '那是最好的时代，那是最坏的时代。' }],
  },
  {
    keywords: ['海明威', '老人与海'],
    quotes: [{ text: 'A man can be destroyed but not defeated.', source: 'Ernest Hemingway, The Old Man and the Sea', translation: '一个人可以被毁灭，但不能被打败。' }],
  },
  {
    keywords: ['奥威尔', '1984', '动物庄园'],
    quotes: [{ text: 'All animals are equal, but some animals are more equal than others.', source: 'George Orwell, Animal Farm', translation: '所有动物一律平等，但有些动物比其他动物更平等。' }],
  },
  {
    keywords: ['歌德', '浮士德'],
    quotes: [{ text: 'Whatever you can do or dream you can, begin it. Boldness has genius, power and magic in it.', source: 'Johann Wolfgang von Goethe', translation: '无论你能做什么，或梦想做什么，开始去做吧。勇气中蕴含天赋、力量和魔力。' }],
  },
  {
    keywords: ['村上春树'],
    quotes: [{ text: '每个人都有属于自己的一片森林，也许我们从来不曾去过，但它一直在那里，总会在那里。', source: '村上春树《挪威的森林》' }],
  },
  {
    keywords: ['川端康成', '雪国'],
    quotes: [{ text: '穿过县界长长的隧道，便是雪国。', source: '川端康成《雪国》' }],
  },
  // ═══ 更多音乐 ═══
  {
    keywords: ['贝多芬', '交响', '命运'],
    quotes: [{ text: 'Music is a higher revelation than all wisdom and philosophy.', source: 'Ludwig van Beethoven', translation: '音乐是比一切智慧和哲学更高的启示。' }],
  },
  {
    keywords: ['莫扎特'],
    quotes: [{ text: 'The music is not in the notes, but in the silence between.', source: 'Wolfgang Amadeus Mozart', translation: '音乐不在音符中，而在音符之间的寂静中。' }],
  },
  {
    keywords: ['巴赫'],
    quotes: [{ text: 'The aim and final end of all music should be none other than the glory of God and the refreshment of the soul.', source: 'Johann Sebastian Bach', translation: '一切音乐的目的和最终归宿，除了荣耀上帝和灵魂的振奋之外，别无其他。' }],
  },
  {
    keywords: ['披头士', 'Beatles', '列侬'],
    quotes: [{ text: 'All you need is love.', source: 'The Beatles (1967)', translation: '你所需要的只是爱。' }],
  },
  {
    keywords: ['鲍勃·迪伦', 'Dylan'],
    quotes: [{ text: 'The times they are a-changin.', source: 'Bob Dylan (1964)', translation: '时代在变。' }],
  },
  // ═══ 更多探索与发现 ═══
  {
    keywords: ['达伽马', '好望角', '印度航路'],
    quotes: [{ text: 'Following the light of the sun, we left the Old World.', source: '(Age of Exploration spirit)', translation: '追随太阳的光芒，我们离开了旧世界。' }],
  },
  {
    keywords: ['马可波罗', '东方见闻'],
    quotes: [{ text: 'I have not told half of what I saw.', source: 'Marco Polo', translation: '我所讲述的还不到我所见的一半。' }],
  },
  {
    keywords: ['旅行者号', '深空'],
    quotes: [{ text: 'Look again at that dot. That is here. That is home. That is us.', source: 'Carl Sagan (Pale Blue Dot)', translation: '再看看那个小点。那就是这里。那就是家。那就是我们。' }],
  },
  // ═══ 更多医学 ═══
  {
    keywords: ['南丁格尔', '护理'],
    quotes: [{ text: 'I attribute my success to this: I never gave or took any excuse.', source: 'Florence Nightingale', translation: '我将我的成功归因于此：我从不给出或接受任何借口。' }],
  },
  {
    keywords: ['巴甫洛夫', '条件反射'],
    quotes: [{ text: 'Learn, compare, collect the facts!', source: 'Ivan Pavlov', translation: '学习、比较、收集事实！' }],
  },
  // ═══ 更多历史 ═══
  {
    keywords: ['鸦片战争', '南京条约'],
    quotes: [{ text: '落后就要挨打。', source: '（近代中国的历史反思）' }],
  },
  {
    keywords: ['辛亥革命', '孙中山'],
    quotes: [{ text: '天下为公。', source: '孙中山题词' }],
  },
  {
    keywords: ['十月革命', '列宁'],
    quotes: [{ text: 'There are decades where nothing happens; and there are weeks where decades happen.', source: 'Vladimir Lenin', translation: '有些十年什么都没发生，有些星期却发生了十年的事。' }],
  },
  {
    keywords: ['工业革命', '工厂'],
    quotes: [{ text: 'The hand-mill gives you society with the feudal lord; the steam-mill, society with the industrial capitalist.', source: 'Karl Marx', translation: '手推磨产生的是封建主的社会，蒸汽磨产生的是工业资本家的社会。' }],
  },
  // ═══ 第四批扩充：目标 250+ 条 ═══
  // ── 中国文化 ──
  {
    keywords: ['甲骨文', '商朝文字'],
    quotes: [{ text: '惟殷先人，有册有典。', source: '《尚书·多士》' }],
  },
  {
    keywords: ['大运河', '隋朝'],
    quotes: [{ text: '尽道隋亡为此河，至今千里赖通波。', source: '皮日休《汴河怀古》' }],
  },
  {
    keywords: ['造纸', '蔡伦'],
    quotes: [{ text: '纸为文之用，犹翼之于鸟也。', source: '（蔡伦造纸相关文献）' }],
  },
  {
    keywords: ['科举', '考试'],
    quotes: [{ text: '天下英雄尽入吾彀中矣。', source: '唐太宗（谈科举）' }],
  },
  {
    keywords: ['本草纲目', '李时珍'],
    quotes: [{ text: '读万卷书不如行万里路，行万里路不如阅人无数。', source: '（明代学者格言）' }],
  },
  {
    keywords: ['兵马俑', '秦始皇陵'],
    quotes: [{ text: '六王毕，四海一，蜀山兀，阿房出。', source: '杜牧《阿房宫赋》' }],
  },
  {
    keywords: ['紫禁城', '故宫', '明朝'],
    quotes: [{ text: '九天阊阖开宫殿，万国衣冠拜冕旒。', source: '王维《和贾舍人早朝》' }],
  },
  {
    keywords: ['五四', '新文化'],
    quotes: [{ text: '自己背着因袭的重担，肩住了黑暗的闸门，放他们到宽阔光明的地方去。', source: '鲁迅《我们现在怎样做父亲》' }],
  },
  // ── 日本文化 ──
  {
    keywords: ['源氏物语', '紫式部'],
    quotes: [{ text: '人の親の心は闇にあらねども子を思ふ道に惑ひぬるかな', source: '紫式部《源氏物语》', translation: '为人父母心虽非暗，却在思子之路上迷失方向。' }],
  },
  {
    keywords: ['武士道', '侍', '切腹'],
    quotes: [{ text: '武士道者，死之谓也。', source: '山本常朝《叶隐》', translation: '所谓武士道，就是看透死亡。' }],
  },
  {
    keywords: ['明治维新'],
    quotes: [{ text: '脱亚入欧，为当今之急务。', source: '福泽谕吉', translation: '' }],
  },
  // ── 印度文化 ──
  {
    keywords: ['吠陀', '印度教', '梵'],
    quotes: [{ text: 'Tat tvam asi.', source: 'Chandogya Upanishad', translation: '你即是那。' }],
  },
  {
    keywords: ['阿育王', '孔雀王朝'],
    quotes: [{ text: '以法治世，以德化民。', source: '阿育王石柱法敕（大意）' }],
  },
  // ── 阿拉伯与波斯 ──
  {
    keywords: ['一千零一夜', '天方夜谭'],
    quotes: [{ text: '世上每一个人，都有属于自己的故事。', source: '《一千零一夜》' }],
  },
  {
    keywords: ['花剌子密', '代数'],
    quotes: [{ text: 'Al-jabr wa al-muqabala.', source: 'Al-Khwarizmi', translation: '还原与对消（"代数"一词的词源）。' }],
  },
  {
    keywords: ['伊本·西那', '阿维森纳', '医典'],
    quotes: [{ text: 'Medicine is the art of removing or averting what is evil in the body.', source: 'Avicenna (Canon of Medicine)', translation: '医学是去除或避免身体中邪恶之物的艺术。' }],
  },
  // ── 非洲文化 ──
  {
    keywords: ['曼德拉', '南非'],
    quotes: [{ text: 'Education is the most powerful weapon which you can use to change the world.', source: 'Nelson Mandela', translation: '教育是你可以用来改变世界的最强大武器。' }],
  },
  {
    keywords: ['廷巴克图', '桑海'],
    quotes: [{ text: 'Salt comes from the north, gold from the south, and the word of God and the treasures of wisdom from Timbuktu.', source: 'West African proverb', translation: '盐来自北方，金来自南方，上帝的话语和智慧的宝藏来自廷巴克图。' }],
  },
  {
    keywords: ['阿契贝', '瓦解'],
    quotes: [{ text: 'Until the lions have their own historians, the history of the hunt will always glorify the hunter.', source: 'Chinua Achebe', translation: '在狮子拥有自己的历史学家之前，狩猎的故事永远只会颂扬猎人。' }],
  },
  // ── 拉美文化 ──
  {
    keywords: ['聂鲁达'],
    quotes: [{ text: 'I want to do with you what spring does with the cherry trees.', source: 'Pablo Neruda', translation: '我想对你做春天对樱桃树做的事。' }],
  },
  {
    keywords: ['博尔赫斯', '迷宫', '图书馆'],
    quotes: [{ text: '我心里一直都在暗暗设想，天堂应该是图书馆的模样。', source: 'Jorge Luis Borges' }],
  },
  {
    keywords: ['切·格瓦拉', '革命'],
    quotes: [{ text: 'Be realistic, demand the impossible.', source: 'Ernesto Che Guevara', translation: '做一个现实主义者，去追求不可能。' }],
  },
  // ── 建筑补充 ──
  {
    keywords: ['包豪斯', '现代建筑'],
    quotes: [{ text: 'Less is more.', source: 'Ludwig Mies van der Rohe', translation: '少即是多。' }],
  },
  {
    keywords: ['安藤忠雄', '清水混凝土'],
    quotes: [{ text: 'Architecture is about creating a space where people can experience the beauty of nature.', source: 'Tadao Ando', translation: '建筑是创造一个让人体验自然之美的空间。' }],
  },
  {
    keywords: ['赖特', '流水别墅', '有机建筑'],
    quotes: [{ text: 'The mother art is architecture. Without an architecture of our own we have no soul of our own civilization.', source: 'Frank Lloyd Wright', translation: '建筑是所有艺术之母。没有属于自己的建筑，文明就没有灵魂。' }],
  },
  {
    keywords: ['大教堂', '圣母院', '巴黎'],
    quotes: [{ text: 'Architecture is frozen music.', source: 'Johann Wolfgang von Goethe', translation: '建筑是凝固的音乐。' }],
  },
  // ── 医学补充 ──
  {
    keywords: ['手术', '麻醉', '外科'],
    quotes: [{ text: 'The physician treats, but nature heals.', source: 'Hippocrates', translation: '医生治疗，自然愈合。' }],
  },
  {
    keywords: ['公共卫生', '流行病', '霍乱'],
    quotes: [{ text: 'The cause of plague is one thing — the conditions that allow it to spread are another.', source: '(Public health principle)', translation: '瘟疫的起因是一回事，让它传播的条件是另一回事。' }],
  },
  {
    keywords: ['基因编辑', 'CRISPR'],
    quotes: [{ text: 'We are playing God in the best sense of the word.', source: 'Jennifer Doudna', translation: '我们在以最好的方式扮演上帝。' }],
  },
  // ── 探索与航海补充 ──
  {
    keywords: ['库克船长', '太平洋'],
    quotes: [{ text: 'Ambition leads me not only farther than any other man has been before me, but as far as I think it possible for man to go.', source: 'James Cook', translation: '雄心引领我不仅走得比任何人都远，而且远到我认为人类所能抵达的极限。' }],
  },
  {
    keywords: ['哥白尼', '日心'],
    quotes: [{ text: 'In the center of all rests the Sun. Who would place this lamp in another or better place than the center?', source: 'Nicolaus Copernicus', translation: '在万物的中心安坐着太阳。谁会把这盏灯放在比中心更好的位置呢？' }],
  },
  {
    keywords: ['火星', '探测', '好奇号'],
    quotes: [{ text: 'Mars has been flown by, orbited, smacked into, radar-examined, and rocketed onto, as well as bounced upon, rolled over, shoveled, drilled into, baked and even lased.', source: 'NASA', translation: '火星被飞掠、环绕、撞击、雷达探测、火箭着陆，还被弹跳、滚轮碾过、铲挖、钻探、烘烤甚至激光照射。' }],
  },
  // ── 战争与和平 ──
  {
    keywords: ['珍珠港', 'Pearl Harbor'],
    quotes: [{ text: 'December 7, 1941 — a date which will live in infamy.', source: 'Franklin D. Roosevelt', translation: '1941年12月7日——一个将永远被铭记为耻辱的日子。' }],
  },
  {
    keywords: ['广岛', '长崎', '原子弹'],
    quotes: [{ text: 'Now I am become Death, the destroyer of worlds.', source: 'J. Robert Oppenheimer', translation: '现在我成了死神，世界的毁灭者。' }],
  },
  {
    keywords: ['联合国成立'],
    quotes: [{ text: 'We the peoples of the United Nations determined to save succeeding generations from the scourge of war.', source: 'UN Charter', translation: '我们联合国人民决心使后世免于战争的祸害。' }],
  },
  {
    keywords: ['冷战', '铁幕'],
    quotes: [{ text: 'An iron curtain has descended across the Continent.', source: 'Winston Churchill (1946)', translation: '一道铁幕已经在欧洲大陆降下。' }],
  },
  // ── 哲学补充 ──
  {
    keywords: ['维特根斯坦', '逻辑'],
    quotes: [{ text: 'Whereof one cannot speak, thereof one must be silent.', source: 'Ludwig Wittgenstein', translation: '对于不能说的东西，必须保持沉默。' }],
  },
  {
    keywords: ['萨特', '存在'],
    quotes: [{ text: 'Existence precedes essence.', source: 'Jean-Paul Sartre', translation: '存在先于本质。' }],
  },
  {
    keywords: ['阿伦特', '极权'],
    quotes: [{ text: 'The sad truth is that most evil is done by people who never make up their minds to be good or evil.', source: 'Hannah Arendt', translation: '可悲的真相是，大多数恶行是由那些从未决定做好人还是坏人的人所为。' }],
  },
  {
    keywords: ['孟子'],
    quotes: [{ text: '故天将降大任于是人也，必先苦其心志，劳其筋骨。', source: '《孟子·告子下》' }],
  },
  {
    keywords: ['荀子'],
    quotes: [{ text: '不积跬步，无以至千里；不积小流，无以成江海。', source: '荀子《劝学》' }],
  },
  {
    keywords: ['墨子', '兼爱'],
    quotes: [{ text: '兼相爱，交相利。', source: '《墨子·兼爱》' }],
  },
  {
    keywords: ['韩非子', '法家'],
    quotes: [{ text: '事在四方，要在中央。', source: '《韩非子》' }],
  },
  // ── 科学补充 ──
  {
    keywords: ['薛定谔', '量子', '猫'],
    quotes: [{ text: 'I do not like it, and I am sorry I ever had anything to do with it.', source: 'Erwin Schrodinger (on quantum mechanics)', translation: '我不喜欢它，我很遗憾曾与之有任何关联。' }],
  },
  {
    keywords: ['波尔', '原子'],
    quotes: [{ text: 'An expert is a person who has made all the mistakes that can be made in a very narrow field.', source: 'Niels Bohr', translation: '专家是在一个很窄的领域犯过所有可能犯的错误的人。' }],
  },
  {
    keywords: ['普朗克', '量子'],
    quotes: [{ text: 'Science cannot solve the ultimate mystery of nature. And that is because, in the last analysis, we ourselves are a part of the mystery that we are trying to solve.', source: 'Max Planck', translation: '科学无法解开自然的终极奥秘，因为归根结底，我们自己就是我们试图解开的奥秘的一部分。' }],
  },
  {
    keywords: ['特斯拉', '交流电', '电磁'],
    quotes: [{ text: 'The present is theirs; the future, for which I really worked, is mine.', source: 'Nikola Tesla', translation: '现在是他们的；而我真正为之奋斗的未来，是属于我的。' }],
  },
  // ── 音乐补充 ──
  {
    keywords: ['肖邦', '钢琴', '波兰'],
    quotes: [{ text: 'Simplicity is the final achievement. After one has played a vast quantity of notes, it is simplicity that emerges as the crowning reward of art.', source: 'Frederic Chopin', translation: '简约是最终的成就。在弹奏了大量音符之后，简约作为艺术的最高回报浮现出来。' }],
  },
  {
    keywords: ['柴可夫斯基', '芭蕾', '天鹅湖'],
    quotes: [{ text: 'Inspiration is a guest that does not willingly visit the lazy.', source: 'Pyotr Ilyich Tchaikovsky', translation: '灵感是一位不愿拜访懒惰者的客人。' }],
  },
  {
    keywords: ['德彪西', '印象主义音乐'],
    quotes: [{ text: 'Music is the silence between the notes.', source: 'Claude Debussy', translation: '音乐是音符之间的寂静。' }],
  },
  {
    keywords: ['鲍勃·马利', '雷鬼', 'reggae'],
    quotes: [{ text: 'One good thing about music, when it hits you, you feel no pain.', source: 'Bob Marley', translation: '音乐有个好处：当它击中你时，你感觉不到疼痛。' }],
  },
  // ── 现代世界 ──
  {
    keywords: ['全球化', '世界贸易'],
    quotes: [{ text: 'The world is flat.', source: 'Thomas Friedman', translation: '世界是平的。' }],
  },
  {
    keywords: ['气候变化', '全球变暖', '环保'],
    quotes: [{ text: 'We do not inherit the earth from our ancestors; we borrow it from our children.', source: 'Native American proverb', translation: '我们不是从祖先那里继承了地球，而是从孩子那里借用了它。' }],
  },
  {
    keywords: ['太空站', '国际空间站'],
    quotes: [{ text: 'When you look at the Earth from space, you do not see borders.', source: 'Astronaut observation', translation: '当你从太空看地球时，你看不到国界。' }],
  },
  {
    keywords: ['民主', '选举', '投票'],
    quotes: [{ text: 'Democracy is the worst form of government except for all the others that have been tried.', source: 'Winston Churchill', translation: '民主是最不坏的政府形式——除了所有其他被尝试过的形式之外。' }],
  },
  {
    keywords: ['诺贝尔', '和平奖'],
    quotes: [{ text: 'If I have a thousand ideas and only one turns out to be good, I am satisfied.', source: 'Alfred Nobel', translation: '如果我有一千个想法，其中只有一个是好的，我就满足了。' }],
  },
  {
    keywords: ['印刷', '谷登堡'],
    quotes: [{ text: 'God suffers in the multitude of souls whom His word cannot reach. Religious truth is imprisoned in a small number of manuscript books.', source: 'Johannes Gutenberg', translation: '上帝因大量灵魂无法接触到他的话语而痛苦。宗教真理被囚禁在少量手抄本中。' }],
  },
  // ═══ 第五批引文：扩充至 300+ ═══
  {
    keywords: ['铁路', '火车', '蒸汽机车'],
    quotes: [{ text: 'What can be more palpably absurd than the prospect held out of locomotives travelling twice as fast as stagecoaches?', source: 'The Quarterly Review, 1825', translation: '还有什么比火车头跑到两倍马车速度的前景更荒谬的呢？' }],
  },
  {
    keywords: ['航空', '飞机', '莱特兄弟'],
    quotes: [{ text: 'The desire to fly is an idea handed down to us by our ancestors who looked enviously on the birds soaring freely through space.', source: 'Wilbur Wright', translation: '飞行的渴望是祖先传递给我们的理想——他们曾嫉妒地仰望在天空中自由翱翔的鸟儿。' }],
  },
  {
    keywords: ['音障', '超音速', '协和号'],
    quotes: [{ text: 'I was scared five years before I finally did it.', source: 'Chuck Yeager, on breaking the sound barrier', translation: '在我真正做到之前，我害怕了整整五年。' }],
  },
  {
    keywords: ['海战', '纳尔逊', '特拉法尔加'],
    quotes: [{ text: 'England expects that every man will do his duty.', source: 'Horatio Nelson, 1805', translation: '英格兰期望每个人都恪尽职守。' }],
  },
  {
    keywords: ['蒸汽船', '轮船'],
    quotes: [{ text: 'The man who can make hard things easy is the educator.', source: 'Robert Fulton', translation: '能将困难之事变得容易的人才是教育家。' }],
  },
  {
    keywords: ['密码', '图灵', 'Enigma'],
    quotes: [{ text: 'Sometimes it is the people no one imagines anything of who do the things that no one can imagine.', source: 'Alan Turing (attributed)', translation: '有时候正是那些没人看好的人，做出了没人能想象的事。' }],
  },
  {
    keywords: ['心理学', '弗洛伊德', '精神分析'],
    quotes: [{ text: 'The mind is like an iceberg; it floats with one-seventh of its bulk above water.', source: 'Sigmund Freud', translation: '心灵就像冰山，七分之一浮在水面之上。' }],
  },
  {
    keywords: ['行为主义', '巴甫洛夫'],
    quotes: [{ text: 'Don\'t become a mere recorder of facts, but try to penetrate the mystery of their origin.', source: 'Ivan Pavlov', translation: '不要只做事实的记录者，而要试图穿透其起源的奥秘。' }],
  },
  {
    keywords: ['马斯洛', '需求层次'],
    quotes: [{ text: 'What a man can be, he must be. This need we call self-actualization.', source: 'Abraham Maslow', translation: '人能成为什么，就必须成为什么。我们把这种需求称为自我实现。' }],
  },
  {
    keywords: ['社会学', '涂尔干'],
    quotes: [{ text: 'Man is a moral being only because he lives in society.', source: 'Émile Durkheim', translation: '人之所以是道德的存在，仅仅因为他生活在社会之中。' }],
  },
  {
    keywords: ['五月风暴', '1968'],
    quotes: [{ text: 'Be realistic, demand the impossible.', source: 'Slogan of May 1968, Paris', translation: '做现实主义者，要求不可能之事。' }],
  },
  {
    keywords: ['考古', '特洛伊', '谢里曼'],
    quotes: [{ text: 'I have gazed on the face of Agamemnon.', source: 'Heinrich Schliemann (attributed)', translation: '我已凝视了阿伽门农的面容。' }],
  },
  {
    keywords: ['图坦卡蒙', '法老'],
    quotes: [{ text: 'Can you see anything? Yes, wonderful things.', source: 'Howard Carter, 1922', translation: '"你能看到什么吗？""是的，奇妙的东西。"' }],
  },
  {
    keywords: ['兵马俑', '秦始皇'],
    quotes: [{ text: 'The terracotta warriors stand as silent witnesses to the first emperor\'s ambition to rule even in death.', source: 'Museum of Terracotta Warriors', translation: '兵马俑作为沉默的见证者，诉说着始皇帝即使在死后也要统治的雄心。' }],
  },
  {
    keywords: ['啤酒', '酿酒'],
    quotes: [{ text: 'Beer is proof that God loves us and wants us to be happy.', source: 'Attributed to Benjamin Franklin (likely apocryphal)', translation: '啤酒证明了上帝爱我们，希望我们幸福。' }],
  },
  {
    keywords: ['咖啡'],
    quotes: [{ text: 'Coffee is a lot more than just a drink; it\'s something happening.', source: 'Gertrude Stein', translation: '咖啡远不止是一种饮品——它是一个正在发生的事件。' }],
  },
  {
    keywords: ['方便面', '拉面'],
    quotes: [{ text: 'Peace follows from aستomach that is full.', source: 'Momofuku Ando', translation: '和平源于一个吃饱的胃。' }],
  },
  {
    keywords: ['香料', '胡椒', '达伽马'],
    quotes: [{ text: 'We came in search of Christians and spices.', source: 'Vasco da Gama, upon reaching India, 1498', translation: '我们来寻找基督徒和香料。' }],
  },
  {
    keywords: ['地图', '墨卡托'],
    quotes: [{ text: 'The world is a book, and those who do not travel read only a page.', source: 'Attributed to Saint Augustine', translation: '世界是一本书，不旅行的人只读了一页。' }],
  },
  {
    keywords: ['国际单位', '度量衡', '米制'],
    quotes: [{ text: 'Nothing is more necessary to science than a system of units that allows the comparison of measurements.', source: 'James Clerk Maxwell', translation: '没有什么比一套允许比较测量结果的单位制更为科学所必需的了。' }],
  },
  {
    keywords: ['奥运', '奥林匹克'],
    quotes: [{ text: 'The most important thing in the Olympic Games is not winning but taking part.', source: 'Pierre de Coubertin', translation: '奥林匹克运动会最重要的不是赢得胜利而是参与其中。' }],
  },
  {
    keywords: ['海底隧道', '英吉利'],
    quotes: [{ text: 'A tunnel under the sea! The idea is as old as Napoleon, but the reality belongs to the engineers of the 20th century.', source: 'Eurotunnel history archives', translation: '海底隧道！这个想法和拿破仑一样古老，但它的实现属于20世纪的工程师。' }],
  },
  {
    keywords: ['转基因', 'GMO'],
    quotes: [{ text: 'We have the power to edit the very code of life. The question is not whether we can, but whether we should.', source: 'Modern genetics discussion', translation: '我们有能力编辑生命的底层代码。问题不在于我们能不能，而在于我们应不应该。' }],
  },
  {
    keywords: ['国家公园', '黄石'],
    quotes: [{ text: 'In wildness is the preservation of the world.', source: 'Henry David Thoreau', translation: '荒野中蕴藏着对世界的保全。' }],
  },
  {
    keywords: ['保险', '风险'],
    quotes: [{ text: 'The essence of insurance is the sharing of risk.', source: 'Insurance industry maxim', translation: '保险的本质是风险的共担。' }],
  },
  {
    keywords: ['漫画', '超人', 'Superman'],
    quotes: [{ text: 'What makes Superman a hero is not that he has power, but that he has the wisdom and the maturity to use the power wisely.', source: 'Christopher Reeve', translation: '让超人成为英雄的不是他拥有力量，而是他拥有智慧和成熟来明智地使用力量。' }],
  },
  {
    keywords: ['米老鼠', '迪士尼'],
    quotes: [{ text: 'I only hope that we never lose sight of one thing — that it was all started by a mouse.', source: 'Walt Disney', translation: '我只希望我们永远不要忘记一件事——这一切都是从一只老鼠开始的。' }],
  },
  {
    keywords: ['宫崎骏', '龙猫', '吉卜力'],
    quotes: [{ text: 'I believe in the power of story. I believe that stories have an important role to play in the formation of human beings.', source: 'Hayao Miyazaki', translation: '我相信故事的力量。我相信故事在人的成长中扮演着重要角色。' }],
  },
  {
    keywords: ['博物馆', '卢浮宫'],
    quotes: [{ text: 'A museum is a place where one should lose one\'s head.', source: 'Renzo Piano', translation: '博物馆是一个应该让人忘乎所以的地方。' }],
  },
  {
    keywords: ['故宫', '紫禁城'],
    quotes: [{ text: '旧时王谢堂前燕，飞入寻常百姓家。', source: '刘禹锡《乌衣巷》', translation: '' }],
  },
  {
    keywords: ['汉谟拉比', '法典', '巴比伦'],
    quotes: [{ text: '以正义之光照耀大地，消灭一切邪恶与罪人，使强者不能压迫弱者。', source: '汉谟拉比法典序言', translation: '' }],
  },
  {
    keywords: ['丝绸', '蚕', '缫丝'],
    quotes: [{ text: '春蚕到死丝方尽，蜡炬成灰泪始干。', source: '李商隐《无题》', translation: '' }],
  },
  {
    keywords: ['瓷器', '青花', '景德镇'],
    quotes: [{ text: '大邑烧瓷轻且坚，扣如哀玉锦城传。', source: '杜甫《又于韦处乞大邑瓷碗》', translation: '' }],
  },
  {
    keywords: ['凡尔赛', '宫殿'],
    quotes: [{ text: 'L\'État, c\'est moi.', source: 'Louis XIV (attributed)', translation: '朕即国家。' }],
  },
  {
    keywords: ['核反应', '费米', '原子能'],
    quotes: [{ text: 'The Italian navigator has just landed in the new world.', source: 'Arthur Compton, coded message about first nuclear reaction, 1942', translation: '"意大利航海家刚刚抵达新大陆。"（关于首次核反应的暗语）' }],
  },
  {
    keywords: ['公钥', 'RSA', '加密'],
    quotes: [{ text: 'Privacy is not something that I\'m merely entitled to, it\'s an absolute prerequisite.', source: 'Marlon Brando', translation: '隐私不仅仅是我的权利——它是绝对的前提条件。' }],
  },
  {
    keywords: ['斯诺登', '监控', '棱镜'],
    quotes: [{ text: 'Arguing that you don\'t care about the right to privacy because you have nothing to hide is no different than saying you don\'t care about free speech because you have nothing to say.', source: 'Edward Snowden', translation: '说你不在乎隐私权因为你无事可藏，和说你不在乎言论自由因为你无话可说没有区别。' }],
  },
  {
    keywords: ['墨西哥', '壁画', '里维拉'],
    quotes: [{ text: 'I paint what I see, not what you want to see.', source: 'Diego Rivera (attributed)', translation: '我画我所见的，不是你想让我见的。' }],
  },
  {
    keywords: ['拿破仑', '法典', '民法'],
    quotes: [{ text: 'My true glory is not to have won forty battles; Waterloo will efface the memory of so many victories. But what nothing will efface, what will live forever, is my Civil Code.', source: 'Napoleon Bonaparte', translation: '我真正的光荣不在于打了四十场胜仗；滑铁卢会抹去那么多胜利的记忆。但不会被抹去的、将永远存在的，是我的民法典。' }],
  },
  {
    keywords: ['水稻', '稻作'],
    quotes: [{ text: '锄禾日当午，汗滴禾下土。谁知盘中餐，粒粒皆辛苦。', source: '李绅《悯农》', translation: '' }],
  },
  {
    keywords: ['奠边府', '越南'],
    quotes: [{ text: 'You can kill ten of our men for every one we kill of yours. But even at those odds, you will lose and we will win.', source: 'Ho Chi Minh', translation: '你可以用十倍于我们的人换命。但即使如此，你仍会输，而我们会赢。' }],
  },
  {
    keywords: ['阿尔及利亚', '独立'],
    quotes: [{ text: 'Every generation must, out of relative obscurity, discover its mission, fulfill it, or betray it.', source: 'Frantz Fanon, The Wretched of the Earth', translation: '每一代人都必须在相对的默默无闻中发现自己的使命——完成它，或者背叛它。' }],
  },
  {
    keywords: ['万有引力', '牛顿'],
    quotes: [{ text: 'If I have seen further it is by standing on the shoulders of Giants.', source: 'Isaac Newton', translation: '如果我看得更远，那是因为我站在巨人的肩膀上。' }],
  },
  {
    keywords: ['脉冲星', '中子星'],
    quotes: [{ text: 'I had to make many observations... and analyze miles of chart recordings before I was convinced that I had observed something real.', source: 'Jocelyn Bell Burnell', translation: '我不得不进行大量观测、分析数英里长的图表记录，才确信我观测到了真实的东西。' }],
  },

  // ─── 第六批：60 条新引文 ─────────────────────────────────

  // 古代与远古
  {
    keywords: ['金字塔', '胡夫', '吉萨'],
    quotes: [{ text: 'Man fears Time, yet Time fears the Pyramids.', source: 'Arab proverb', translation: '人惧怕时间，而时间惧怕金字塔。' }],
  },
  {
    keywords: ['吉尔伽美什', '乌鲁克'],
    quotes: [{ text: '他是看过深渊的人，是国土的基石。他知晓一切，他明悟万事。', source: '《吉尔伽美什史诗》（开篇）', translation: '' }],
  },
  {
    keywords: ['轮子', '美索不达米亚'],
    quotes: [{ text: 'The wheel is the greatest invention, but the brake is a close second.', source: 'attributed to various', translation: '轮子是最伟大的发明，但刹车紧随其后。' }],
  },
  {
    keywords: ['青铜', '冶金', '冶炼'],
    quotes: [{ text: 'The discovery of metals was the discovery of power itself.', source: 'V. Gordon Childe', translation: '金属的发现就是权力本身的发现。' }],
  },
  {
    keywords: ['班图', '迁徙', '非洲'],
    quotes: [{ text: 'Africa is not a country, but a continent of extraordinary diversity, and the Bantu expansion is one reason why.', source: 'John Reader, Africa: A Biography of the Continent', translation: '非洲不是一个国家，而是一个拥有非凡多样性的大陆——班图人的扩张正是原因之一。' }],
  },

  // 哲学与宗教
  {
    keywords: ['庄子', '蝴蝶'],
    quotes: [{ text: '昔者庄周梦为蝴蝶，栩栩然蝴蝶也。不知周之梦为蝴蝶与？蝴蝶之梦为周与？', source: '庄子·齐物论', translation: '' }],
  },
  {
    keywords: ['亚伯拉罕', '一神教'],
    quotes: [{ text: 'Now the Lord had said unto Abram, Get thee out of thy country, and from thy kindred, and from thy father\'s house, unto a land that I will shew thee.', source: 'Genesis 12:1', translation: '耶和华对亚伯兰说：你要离开本地、本族、父家，往我所要指示你的地去。' }],
  },
  {
    keywords: ['阿育王', '佛教传播'],
    quotes: [{ text: 'All men are my children. And just as I desire for my children that they may enjoy every kind of prosperity and happiness, so also do I desire the same for all men.', source: 'Asoka, Rock Edict VI', translation: '所有人都是我的孩子。正如我希望我的孩子享有一切繁荣和幸福，我对所有人也怀有同样的期望。' }],
  },
  {
    keywords: ['耶稣', '受难', '十字架'],
    quotes: [{ text: 'Father, forgive them, for they do not know what they are doing.', source: 'Luke 23:34', translation: '父啊，赦免他们，因为他们所做的，他们不晓得。' }],
  },
  {
    keywords: ['伊斯兰', '穆罕默德', '古兰经'],
    quotes: [{ text: 'Read! In the name of your Lord who created.', source: 'Quran 96:1 (first revelation)', translation: '你应当奉你的创造主的名义而宣读。' }],
  },

  // 帝国与战争
  {
    keywords: ['亚历山大', '东征'],
    quotes: [{ text: 'There is nothing impossible to him who will try.', source: 'Alexander the Great (attributed)', translation: '对于愿意尝试的人，没有什么是不可能的。' }],
  },
  {
    keywords: ['赤壁', '三国'],
    quotes: [{ text: '大江东去，浪淘尽，千古风流人物。', source: '苏轼《念奴娇·赤壁怀古》', translation: '' }],
  },
  {
    keywords: ['蒙古', '成吉思汗'],
    quotes: [{ text: 'I am the punishment of God. If you had not committed great sins, God would not have sent a punishment like me upon you.', source: 'Genghis Khan (attributed)', translation: '我是上天的惩罚。如果你们没有犯下大罪，上天不会派我这样的惩罚降临于你们。' }],
  },
  {
    keywords: ['阿杜瓦', '埃塞俄比亚'],
    quotes: [{ text: 'Ethiopia has need of no one. She stretches her hands unto God.', source: 'Emperor Menelik II', translation: '埃塞俄比亚不需要任何人。她向上帝伸出双手。' }],
  },
  {
    keywords: ['奥斯曼', '苏莱曼'],
    quotes: [{ text: 'The people think of wealth and power as the greatest fate, but in this world a spell of health is the best state.', source: 'Suleiman the Magnificent', translation: '人们认为财富和权力是最大的命运，但在这个世界上，健康的时光才是最好的状态。' }],
  },

  // 科学与技术
  {
    keywords: ['DNA', '双螺旋', '沃森', '克里克'],
    quotes: [{ text: 'We have discovered the secret of life.', source: 'Francis Crick (to patrons at the Eagle pub, Cambridge, 1953)', translation: '我们发现了生命的秘密。' }],
  },
  {
    keywords: ['集成电路', '芯片'],
    quotes: [{ text: 'The number of transistors in a dense integrated circuit doubles about every two years.', source: 'Gordon Moore (Moore\'s Law, 1965)', translation: '密集集成电路中的晶体管数量大约每两年翻一番。' }],
  },
  {
    keywords: ['ARPANET', '互联网前身'],
    quotes: [{ text: 'The Internet is the first thing that humanity has built that humanity doesn\'t understand.', source: 'Eric Schmidt', translation: '互联网是人类建造的第一个人类自己不理解的东西。' }],
  },
  {
    keywords: ['谷歌', '搜索'],
    quotes: [{ text: 'Google\'s mission is to organize the world\'s information and make it universally accessible and useful.', source: 'Google corporate mission statement', translation: '谷歌的使命是整合全球信息，使人人皆可访问并从中受益。' }],
  },
  {
    keywords: ['CRISPR', '基因编辑'],
    quotes: [{ text: 'We now have the power to change the very essence of who we are. The question is: should we?', source: 'Jennifer Doudna', translation: '我们现在有能力改变我们存在的本质。问题是：我们应该吗？' }],
  },
  {
    keywords: ['韦伯望远镜', 'Webb'],
    quotes: [{ text: 'Where the Hubble showed us the universe was bigger than we thought, Webb will show us it is older than we knew.', source: 'NASA', translation: '如果说哈勃告诉我们宇宙比我们以为的更大，韦伯将告诉我们宇宙比我们知道的更古老。' }],
  },
  {
    keywords: ['青霉素', '弗莱明'],
    quotes: [{ text: 'One sometimes finds what one is not looking for.', source: 'Alexander Fleming (Nobel Lecture, 1945)', translation: '人有时会找到自己并未在寻找的东西。' }],
  },
  {
    keywords: ['基因组', 'DNA测序'],
    quotes: [{ text: 'We used to think our fate was in our stars. Now we know, in large measure, our fate is in our genes.', source: 'James Watson', translation: '我们曾以为命运写在星辰里。现在我们知道，在很大程度上，命运写在基因里。' }],
  },

  // 现代政治与社会
  {
    keywords: ['独立宣言', '美国独立'],
    quotes: [{ text: 'We hold these truths to be self-evident, that all men are created equal.', source: 'United States Declaration of Independence, 1776', translation: '我们认为这些真理是不言而喻的：人人生而平等。' }],
  },
  {
    keywords: ['法国大革命', '巴士底'],
    quotes: [{ text: 'Liberty, Equality, Fraternity.', source: 'Motto of the French Republic', translation: '自由、平等、博爱。' }],
  },
  {
    keywords: ['辛亥', '孙中山'],
    quotes: [{ text: '革命尚未成功，同志仍须努力。', source: '孙中山《总理遗嘱》（1925）', translation: '' }],
  },
  {
    keywords: ['五四运动', '新文化'],
    quotes: [{ text: '德先生和赛先生——只有这两位先生可以救治中国政治上、道德上、学术上、思想上一切的黑暗。', source: '陈独秀《新青年》', translation: '' }],
  },
  {
    keywords: ['大萧条', '股市崩盘'],
    quotes: [{ text: 'The only thing we have to fear is fear itself.', source: 'Franklin D. Roosevelt, Inaugural Address, 1933', translation: '我们唯一需要恐惧的，就是恐惧本身。' }],
  },
  {
    keywords: ['二战', '世界大战', '诺曼底'],
    quotes: [{ text: 'We shall fight on the beaches, we shall fight on the landing grounds, we shall fight in the fields and in the streets, we shall never surrender.', source: 'Winston Churchill, 1940', translation: '我们将在海滩上作战，我们将在登陆场上作战，我们将在田野和街头作战，我们永不投降。' }],
  },
  {
    keywords: ['原子弹', '广岛', '核武器'],
    quotes: [{ text: 'Now I am become Death, the destroyer of worlds.', source: 'J. Robert Oppenheimer (quoting the Bhagavad Gita)', translation: '现在我成了死神，世界的毁灭者。' }],
  },
  {
    keywords: ['世界人权宣言', '人权'],
    quotes: [{ text: 'All human beings are born free and equal in dignity and rights.', source: 'Universal Declaration of Human Rights, Article 1', translation: '人人生而自由，在尊严和权利上一律平等。' }],
  },
  {
    keywords: ['联合国', '成立'],
    quotes: [{ text: 'We the peoples of the United Nations determined to save succeeding generations from the scourge of war.', source: 'UN Charter, Preamble', translation: '我联合国人民同兹决心，欲免后世再遭今代人类两度身历惨不堪言之战祸。' }],
  },
  {
    keywords: ['柏林墙', '倒塌'],
    quotes: [{ text: 'Mr. Gorbachev, tear down this wall!', source: 'Ronald Reagan, Brandenburg Gate, 1987', translation: '戈尔巴乔夫先生，拆掉这堵墙！' }],
  },
  {
    keywords: ['苏联解体', '冷战结束'],
    quotes: [{ text: 'The end of the Cold War is the end of a most extraordinary chapter in human history.', source: 'Mikhail Gorbachev', translation: '冷战的结束是人类历史上最非凡篇章的终结。' }],
  },
  {
    keywords: ['改革开放', '邓小平'],
    quotes: [{ text: '不管白猫黑猫，捉到老鼠就是好猫。', source: '邓小平', translation: '' }],
  },
  {
    keywords: ['古巴导弹', '肯尼迪'],
    quotes: [{ text: 'Mankind must put an end to war, or war will put an end to mankind.', source: 'John F. Kennedy, UN Address, 1961', translation: '人类必须终结战争，否则战争将终结人类。' }],
  },
  {
    keywords: ['石油危机', 'OPEC'],
    quotes: [{ text: 'The Stone Age did not end for lack of stone, and the Oil Age will end long before the world runs out of oil.', source: 'Sheikh Ahmed Zaki Yamani (Saudi Oil Minister)', translation: '石器时代不是因为没有石头而结束的，石油时代也会在石油用完之前很久就结束。' }],
  },

  // 文学与艺术
  {
    keywords: ['红楼梦', '曹雪芹'],
    quotes: [{ text: '满纸荒唐言，一把辛酸泪。都云作者痴，谁解其中味？', source: '曹雪芹《红楼梦》开篇', translation: '' }],
  },
  {
    keywords: ['尤利西斯', '乔伊斯'],
    quotes: [{ text: 'Yes I said yes I will Yes.', source: 'James Joyce, Ulysses (final words)', translation: '是的我说了是的我愿意是的。' }],
  },
  {
    keywords: ['百年孤独', '马尔克斯'],
    quotes: [{ text: 'Many years later, as he faced the firing squad, Colonel Aureliano Buendía was to remember that distant afternoon when his father took him to discover ice.', source: 'Gabriel García Márquez, One Hundred Years of Solitude', translation: '多年以后，面对行刑队，奥雷里亚诺·布恩迪亚上校将会回想起父亲带他去见识冰块的那个遥远的下午。' }],
  },
  {
    keywords: ['立体主义', '毕加索', '格尔尼卡'],
    quotes: [{ text: 'Art is a lie that makes us realize truth.', source: 'Pablo Picasso', translation: '艺术是让我们认识真理的谎言。' }],
  },
  {
    keywords: ['包豪斯', '设计'],
    quotes: [{ text: 'Less is more.', source: 'Ludwig Mies van der Rohe (Bauhaus director)', translation: '少即是多。' }],
  },
  {
    keywords: ['吴哥窟', '高棉'],
    quotes: [{ text: 'It is grander than anything left to us by Greece or Rome.', source: 'Henri Mouhot (French explorer, 1860)', translation: '它比希腊或罗马留给我们的任何东西都更宏伟。' }],
  },
  {
    keywords: ['泰姬陵', '莫卧儿'],
    quotes: [{ text: 'A teardrop on the cheek of time.', source: 'Rabindranath Tagore (on the Taj Mahal)', translation: '时光面颊上的一滴泪珠。' }],
  },
  {
    keywords: ['奥尔梅克', '中美洲'],
    quotes: [{ text: 'The Olmec were the mother culture of Mesoamerica.', source: 'Michael D. Coe, archaeologist', translation: '奥尔梅克是中美洲的母文化。' }],
  },

  // 现代科技与全球事件
  {
    keywords: ['9·11', '世贸中心'],
    quotes: [{ text: 'Even the smallest act of service, the simplest act of kindness, is a way to honor those we lost.', source: 'Barack Obama (9/11 memorial, 2011)', translation: '即使是最微小的服务行为、最简单的善举，也是纪念我们失去之人的一种方式。' }],
  },
  {
    keywords: ['金融危机', '次贷', '雷曼'],
    quotes: [{ text: 'When the music stops, in terms of liquidity, things will be complicated.', source: 'Chuck Prince, Citigroup CEO (July 2007)', translation: '当音乐停下来的时候，就流动性而言，事情会变得复杂。' }],
  },
  {
    keywords: ['新冠', 'COVID', '疫情'],
    quotes: [{ text: 'The pandemic represents a rare but narrow window of opportunity to reflect, reimagine, and reset our world.', source: 'Klaus Schwab, World Economic Forum', translation: '这场大流行代表了一个罕见但短暂的机会窗口，让我们反思、重新想象和重置我们的世界。' }],
  },
  {
    keywords: ['mRNA', '疫苗'],
    quotes: [{ text: 'This is the first time in history that we have a vaccine within a year of the emergence of a new pathogen.', source: 'Ugur Sahin, BioNTech CEO', translation: '这是历史上第一次在新病原体出现一年内就有了疫苗。' }],
  },
  {
    keywords: ['威斯特伐利亚', '主权'],
    quotes: [{ text: 'The Westphalian system is the foundation upon which the entire edifice of international relations rests.', source: 'Henry Kissinger, World Order', translation: '威斯特伐利亚体系是整个国际关系大厦所依托的基础。' }],
  },
  {
    keywords: ['德川', '江户', '锁国'],
    quotes: [{ text: '花は桜木、人は武士。', source: '一休宗纯（江户时代谚语）', translation: '花中樱花，人中武士。' }],
  },
  {
    keywords: ['西班牙流感', '大流感'],
    quotes: [{ text: 'The influenza pandemic of 1918-1919 killed more people than the Great War, known today as World War I, at somewhere between 50 and 100 million people.', source: 'John M. Barry, The Great Influenza', translation: '1918-1919年的流感大流行杀死的人比大战（即第一次世界大战）还多，约在5000万到1亿之间。' }],
  },
  {
    keywords: ['玛雅', '历法'],
    quotes: [{ text: 'The Maya invented mathematics and astronomy of a complexity not equaled in Europe for a thousand years.', source: 'Jared Diamond', translation: '玛雅人发明的数学和天文学的复杂程度，在一千年内欧洲都未能企及。' }],
  },
  {
    keywords: ['斯普特尼克', '卫星'],
    quotes: [{ text: 'The Earth is the cradle of humanity, but mankind cannot stay in the cradle forever.', source: 'Konstantin Tsiolkovsky', translation: '地球是人类的摇篮，但人类不能永远待在摇篮里。' }],
  },
  // ═══ 中国经典名言扩充（先秦诸子 → 两汉散文 → 魏晋名言 → 宋明理学 → 近代名言） ═══
  {
    keywords: ['孔子', '儒家', '论语'],
    quotes: [
      { text: '三人行，必有我师焉。择其善者而从之，其不善者而改之。', source: '《论语·述而》' },
      { text: '知之为知之，不知为不知，是知也。', source: '《论语·为政》' },
      { text: '朝闻道，夕死可矣。', source: '《论语·里仁》' },
    ],
  },
  {
    keywords: ['老子', '道德经', '道家'],
    quotes: [
      { text: '道可道，非常道；名可名，非常名。', source: '老子《道德经》' },
      { text: '上善若水。水善利万物而不争。', source: '老子《道德经》' },
      { text: '千里之行，始于足下。', source: '老子《道德经》' },
    ],
  },
  {
    keywords: ['孟子', '仁政'],
    quotes: [{ text: '天将降大任于斯人也，必先苦其心志，劳其筋骨，饿其体肤。', source: '《孟子·告子下》' }],
  },
  {
    keywords: ['庄子', '逍遥'],
    quotes: [{ text: '北冥有鱼，其名为鲲。鲲之大，不知其几千里也。', source: '《庄子·逍遥游》' }],
  },
  {
    keywords: ['孙子', '兵法', '军事'],
    quotes: [
      { text: '知己知彼，百战不殆。', source: '《孙子兵法·谋攻篇》' },
      { text: '不战而屈人之兵，善之善者也。', source: '《孙子兵法·谋攻篇》' },
    ],
  },
  {
    keywords: ['司马迁', '史记'],
    quotes: [{ text: '人固有一死，或重于泰山，或轻于鸿毛。', source: '司马迁《报任安书》' }],
  },
  {
    keywords: ['曹操', '建安'],
    quotes: [{ text: '对酒当歌，人生几何！\n譬如朝露，去日苦多。', source: '曹操《短歌行》' }],
  },
  {
    keywords: ['诸葛亮', '出师表'],
    quotes: [{ text: '鞠躬尽瘁，死而后已。', source: '诸葛亮《后出师表》' }],
  },
  {
    keywords: ['陶渊明', '桃花源'],
    quotes: [{ text: '采菊东篱下，悠然见南山。', source: '陶渊明《饮酒·其五》' }],
  },
  {
    keywords: ['范仲淹', '岳阳楼'],
    quotes: [{ text: '先天下之忧而忧，后天下之乐而乐。', source: '范仲淹《岳阳楼记》' }],
  },
  {
    keywords: ['王阳明', '心学'],
    quotes: [{ text: '知是行之始，行是知之成。', source: '王阳明《传习录》' }],
  },
  {
    keywords: ['李白', '唐诗', '诗仙'],
    quotes: [
      { text: '举头望明月，低头思故乡。', source: '李白《静夜思》' },
      { text: '长风破浪会有时，直挂云帆济沧海。', source: '李白《行路难》' },
    ],
  },
  {
    keywords: ['杜甫', '诗圣'],
    quotes: [
      { text: '国破山河在，城春草木深。', source: '杜甫《春望》' },
      { text: '安得广厦千万间，大庇天下寒士俱欢颜。', source: '杜甫《茅屋为秋风所破歌》' },
    ],
  },
  {
    keywords: ['王维', '山水'],
    quotes: [{ text: '空山新雨后，天气晚来秋。\n明月松间照，清泉石上流。', source: '王维《山居秋暝》' }],
  },
  {
    keywords: ['白居易', '长恨歌'],
    quotes: [{ text: '在天愿作比翼鸟，在地愿为连理枝。\n天长地久有时尽，此恨绵绵无绝期。', source: '白居易《长恨歌》' }],
  },
  {
    keywords: ['李清照', '声声慢'],
    quotes: [{ text: '寻寻觅觅，冷冷清清，凄凄惨惨戚戚。', source: '李清照《声声慢》' }],
  },
  {
    keywords: ['辛弃疾', '破阵'],
    quotes: [{ text: '醉里挑灯看剑，梦回吹角连营。', source: '辛弃疾《破阵子》' }],
  },
  {
    keywords: ['岳飞', '满江红'],
    quotes: [{ text: '三十功名尘与土，八千里路云和月。', source: '岳飞《满江红》' }],
  },
  {
    keywords: ['文天祥', '正气歌'],
    quotes: [{ text: '人生自古谁无死，留取丹心照汗青。', source: '文天祥《过零丁洋》' }],
  },
  {
    keywords: ['林则徐', '鸦片', '禁烟'],
    quotes: [{ text: '苟利国家生死以，岂因祸福避趋之。', source: '林则徐《赴戍登程口占示家人》' }],
  },
  {
    keywords: ['秦始皇', '秦朝', '统一'],
    quotes: [{ text: '六王毕，四海一。蜀山兀，阿房出。', source: '杜牧《阿房宫赋》' }],
  },
  {
    keywords: ['丝绸之路', '张骞', '西域'],
    quotes: [{ text: '劝君更尽一杯酒，西出阳关无故人。', source: '王维《送元二使安西》' }],
  },
  {
    keywords: ['长城', '边塞'],
    quotes: [{ text: '秦时明月汉时关，万里长征人未还。', source: '王昌龄《出塞》' }],
  },
  {
    keywords: ['鲁迅', '呐喊', '狂人'],
    quotes: [
      { text: '横眉冷对千夫指，俯首甘为孺子牛。', source: '鲁迅《自嘲》' },
      { text: '其实地上本没有路，走的人多了，也便成了路。', source: '鲁迅《故乡》' },
    ],
  },
  {
    keywords: ['五四', '新文化', '觉醒'],
    quotes: [{ text: '世上如果还有真要活下去的人们，就先该敢说，敢笑，敢怒，敢骂，敢打。', source: '鲁迅《忽然想到》' }],
  },
  {
    keywords: ['改革开放', '邓小平'],
    quotes: [{ text: '不管黑猫白猫，抓住老鼠就是好猫。', source: '邓小平' }],
  },
  {
    keywords: ['大运河', '隋朝'],
    quotes: [{ text: '尽道隋亡为此河，至今千里赖通波。\n若无水殿龙舟事，共禹论功不较多。', source: '皮日休《汴河怀古》' }],
  },
  {
    keywords: ['武则天', '女皇'],
    quotes: [{ text: '日月当空曌。', source: '武则天自造字——"曌"，取"日月当空"之意' }],
  },
  {
    keywords: ['赤壁', '三国'],
    quotes: [{ text: '大江东去，浪淘尽，千古风流人物。', source: '苏轼《念奴娇·赤壁怀古》' }],
  },
  // ═══ 澳大利亚/大洋洲引文 ═══
  {
    keywords: ['梦幻时期', 'Dreamtime', '原住民', 'Aboriginal'],
    quotes: [{ text: 'We are all visitors to this time, this place. We are just passing through. Our purpose here is to observe, to learn, to grow, to love… and then we return home.', source: '澳大利亚原住民谚语', translation: '我们都是这个时代、这个地方的过客。我们只是路过。我们来这里的目的是观察、学习、成长、去爱……然后回家。' }],
  },
  {
    keywords: ['库克船长', 'Cook', '太平洋探险'],
    quotes: [{ text: 'I had ambition not only to go farther than anyone had been before, but as far as it was possible for man to go.', source: '詹姆斯·库克船长', translation: '我的志向不仅是比任何人走得更远，而是走到人类所能到达的极限。' }],
  },
  {
    keywords: ['第一舰队', '1788', '殖民', '流放'],
    quotes: [{ text: 'The land belongs to no one. Terra nullius.', source: '英国殖民者宣言，1788年——这一法律虚构统治了澳大利亚204年', translation: '这片土地不属于任何人。无主之地。' }],
  },
  {
    keywords: ['道歉', 'Sorry', '被偷走的一代'],
    quotes: [{ text: 'We apologise for the laws and policies of successive Parliaments and governments that have inflicted profound grief, suffering and loss on these our fellow Australians.', source: '陆克文总理道歉演讲，2008年2月13日', translation: '我们为历届议会和政府制定的法律和政策道歉——这些法律和政策给我们的澳大利亚同胞造成了深重的悲痛、苦难和损失。' }],
  },
  {
    keywords: ['马博', 'Mabo', '无主之地', 'terra nullius'],
    quotes: [{ text: 'The common law of this country would perpetuate injustice if it were to continue to embrace the enlarged notion of terra nullius.', source: '澳大利亚高等法院马博判决书，1992年', translation: '如果本国普通法继续拥抱扩大化的"无主之地"概念，它将使不公正永久化。' }],
  },
  {
    keywords: ['怀唐伊', 'Waitangi', '毛利'],
    quotes: [{ text: 'Ko te tuatahi, ko te mana o te whenua; ko te tuarua, ko te mana o te tangata.', source: '毛利谚语', translation: '第一是土地的威严；第二是人的威严。' }],
  },
  {
    keywords: ['女性投票权', '1893', '新西兰'],
    quotes: [{ text: 'All that separates, whether of race, class, creed, or sex, is inhuman, and must be overcome.', source: 'Kate Sheppard，新西兰女性投票权运动领袖', translation: '一切制造分离的东西——无论是种族、阶级、信仰还是性别——都是不人道的，必须被克服。' }],
  },
  {
    keywords: ['希拉里', 'Hillary', '珠峰', 'Everest'],
    quotes: [{ text: 'Well, we knocked the bastard off.', source: '埃德蒙·希拉里爵士，1953年5月29日登顶珠峰后', translation: '好吧，我们把那个该死的山峰给征服了。' }],
  },
  // ═══ 东南亚引文 ═══
  {
    keywords: ['苏加诺', '印尼独立', '万隆'],
    quotes: [{ text: 'This is the first intercontinental conference of coloured peoples in the history of mankind!', source: '苏加诺，1955年万隆会议开幕演讲', translation: '这是人类历史上第一次有色人种的洲际会议！' }],
  },
  {
    keywords: ['李光耀', '新加坡', 'Singapore'],
    quotes: [{ text: 'We are a small country with no natural resources. Our only resource is our people.', source: '李光耀', translation: '我们是一个没有自然资源的小国。我们唯一的资源是我们的人民。' }],
  },
  {
    keywords: ['胡志明', '越南', '奠边府'],
    quotes: [{ text: 'Nothing is more precious than independence and freedom.', source: '胡志明', translation: '没有什么比独立和自由更珍贵。' }],
  },
  {
    keywords: ['红色高棉', '波尔布特', 'S-21', '柬埔寨大屠杀'],
    quotes: [{ text: 'To keep you is no benefit. To destroy you is no loss.', source: '红色高棉标语（S-21审讯中心墙上）', translation: '留你没有用，杀你没有损失。' }],
  },
  {
    keywords: ['昂山素季', '缅甸', 'Myanmar'],
    quotes: [{ text: 'The only real prison is fear, and the only real freedom is freedom from fear.', source: '昂山素季', translation: '唯一真正的牢笼是恐惧，唯一真正的自由是免于恐惧的自由。' }],
  },
  {
    keywords: ['吴哥', 'Angkor', '高棉帝国'],
    quotes: [{ text: 'At the sight of this temple, the mind is struck with amazement, and one marvels that such a work could have been accomplished by the hand of man.', source: '周达观《真腊风土记》，1296年', translation: '见此庙宇，心灵为之震撼，不禁惊叹人力竟能成就如此伟业。' }],
  },
  {
    keywords: ['人民力量', 'EDSA', '菲律宾革命'],
    quotes: [{ text: 'The Filipino is worth dying for.', source: '尼诺·阿基诺（被暗杀的菲律宾反对派领袖），1983年', translation: '菲律宾人民值得为之献身。' }],
  },
  {
    keywords: ['东盟', 'ASEAN'],
    quotes: [{ text: 'Unity in diversity.', source: '东盟格言（源自印尼国家格言 Bhinneka Tunggal Ika）', translation: '多样性中的统一。' }],
  },
  // ═══ 印度引文 ═══
  {
    keywords: ['奥义书', 'Upanishad', '梵我'],
    quotes: [{ text: 'Tat tvam asi.', source: '《歌者奥义书》', translation: '你即是那（个体灵魂与宇宙精神本质上是同一的）。' }],
  },
  {
    keywords: ['阿育王', 'Ashoka', '羯陵伽'],
    quotes: [{ text: '凡战胜之处，必有悲伤。即使胜利者也不能不为此感到懊悔。', source: '阿育王第十三号岩石法敕', translation: '' }],
  },
  {
    keywords: ['食盐进军', '甘地', 'Gandhi', '非暴力'],
    quotes: [{ text: 'First they ignore you, then they laugh at you, then they fight you, then you win.', source: '常被归于甘地（实际来源有争议）', translation: '起初他们无视你，然后嘲笑你，然后与你战斗，最后你赢了。' }],
  },
  {
    keywords: ['印巴分治', '1947', '独立'],
    quotes: [{ text: 'At the stroke of the midnight hour, when the world sleeps, India will awake to life and freedom.', source: '尼赫鲁，1947年8月14日午夜', translation: '当午夜的钟声响起，当世界沉睡之时，印度将醒来，迎接生命和自由。' }],
  },
  {
    keywords: ['泰姬陵', 'Taj Mahal'],
    quotes: [{ text: 'A teardrop on the cheek of eternity.', source: '泰戈尔论泰姬陵', translation: '永恒面颊上的一滴眼泪。' }],
  },
  {
    keywords: ['玄奘', '那烂陀', '西行'],
    quotes: [{ text: '宁可就西而死，岂归东而生！', source: '玄奘，《大慈恩寺三藏法师传》', translation: '' }],
  },
  // ═══ 中东引文 ═══
  {
    keywords: ['智慧宫', 'Bayt al-Hikma', '巴格达', '翻译'],
    quotes: [{ text: 'Seek knowledge even unto China.', source: '圣训（hadith），常被引用于伊斯兰学术传统', translation: '求知，哪怕远至中国。' }],
  },
  {
    keywords: ['伊本西那', '阿维森纳', 'Avicenna', '医典'],
    quotes: [{ text: 'Medicine is the science by which we learn the various states of the human body, in health and when not in health.', source: '伊本·西那《医典》', translation: '医学是我们借以了解人体在健康与非健康状态下各种情况的科学。' }],
  },
  {
    keywords: ['赛克斯', 'Sykes', '皮科', 'Picot', '瓜分中东'],
    quotes: [{ text: 'I should like to draw a line from the "e" in Acre to the last "k" in Kirkuk.', source: '马克·赛克斯爵士，1916年', translation: '我想从阿克港的"e"画一条线到基尔库克的最后一个"k"。' }],
  },
  {
    keywords: ['阿拉伯之春', '布瓦吉吉', '突尼斯'],
    quotes: [{ text: 'The people want to bring down the regime.', source: '阿拉伯之春最广泛传播的口号（ash-shaʻb yurīd isqāṭ an-niẓām）', translation: '人民要推翻这个政权。' }],
  },
  // ═══ 南亚/中亚引文 ═══
  {
    keywords: ['哈拉帕', '摩亨佐', '印度河'],
    quotes: [{ text: 'A civilization that left no monuments to kings, no records of wars — only the world\'s most advanced plumbing.', source: '考古学家对印度河文明的评价', translation: '一个没有为国王建造纪念碑、没有留下战争记录的文明——只有世界上最先进的排水系统。' }],
  },
  {
    keywords: ['巴基斯坦', '真纳', '分治'],
    quotes: [{ text: 'You are free. You are free to go to your temples. You are free to go to your mosques. You may belong to any religion, caste or creed — that has nothing to do with the business of the State.', source: '穆罕默德·阿里·真纳，巴基斯坦建国演讲，1947年8月11日', translation: '你们是自由的。你们可以自由地去你们的寺庙，自由地去你们的清真寺。你们可以属于任何宗教、种姓或信条——这与国家事务无关。' }],
  },
  {
    keywords: ['斯里兰卡', '锡兰', '佛牙'],
    quotes: [{ text: 'Three things cannot be long hidden: the sun, the moon, and the truth.', source: '佛陀（常被引用于斯里兰卡上座部传统）', translation: '三件事无法长久隐藏：太阳、月亮和真理。' }],
  },
  {
    keywords: ['不丹', '幸福', 'GNH'],
    quotes: [{ text: 'Gross National Happiness is more important than Gross National Product.', source: '不丹第四代国王吉格梅·辛格·旺楚克', translation: '国民幸福总值比国民生产总值更重要。' }],
  },
  {
    keywords: ['帖木儿', '撒马尔罕', 'Timur'],
    quotes: [{ text: 'If you would know our power, look at our buildings.', source: '帖木儿', translation: '如果你想知道我们的力量，看看我们的建筑。' }],
  },
  {
    keywords: ['怛罗斯', '造纸', '751'],
    quotes: [{ text: '一场战败意外地加速了文明进程——俘虏的造纸工匠比十万大军更深刻地改变了世界。', source: '关于怛罗斯之战的历史评价', translation: '' }],
  },
  {
    keywords: ['阿富汗', '帝国坟场', 'Great Game'],
    quotes: [{ text: 'Afghanistan: where empires go to die.', source: '西方谚语', translation: '阿富汗：帝国的坟场。' }],
  },
  {
    keywords: ['孟加拉', '独立', '1971'],
    quotes: [{ text: 'Joy Bangla! (Victory to Bengal!)', source: '穆吉布·拉赫曼，1971年3月7日历史性演讲', translation: '孟加拉万岁！' }],
  },
  // ═══ 以色列/巴勒斯坦/印巴引文 ═══
  {
    keywords: ['巴比伦之囚', '圣殿', '流放'],
    quotes: [{ text: 'By the rivers of Babylon, there we sat down, yea, we wept, when we remembered Zion.', source: '《圣经·诗篇》第137篇', translation: '我们曾在巴比伦的河边坐下，一追想锡安就哭了。' }],
  },
  {
    keywords: ['贝尔福', 'Balfour', '犹太民族家园'],
    quotes: [{ text: "His Majesty's Government view with favour the establishment in Palestine of a national home for the Jewish people.", source: '贝尔福宣言，1917年11月2日', translation: '陛下政府赞成在巴勒斯坦为犹太民族建立一个民族家园。' }],
  },
  {
    keywords: ['因提法达', 'Intifada', '巴勒斯坦起义'],
    quotes: [{ text: 'We will not accept any alternative to our homeland.', source: '巴勒斯坦因提法达时期口号', translation: '我们不会接受家园的任何替代品。' }],
  },
  {
    keywords: ['奥斯陆', '拉宾', '和平'],
    quotes: [{ text: 'Enough of blood and tears. Enough.', source: '伊扎克·拉宾，奥斯陆协议签署仪式，1993年', translation: '够了，血和泪。够了。' }],
  },
  {
    keywords: ['阿姆利则', '贾利安瓦拉', '屠杀'],
    quotes: [{ text: 'The impossible has happened.', source: '泰戈尔退回爵士头衔时的信', translation: '不可能的事情发生了。' }],
  },
  {
    keywords: ['安贝德卡尔', '宪法', '达利特', '种姓'],
    quotes: [{ text: 'I measure the progress of a community by the degree of progress which women have achieved.', source: '安贝德卡尔', translation: '我用女性取得的进步程度来衡量一个社会的进步。' }],
  },
  {
    keywords: ['克什米尔', 'Kashmir', '印巴'],
    quotes: [{ text: 'Kashmir is the jugular vein of Pakistan.', source: '穆罕默德·阿里·真纳', translation: '克什米尔是巴基斯坦的咽喉命脉。' }],
  },
  // ═══ 近现代引文 ═══
  {
    keywords: ['沃斯通克拉夫特', '女权辩护', 'Wollstonecraft'],
    quotes: [{ text: 'I do not wish them to have power over men, but over themselves.', source: '玛丽·沃斯通克拉夫特《女权辩护》', translation: '我不希望女性凌驾于男性之上，我希望她们掌控自己。' }],
  },
  {
    keywords: ['波伏瓦', '第二性', 'Beauvoir'],
    quotes: [{ text: 'One is not born, but rather becomes, a woman.', source: '西蒙娜·德·波伏瓦《第二性》', translation: '女人不是天生的，而是后天造成的。' }],
  },
  {
    keywords: ['曼德拉', 'Mandela', '种族隔离', 'apartheid'],
    quotes: [{ text: 'No one is born hating another person because of the colour of his skin. People must learn to hate, and if they can learn to hate, they can be taught to love.', source: '纳尔逊·曼德拉《漫漫自由路》', translation: '没有人生来就因为肤色而仇恨他人。仇恨是后天学来的，如果人们能学会仇恨，他们也能被教会去爱。' }],
  },
  {
    keywords: ['人权宣言', 'Universal Declaration', '1948'],
    quotes: [{ text: 'All human beings are born free and equal in dignity and rights.', source: '《世界人权宣言》第一条，1948年', translation: '人人生而自由，在尊严和权利上一律平等。' }],
  },
  {
    keywords: ['天花', 'smallpox', '根除'],
    quotes: [{ text: 'The world and all its peoples have won freedom from smallpox.', source: 'WHO天花根除宣言，1980年', translation: '世界和世界上所有人民赢得了免于天花的自由。' }],
  },
  {
    keywords: ['西班牙内战', '格尔尼卡', '国际纵队'],
    quotes: [{ text: 'No pasaran! (They shall not pass!)', source: '西班牙共和派在马德里保卫战中的口号，1936年', translation: '他们休想通过！' }],
  },
  {
    keywords: ['朝鲜战争', 'Korean War', '三八线'],
    quotes: [{ text: 'In war there is no substitute for victory.', source: '麦克阿瑟（后被杜鲁门解职）', translation: '在战争中，胜利没有替代品。' }],
  },
  // ═══ 中国古典文学引文 ═══
  {
    keywords: ['诗经', '国风', '关雎'],
    quotes: [{ text: '关关雎鸠，在河之洲。窈窕淑女，君子好逑。', source: '《诗经·关雎》——中国文学的第一声', translation: '' }],
  },
  {
    keywords: ['诗经', '蒹葭', '秋水'],
    quotes: [{ text: '蒹葭苍苍，白露为霜。所谓伊人，在水一方。', source: '《诗经·蒹葭》', translation: '' }],
  },
  {
    keywords: ['曹操', '短歌行', '建安'],
    quotes: [{ text: '对酒当歌，人生几何！譬如朝露，去日苦多。', source: '曹操《短歌行》', translation: '' }],
  },
  {
    keywords: ['曹植', '洛神赋', '七步诗'],
    quotes: [{ text: '翩若惊鸿，婉若游龙。', source: '曹植《洛神赋》', translation: '' }],
  },
  {
    keywords: ['陶渊明', '桃花源', '田园'],
    quotes: [{ text: '采菊东篱下，悠然见南山。', source: '陶渊明《饮酒·其五》', translation: '' }],
  },
  {
    keywords: ['陈子昂', '幽州台'],
    quotes: [{ text: '前不见古人，后不见来者。念天地之悠悠，独怆然而涕下。', source: '陈子昂《登幽州台歌》——唐诗精神的宣言', translation: '' }],
  },
  {
    keywords: ['孟浩然', '春晓'],
    quotes: [{ text: '春眠不觉晓，处处闻啼鸟。夜来风雨声，花落知多少。', source: '孟浩然《春晓》——每个中国孩子最早背诵的诗', translation: '' }],
  },
  {
    keywords: ['王昌龄', '出塞', '边塞'],
    quotes: [{ text: '但使龙城飞将在，不教胡马度阴山。', source: '王昌龄《出塞》', translation: '' }],
  },
  {
    keywords: ['岑参', '白雪歌', '边塞'],
    quotes: [{ text: '忽如一夜春风来，千树万树梨花开。', source: '岑参《白雪歌送武判官归京》', translation: '' }],
  },
  {
    keywords: ['李商隐', '锦瑟', '无题'],
    quotes: [{ text: '锦瑟无端五十弦，一弦一柱思华年。庄生晓梦迷蝴蝶，望帝春心托杜鹃。', source: '李商隐《锦瑟》——中国诗歌最著名的难解之诗', translation: '' }],
  },
  {
    keywords: ['李商隐', '无题', '灵犀'],
    quotes: [{ text: '身无彩凤双飞翼，心有灵犀一点通。', source: '李商隐《无题》', translation: '' }],
  },
  {
    keywords: ['杜牧', '泊秦淮', '清明'],
    quotes: [{ text: '商女不知亡国恨，隔江犹唱后庭花。', source: '杜牧《泊秦淮》', translation: '' }],
  },
  {
    keywords: ['范仲淹', '岳阳楼', '忧乐'],
    quotes: [{ text: '先天下之忧而忧，后天下之乐而乐。', source: '范仲淹《岳阳楼记》——中国士大夫精神的最高表达', translation: '' }],
  },
  {
    keywords: ['晏殊', '浣溪沙'],
    quotes: [{ text: '无可奈何花落去，似曾相识燕归来。', source: '晏殊《浣溪沙》', translation: '' }],
  },
  {
    keywords: ['秦观', '鹊桥仙', '七夕'],
    quotes: [{ text: '两情若是久长时，又岂在朝朝暮暮。', source: '秦观《鹊桥仙》', translation: '' }],
  },
  {
    keywords: ['欧阳修', '醉翁亭', '蝶恋花'],
    quotes: [{ text: '醉翁之意不在酒，在乎山水之间也。', source: '欧阳修《醉翁亭记》', translation: '' }],
  },
  {
    keywords: ['关汉卿', '铜豌豆', '不伏老'],
    quotes: [{ text: '我是个蒸不烂、煮不熟、捶不扁、炒不爆、响当当一粒铜豌豆。', source: '关汉卿《南吕·一枝花·不伏老》——中国文学史上最张狂的自我宣言', translation: '' }],
  },
  {
    keywords: ['白朴', '梧桐雨'],
    quotes: [{ text: '一声声更苦。', source: '白朴《梧桐雨》——秋雨打梧桐的永恒意象', translation: '' }],
  },
  {
    keywords: ['元散曲', '张养浩', '潼关怀古'],
    quotes: [{ text: '兴，百姓苦；亡，百姓苦。', source: '张养浩《山坡羊·潼关怀古》——中国诗歌中最深刻的历史感慨', translation: '' }],
  },
  // ═══ 明清文学引文 ═══
  {
    keywords: ['三国演义', '罗贯中', '天下大势'],
    quotes: [{ text: '话说天下大势，分久必合，合久必分。', source: '罗贯中《三国演义》开篇', translation: '' }],
  },
  {
    keywords: ['水浒传', '施耐庵', '逼上梁山'],
    quotes: [{ text: '万卷经书曾读过，平生机巧心灵。六韬三略究来精。胸中藏战将，腹内隐雄兵。', source: '《水浒传》吴用出场词', translation: '' }],
  },
  {
    keywords: ['西游记', '吴承恩', '孙悟空', '大闹天宫'],
    quotes: [{ text: '皇帝轮流做，明年到我家。', source: '吴承恩《西游记》——孙悟空大闹天宫', translation: '' }],
  },
  {
    keywords: ['红楼梦', '曹雪芹', '贾宝玉', '林黛玉'],
    quotes: [{ text: '满纸荒唐言，一把辛酸泪。都云作者痴，谁解其中味？', source: '曹雪芹《红楼梦》开卷诗', translation: '' }],
  },
  {
    keywords: ['牡丹亭', '汤显祖', '杜丽娘'],
    quotes: [{ text: '情不知所起，一往而深。生者可以死，死可以生。', source: '汤显祖《牡丹亭》题词', translation: '' }],
  },
  {
    keywords: ['纳兰', '饮水词', '初见'],
    quotes: [{ text: '人生若只如初见，何事秋风悲画扇。', source: '纳兰性德《木兰花·拟古决绝词柬友》', translation: '' }],
  },
  {
    keywords: ['纳兰', '饮水词', '悼亡'],
    quotes: [{ text: '被酒莫惊春睡重，赌书消得泼茶香，当时只道是寻常。', source: '纳兰性德《浣溪沙》——悼念亡妻', translation: '' }],
  },
  {
    keywords: ['龚自珍', '己亥杂诗', '风雷'],
    quotes: [{ text: '九州生气恃风雷，万马齐喑究可哀。我劝天公重抖擞，不拘一格降人才。', source: '龚自珍《己亥杂诗》', translation: '' }],
  },
  {
    keywords: ['儒林外史', '范进', '吴敬梓'],
    quotes: [{ text: '功名富贵无凭据，费尽心情，总把流光误。浊酒三杯沉醉去，水流花谢知何处。', source: '吴敬梓《儒林外史》开篇词', translation: '' }],
  },
  // ═══ 中国现代文学引文 ═══
  {
    keywords: ['鲁迅', '狂人日记', '吃人'],
    quotes: [{ text: '我翻开历史一查，每页上都写着仁义道德，仔细看了半夜，才从字缝里看出字来，满本都写着两个字是"吃人"。', source: '鲁迅《狂人日记》', translation: '' }],
  },
  {
    keywords: ['鲁迅', '呐喊', '希望'],
    quotes: [{ text: '希望本是无所谓有，无所谓无的。这正如地上的路；其实地上本没有路，走的人多了，也便成了路。', source: '鲁迅《故乡》', translation: '' }],
  },
  {
    keywords: ['徐志摩', '再别康桥'],
    quotes: [{ text: '轻轻的我走了，正如我轻轻的来；我轻轻的招手，作别西天的云彩。', source: '徐志摩《再别康桥》', translation: '' }],
  },
  {
    keywords: ['沈从文', '边城', '翠翠'],
    quotes: [{ text: '这个人也许永远不回来了，也许明天回来。', source: '沈从文《边城》结尾', translation: '' }],
  },
  {
    keywords: ['张爱玲', '金锁记', '半生缘'],
    quotes: [{ text: '生命是一袭华美的袍，爬满了蚤子。', source: '张爱玲《天才梦》', translation: '' }],
  },
  {
    keywords: ['莫言', '诺贝尔', '红高粱'],
    quotes: [{ text: '文学和科学相比较，的确是没有什么用处，但文学最大的用处，也许就是它没有用处。', source: '莫言，诺贝尔文学奖演讲', translation: '' }],
  },
  // ═══ 中国书法/绘画引文 ═══
  {
    keywords: ['兰亭', '王羲之', '天下第一行书'],
    quotes: [{ text: '每览昔人兴感之由，若合一契，未尝不临文嗟悼，不能喻之于怀。', source: '王羲之《兰亭集序》', translation: '' }],
  },
  {
    keywords: ['颜真卿', '祭侄', '安史之乱'],
    quotes: [{ text: '贼臣不救，孤城围逼，父陷子死，巢倾卵覆。', source: '颜真卿《祭侄文稿》——天下第二行书', translation: '' }],
  },
  {
    keywords: ['怀素', '草书', '自叙帖'],
    quotes: [{ text: '忽然绝叫三五声，满壁纵横千万字。', source: '怀素《自叙帖》引他人评价', translation: '' }],
  },
  {
    keywords: ['齐白石', '似与不似', '虾'],
    quotes: [{ text: '作画妙在似与不似之间，太似为媚俗，不似为欺世。', source: '齐白石——中国画最精辟的美学纲领', translation: '' }],
  },
  {
    keywords: ['郑板桥', '竹', '难得糊涂'],
    quotes: [{ text: '难得糊涂。', source: '郑板桥', translation: '' }],
  },
  {
    keywords: ['顾恺之', '传神', '以形写神'],
    quotes: [{ text: '传神写照，正在阿堵中。', source: '顾恺之——中国画论的奠基之语（"阿堵"指眼睛）', translation: '' }],
  },
  {
    keywords: ['清明上河图', '张择端', '汴京'],
    quotes: [{ text: '画尽汴京繁华事，一卷千年说太平。', source: '后人评价《清明上河图》', translation: '' }],
  },
  // ═══ 三大一神教引文 ═══
  {
    keywords: ['摩西', '出埃及', '十诫'],
    quotes: [{ text: 'Let my people go.', source: '《出埃及记》5:1——摩西对法老说', translation: '让我的百姓走。' }],
  },
  {
    keywords: ['诗篇', '耶路撒冷', '巴比伦之囚'],
    quotes: [{ text: 'If I forget thee, O Jerusalem, let my right hand forget her cunning.', source: '《圣经·诗篇》137:5', translation: '耶路撒冷啊，我若忘记你，情愿我的右手忘记技巧。' }],
  },
  {
    keywords: ['塔木德', 'Talmud', '犹太律法'],
    quotes: [{ text: 'Who saves a single life, saves the entire world.', source: '《塔木德·密西拿·桑赫德林》4:5', translation: '拯救一个生命，就是拯救整个世界。' }],
  },
  {
    keywords: ['保罗', '哥林多', '爱的颂歌'],
    quotes: [{ text: 'And now these three remain: faith, hope and love. But the greatest of these is love.', source: '保罗《哥林多前书》13:13', translation: '如今常存的有信、有望、有爱，这三样，其中最大的是爱。' }],
  },
  {
    keywords: ['方济各', 'Francis', '太阳颂'],
    quotes: [{ text: 'Lord, make me an instrument of Your peace.', source: '常被归于阿西西的方济各（实际来源有争议）', translation: '主啊，使我成为你和平的工具。' }],
  },
  {
    keywords: ['路德', 'Luther', '宗教改革', '九十五条'],
    quotes: [{ text: 'Here I stand, I can do no other.', source: '马丁·路德，沃尔姆斯帝国议会，1521年', translation: '这是我的立场，我无法做出其他选择。' }],
  },
  {
    keywords: ['鲁米', 'Rumi', '苏菲', '旋转舞'],
    quotes: [{ text: 'You are not a drop in the ocean. You are the entire ocean in a drop.', source: '鲁米', translation: '你不是海洋中的一滴水，你是一滴水中的整个海洋。' }],
  },
  {
    keywords: ['鲁米', 'Rumi', '爱'],
    quotes: [{ text: 'The wound is the place where the Light enters you.', source: '鲁米', translation: '伤口是光进入你的地方。' }],
  },
  {
    keywords: ['古兰经', 'Quran', '第一次启示'],
    quotes: [{ text: 'Read! In the name of your Lord who created.', source: '《古兰经》96:1——穆罕默德接受的第一次启示', translation: '你应当以创造了你的主的名义宣读。' }],
  },
  {
    keywords: ['侯赛因', 'Husayn', '卡尔巴拉', '什叶'],
    quotes: [{ text: 'Every day is Ashura, every land is Karbala.', source: '什叶派谚语', translation: '每天都是阿舒拉，每个地方都是卡尔巴拉。' }],
  },
  {
    keywords: ['安萨里', 'Ghazali', '迷途指津'],
    quotes: [{ text: 'Knowledge without action is insanity, and action without knowledge is vanity.', source: '安萨里（加扎利）', translation: '没有行动的知识是疯狂，没有知识的行动是虚妄。' }],
  },
  // ═══ 佛教/印度教/道教/儒家引文 ═══
  {
    keywords: ['佛陀', '释迦', '四谛', '涅槃'],
    quotes: [{ text: 'Three things cannot be long hidden: the sun, the moon, and the truth.', source: '释迦牟尼', translation: '三件事无法长久隐藏：太阳、月亮和真理。' }],
  },
  {
    keywords: ['龙树', '空性', '中观', '大乘'],
    quotes: [{ text: '色不异空，空不异色。色即是空，空即是色。', source: '《般若波罗蜜多心经》——大乘佛教最精炼的哲学表述', translation: '' }],
  },
  {
    keywords: ['禅宗', '达摩', '公案', 'Zen'],
    quotes: [{ text: '不立文字，教外别传，直指人心，见性成佛。', source: '禅宗四句偈——菩提达摩', translation: '' }],
  },
  {
    keywords: ['薄伽梵歌', 'Bhagavad Gita', '克里希纳'],
    quotes: [{ text: 'Now I am become Death, the destroyer of worlds.', source: '《薄伽梵歌》——奥本海默在原子弹爆炸后引用', translation: '我成了死神，世界的毁灭者。' }],
  },
  {
    keywords: ['商羯罗', '不二论', 'Advaita'],
    quotes: [{ text: 'Brahman is real, the world is illusion, the self is nothing but Brahman.', source: '商羯罗', translation: '梵是真实的，世界是幻象，自我不过是梵。' }],
  },
  {
    keywords: ['庄子', '庄周梦蝶', '逍遥'],
    quotes: [{ text: '昔者庄周梦为胡蝶，栩栩然胡蝶也。不知周之梦为胡蝶与，胡蝶之梦为周与？', source: '庄子《齐物论》', translation: '' }],
  },
  {
    keywords: ['道德经', '老子', '道可道'],
    quotes: [{ text: '道可道，非常道。名可名，非常名。', source: '老子《道德经》开篇——中国哲学最著名的悖论', translation: '' }],
  },
  {
    keywords: ['孟子', '性善', '民贵君轻'],
    quotes: [{ text: '民为贵，社稷次之，君为轻。', source: '孟子《尽心下》', translation: '' }],
  },
  {
    keywords: ['王阳明', '心学', '知行合一', '龙场'],
    quotes: [{ text: '你未看此花时，此花与汝同归于寂。你来看此花时，则此花颜色一时明白起来。', source: '王阳明', translation: '' }],
  },
  {
    keywords: ['朱熹', '理学', '格物'],
    quotes: [{ text: '问渠那得清如许？为有源头活水来。', source: '朱熹《观书有感》', translation: '' }],
  },
  {
    keywords: ['维韦卡南达', '芝加哥', '宗教议会'],
    quotes: [{ text: 'As different streams having their sources in different places all mingle their water in the sea, so the different paths which men take all lead to God.', source: '维韦卡南达，1893年芝加哥世界宗教议会', translation: '正如不同的河流源自不同的地方但最终汇入大海，人们走的不同道路也通往同一个上帝。' }],
  },
  {
    keywords: ['梵二', '梵蒂冈', '大公会议'],
    quotes: [{ text: 'The Church rejects nothing of what is true and holy in other religions.', source: '梵蒂冈第二次大公会议《教会对非基督宗教态度宣言》', translation: '教会不拒绝其他宗教中真实和神圣的东西。' }],
  },
  // ═══ 印度教/道教丰富引文 ═══
  {
    keywords: ['摩诃婆罗多', 'Mahabharata', '俱卢之战'],
    quotes: [{ text: '摩诃婆罗多中有的，世界上都有；摩诃婆罗多中没有的，世界上也没有。', source: '印度谚语', translation: '' }],
  },
  {
    keywords: ['罗摩衍那', 'Ramayana', '罗摩', '悉多'],
    quotes: [{ text: '我的罗摩不只是历史人物，他是永恒的理想。', source: '甘地论《罗摩衍那》', translation: '' }],
  },
  {
    keywords: ['种姓', 'caste', '达利特', '不可接触'],
    quotes: [{ text: 'I like your Christ, I do not like your Christians. Your Christians are so unlike your Christ.', source: '甘地（谈种姓与宗教虚伪）', translation: '我喜欢你们的基督，但不喜欢你们的基督徒。你们的基督徒太不像你们的基督了。' }],
  },
  {
    keywords: ['瑜伽', 'yoga', '帕坦伽利'],
    quotes: [{ text: 'Yoga is the cessation of the fluctuations of the mind.', source: '帕坦伽利《瑜伽经》1.2', translation: '瑜伽是心念波动的止息。' }],
  },
  {
    keywords: ['老子', '道德经', '无为', '水'],
    quotes: [{ text: '上善若水。水善利万物而不争，处众人之所恶，故几于道。', source: '老子《道德经》第八章', translation: '' }],
  },
  {
    keywords: ['易经', '周易', '太极', '阴阳'],
    quotes: [{ text: '天行健，君子以自强不息。地势坤，君子以厚德载物。', source: '《易经》乾卦/坤卦——清华大学校训的来源', translation: '' }],
  },
  {
    keywords: ['黄巾', '太平道', '张角'],
    quotes: [{ text: '苍天已死，黄天当立。岁在甲子，天下大吉。', source: '张角·黄巾起义口号', translation: '' }],
  },
  {
    keywords: ['武当', '太极拳', '张三丰'],
    quotes: [{ text: '天下之至柔，驰骋天下之至坚。', source: '老子《道德经》第四十三章——太极拳的哲学根基', translation: '' }],
  },
  {
    keywords: ['李约瑟', '道教', '科技'],
    quotes: [{ text: 'Taoism was the most important root of Chinese science and technology.', source: '约瑟夫·李约瑟《中国科学技术史》', translation: '道教是中国传统科学和技术发展中最重要的思想根基。' }],
  },
  // ═══ 舞台艺术引文 ═══
  {
    keywords: ['威尔第', 'Verdi', '茶花女', '阿依达'],
    quotes: [{ text: 'You may have the universe if I may have Italy.', source: '威尔第', translation: '你可以拥有全世界，只要让我拥有意大利。' }],
  },
  {
    keywords: ['瓦格纳', 'Wagner', '指环', '尼伯龙根'],
    quotes: [{ text: 'Imagination creates reality.', source: '理查德·瓦格纳', translation: '想象创造现实。' }],
  },
  {
    keywords: ['卡门', 'Carmen', '比才'],
    quotes: [{ text: "L'amour est un oiseau rebelle que nul ne peut apprivoiser.", source: '比才《卡门》哈巴涅拉', translation: '爱情是一只叛逆的鸟，谁也无法驯服。' }],
  },
  {
    keywords: ['普契尼', 'Puccini', '蝴蝶夫人', '图兰朵'],
    quotes: [{ text: "Nessun dorma! All'alba vincerò!", source: '普契尼《图兰朵》——今夜无人入睡', translation: '谁都不许睡！黎明时我将获胜！' }],
  },
  {
    keywords: ['天鹅湖', '芭蕾', '柴可夫斯基'],
    quotes: [{ text: 'Where words leave off, music begins.', source: '海涅（常被用于描述芭蕾的无言之美）', translation: '言语止处，音乐始。' }],
  },
  {
    keywords: ['等待戈多', 'Godot', '贝克特', '荒诞'],
    quotes: [{ text: 'Nothing happens. Nobody comes, nobody goes. It is terrible.', source: '贝克特《等待戈多》', translation: '什么都没发生。没有人来，没有人走。太可怕了。' }],
  },
  {
    keywords: ['推销员之死', '威利·洛曼', '阿瑟·米勒'],
    quotes: [{ text: 'Attention, attention must be finally paid to such a person.', source: '阿瑟·米勒《推销员之死》', translation: '必须关注这样一个人，终于必须关注了。' }],
  },
  {
    keywords: ['布莱希特', 'Brecht', '三分钱', '间离'],
    quotes: [{ text: 'Erst kommt das Fressen, dann kommt die Moral.', source: '布莱希特《三分钱歌剧》', translation: '先有面包，后有道德。' }],
  },
  {
    keywords: ['曹禺', '雷雨', '话剧'],
    quotes: [{ text: '我觉得宇宙间许多残忍的事都是出自好心的人。', source: '曹禺《雷雨》', translation: '' }],
  },
  {
    keywords: ['汉密尔顿', 'Hamilton', '米兰达'],
    quotes: [{ text: "I am not throwing away my shot.", source: '林-曼努尔·米兰达《汉密尔顿》', translation: '我不会浪费我的机会。' }],
  },
  {
    keywords: ['悲惨世界', 'Les Mis', '人民歌唱'],
    quotes: [{ text: 'Do you hear the people sing, singing the song of angry men?', source: '《悲惨世界》——从虚构的巴黎街垒到真实的全球抗议', translation: '你听到人民在歌唱吗？那是愤怒者的歌声。' }],
  },
  {
    keywords: ['契诃夫', 'Chekhov', '樱桃园', '海鸥'],
    quotes: [{ text: 'Any idiot can face a crisis; it is day-to-day living that wears you out.', source: '契诃夫', translation: '任何白痴都能面对危机；真正把你磨垮的是日复一日的生活。' }],
  },
  // ═══ 科技引文 ═══
  {
    keywords: ['普朗克', 'Planck', '量子'],
    quotes: [{ text: 'Science advances one funeral at a time.', source: '普朗克', translation: '科学每次只前进一个葬礼的距离。' }],
  },
  {
    keywords: ['玻尔', 'Bohr', '量子', '原子'],
    quotes: [{ text: 'Anyone who is not shocked by quantum theory has not understood it.', source: '尼尔斯·玻尔', translation: '任何没有被量子理论震惊的人都没有理解它。' }],
  },
  {
    keywords: ['海森堡', '测不准', '不确定'],
    quotes: [{ text: 'Not only does God play dice, but He sometimes throws them where they cannot be seen.', source: '霍金（回应爱因斯坦）', translation: '上帝不仅掷骰子，有时还把它们扔到看不见的地方。' }],
  },
  {
    keywords: ['费曼', 'Feynman', 'QED'],
    quotes: [{ text: 'If you think you understand quantum mechanics, you do not understand quantum mechanics.', source: '费曼', translation: '如果你觉得你理解了量子力学，那你就没有理解量子力学。' }],
  },
  {
    keywords: ['切尔诺贝利', 'Chernobyl', '核事故'],
    quotes: [{ text: 'The real danger is not radiation itself, but lies told about radiation.', source: '切尔诺贝利幸存者', translation: '真正的危险不是辐射本身，而是关于辐射的谎言。' }],
  },
  {
    keywords: ['邓稼先', '两弹', '原子弹'],
    quotes: [{ text: '我不爱武器，我爱和平。但为了和平，我愿做这件事。', source: '邓稼先', translation: '' }],
  },
  {
    keywords: ['5G', '通信', '万物互联'],
    quotes: [{ text: 'The best way to predict the future is to invent it.', source: '艾伦·凯', translation: '预测未来最好的方式就是发明它。' }],
  },
  {
    keywords: ['光纤', '海底电缆', '互联网基础设施'],
    quotes: [{ text: '99% of international data traffic travels through undersea cables, not satellites.', source: 'TeleGeography', translation: '99%的国际数据流量通过海底电缆传输，而不是卫星。' }],
  },
]

/**
 * 为事件查找匹配的经典引用
 * 优先精确 ID 匹配，再尝试关键词匹配
 * 支持类目：literature, music, philosophy, science, religion, history, warfare
 */
export function findQuotesForEvent(event: { id: string; title: string; description: string; category: string }): LiteraryQuote[] {
  const SUPPORTED_CATEGORIES = new Set(['literature', 'music', 'philosophy', 'science', 'religion', 'history', 'warfare', 'technology', 'exploration', 'medicine', 'architecture', 'art'])
  if (!SUPPORTED_CATEGORIES.has(event.category)) return []

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
