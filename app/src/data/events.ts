import type { HistoricalEvent } from './types'
import { expandHistoricalEvents, HISTORICAL_EVENTS_MULTIPLIER } from './event-expansion'
import { injectCausalChains } from './causal-chains'
import { injectMilestoneDetails } from './milestone-details-patch'
import { injectMilestoneDetails2 } from './milestone-details-patch-2'
import { injectMilestoneDetails3 } from './milestone-details-patch-3'
import { injectMilestoneDetails4 } from './milestone-details-patch-4'
import { injectMilestoneDetails5 } from './milestone-details-patch-5'
import { injectMilestoneDetails6 } from './milestone-details-patch-6'
import { injectMilestoneDetails7 } from './milestone-details-patch-7'
import { injectImportantDetails } from './important-details-patch'
import { injectImportantDetails2 } from './important-details-patch-2'
import { ancientEvents, classicalEvents } from './events-ancient'
import { axialEvents, empireEvents } from './events-axial'
import { medievalEvents, preRenaissanceEvents } from './events-medieval'
import { renaissanceEvents, scientificRevolutionEvents } from './events-renaissance'
import { industrialEvents, modernEvents } from './events-modern'
import { egyptDynastyEvents } from './events-egypt-dynasties'
import { indiaDynastyEvents } from './events-india-dynasties'
import { chinaDynastyEvents } from './events-china-dynasties'
import { arabDynastyEvents } from './events-arab-dynasties'
import { israelHistoryEvents } from './events-israel-history'
import { europeDynastyEvents } from './events-europe-dynasties'
import { globalDynastyEvents } from './events-global-dynasties'
// 事件丰富度扩充包（10 个特性方向）
import { africaEnrichmentEvents, southeastAsiaEnrichmentEvents, latinAmericaEnrichmentEvents } from './events-enrichment-1'
import { musicEnrichmentEvents, medicineEnrichmentEvents, explorationEnrichmentEvents } from './events-enrichment-2'
import { medievalEnrichmentEvents, enlightenmentEnrichmentEvents, modernGlobalizationEvents, philosophyEnrichmentEvents } from './events-enrichment-3'
// Round 2-4 扩充包（特性 11-100）
import { chinaDeepEvents, japanDeepEvents, koreaDeepEvents, religionDeepEvents, literatureDeepEvents, eurasiaDeepEvents, worldDeepEvents } from './events-enrichment-4'
import { indiaDeepEvents, warfareDeepEvents, techDeepEvents, smallRegionEvents, figureAndExchangeEvents } from './events-enrichment-5'
import { womenHistoryEvents, economicsEvents, languageEvents, lawAndRightsEvents, dailyLifeEvents, scienceAndFutureEvents } from './events-enrichment-6'
// Round 5-7 扩充包（特性 101-200）
import { cinemaEvents, theaterEvents, danceEvents, architectureDeepEvents, educationEvents, environmentEvents, diplomacyEvents, sportsEvents, mediaEvents, fashionEvents, photographyEvents, urbanEvents } from './events-enrichment-7'
import { centralAsiaEvents, balkanEvents, caribbeanPacificEvents, africaDeepEvents, chinaModernEvents, scientistEvents, inventorEvents, philosophyDeepEvents, coldWarEvents, religionDeepEvents as religionDeep2Events, mathEvents } from './events-enrichment-8'
import { prehistoryEvents, lateAntiquityEvents, industrialDeepEvents, worldWarEvents, disasterEvents, spaceDeepEvents, culturalExchangeEvents, digitalAgeEvents } from './events-enrichment-9'
// Round 9 扩充包（特性 201-235）
import { psychologyEvents, sociologyEvents, nationalLiberationEvents, maritimeEvents, astronomyEvents, cryptographyEvents, libraryEvents, postalEvents, meteorologyEvents, miningEvents, textileEvents, ceramicsEvents, gardenEvents } from './events-enrichment-10'
// Round 10 扩充包（特性 236-270）
import { currencyEvents, insuranceEvents, espionageEvents, gamingEvents, comicsEvents, advertisingEvents, museumEvents, conservationEvents, firefightingEvents, judicialEvents, abolitionEvents, agricultureEvents, energyEvents } from './events-enrichment-11'
// Round 11 扩充包（特性 271-300）
import { railwayEvents, aviationEvents, automobileEvents, archaeologyEvents, migrationEvents, festivalEvents, foodCultureEvents, spiceTradeEvents, cartographyEvents, measurementEvents } from './events-enrichment-12'
// Round 30: 地图绘制与地理认知的千年革命
import { cartographyHistoryEvents } from './events-cartography-history'
// 非洲文明早期事件补充
import { africaEarlyEvents } from './events-africa-early'
// Round 12: 诗歌 + 音乐剧专题
import { poetryEvents, musicalTheaterEvents } from './events-enrichment-13'
// Round 13: 诗经·唐诗·宋词·元曲专题
import { shijingEvents, tangshiEvents, songciEvents, yuanquEvents } from './events-enrichment-14'
// 中国历史名人群像扩充
import { chinaFigureEvents, injectChinaFigures } from './china-figures-patch'
// 中国历史基础事件扩充 + 宋明清深度扩充
import { chinaSeedExpansionEvents } from './events-china-seed-expansion'
import { songMingQingDeepEvents } from './events-song-mingqing-deep'
// 维京与北欧文明
import { vikingNordicEvents } from './events-viking-nordic'
// Round 14: 荷兰/西班牙/东欧专题
import { netherlandsEvents, spainEvents, easternEuropeEvents } from './events-enrichment-15'
// Round 15: 美国历史深度专题（45条）
import { usColonialRevolutionEvents, usWestwardExpansionEvents, usCivilWarDeepEvents, usGildedProgressiveEvents, usDepressionWWIIEvents, usColdWarCivilRightsEvents, usContemporaryEvents } from './events-us-history'
// Round 16: 美洲深度扩充 — 拉美 + 原住民 + 美国文化线
import { latinAmericaDeepEvents, nativeAmericasEvents, usaCultureDeepEvents } from './events-americas-deep'
import { australiaDeepEvents, pacificEvents, newZealandDeepEvents, australiaTechEvents, pacificEnvironmentEvents } from './events-australia-deep'
import { southeastAsiaDeepEvents, seaReligionEvents } from './events-southeast-asia-deep'
import { indiaSubcontinentDeepEvents, middleEastDeepEvents } from './events-india-middleeast-deep'
import { southAsiaDeepEvents, centralAsiaDeepEvents } from './events-southasia-centralasia-deep'
import { israelPalestineDeepEvents, indiaSupplementEvents, pakistanSupplementEvents } from './events-israel-india-pakistan-deep'
import { modernFeminismEvents, modernHumanRightsEvents, modernLaborEvents, modernColdWarProxyEvents, modernHealthEvents } from './events-modern-deep'
import { weakRegionPatchEvents } from './events-weak-region-patch'
import { weakRegionPatch2Events } from './events-weak-region-patch-2'
import { shijingDeepEvents, weiJinLitEvents, tangPoetrySupplementEvents, songCiSupplementEvents, yuanQuSupplementEvents } from './events-chinese-literature-deep'
import { mingQingLitEvents, modernChineseLitEvents } from './events-chinese-literature-deep-2'
import { chineseCalligraphyEvents, chinesePaintingEvents } from './events-chinese-art-deep'
import { judaismDeepEvents, christianityDeepEvents, islamDeepEvents } from './events-abrahamic-religions-deep'
import { buddhismDeepEvents, hinduismDeepEvents, taoismDeepEvents, confucianismDeepEvents, interFaithEvents } from './events-eastern-religions-deep'
import { hinduismEnrichEvents, taoismEnrichEvents } from './events-hinduism-taoism-enrich'
import { operaDeepEvents, balletDeepEvents, musicalEnrichEvents, dramaEnrichEvents } from './events-stage-arts-deep'
import { broadwayEnrichEvents, westEndEnrichEvents } from './events-broadway-westend-enrich'
import { europeanMusicalEvents, australiaMusicalEvents } from './events-europe-australia-musical'
import { popMusicMilestonesEvents } from './events-pop-music-milestones'
import { popMusic21stEvents } from './events-pop-music-21st'
import { medicineHumanityEvents } from './events-medicine-humanity'
import { cantopopEvents, taiwanPopEvents, jpopEvents, kpopDeepEvents, mainlandPopEvents } from './events-asian-pop-music'
import { asianNewGenPopEvents } from './events-asian-newgen-pop'
import { europeanLitEvents, modernWorldLitEvents } from './events-world-literature'
import { chineseNovelEnrichEvents } from './events-chinese-novel-enrich'
import { medicineMilestonesEvents } from './events-medicine-milestones'
import { architectureMilestonesEvents, westernPhilosophyEvents } from './events-architecture-philosophy'
import { prehistoryDeepEvents, twentyFirstCenturyEvents } from './events-prehistory-21stcentury'
import { quantumPhysicsEvents, chinaTechEvents, energyRevolutionEvents, communicationRevolutionEvents } from './events-science-tech-enrich'
import { aiMilestonesEvents } from './events-ai-milestones'
import { economicHistoryEvents, sportsHistoryEvents, explorationEvents } from './events-economy-sports-exploration'
import { cinemaDeepEvents, mathHistoryEvents, environmentalHistoryEvents } from './events-cinema-math-environment'
import { medicinePatchEvents, musicPatchEvents } from './events-category-patch'
// Round 30: 全球医学与公共卫生里程碑（18 条：阿拉伯/中医/印度/近代流行病学/20世纪公共卫生/21世纪）
import { globalMedicineEvents } from './events-global-medicine'
import { globalExplorationEvents } from './events-global-exploration'
import { nonWesternPhilosophyEvents } from './events-non-western-philosophy'
import { worldPhilosophyVoicesEvents } from './events-global-philosophy'
import { woodArchitectureEvents } from './events-wood-architecture'
import { fashionDesignEvents } from './events-fashion-design'
import { worldWritingEvents } from './events-world-writing'
import { lawJusticeEvents } from './events-law-justice'
import { foodAgricultureEvents } from './events-food-agriculture'
// Round 31: 小国的大历史 — Chile/Sri Lanka/Tanzania/Romania/Palestine/Myanmar
import { smallNationsEvents } from './events-small-nations'
import { inlandEmpiresEvents } from './events-inland-empires'
// Round 31: 伊斯兰科学黄金时代（22条）
import { islamicGoldenAgeEvents } from './events-islamic-golden-age'
// Round 32: 被遗忘的她们——女性科学家纵深（25条）
import { womenScienceEvents } from './events-women-science'
import { lostExplorersEvents } from './events-lost-explorers'
// Round 31: 海上丝路双珠 — 澳门与新加坡（23 条）
import { portCitiesEvents } from './events-port-cities'
import { mountainFaithsEvents } from './events-mountain-faiths'
// Round 34: 半岛雨林与北国光 — Laos/Malaysia/Philippines/Bangladesh/Denmark/Finland/Serbia（23条）
import { sparseRegionsRound34Events } from './events-sparse-regions-round34'
import { andesSaharaEvents } from './events-andes-sahara'
import { eastAfricaMediterraneanEvents } from './events-east-africa-mediterranean'
import { chileAndesEvents } from './events-chile-andes'
import { iceAgeEvents } from './events-ice-age'
import { worldPhilosophyEvents } from './events-world-philosophy'
import { voyagesForgottenEvents } from './events-voyages-forgotten'
import { medicineShadowsEvents } from './events-medicine-shadows'
import { faithsMarginsEvents } from './events-faiths-margins'
import { musicWorldTraditionsEvents } from './events-music-world-traditions'
import { frontierExplorersEvents } from './events-frontier-explorers'
// Round 35: 北欧与东欧历史纵深（22条）
import { nordicEasternEuropeEvents } from './events-nordic-eastern-europe'
// Round 35: 薄弱地区补齐 — 中亚/东南亚/非洲/欧洲小国/美洲缺口（22条）
import { weakRegionsRound35Events } from './events-weak-regions-round35'
// 自进化轮次 2026-04-25_1536 — 非洲内陆 + 哲学纵深 + 远古补强（25条）
import { evolve202604251536Events } from './events-evolve-20260425-1536'

