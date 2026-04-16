import type { HistoricalEvent } from './types'

// ═══════════════════════════════════════════════════════════════════
//  中国历史基础事件扩充（Seed Expansion）
//
//  补充各朝代薄弱环节，重点覆盖：
//  - 春秋战国：诸子百家、关键战役
//  - 秦汉补充：丝绸之路、科技
//  - 魏晋南北朝：竹林七贤、佛教东传、书法
//  - 隋唐补充：科举、遣唐使
//  - 宋辽金：澶渊之盟、经济制度
//  - 明中后期：王阳明、戚继光、天工开物
//  - 清前中期：雍正改革、乾隆、洋务运动、百日维新
//  - 近现代补充
//
//  ID 规则: cse + 三位数字（china seed expansion）
// ═══════════════════════════════════════════════════════════════════

export const chinaSeedExpansionEvents: HistoricalEvent[] = [

  // ─── 春秋战国：诸子百家与关键事件 ─────────────────
  {
    id: 'cse001', year: -685, title: '管仲相齐·法家先驱',
    description: '齐桓公不计前嫌任用管仲为相，管仲推行"相地而衰征"的经济改革和"寓兵于农"的军事制度，使齐国成为春秋第一霸主。',
    details: '管仲的改革涵盖了经济（盐铁专卖）、军事（编户齐民）、外交（尊王攘夷）各方面，被后世视为法家思想的先驱。孔子评价他："微管仲，吾其被发左衽矣"——没有管仲，华夏文明可能被夷狄同化。',
    category: 'history', region: 'china', significance: 2, figure: '管仲/齐桓公',
  },
  {
    id: 'cse002', year: -496, title: '越王勾践卧薪尝胆',
    description: '越王勾践战败后忍辱负重，卧薪尝胆十余年，最终灭吴复国。"苦心人天不负"成为中国隐忍复仇精神的永恒典范。',
    category: 'history', region: 'china', significance: 2, figure: '勾践/范蠡',
  },
  {
    id: 'cse003', year: -350, title: '商鞅变法·秦国崛起之基',
    description: '商鞅在秦孝公支持下推行废井田、开阡陌、军功爵制、连坐法等激进改革，秦国从落后的西陲小国蜕变为虎狼之国。',
    details: '商鞅变法是中国历史上最彻底的社会改革之一。他将贵族世袭制改为军功授爵——任何人斩敌首一级即升一爵，使秦军成为最具战斗力的军队。"徙木立信"成为改革者守信的经典故事。商鞅最终被车裂，但他建立的制度却支撑秦国走向统一。',
    category: 'history', region: 'china', significance: 3, figure: '商鞅',
    relatedIds: ['cn008', 'cn009'],
  },
  {
    id: 'cse004', year: -340, title: '屈原与《楚辞》',
    description: '屈原创作《离骚》《九歌》《天问》，以浓烈的个人情感和瑰丽的想象开创了中国浪漫主义文学传统。他投汨罗江自尽，端午节由此而来。',
    category: 'literature', region: 'china', significance: 3, figure: '屈原',
  },
  {
    id: 'cse005', year: -260, title: '长平之战·战国最惨烈的战役',
    description: '秦将白起在长平之战中坑杀赵国降卒约四十万，这是古代战争史上最大规模的屠杀事件之一，赵国从此一蹶不振。',
    details: '长平之战持续三年，赵括替代廉颇后主动出击中伏——"纸上谈兵"的典故由此而来。秦国此战虽胜，也付出了伤亡过半的代价。白起最终被赐死，临终叹道："我固当死。长平之战，赵卒降者数十万人，我诈而尽坑之，是足以死。"',
    category: 'warfare', region: 'china', significance: 2, figure: '白起/赵括',
  },
  {
    id: 'cse006', year: -500, title: '老子与《道德经》',
    description: '传说老子出关赴西，关令尹喜请他著书，遂作《道德经》五千言。"道可道，非常道"开启了中国哲学最深邃的思辨传统。',
    details: '道家思想与儒家形成互补——儒家关注社会秩序，道家追问宇宙本源。"无为而治""上善若水""祸兮福之所倚"等思想深刻影响了中国的政治哲学、艺术审美和日常生活智慧。',
    category: 'philosophy', region: 'china', significance: 3, figure: '老子',
  },
  {
    id: 'cse007', year: -470, title: '墨子与墨家·兼爱非攻',
    description: '墨翟创立墨家学派，提出"兼爱""非攻""尚贤""节用"等主张，墨家弟子组成纪律严明的准军事团体，专门帮助弱小城邦抵御侵略。',
    details: '墨家是先秦诸子中最具实践精神的学派——他们不仅有思想，还有行动。墨家弟子精通守城术和机关制造，"墨守成规"一词就源于墨家的守城之术。可惜秦统一后墨家消亡，"兼爱"思想直到近代才被重新发现。',
    category: 'philosophy', region: 'china', significance: 2, figure: '墨子',
  },
  {
    id: 'cse008', year: -300, title: '荀子·人性恶与礼法思想',
    description: '荀子提出"性恶论"，认为人性本恶需要礼法约束，教育是化性起伪的关键。他的弟子韩非和李斯分别成为法家大师和秦朝宰相。',
    category: 'philosophy', region: 'china', significance: 2, figure: '荀子',
  },

  // ─── 秦汉补充 ────────────────────────────────
  {
    id: 'cse009', year: -138, title: '张骞出使西域·丝绸之路开辟',
    description: '汉武帝派张骞出使大月氏，虽未达成军事联盟目的，却打通了通往中亚的道路，开辟了延续千年的丝绸之路。',
    details: '张骞两次西行共历十余年，被匈奴扣押、逃脱、再出使。他带回了关于西域各国的详细情报——葡萄、苜蓿、汗血宝马等也由此传入中国。司马迁称他"凿空"西域，意为打通了前所未有的通道。',
    category: 'exploration', region: 'china', significance: 3, figure: '张骞',
    relatedIds: ['cn010'],
  },
  {
    id: 'cse010', year: -104, title: '司马迁《史记》·历史书写的革命',
    description: '司马迁遭受宫刑后忍辱著史，以"究天人之际，通古今之变，成一家之言"的抱负完成《史记》，开创纪传体通史传统。',
    details: '《史记》记载了从黄帝到汉武帝约三千年的历史，包含本纪12篇、世家30篇、列传70篇、表10篇、书8篇。鲁迅评价为"史家之绝唱，无韵之离骚"。司马迁对项羽、李广等悲剧英雄的描写充满同情，奠定了中国史学"秉笔直书"的传统。',
    category: 'literature', region: 'china', significance: 3, figure: '司马迁',
  },
  {
    id: 'cse011', year: 132, title: '张衡地动仪与浑天仪',
    description: '东汉科学家张衡发明了世界上第一台地震仪（候风地动仪）和精密天文仪器（浑天仪），还提出了"浑天说"宇宙模型。',
    category: 'science', region: 'china', significance: 2, figure: '张衡',
  },

  // ─── 魏晋南北朝 ──────────────────────────────
  {
    id: 'cse012', year: 263, title: '竹林七贤·魏晋风度',
    description: '嵇康、阮籍等"竹林七贤"以纵酒放达、谈玄论道的生活方式反抗司马氏的虚伪礼教，代表了魏晋士人追求精神自由的风骨。',
    details: '"竹林七贤"不只是一群酒鬼——他们的放浪形骸背后是对黑暗政治的无声抗议。嵇康宁可被杀也不为司马氏效力，临刑前弹奏《广陵散》从此绝响。阮籍"青白眼"——用黑眼珠看喜欢的人，白眼看讨厌的人。这种以个性对抗权威的精神，成为中国知识分子的重要精神传统。',
    category: 'philosophy', region: 'china', significance: 2, figure: '嵇康/阮籍',
  },
  {
    id: 'cse013', year: 353, title: '王羲之《兰亭集序》·书法圣典',
    description: '王羲之在兰亭雅集上即兴书写《兰亭集序》，被誉为"天下第一行书"。中国书法从此被提升为与诗歌、绘画并列的最高艺术形式。',
    details: '传说王羲之醒酒后多次重写《兰亭集序》，却再也写不出当日的神韵——这成为"一次性艺术"的经典例证。唐太宗李世民对此帖痴迷不已，遗命将真迹带入昭陵陪葬，今存世者皆为摹本。',
    category: 'art', region: 'china', significance: 3, figure: '王羲之',
  },
  {
    id: 'cse014', year: 399, title: '法显西行取经',
    description: '东晋高僧法显以65岁高龄从长安出发，经西域到达印度求法取经，历时14年，是中国第一位到印度取经并留下完整记录的僧人。',
    category: 'religion', region: 'china', significance: 2, figure: '法显',
  },
  {
    id: 'cse015', year: 494, title: '北魏孝文帝迁都洛阳·全面汉化',
    description: '北魏孝文帝拓跋宏力排众议迁都洛阳，推行全面汉化——改鲜卑姓为汉姓、穿汉服、说汉语、与汉族通婚。这是中国历史上最彻底的民族融合运动。',
    category: 'history', region: 'china', significance: 2, figure: '孝文帝拓跋宏',
    relatedIds: ['cn014'],
  },
  {
    id: 'cse016', year: 460, title: '云冈石窟开凿',
    description: '北魏在平城（今大同）开凿云冈石窟，融合印度犍陀罗风格与中原审美，是佛教艺术中国化的里程碑。',
    category: 'art', region: 'china', significance: 2,
  },
  {
    id: 'cse017', year: 530, title: '《水经注》与《齐民要术》',
    description: '郦道元的《水经注》是中国最详尽的古代地理著作，贾思勰的《齐民要术》是世界上最早的农业百科全书。南北朝分裂时期的学术成就往往被低估。',
    category: 'science', region: 'china', significance: 2, figure: '郦道元/贾思勰',
  },

  // ─── 隋唐补充 ──────────────────────────────
  {
    id: 'cse018', year: 605, title: '科举制度正式确立',
    description: '隋炀帝设进士科，科举制度正式确立。此后1300年间，科举成为中国选拔官员的核心制度，打破了门阀垄断，让寒门子弟有了出人头地的渠道。',
    details: '科举制度是中国对世界文明最重要的制度贡献之一。它用考试代替了世袭和推荐，建立了一套相对公平的人才选拔机制。欧洲的文官考试制度（19世纪）明确参考了中国科举。但科举也有局限——八股文的僵化格式最终扼杀了创新思维。',
    category: 'history', region: 'china', significance: 3,
    relatedIds: ['cn015'],
  },
  {
    id: 'cse019', year: 630, title: '唐朝击灭东突厥',
    description: '唐太宗派李靖率军击灭东突厥，俘虏颉利可汗。草原各族尊唐太宗为"天可汗"，唐朝确立了对东亚和中亚的霸主地位。',
    category: 'warfare', region: 'china', significance: 2, figure: '李世民/李靖',
  },
  {
    id: 'cse020', year: 700, title: '唐代遣唐使·东亚文化圈形成',
    description: '日本、新罗频繁派遣使团来唐学习制度、文化和技术。日本的平城京完全仿照长安布局，韩文字母的设计理念也受到中国音韵学影响。',
    details: '唐代是东亚文化圈形成的关键时期。日本的大化改新（645年）直接模仿唐朝的律令制度；汉字、佛教、儒学、建筑风格通过遣唐使传入日本和朝鲜半岛。长安成为当时亚洲的文化首都。',
    category: 'history', region: 'china', significance: 2,
  },

  // ─── 宋辽金：外交与经济 ─────────────────────
  {
    id: 'cse021', year: 1004, title: '澶渊之盟·宋辽和平',
    description: '宋真宗在寇准力劝下亲征前线，最终与辽国签订澶渊之盟——宋每年向辽输送岁币，换取百年和平。这是中国历史上最早的平等外交条约之一。',
    details: '澶渊之盟虽常被视为屈辱，但它实际上是一次理性的战略选择。宋朝用不到国库1%的支出换来了北方边境120年的和平，使国内经济得以高速发展。宋辽之间甚至建立了类似现代外交的互使制度和榷场贸易。',
    category: 'history', region: 'china', significance: 2, figure: '宋真宗/寇准',
  },
  {
    id: 'cse022', year: 1023, title: '交子·世界最早的纸币',
    description: '北宋四川地区发行"交子"，这是人类历史上最早的官方纸币，比欧洲最早的银行券早了约600年。',
    details: '交子的出现源于四川铁钱太重不便携带——一贯铁钱重达25斤。商人们先是自发使用"交子铺"的存款凭证来交易，后来朝廷将其收归官办。纸币的发明标志着人类货币从实物价值走向信用价值的革命性转变。',
    category: 'technology', region: 'china', significance: 3,
  },
  {
    id: 'cse023', year: 1069, title: '王安石变法',
    description: '王安石在宋神宗支持下推行青苗法、免役法、均输法等新法，试图通过国家干预经济来富国强兵，但引发了激烈的新旧党争。',
    details: '王安石变法是中国历史上最具争议的改革之一。支持者认为他是超前于时代的经济改革家；反对者（以司马光为首）认为他违背了"藏富于民"的传统。新旧党争持续数十年，严重消耗了北宋的政治能量，间接加速了靖康之变。',
    category: 'history', region: 'china', significance: 2, figure: '王安石/司马光',
    relatedIds: ['cn020'],
  },

  // ─── 明中后期补充 ──────────────────────────
  {
    id: 'cse024', year: 1508, title: '王阳明龙场悟道·心学诞生',
    description: '王守仁（阳明）被贬贵州龙场，在困顿中悟出"知行合一""致良知"的心学思想，开创了中国哲学从理学到心学的重大转向。',
    details: '王阳明是中国历史上罕见的"立德、立功、立言"三不朽之人——他不仅创立了影响东亚的心学哲学，还平定了宸濠之乱和南赣匪患。"知行合一"强调知识必须付诸实践，"致良知"主张每个人内心都有是非判断的天生能力。阳明心学后来传入日本，对明治维新产生了深远影响。',
    category: 'philosophy', region: 'china', significance: 3, figure: '王阳明',
  },
  {
    id: 'cse025', year: 1561, title: '戚继光抗倭',
    description: '名将戚继光组建"戚家军"，以严明的纪律和创新的"鸳鸯阵"战术横扫东南沿海倭寇，基本平定了困扰明朝数十年的倭患。',
    details: '戚继光不仅是军事天才，也是制度创新者。他打破了明军的腐败体制，从义乌矿工和农民中招募新兵，训练出了明朝最精锐的部队。他撰写的《纪效新书》和《练兵实纪》是中国军事史上的经典著作。',
    category: 'warfare', region: 'china', significance: 2, figure: '戚继光',
  },
  {
    id: 'cse026', year: 1572, title: '张居正改革·明朝最后的中兴',
    description: '内阁首辅张居正推行"考成法"整顿吏治、"一条鞭法"简化赋税、清丈全国田亩，使明朝财政短暂恢复健康。他是明朝最后一位有作为的改革家。',
    details: '张居正执政十年间国库充盈、边境安宁，但他的强势作风得罪了大量既得利益者。死后被万历帝清算，家产被抄，子孙受辱。"人亡政息"在张居正身上体现得淋漓尽致。',
    category: 'history', region: 'china', significance: 2, figure: '张居正',
  },
  {
    id: 'cse027', year: 1637, title: '宋应星《天工开物》',
    description: '宋应星撰写《天工开物》，系统记录了明代农业和手工业的生产技术，被誉为"中国17世纪的工艺百科全书"。',
    details: '《天工开物》涵盖了谷物种植、纺织、陶瓷、冶金、造纸、酿酒、兵器制造等18个领域，配有大量精细插图。讽刺的是，此书在中国长期被忽视（因为"奇技淫巧"不为科举所重），反而在日本和欧洲产生了更大的影响。',
    category: 'technology', region: 'china', significance: 2, figure: '宋应星',
  },
  {
    id: 'cse028', year: 1644, title: '崇祯自缢·明朝灭亡',
    description: '李自成攻破北京，崇祯帝在煤山自缢，临终写下"诸臣误我"。明朝276年国祚至此终结。',
    details: '崇祯是一个勤政但多疑的皇帝——他执政17年换了50个内阁大学士。明朝灭亡的根本原因是财政崩溃、自然灾害（小冰期）、农民起义和后金（清）的双重压力。吴三桂引清兵入关，开启了满族统治。',
    category: 'history', region: 'china', significance: 2, figure: '崇祯帝/李自成',
    relatedIds: ['cn024', 'cn026'],
  },

  // ─── 清朝前中期补充 ─────────────────────────
  {
    id: 'cse029', year: 1722, title: '雍正即位·清朝最勤政的皇帝',
    description: '雍正帝在位13年，推行摊丁入亩、火耗归公、改土归流等改革，是清朝最勤政高效的皇帝，但也因"九子夺嫡"和"文字狱"而备受争议。',
    details: '雍正每天批阅奏折到深夜，在位13年留下了1700多万字的朱批——他的工作量超过了绝大多数现代CEO。"摊丁入亩"废除了延续两千年的人头税，"火耗归公"将地方官的灰色收入公开化——这些改革为乾隆盛世奠定了财政基础。',
    category: 'history', region: 'china', significance: 2, figure: '雍正',
  },
  {
    id: 'cse030', year: 1773, title: '《四库全书》编纂',
    description: '乾隆帝下令编纂《四库全书》，历时13年，收录3461种典籍，约8亿字，是中国历史上规模最大的丛书工程。',
    details: '《四库全书》分经、史、子、集四部，全书共抄写7部分藏各地。但编纂过程也伴随着大规模的禁书和销毁——凡被认为有"悖逆"内容的书籍一律焚毁，据估计被销毁的书籍数量与收录的不相上下。"修书"与"毁书"并行，是清代文化政策最矛盾的写照。',
    category: 'literature', region: 'china', significance: 2, figure: '乾隆/纪昀',
  },
  {
    id: 'cse031', year: 1757, title: '一口通商·闭关锁国的开始',
    description: '乾隆帝限定广州为唯一对外通商口岸，"十三行"成为中国对外贸易的唯一窗口。闭关政策使中国逐渐落后于工业革命中的西方。',
    category: 'history', region: 'china', significance: 2,
  },
  {
    id: 'cse032', year: 1861, title: '洋务运动·自强求富',
    description: '曾国藩、李鸿章、左宗棠等发起洋务运动，以"中学为体、西学为用"为纲领，创办江南制造总局、福州船政局、北洋水师等近代化工程。',
    details: '洋务运动是中国近代化的第一次尝试。30年间建立了中国第一条铁路、第一个电报局、第一支近代海军。但甲午战争的惨败证明了"只学技术不改制度"的路线行不通——李鸿章叹道"一生事业，扫地都尽"。',
    category: 'technology', region: 'china', significance: 2, figure: '曾国藩/李鸿章',
    relatedIds: ['cn027'],
  },
  {
    id: 'cse033', year: 1898, title: '戊戌变法·百日维新',
    description: '光绪帝在康有为、梁启超推动下发动"百日维新"，试图从制度层面学习日本明治维新进行全面改革，但仅103天便被慈禧太后发动政变镇压。',
    details: '戊戌六君子之一谭嗣同拒绝出逃，留下"我自横刀向天笑，去留肝胆两昆仑"后从容就义。百日维新的失败证明了通过改良来实现现代化在当时的中国行不通——十三年后，辛亥革命以暴力推翻了清朝。',
    category: 'history', region: 'china', significance: 2, figure: '光绪帝/康有为/谭嗣同',
    relatedIds: ['cn027', 'cn028'],
  },
  {
    id: 'cse034', year: 1900, title: '八国联军侵华·庚子国难',
    description: '义和团运动引发八国联军入侵北京，慈禧太后携光绪西逃。《辛丑条约》赔款4.5亿两白银，中国沦为半殖民地的深渊。',
    category: 'warfare', region: 'china', significance: 2,
    relatedIds: ['cn027'],
  },

  // ─── 近现代补充 ──────────────────────────────
  {
    id: 'cse035', year: 1919, title: '五四运动·新文化觉醒',
    description: '巴黎和会上中国外交失败引发北京学生示威，五四运动从爱国运动发展为新文化运动的高潮，"德先生"（民主）和"赛先生"（科学）成为时代口号。',
    details: '五四运动的影响远超一次政治抗议——它催生了白话文运动（胡适）、新文学（鲁迅《狂人日记》）和马克思主义在中国的传播。陈独秀和李大钊在这一时期播下了中国共产党的种子。',
    category: 'history', region: 'china', significance: 3, figure: '陈独秀/蔡元培/胡适',
  },
  {
    id: 'cse036', year: 1934, title: '红军长征',
    description: '中国工农红军在第五次反"围剿"失败后开始战略转移，历时两年、行程两万五千里的长征成为中国革命史上最悲壮的史诗。',
    category: 'warfare', region: 'china', significance: 3,
    relatedIds: ['cn029'],
  },
  {
    id: 'cse037', year: 2001, title: '中国加入WTO',
    description: '经过15年谈判，中国正式加入世界贸易组织，全面融入全球贸易体系。此后20年间中国GDP从1.3万亿美元增长至17.7万亿美元，成为世界工厂和第二大经济体。',
    category: 'history', region: 'china', significance: 2,
  },
  {
    id: 'cse038', year: 2008, title: '北京奥运会',
    description: '第29届夏季奥运会在北京举行，张艺谋执导的开幕式以"活字印刷"等中国元素震撼全球，这是中国崛起为世界大国的标志性时刻。',
    category: 'history', region: 'china', significance: 2,
  },

  // ─── 科技与文化补充 ─────────────────────────
  {
    id: 'cse039', year: -256, title: '都江堰水利工程',
    description: '秦国蜀郡太守李冰父子修建都江堰，将岷江分流灌溉成都平原，使之成为"天府之国"。这项工程运行至今已超过2200年。',
    details: '都江堰是世界上年代最久、唯一至今仍在使用的无坝引水工程。它的设计巧妙利用了地形和水流规律——鱼嘴分水、飞沙堰溢洪、宝瓶口引水——无需任何闸门和水坝，完全靠自然力运行。2000年被列入世界文化遗产。',
    category: 'technology', region: 'china', significance: 3, figure: '李冰',
  },
  {
    id: 'cse040', year: 868, title: '最早的印刷品《金刚经》',
    description: '现存世界上最早的有确切日期的印刷品——唐咸通九年（868年）版《金刚经》，证明中国在9世纪已掌握成熟的雕版印刷技术。',
    category: 'technology', region: 'china', significance: 2,
  },
  {
    id: 'cse041', year: 1088, title: '苏颂水运仪象台',
    description: '北宋科学家苏颂建造水运仪象台，是世界上最早的天文钟。它能自动报时、显示天象，精密程度领先欧洲300年。',
    category: 'science', region: 'china', significance: 2, figure: '苏颂',
  },
  {
    id: 'cse042', year: -500, title: '孙武《孙子兵法》',
    description: '孙武著《孙子兵法》十三篇，提出"知己知彼百战不殆""不战而屈人之兵"等战略思想，至今仍被全球军事、商业界奉为经典。',
    details: '《孙子兵法》是世界上最古老的军事理论著作，被翻译成29种文字。拿破仑据说随身携带法文译本，海湾战争时美军指挥官也公开引用。它的核心不是教人如何打仗，而是如何避免打仗——"上兵伐谋"的思想比克劳塞维茨早了两千多年。',
    category: 'warfare', region: 'china', significance: 3, figure: '孙武',
  },
  {
    id: 'cse043', year: 1405, title: '郑和第一次下西洋',
    description: '明朝永乐帝派三宝太监郑和率领27800人、208艘船的庞大舰队首航西洋，旗舰宝船长约120米，是当时世界上最大的船只。',
    details: '郑和七下西洋（1405-1433），遍访东南亚、印度洋、波斯湾和东非海岸，展示了明朝的国力。但明朝此后实行海禁，销毁航海档案——中国与大航海时代擦肩而过。如果郑和继续向西航行，他会比哥伦布早87年到达非洲南端。',
    category: 'exploration', region: 'china', significance: 3, figure: '郑和',
    relatedIds: ['cn024'],
  },

  // ─── 文化与社会 ──────────────────────────────
  {
    id: 'cse044', year: 400, title: '陶渊明·中国田园诗鼻祖',
    description: '陶渊明不为五斗米折腰归隐田园，"采菊东篱下，悠然见南山"开创了中国田园诗传统和隐逸文化。',
    category: 'literature', region: 'china', significance: 2, figure: '陶渊明',
  },
  {
    id: 'cse045', year: 1046, title: '范仲淹《岳阳楼记》',
    description: '范仲淹写下"先天下之忧而忧，后天下之乐而乐"，确立了中国士大夫以天下为己任的精神境界和政治担当。',
    category: 'literature', region: 'china', significance: 2, figure: '范仲淹',
  },
  {
    id: 'cse046', year: 1550, title: '明代白话小说四大名著时代',
    description: '《三国演义》《水浒传》《西游记》《金瓶梅》在明代相继成书或定型，中国古典小说走向成熟。加上清代《红楼梦》，"四大名著"成为中华文化的核心经典。',
    details: '罗贯中、施耐庵、吴承恩的创作标志着中国文学从诗词歌赋向长篇叙事小说的重大转型。这些小说至今仍深刻影响着中国人的价值观、思维方式和日常用语——"空城计""孙悟空""逼上梁山"早已超越文学成为文化符号。',
    category: 'literature', region: 'china', significance: 3, figure: '罗贯中/施耐庵/吴承恩',
  },
  {
    id: 'cse047', year: 1860, title: '火烧圆明园',
    description: '第二次鸦片战争中英法联军劫掠并焚毁圆明园——这座"万园之园"汇聚了中西建筑精华，其毁灭成为中国"百年屈辱"最痛切的象征。',
    category: 'warfare', region: 'china', significance: 2,
    relatedIds: ['cn027'],
  },
  {
    id: 'cse048', year: 2003, title: '神舟五号·中国载人航天',
    description: '杨利伟搭乘神舟五号飞船进入太空，中国成为继苏联和美国之后第三个独立掌握载人航天技术的国家。',
    category: 'exploration', region: 'china', significance: 2, figure: '杨利伟',
  },
]

// 批量设置图片兜底
for (const event of chinaSeedExpansionEvents) {
  if (!event.image) {
    event.image = `https://picsum.photos/seed/chrono-${event.id}/1200/800`
  }
}
