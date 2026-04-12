import type { HistoricalEvent } from './types'

// ============================================================
// 事件丰富度扩充包 Part 14
// 中国古典诗词四大体裁：诗经 · 唐诗 · 宋词 · 元曲
// ============================================================

/** 诗经与先秦诗歌 */
export const shijingEvents: HistoricalEvent[] = [
  { id: 'sj001', year: -800, title: '《诗经·国风》采集', description: '周朝采诗官深入民间采集歌谣，"关关雎鸠"等 160 篇国风成为中国最早的民歌总集。', category: 'literature', region: 'china', significance: 2 },
  { id: 'sj002', year: -600, title: '孔子整理《诗经》', description: '孔子删定《诗经》为 305 篇，确立"诗教"传统——"不学诗，无以言"。', category: 'literature', region: 'china', significance: 3, figure: '孔子' },
  { id: 'sj003', year: -300, title: '《楚辞·九歌》', description: '屈原创作《九歌》，以祭祀歌曲的形式表达对楚地山川神灵的深情，香草美人传统由此确立。', category: 'literature', region: 'china', significance: 2, figure: '屈原' },
  { id: 'sj004', year: -200, title: '汉乐府民歌', description: '汉武帝设立乐府机构采集民歌，"孔雀东南飞""木兰辞"等叙事诗开创了中国叙事诗传统。', category: 'literature', region: 'china', significance: 2 },
  { id: 'sj005', year: 210, title: '建安文学', description: '曹操"对酒当歌，人生几何"、曹植"煮豆燃豆萁"——建安七子开创了中国诗歌慷慨悲凉的新风格。', category: 'literature', region: 'china', significance: 2, figure: '曹操' },
]

/** 唐诗 */
export const tangshiEvents: HistoricalEvent[] = [
  { id: 'ts001', year: 627, title: '初唐四杰', description: '王勃"海内存知己，天涯若比邻"——初唐四杰打破了宫廷诗的纤弱风气，为盛唐诗歌铺路。', category: 'literature', region: 'china', significance: 2, figure: '王勃' },
  { id: 'ts002', year: 744, title: '李白与杜甫洛阳相会', description: '诗仙李白与诗圣杜甫在洛阳相遇，被闻一多称为"中国文学史上最伟大的会面"。', category: 'literature', region: 'china', significance: 3, figure: '李白、杜甫' },
  { id: 'ts003', year: 756, title: '杜甫《春望》', description: '安史之乱中杜甫写下"国破山河在，城春草木深"——战争中的悲悯与苍凉达到中国诗歌的极致。', category: 'literature', region: 'china', significance: 2, figure: '杜甫' },
  { id: 'ts004', year: 750, title: '王维山水诗', description: '王维"空山新雨后，天气晚来秋"——禅意与山水的融合开创了中国山水诗的最高境界。', category: 'literature', region: 'china', significance: 2, figure: '王维' },
  { id: 'ts005', year: 806, title: '白居易《长恨歌》', description: '白居易以 840 字叙述唐玄宗与杨贵妃的爱情悲剧，"天长地久有时尽，此恨绵绵无绝期"。', category: 'literature', region: 'china', significance: 3, figure: '白居易' },
]

/** 宋词 */
export const songciEvents: HistoricalEvent[] = [
  { id: 'sc001', year: 1008, title: '柳永与市井词', description: '柳永"忍把浮名，换了浅斟低唱"——他把词从贵族文人的案头带入市井百姓的歌楼。', category: 'literature', region: 'china', significance: 2, figure: '柳永' },
  { id: 'sc002', year: 1082, title: '苏轼《念奴娇·赤壁怀古》', description: '"大江东去，浪淘尽，千古风流人物"——苏轼将词从小情小爱推向大历史大情怀。', category: 'literature', region: 'china', significance: 3, figure: '苏轼' },
  { id: 'sc003', year: 1132, title: '李清照晚年词', description: '"寻寻觅觅，冷冷清清，凄凄惨惨戚戚"——李清照用 97 个字写出了中国词史上最著名的开篇。', category: 'literature', region: 'china', significance: 3, figure: '李清照' },
  { id: 'sc004', year: 1188, title: '辛弃疾《破阵子》', description: '"醉里挑灯看剑，梦回吹角连营"——辛弃疾以词言志，将北伐壮志和英雄迟暮的悲怆注入词牌。', category: 'literature', region: 'china', significance: 3, figure: '辛弃疾' },
  { id: 'sc005', year: 1210, title: '陆游《示儿》', description: '"王师北定中原日，家祭无忘告乃翁"——85 岁的陆游在弥留之际留下的绝笔诗，九千首诗词的句号。', category: 'literature', region: 'china', significance: 2, figure: '陆游' },
]

/** 元曲 */
export const yuanquEvents: HistoricalEvent[] = [
  { id: 'yq001', year: 1260, title: '关汉卿《窦娥冤》', description: '窦娥在刑场上许下三桩誓愿——血溅白绫、六月飞雪、大旱三年。中国戏剧史上最震撼的悲剧。', category: 'literature', region: 'china', significance: 3, figure: '关汉卿' },
  { id: 'yq002', year: 1295, title: '马致远《天净沙·秋思》', description: '"枯藤老树昏鸦，小桥流水人家"——28 个字写尽了中国文学中最经典的游子思乡意境。', category: 'literature', region: 'china', significance: 2, figure: '马致远' },
  { id: 'yq003', year: 1300, title: '王实甫《西厢记》', description: '"愿天下有情人终成眷属"——《西厢记》打破了"才子佳人"的老套程式，让爱情战胜了礼教。', category: 'literature', region: 'china', significance: 3, figure: '王实甫' },
  { id: 'yq004', year: 1598, title: '汤显祖《牡丹亭》', description: '"情不知所起，一往而深"——杜丽娘因梦生情、因情而死、因情复生，中国最浪漫的戏曲。', category: 'literature', region: 'china', significance: 3, figure: '汤显祖' },
  { id: 'yq005', year: 1790, title: '四大徽班进京', description: '安徽戏班进京为乾隆祝寿，各地声腔在北京融合，最终催生了京剧——中国"国粹"诞生的起点。', category: 'music', region: 'china', significance: 2 },
]