// Round 36: 自进化轮次 2026-04-25 — 非洲深化 + 建筑奇迹 + 远古补强（25条）
import { evolve20260425Events } from './events-evolve-20260425'

export const baseHistoricalEvents: HistoricalEvent[] = [
  ...ancientEvents,
  ...classicalEvents,
  ...axialEvents,
  ...empireEvents,
  ...medievalEvents,
  ...preRenaissanceEvents,
  ...renaissanceEvents,
  ...scientificRevolutionEvents,
  ...industrialEvents,
  ...modernEvents,
  ...egyptDynastyEvents,
  ...indiaDynastyEvents,
  ...chinaDynastyEvents,
  ...arabDynastyEvents,
  ...israelHistoryEvents,
  ...europeDynastyEvents,
  ...globalDynastyEvents,
  // 丰富度扩充
  ...africaEnrichmentEvents,
  ...southeastAsiaEnrichmentEvents,
  ...latinAmericaEnrichmentEvents,
  ...musicEnrichmentEvents,
  ...medicineEnrichmentEvents,
  ...explorationEnrichmentEvents,
  ...medievalEnrichmentEvents,
  ...enlightenmentEnrichmentEvents,
  ...modernGlobalizationEvents,
  ...philosophyEnrichmentEvents,
  // Round 2: 中国/日本/韩国/宗教/文学/欧亚/世界
  ...chinaDeepEvents,
  ...japanDeepEvents,
  ...koreaDeepEvents,
  ...religionDeepEvents,
  ...literatureDeepEvents,
  ...eurasiaDeepEvents,
  ...worldDeepEvents,
  // Round 3: 印度/战争/科技/薄弱地区/人物
  ...indiaDeepEvents,
  ...warfareDeepEvents,
  ...techDeepEvents,
  ...smallRegionEvents,
  ...figureAndExchangeEvents,
  // Round 4: 女性/经济/语言/法律/日常生活/科学前沿
  ...womenHistoryEvents,
  ...economicsEvents,
  ...languageEvents,
  ...lawAndRightsEvents,
  ...dailyLifeEvents,
  ...scienceAndFutureEvents,
  // Round 5: 电影/戏剧/舞蹈/建筑/教育/环保/外交/体育/传媒/时尚/摄影/城市
  ...cinemaEvents,
  ...theaterEvents,
  ...danceEvents,
  ...architectureDeepEvents,
  ...educationEvents,
  ...environmentEvents,
  ...diplomacyEvents,
  ...sportsEvents,
  ...mediaEvents,
  ...fashionEvents,
  ...photographyEvents,
  ...urbanEvents,
  // Round 6: 中亚/巴尔干/加勒比/非洲深化/中国近现代/科学家/发明家/哲学/冷战/宗教/数学
  ...centralAsiaEvents,
  ...balkanEvents,
  ...caribbeanPacificEvents,
  ...africaDeepEvents,
  ...chinaModernEvents,
  ...scientistEvents,
  ...inventorEvents,
  ...philosophyDeepEvents,
  ...coldWarEvents,
  ...religionDeep2Events,
  ...mathEvents,
  // Round 7: 史前/古典晚期/工业革命/世界大战/灾难/太空/文化交流/AI
  ...prehistoryEvents,
  ...lateAntiquityEvents,
  ...industrialDeepEvents,
  ...worldWarEvents,
  ...disasterEvents,
  ...spaceDeepEvents,
  ...culturalExchangeEvents,
  ...digitalAgeEvents,
  // Round 9: 心理学/社会学/民族运动/海洋/天文/密码学/图书馆/邮政/气象/矿业/纺织/陶瓷/园林
  ...psychologyEvents,
  ...sociologyEvents,
  ...nationalLiberationEvents,
  ...maritimeEvents,
  ...astronomyEvents,
  ...cryptographyEvents,
  ...libraryEvents,
  ...postalEvents,
  ...meteorologyEvents,
  ...miningEvents,
  ...textileEvents,
  ...ceramicsEvents,
  ...gardenEvents,
  // Round 10: 货币/保险/间谍/游戏/漫画/广告/博物馆/动物保护/消防/司法/奴隶废除/农业/能源
  ...currencyEvents,
  ...insuranceEvents,
  ...espionageEvents,
  ...gamingEvents,
  ...comicsEvents,
  ...advertisingEvents,
  ...museumEvents,
  ...conservationEvents,
  ...firefightingEvents,
  ...judicialEvents,
  ...abolitionEvents,
  ...agricultureEvents,
  ...energyEvents,
  // Round 11: 铁路/航空/汽车/考古/迁徙/节日/饮食/香料/地图/度量衡
  ...railwayEvents,
  ...aviationEvents,
  ...automobileEvents,
  ...archaeologyEvents,
  ...migrationEvents,
  ...festivalEvents,
  ...foodCultureEvents,
  ...spiceTradeEvents,
  ...cartographyEvents,
  ...cartographyHistoryEvents,
  ...measurementEvents,
  // 非洲文明早期补充
  ...africaEarlyEvents,
  // Round 12: 诗歌 + 音乐剧专题
  ...poetryEvents,
  ...musicalTheaterEvents,
  // Round 13: 诗经·唐诗·宋词·元曲
  ...shijingEvents,
  ...tangshiEvents,
  ...songciEvents,
  ...yuanquEvents,
  // 中国历史名人群像
  ...chinaFigureEvents,
  // 中国历史基础事件扩充（48条）
  ...chinaSeedExpansionEvents,
  // 宋代·明清深度扩充（20条）
  ...songMingQingDeepEvents,
  // 维京与北欧文明（15条）
  ...vikingNordicEvents,
  // Round 14: 荷兰/西班牙/东欧（50条）
  ...netherlandsEvents,
  ...spainEvents,
  ...easternEuropeEvents,
  // Round 15: 美国历史深度（45条）
  ...usColonialRevolutionEvents,
  ...usWestwardExpansionEvents,
  ...usCivilWarDeepEvents,
  ...usGildedProgressiveEvents,
  ...usDepressionWWIIEvents,
  ...usColdWarCivilRightsEvents,
  ...usContemporaryEvents,
  // Round 16: 美洲深度（拉美15 + 原住民9 + 美国文化10 = 34条）
  ...latinAmericaDeepEvents,
  ...nativeAmericasEvents,
  ...usaCultureDeepEvents,
  ...australiaDeepEvents,
  ...pacificEvents,
  ...newZealandDeepEvents,
  ...australiaTechEvents,
  ...pacificEnvironmentEvents,
  ...southeastAsiaDeepEvents,
  ...seaReligionEvents,
  ...indiaSubcontinentDeepEvents,
  ...middleEastDeepEvents,
  ...southAsiaDeepEvents,
  ...centralAsiaDeepEvents,
  ...israelPalestineDeepEvents,
  ...indiaSupplementEvents,
  ...pakistanSupplementEvents,
  ...modernFeminismEvents,
  ...modernHumanRightsEvents,
  ...modernLaborEvents,
  ...modernColdWarProxyEvents,
  ...modernHealthEvents,
  ...weakRegionPatchEvents,
  ...weakRegionPatch2Events,
  ...medicinePatchEvents,
  ...musicPatchEvents,
  ...shijingDeepEvents,
  ...weiJinLitEvents,
  ...tangPoetrySupplementEvents,
  ...songCiSupplementEvents,
  ...yuanQuSupplementEvents,
  ...mingQingLitEvents,
  ...modernChineseLitEvents,
  ...chineseCalligraphyEvents,
  ...chinesePaintingEvents,
  ...judaismDeepEvents,
  ...christianityDeepEvents,
  ...islamDeepEvents,
  ...buddhismDeepEvents,
  ...hinduismDeepEvents,
  ...taoismDeepEvents,
  ...confucianismDeepEvents,
  ...interFaithEvents,
  ...hinduismEnrichEvents,
  ...taoismEnrichEvents,
  ...operaDeepEvents,
  ...balletDeepEvents,
  ...musicalEnrichEvents,
  ...dramaEnrichEvents,
  ...broadwayEnrichEvents,
  ...westEndEnrichEvents,
  ...europeanMusicalEvents,
  ...australiaMusicalEvents,
  ...popMusicMilestonesEvents,
  ...popMusic21stEvents,
  ...cantopopEvents,
  ...taiwanPopEvents,
  ...jpopEvents,
  ...kpopDeepEvents,
  ...mainlandPopEvents,
  ...asianNewGenPopEvents,
  ...europeanLitEvents,
  ...modernWorldLitEvents,
  ...chineseNovelEnrichEvents,
  ...medicineMilestonesEvents,
  ...globalMedicineEvents,
  ...globalExplorationEvents,
  ...nonWesternPhilosophyEvents,
  ...architectureMilestonesEvents,
  ...westernPhilosophyEvents,
  ...prehistoryDeepEvents,
  ...twentyFirstCenturyEvents,
  ...quantumPhysicsEvents,
  ...chinaTechEvents,
  ...energyRevolutionEvents,
  ...communicationRevolutionEvents,
  ...aiMilestonesEvents,
  ...economicHistoryEvents,
  ...sportsHistoryEvents,
  ...explorationEvents,
  ...cinemaDeepEvents,
  ...mathHistoryEvents,
  ...environmentalHistoryEvents,
  ...worldPhilosophyVoicesEvents,
  ...medicineHumanityEvents,
  ...woodArchitectureEvents,
  ...fashionDesignEvents,
  ...worldWritingEvents,
  ...lawJusticeEvents,
  ...foodAgricultureEvents,
  ...smallNationsEvents,
  ...inlandEmpiresEvents,
  // Round 31: 伊斯兰科学黄金时代（翻译运动/代数/天文/光学/医学/工程）
  ...islamicGoldenAgeEvents,
  // Round 32: 被遗忘的她们——女性科学家从 3 世纪到 21 世纪的纵深
  ...womenScienceEvents,
  // Round 33: 失落的探索者——非西方航海家、商旅、地理发现（22条）
  ...lostExplorersEvents,
  ...portCitiesEvents,
  ...mountainFaithsEvents,
  ...sparseRegionsRound34Events,
  ...andesSaharaEvents,
  ...eastAfricaMediterraneanEvents,
  ...chileAndesEvents,
  ...iceAgeEvents,
  ...worldPhilosophyEvents,
  ...voyagesForgottenEvents,
  ...medicineShadowsEvents,
  ...faithsMarginsEvents,
  ...musicWorldTraditionsEvents,
  ...frontierExplorersEvents,
  ...nordicEasternEuropeEvents,
  ...evolve20260425Events,
  ...evolve202604251536Events,
  ...weakRegionsRound35Events,
]

