import { useMemo } from 'react'
import type { HistoricalEvent } from '@/data/types'
import { CATEGORY_CONFIG, formatYear } from '@/data/types'

export interface FunFact {
  emoji: string
  text: string
}

/**
 * 从事件数据中自动生成趣味历史冷知识
 */
export function generateFunFacts(events: HistoricalEvent[]): FunFact[] {
  const facts: FunFact[] = []
  if (events.length === 0) return facts

  // 1. 最古老的事件
  const oldest = events.reduce((min, e) => e.year < min.year ? e : min, events[0])
  if (oldest) {
    const yearsAgo = oldest.year < 0
      ? new Date().getFullYear() + Math.abs(oldest.year)
      : new Date().getFullYear() - oldest.year
    facts.push({
      emoji: '🏛️',
      text: `这里最古老的事件是「${oldest.title}」，发生在${formatYear(oldest.year)}，距今已有 ${yearsAgo} 年！`,
    })
  }

  // 2. 最多事件的世纪
  const centuryMap = new Map<number, number>()
  events.forEach(e => {
    const century = Math.floor(e.year / 100)
    centuryMap.set(century, (centuryMap.get(century) || 0) + 1)
  })
  let busiestCentury = 0, busiestCount = 0
  centuryMap.forEach((count, century) => {
    if (count > busiestCount) { busiestCentury = century; busiestCount = count }
  })
  if (busiestCount > 0) {
    const centuryLabel = busiestCentury >= 0
      ? `公元 ${busiestCentury * 100}~${(busiestCentury + 1) * 100} 年`
      : `公元前 ${Math.abs(busiestCentury + 1) * 100}~${Math.abs(busiestCentury) * 100} 年`
    facts.push({
      emoji: '📊',
      text: `人类文明最「忙碌」的 100 年是 ${centuryLabel}，记录了 ${busiestCount} 条历史事件。`,
    })
  }

  // 3. 出现最多次的人物
  const figureMap = new Map<string, number>()
  events.forEach(e => {
    if (e.figure) {
      e.figure.split(/[、,，/]/).map(n => n.trim()).filter(Boolean).forEach(name => {
        figureMap.set(name, (figureMap.get(name) || 0) + 1)
      })
    }
  })
  const topFigure = Array.from(figureMap.entries()).sort((a, b) => b[1] - a[1])[0]
  if (topFigure) {
    facts.push({
      emoji: '👤',
      text: `出场次数最多的历史人物是「${topFigure[0]}」，在 ${topFigure[1]} 个事件中被提及。`,
    })
  }

  // 4. 持续时间最长的事件
  const longestDuration = events
    .filter(e => e.endYear)
    .reduce((max, e) => {
      const dur = (e.endYear! - e.year)
      return dur > (max?.duration || 0) ? { event: e, duration: dur } : max
    }, null as { event: HistoricalEvent; duration: number } | null)
  if (longestDuration) {
    facts.push({
      emoji: '⏳',
      text: `持续时间最长的事件是「${longestDuration.event.title}」，跨越了 ${longestDuration.duration} 年。`,
    })
  }

  // 5. 里程碑事件数量
  const milestones = events.filter(e => e.significance === 3)
  facts.push({
    emoji: '⭐',
    text: `在全部 ${events.length} 条事件中，有 ${milestones.length} 个被标记为「里程碑」——它们改变了文明的走向。`,
  })

  // 6. 涉及国家最多的类目
  const catRegionMap = new Map<string, Set<string>>()
  events.forEach(e => {
    if (!catRegionMap.has(e.category)) catRegionMap.set(e.category, new Set())
    catRegionMap.get(e.category)!.add(e.region)
  })
  let globalCat = '', globalRegionCount = 0
  catRegionMap.forEach((regions, cat) => {
    if (regions.size > globalRegionCount) { globalCat = cat; globalRegionCount = regions.size }
  })
  if (globalCat) {
    facts.push({
      emoji: '🌍',
      text: `「${CATEGORY_CONFIG[globalCat as keyof typeof CATEGORY_CONFIG]?.label || globalCat}」是最全球化的领域，涉及 ${globalRegionCount} 个国家和地区。`,
    })
  }

  // 7. 同一年发生最多事件
  const yearMap = new Map<number, number>()
  events.forEach(e => yearMap.set(e.year, (yearMap.get(e.year) || 0) + 1))
  let busiestYear = 0, busiestYearCount = 0
  yearMap.forEach((count, year) => {
    if (count > busiestYearCount) { busiestYear = year; busiestYearCount = count }
  })
  if (busiestYearCount > 1) {
    facts.push({
      emoji: '🔥',
      text: `${formatYear(busiestYear)} 是历史上最「爆」的一年——同年发生了 ${busiestYearCount} 件大事！`,
    })
  }

  // 8. 中国事件占比
  const chinaCount = events.filter(e => e.region === 'china').length
  if (chinaCount > 0) {
    facts.push({
      emoji: '🇨🇳',
      text: `中国历史事件有 ${chinaCount} 条，占全部事件的 ${Math.round(chinaCount / events.length * 100)}%。`,
    })
  }

  // 9. 文学事件统计
  const litEvents = events.filter(e => e.category === 'literature')
  if (litEvents.length > 0) {
    const oldestLit = litEvents.reduce((min, e) => e.year < min.year ? e : min, litEvents[0])
    facts.push({
      emoji: '📚',
      text: `文学类事件共 ${litEvents.length} 条，最古老的是「${oldestLit.title}」（${formatYear(oldestLit.year)}）——人类用文字记录故事的传统比很多帝国都要长寿。`,
    })
  }

  // 10. 音乐事件统计
  const musicEvents = events.filter(e => e.category === 'music')
  if (musicEvents.length > 0) {
    const musicRegions = new Set(musicEvents.map(e => e.region))
    facts.push({
      emoji: '🎵',
      text: `音乐类事件覆盖了 ${musicRegions.size} 个国家和地区——从苏美尔竖琴到韩国流行乐，音乐真的是人类的通用语言。`,
    })
  }

  // 11. 文学 vs 音乐里程碑对比
  const litMilestones = litEvents.filter(e => e.significance === 3).length
  const musicMilestones = musicEvents.filter(e => e.significance === 3).length
  if (litMilestones > 0 && musicMilestones > 0) {
    facts.push({
      emoji: '🏆',
      text: `文学有 ${litMilestones} 个里程碑事件，音乐有 ${musicMilestones} 个——${litMilestones > musicMilestones ? '文学在"改变世界的事件"上略胜一筹' : musicMilestones > litMilestones ? '音乐在"改变世界的事件"上略胜一筹' : '两者势均力敌'}。`,
    })
  }

  // 12. 诗歌事件统计
  const poetryEvents = events.filter(e => e.category === 'literature' && /诗|poem|poetry|抒情|词|俳句|十四行|sonnet|离骚|草叶/i.test(`${e.title} ${e.description}`))
  if (poetryEvents.length >= 3) {
    facts.push({
      emoji: '🖊️',
      text: `收录了 ${poetryEvents.length} 条与诗歌相关的事件——从三千年前的《诗经》到现代主义的《荒原》，诗歌是人类坚持得最久的艺术形式。`,
    })
  }

  // 13. 音乐剧事件统计
  const musicalEvents = events.filter(e => /音乐剧|musical|百老汇|Broadway|西区故事|歌剧魅影|猫|汉密尔顿|Hamilton|韦伯|魔法坏女巫/i.test(`${e.title} ${e.description}`))
  if (musicalEvents.length >= 3) {
    facts.push({
      emoji: '🎭',
      text: `收录了 ${musicalEvents.length} 条音乐剧相关事件——百老汇每年吸引超过 1400 万观众，一条不到一公里的街道承载着全球最集中的现场表演艺术。`,
    })
  }

  // 14. 中国古典诗词统计
  const chinaPoetryEvents = events.filter(e =>
    e.region === 'china' && e.category === 'literature' &&
    /诗经|楚辞|离骚|唐诗|宋词|元曲|李白|杜甫|苏轼|李清照|辛弃疾|白居易|王维|柳永|关汉卿|马致远|窦娥|西厢|牡丹亭|诗人|词|曲|建安|乐府|国风/i.test(`${e.title} ${e.description}`)
  )
  if (chinaPoetryEvents.length >= 5) {
    facts.push({
      emoji: '📜',
      text: `中国古典诗词相关事件有 ${chinaPoetryEvents.length} 条——从《诗经》到元曲跨越两千多年。"唐诗宋词元曲"是中国人的精神家底，也是汉语最精美的结晶。`,
    })
  }

  // ──── 以下为 Round 60 新增的 36 个细分领域冷知识 ────

  // 15. 心理学事件
  const psyEvents = events.filter(e => /心理|psychology|弗洛伊德|荣格|行为主义|认知/i.test(`${e.title} ${e.description}`))
  if (psyEvents.length >= 2) facts.push({ emoji: '🧠', text: `收录了 ${psyEvents.length} 条心理学事件——从冯特 1879 年建立第一个心理学实验室算起，心理学作为一门科学还不到 150 年。` })

  // 16. 天文学事件
  const astroEvents = events.filter(e => /天文|星|行星|望远镜|哈勃|黑洞|日心|开普勒|伽利略/i.test(`${e.title} ${e.description}`) && e.category === 'science')
  if (astroEvents.length >= 2) facts.push({ emoji: '🔭', text: `天文学事件有 ${astroEvents.length} 条——人类仰望星空超过 5000 年，但直到 400 年前伽利略举起望远镜，才真正"看见"了宇宙。` })

  // 17. 密码学事件
  const cryptoEvents = events.filter(e => /密码|Enigma|图灵|加密|RSA|密码学/i.test(`${e.title} ${e.description}`))
  if (cryptoEvents.length >= 2) facts.push({ emoji: '🔐', text: `收录了 ${cryptoEvents.length} 条密码学事件——从凯撒密码到量子加密，保守秘密的艺术和破解秘密的技术一直在军备竞赛。` })

  // 18. 游戏史事件
  const gameEvents = events.filter(e => /游戏|棋|chess|Go|Pong|马里奥|电竞/i.test(`${e.title} ${e.description}`))
  if (gameEvents.length >= 2) facts.push({ emoji: '🎮', text: `游戏类事件有 ${gameEvents.length} 条——人类最古老的棋盘游戏（乌尔王棋）出土于 4500 年前的苏美尔，比很多文字都古老。` })

  // 19. 漫画/动画事件
  const comicEvents = events.filter(e => /漫画|动画|动漫|手冢|迪士尼|宫崎骏|超人|海贼/i.test(`${e.title} ${e.description}`))
  if (comicEvents.length >= 2) facts.push({ emoji: '💥', text: `漫画/动画事件有 ${comicEvents.length} 条——手冢治虫一生画了超过 15 万页漫画，被称为"漫画之神"。` })

  // 20. 货币/金融事件
  const finEvents = events.filter(e => /货币|铸币|银行|金融|交子|比特币|股票|泡沫/i.test(`${e.title} ${e.description}`))
  if (finEvents.length >= 2) facts.push({ emoji: '💰', text: `货币金融事件有 ${finEvents.length} 条——中国宋代发行的"交子"是世界上最早的纸币，比欧洲早了 600 多年。` })

  // 21. 博物馆事件
  const museumEvents = events.filter(e => /博物馆|museum|卢浮宫|大英博物馆|故宫/i.test(`${e.title} ${e.description}`))
  if (museumEvents.length >= 2) facts.push({ emoji: '🏛️', text: `博物馆事件有 ${museumEvents.length} 条——卢浮宫每年接待近 1000 万游客，相当于每天有 2.7 万人在 380,000 件展品前驻足。` })

  // 22. 铁路事件
  const railEvents = events.filter(e => /铁路|火车|railway|地铁|新干线|高铁/i.test(`${e.title} ${e.description}`))
  if (railEvents.length >= 2) facts.push({ emoji: '🚂', text: `铁路事件有 ${railEvents.length} 条——从 1825 年第一条铁路通车到今天，全球铁路总长度超过 100 万公里，可以绕地球 25 圈。` })

  // 23. 航空事件
  const aviaEvents = events.filter(e => /飞机|航空|莱特兄弟|飞行|热气球|音障|波音/i.test(`${e.title} ${e.description}`))
  if (aviaEvents.length >= 2) facts.push({ emoji: '✈️', text: `航空事件有 ${aviaEvents.length} 条——莱特兄弟的首飞只持续了 12 秒，66 年后人类就登上了月球。` })

  // 24. 考古事件
  const archEvents = events.filter(e => /考古|出土|发掘|罗塞塔|图坦卡蒙|兵马俑|死海古卷/i.test(`${e.title} ${e.description}`))
  if (archEvents.length >= 2) facts.push({ emoji: '⛏️', text: `考古发现事件有 ${archEvents.length} 条——兵马俑是 1974 年一位农民打井时偶然发现的，他后来成了秦始皇帝陵博物院的名誉馆员。` })

  // 25. 饮食文化事件
  const foodEvents = events.filter(e => /茶|咖啡|巧克力|啤酒|方便面|食品|烹饪|香料/i.test(`${e.title} ${e.description}`))
  if (foodEvents.length >= 2) facts.push({ emoji: '☕', text: `饮食文化事件有 ${foodEvents.length} 条——传说咖啡是由一个埃塞俄比亚牧羊人发现的，他注意到山羊吃了某种红色果实后异常兴奋。` })

  // 26. 太空事件
  const spaceEvents = events.filter(e => /太空|卫星|登月|空间站|火星|望远镜|宇航/i.test(`${e.title} ${e.description}`) && e.category === 'exploration')
  if (spaceEvents.length >= 2) facts.push({ emoji: '🚀', text: `太空探索事件有 ${spaceEvents.length} 条——旅行者 1 号目前距地球超过 240 亿公里，是人类制造的最远人造物体。` })

  // 27. 哲学事件
  const philEvents = events.filter(e => e.category === 'philosophy')
  if (philEvents.length >= 5) facts.push({ emoji: '🦉', text: `哲学类事件有 ${philEvents.length} 条——公元前 5 世纪，孔子、苏格拉底和佛陀几乎同时在三个互不知晓的文明中思考同样的问题。` })

  // 28. 建筑事件
  const architEvents = events.filter(e => e.category === 'architecture')
  if (architEvents.length >= 5) facts.push({ emoji: '🏗️', text: `建筑类事件有 ${architEvents.length} 条——金字塔建造时猛犸象还没有灭绝，它比克利奥帕特拉生活的年代还要古老得多。` })

  // 29. 宗教事件
  const relEvents = events.filter(e => e.category === 'religion')
  if (relEvents.length >= 5) facts.push({ emoji: '☸️', text: `宗教类事件有 ${relEvents.length} 条——目前全球约有 1 万种宗教，但 84% 的人只信奉其中 5 种。` })

  // 30. 医学事件
  const medEvents = events.filter(e => e.category === 'medicine')
  if (medEvents.length >= 5) facts.push({ emoji: '💉', text: `医学类事件有 ${medEvents.length} 条——青霉素的发现纯属意外——弗莱明度假回来发现培养皿被霉菌污染了。这个"失误"拯救了数亿人的生命。` })

  // 31. 艺术事件
  const artEvents = events.filter(e => e.category === 'art')
  if (artEvents.length >= 5) facts.push({ emoji: '🎨', text: `艺术类事件有 ${artEvents.length} 条——已知最古老的洞穴壁画超过 4 万年，那时人类还没有发明农业。` })

  // 32. 探索事件
  const explEvents = events.filter(e => e.category === 'exploration')
  if (explEvents.length >= 5) facts.push({ emoji: '🧭', text: `探索类事件有 ${explEvents.length} 条——人类花了 7 万年走出非洲抵达澳大利亚，但只用了 8 年从第一颗人造卫星到登上月球。` })

  // 33. 军事/战争事件
  const warEvents = events.filter(e => e.category === 'warfare')
  if (warEvents.length >= 5) facts.push({ emoji: '⚔️', text: `军事类事件有 ${warEvents.length} 条——在有记录的 3400 年人类文明史中，只有 268 年没有战争。` })

  // 34. 技术事件
  const techEvents = events.filter(e => e.category === 'technology')
  if (techEvents.length >= 5) facts.push({ emoji: '⚡', text: `技术类事件有 ${techEvents.length} 条——如果把人类技术发展史压缩成 24 小时，互联网出现在最后 0.1 秒。` })

  // 35. 科学事件
  const sciEvents = events.filter(e => e.category === 'science')
  if (sciEvents.length >= 5) facts.push({ emoji: '🔬', text: `科学类事件有 ${sciEvents.length} 条——牛顿出生的 1642 年，伽利略刚好去世——科学的火炬代际相传。` })

  // 36. 教育事件
  const eduEvents = events.filter(e => /教育|大学|学院|学校|义务教育|科举/i.test(`${e.title} ${e.description}`))
  if (eduEvents.length >= 2) facts.push({ emoji: '🎓', text: `教育类事件有 ${eduEvents.length} 条——博洛尼亚大学成立于 1088 年，是世界上最古老的持续运营大学。` })

  // 37. 环保事件
  const envEvents = events.filter(e => /环境|气候|保护|生态|切尔诺贝利|臭氧|碳排/i.test(`${e.title} ${e.description}`))
  if (envEvents.length >= 2) facts.push({ emoji: '🌱', text: `环境保护事件有 ${envEvents.length} 条——第一个地球日（1970年）有 2000 万美国人走上街头，这是人类历史上最大的公民运动之一。` })

  // 38. 外交/条约事件
  const diploEvents = events.filter(e => /条约|外交|联合国|和约|峰会|同盟|协定/i.test(`${e.title} ${e.description}`))
  if (diploEvents.length >= 2) facts.push({ emoji: '🤝', text: `外交条约事件有 ${diploEvents.length} 条——1648 年的威斯特伐利亚和约被认为是现代国际法的起点，"主权国家"的概念从此诞生。` })

  // 39. 体育事件
  const sportEvents = events.filter(e => /奥运|世界杯|体育|竞技|马拉松|电竞/i.test(`${e.title} ${e.description}`))
  if (sportEvents.length >= 2) facts.push({ emoji: '🏅', text: `体育事件有 ${sportEvents.length} 条——古代奥运会从公元前 776 年持续到公元 393 年，连续举办了 1169 年。` })

  // 40. 传媒事件
  const mediaEvents = events.filter(e => /报纸|电视|广播|无线电|YouTube|新闻|ARPANET/i.test(`${e.title} ${e.description}`))
  if (mediaEvents.length >= 2) facts.push({ emoji: '📡', text: `传媒事件有 ${mediaEvents.length} 条——第一条跨大西洋电报（1858 年）传输一条消息需要 17 小时，今天光纤只需要 0.06 秒。` })

  // 41. 汽车事件
  const carEvents = events.filter(e => /汽车|automobile|福特|T型车|特斯拉|高速公路/i.test(`${e.title} ${e.description}`))
  if (carEvents.length >= 2) facts.push({ emoji: '🚗', text: `汽车事件有 ${carEvents.length} 条——福特 T 型车问世时售价 825 美元，到停产时降到了 260 美元，让普通人第一次买得起汽车。` })

  // 42. 灾难事件
  const disasterEvents = events.filter(e => /灾难|地震|瘟疫|海啸|黑死病|庞贝|泰坦尼克|大流感/i.test(`${e.title} ${e.description}`))
  if (disasterEvents.length >= 2) facts.push({ emoji: '🌋', text: `灾难与韧性事件有 ${disasterEvents.length} 条——14 世纪黑死病杀死了欧洲 1/3 到 1/2 的人口，却意外促进了文艺复兴的到来。` })

  // 43. 女性历史
  const womenEvents = events.filter(e => /女性|女权|投票权|居里|贞德|哈特谢普苏特|马拉拉/i.test(`${e.title} ${e.description}`))
  if (womenEvents.length >= 2) facts.push({ emoji: '👩', text: `女性历史事件有 ${womenEvents.length} 条——新西兰是第一个给予女性投票权的国家（1893 年），而瑞士直到 1971 年才实现。` })

  // 44. 语言文字事件
  const langEvents = events.filter(e => /文字|字母|象形|罗塞塔|语言|印刷|活字/i.test(`${e.title} ${e.description}`))
  if (langEvents.length >= 2) facts.push({ emoji: '🔤', text: `语言文字事件有 ${langEvents.length} 条——全世界约有 7000 种语言，但其中一半可能在本世纪内消失。` })

  // 45. 电影事件
  const filmEvents = events.filter(e => /电影|film|cinema|导演|好莱坞|奥斯卡/i.test(`${e.title} ${e.description}`))
  if (filmEvents.length >= 2) facts.push({ emoji: '🎬', text: `电影事件有 ${filmEvents.length} 条——卢米埃尔兄弟 1895 年放映《火车进站》时，据说有观众吓得从座位上跳起来。` })

  // 46. 人口迁徙
  const migEvents = events.filter(e => /迁徙|移民|难民|走出非洲|五月花|diaspora/i.test(`${e.title} ${e.description}`))
  if (migEvents.length >= 2) facts.push({ emoji: '🚶', text: `人口迁徙事件有 ${migEvents.length} 条——人类约在 7 万年前走出非洲，用了 5 万年才遍布除南极外的所有大陆。` })

  // 47. 丝绸之路
  const silkEvents = events.filter(e => /丝绸之路|张骞|马可波罗|一带一路|玄奘/i.test(`${e.title} ${e.description}`))
  if (silkEvents.length >= 2) facts.push({ emoji: '🐫', text: `丝路与文化交流事件有 ${silkEvents.length} 条——丝绸之路不只运丝绸：黑死病也是沿着这条路从亚洲传到欧洲的。` })

  // 48. 地图学事件
  const mapEvents = events.filter(e => /地图|投影|墨卡托|Google地球|经纬/i.test(`${e.title} ${e.description}`))
  if (mapEvents.length >= 2) facts.push({ emoji: '🗺️', text: `地图学事件有 ${mapEvents.length} 条——墨卡托投影让格陵兰看起来和非洲一样大，但实际上非洲是格陵兰的 14 倍。` })

  // 49. 印度文明
  const indiaEvents = events.filter(e => e.region === 'india')
  if (indiaEvents.length >= 5) facts.push({ emoji: '🪷', text: `印度文明事件有 ${indiaEvents.length} 条——印度发明了"零"的概念，没有零就没有现代数学和计算机。` })

  // 50. 非洲文明
  const africaEvents = events.filter(e => ['ethiopia','nigeria','south-africa','mali','ghana','kenya','tanzania','sudan','egypt'].includes(e.region))
  if (africaEvents.length >= 5) facts.push({ emoji: '🌍', text: `非洲文明事件有 ${africaEvents.length} 条——廷巴克图在 15 世纪拥有的图书馆比欧洲大多数城市都多，这里曾是全球最重要的学术中心之一。` })

  // ═══ 故事性历史冷知识（反直觉/叙事型） ═══
  facts.push({ emoji: '🔺', text: '克利奥帕特拉距离 iPhone 发布（2007年）比距离大金字塔建造（约前2560年）更近。她活在前 69 年——离金字塔已过了 2500 年，离 iPhone 只有 2076 年。' })
  facts.push({ emoji: '🦣', text: '大金字塔建造时，猛犸象还没完全灭绝——弗兰格尔岛上的矮化猛犸象一直活到约前 1700 年，比胡夫金字塔晚了近 900 年。' })
  facts.push({ emoji: '🎓', text: '牛津大学（1096年有教学记录）比阿兹特克帝国（1325年建立特诺奇蒂特兰）更古老。' })
  facts.push({ emoji: '🦈', text: '鲨鱼比树更古老——鲨鱼出现在约 4.5 亿年前，而树直到约 3.5 亿年前才演化出来。' })
  facts.push({ emoji: '⏰', text: '如果把地球 46 亿年历史压缩成 24 小时，人类在最后 1.5 秒才出现，文明在最后 0.1 秒。' })
  facts.push({ emoji: '🏛️', text: '古罗马的混凝土配方至今令工程师惊叹——万神殿的穹顶 2000 年来从未坍塌，而现代混凝土通常在 50-100 年后就开始劣化。' })
  facts.push({ emoji: '📮', text: '英国的皇家邮政成立于 1516 年——比美国独立早了 260 年。如果你在 1516 年寄信，理论上可以送到亨利八世手中。' })
  facts.push({ emoji: '🎵', text: '莫扎特和贝多芬曾在维也纳同城生活——1787 年 17 岁的贝多芬可能见过 31 岁的莫扎特，虽然具体细节至今有争议。' })
  facts.push({ emoji: '🗡️', text: '最后一次使用弓箭的战役发生在 1940 年——英国军官杰克·丘吉尔在二战中用长弓和苏格兰大剑作战，并真的用弓箭射杀了一名德国士兵。' })
  facts.push({ emoji: '📚', text: '世界上现存最古老的企业是日本的金刚组（578 年建立），它比查理曼帝国和唐朝都早了两百多年。' })
  facts.push({ emoji: '🏠', text: '任天堂成立于 1889 年——比纸牌游戏到电子游戏的跨越整整 100 年。它最初是做手工花札纸牌的。' })
  facts.push({ emoji: '🌊', text: '太平洋的面积比所有陆地面积加起来还大。当麦哲伦船队 1521 年穿越它时，花了 3 个多月没看到任何陆地。' })
  facts.push({ emoji: '💀', text: '黑死病杀死了欧洲约三分之一到二分之一的人口（约 2500 万人），但它间接催生了文艺复兴——劳动力短缺让幸存者的工资暴涨，社会流动性大增。' })
  facts.push({ emoji: '🏗️', text: '科隆大教堂从 1248 年开始建造，直到 1880 年才完工——建了 632 年。在这期间，蒙古帝国崛起又衰落，美洲被"发现"又独立，蒸汽机被发明。' })
  facts.push({ emoji: '🐎', text: '成吉思汗的蒙古帝国在不到 80 年里征服了人类历史上最大的连续陆地面积——约 2400 万平方公里。骑马的游牧民创造的帝国比任何定居文明都大。' })
  facts.push({ emoji: '✉️', text: '英国在 1840 年发行了世界上第一枚邮票——黑便士。一枚黑便士的面值是一便士，今天一枚保存完好的黑便士价值数千英镑。' })
  facts.push({ emoji: '🧮', text: '古巴比伦人在 4000 年前就能解二次方程——他们用的是 60 进制数学系统，这也是我们今天一小时 60 分钟、一分钟 60 秒的来源。' })
  facts.push({ emoji: '🗽', text: '自由女神像是法国送给美国的礼物，但她的铜皮最初是闪亮的铜色——绿色铜锈是几十年氧化的结果。设计师是建造了埃菲尔铁塔内部结构的古斯塔夫·埃菲尔。' })
  facts.push({ emoji: '🌿', text: '阿司匹林来源于柳树皮——古埃及人在 3500 年前就用柳树皮止痛，但直到 1899 年拜耳才将其制成药片。' })
  facts.push({ emoji: '🐛', text: '丝绸之路上最值钱的"货物"之一不是丝绸，而是偷运出中国的蚕卵——据传是两个拜占庭僧侣把蚕卵藏在竹杖里带到了君士坦丁堡。' })

  // ═══ 中国历史专属冷知识（20条） ═══
  facts.push({ emoji: '🐲', text: '秦始皇每天批阅 120 斤竹简——直到蔡伦改进造纸术，"读书"在中国都是一项真正的体力活。' })
  facts.push({ emoji: '🐲', text: '唐朝长安城面积约 84 平方公里，是当时罗马城的 7 倍、拜占庭的 5 倍——它是公元 8 世纪全球最大的城市。' })
  facts.push({ emoji: '🐲', text: '宋朝发明了世界上最早的纸币"交子"——比欧洲最早的银行券早了 600 多年。' })
  facts.push({ emoji: '🐲', text: '郑和的旗舰"宝船"长约 120 米，是哥伦布"圣玛利亚号"的 5 倍——但郑和之后，明朝竟销毁了全部航海档案。' })
  facts.push({ emoji: '🐲', text: '中国的科举制度从隋朝（605年）持续到清朝（1905年），运行了整整 1300 年——是人类历史上持续时间最长的考试制度。' })
  facts.push({ emoji: '🐲', text: '北宋画家张择端的《清明上河图》长约 5.29 米，上面画了 814 个人物——它是人类历史上信息密度最高的画作之一。' })
  facts.push({ emoji: '🐲', text: '长城并不是一道连续的墙——它是两千多年间不同朝代修建的多段防御工事的总称，总长度超过 2 万公里。' })
  facts.push({ emoji: '🐲', text: '汉字"國"（国）的繁体字里有个"戈"——这个字本身就暗示着：一个国家的存在需要武力来守护。' })
  facts.push({ emoji: '🐲', text: '三国时期蜀汉的总人口只有约 94 万——比今天一个中等城市的人口还少。诸葛亮"六出祁山"时，整个蜀汉能动员的兵力不超过 10 万。' })
  facts.push({ emoji: '🐲', text: '中国的四大发明——造纸术、印刷术、火药、指南针——恰好对应了人类文明的四个核心需求：记录、传播、力量和方向。' })
  facts.push({ emoji: '🐲', text: '"中国"这个名字本意是"中央之国"——殷墟出土的甲骨文中已有"中商"的用法，而"中国"一词最早见于西周青铜器何尊铭文。' })
  facts.push({ emoji: '🐲', text: '唐朝诗人写的诗歌总量超过 5 万首——如果一天读一首，需要连续读 137 年才能读完《全唐诗》。' })
  facts.push({ emoji: '🐲', text: '故宫紫禁城有 9999 间半房间——传说中天宫有一万间，人间皇帝不敢僭越，所以少了半间。' })
  facts.push({ emoji: '🐲', text: '春秋战国时期的"合纵连横"是人类最早的系统性外交博弈——苏秦同时佩戴六国相印，堪称最早的"六国外交官"。' })
  facts.push({ emoji: '🐲', text: '曹雪芹写《红楼梦》"批阅十载，增删五次"——而这部伟大作品的后 40 回至今下落不明，成为中国文学史上最大的悬案。' })
  facts.push({ emoji: '🐲', text: '武则天留下了一块无字碑——功过是非任由后人评说。这种"沉默"反而成了中国历史上最响亮的政治声明。' })
  facts.push({ emoji: '🐲', text: '隋朝大运河全长 2700 公里——这是一条比巴拿马运河（82 公里）长 33 倍的人工水道，耗时仅 6 年便基本完工。' })
  facts.push({ emoji: '🐲', text: '中国是世界上唯一一个文字系统从未中断的文明——从 3000 多年前的甲骨文到今天的简体字，一脉相承。' })
  facts.push({ emoji: '🐲', text: '宋代汴京（开封）的夜市一直营业到凌晨——这在当时的世界是独一无二的。宋之前，中国城市都实行严格的宵禁制度。' })
  facts.push({ emoji: '🐲', text: '辛弃疾 21 岁率 50 骑兵闯入数万金兵大营活捉叛将——这不是《三国演义》，这是正史《宋史》的记载。' })

  // ═══ 美国历史专属冷知识（10条） ═══
  facts.push({ emoji: '🗽', text: '林肯被刺杀那天白天刚签署了建立特勤局的法令——讽刺的是，特勤局最初是为了打击假币，不是保护总统。' })
  facts.push({ emoji: '🗽', text: '哈佛大学成立于 1636 年——比美国独立早了 140 年。美国最古老的大学比美国本身还古老。' })
  facts.push({ emoji: '🗽', text: '美国宪法全文只有 4543 个英文单词——它是世界上仍在生效的最古老的成文宪法，而且比大多数手机使用条款都短。' })
  facts.push({ emoji: '🗽', text: '阿波罗 11 号登月飞船的导航电脑运算能力约为 2.048 MHz——不到今天一部普通智能手机的百万分之一。' })
  facts.push({ emoji: '🗽', text: '自由女神像最初不是绿色的——她是闪亮的铜色。大约在安装后 20 年，氧化作用才让她变成了今天的标志性铜绿色。' })
  facts.push({ emoji: '🗽', text: '美国最短的总统就职演说是华盛顿的第二次（仅 135 个单词），最长的是哈里森的（8445 个单词）——哈里森在就职 32 天后因感冒引发肺炎去世。' })
  facts.push({ emoji: '🗽', text: '路易斯安那购地每英亩不到 3 美分——按今天的地价算，那 214 万平方公里的土地现在价值超过 2 万亿美元。' })
  facts.push({ emoji: '🗽', text: '在加利福尼亚淘金热期间，一个鸡蛋可以卖到 25 美元（约合今天的 900 美元）——真正发财的不是淘金者，而是卖铲子和牛仔裤的人。' })
  facts.push({ emoji: '🗽', text: '南北战争中，双方伤亡总计约 62 万人——超过美国参与的所有其他战争（含两次世界大战）死亡人数的总和。' })
  facts.push({ emoji: '🗽', text: '马克·吐温和哈雷彗星同年出生（1835年）也同年去世（1910年）。他曾预言："我随彗星而来，也将随彗星而去。"' })

  return facts
}

/** Hook: 获取随机一条冷知识 */
export function useRandomFact(events: HistoricalEvent[]): FunFact | null {
  return useMemo(() => {
    if (events.length === 0) return null
    const facts = generateFunFacts(events)
    return facts[Math.floor(Math.random() * facts.length)] || null
  }, [events])
}