export const historicalEventsMultiplier = HISTORICAL_EVENTS_MULTIPLIER

// ── P0 去重：按 title+year 去重，保留 details 最丰富的版本 ──
function deduplicateEvents(events: HistoricalEvent[]): HistoricalEvent[] {
  // 第一遍：决定每个 title+year 保留哪个 ID
  const bestByKey = new Map<string, { event: HistoricalEvent; score: number }>()
  const idRemapTo = new Map<string, string>() // 被删 ID → 保留 ID

  for (const event of events) {
    const key = `${event.title}|${event.year}`
    const score = (event.details?.length ?? 0) + (event.significance ?? 0) * 100
    const existing = bestByKey.get(key)
    if (!existing) {
      bestByKey.set(key, { event, score })
    } else if (score > existing.score) {
      // 新的更好，旧的 ID 映射到新的
      idRemapTo.set(existing.event.id, event.id)
      bestByKey.set(key, {
        event: { ...event, relatedIds: mergeRelatedIdArrays(existing.event.relatedIds, event.relatedIds) },
        score,
      })
    } else {
      // 旧的更好，新的 ID 映射到旧的
      idRemapTo.set(event.id, existing.event.id)
      bestByKey.set(key, {
        event: { ...existing.event, relatedIds: mergeRelatedIdArrays(existing.event.relatedIds, event.relatedIds) },
        score: existing.score,
      })
    }
  }

  const validIds = new Set(Array.from(bestByKey.values()).map(v => v.event.id))

  // 第二遍：清理 relatedIds，替换被删除的 ID 为保留的 ID
  return Array.from(bestByKey.values()).map(({ event }) => {
    if (!event.relatedIds) return event
    const cleaned = event.relatedIds
      .map(id => idRemapTo.get(id) ?? id) // 替换被删 ID
      .filter(id => id !== event.id && validIds.has(id)) // 移除自引用和无效 ID
    const unique = [...new Set(cleaned)]
    return { ...event, relatedIds: unique.length > 0 ? unique : undefined }
  })
}

function mergeRelatedIdArrays(a?: string[], b?: string[]): string[] | undefined {
  if (!a && !b) return undefined
  const merged = new Set([...(a ?? []), ...(b ?? [])])
  return merged.size > 0 ? Array.from(merged) : undefined
}

const deduplicatedEvents = deduplicateEvents(baseHistoricalEvents)

const baseWithCausalChains = injectCausalChains(deduplicatedEvents)
const baseWithFigures = injectChinaFigures(baseWithCausalChains)
const baseWithMilestoneDetails = injectMilestoneDetails(baseWithFigures)
const baseWithMilestoneDetails2 = injectMilestoneDetails2(baseWithMilestoneDetails)
const baseWithMilestoneDetails3 = injectMilestoneDetails3(baseWithMilestoneDetails2)
const baseWithMilestoneDetails4 = injectMilestoneDetails4(baseWithMilestoneDetails3)
const baseWithMilestoneDetails5 = injectMilestoneDetails5(baseWithMilestoneDetails4)
const baseWithMilestoneDetails6 = injectMilestoneDetails6(baseWithMilestoneDetails5)
const baseWithMilestoneDetails7 = injectMilestoneDetails7(baseWithMilestoneDetails6)
const baseWithDetails = injectImportantDetails(baseWithMilestoneDetails7)
const baseWithDetails2 = injectImportantDetails2(baseWithDetails)

export const historicalEvents: HistoricalEvent[] = expandHistoricalEvents(baseWithDetails2)
