import type { HistoricalEvent } from './types'
import { expandHistoricalEvents, HISTORICAL_EVENTS_MULTIPLIER } from './event-expansion'
import { injectCausalChains } from './causal-chains'
import { injectMilestoneDetails } from './milestone-details-patch'
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
// 非洲文明早期事件补充
import { africaEarlyEvents } from './events-africa-early'

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
  ...measurementEvents,
  // 非洲文明早期补充
  ...africaEarlyEvents,
]

export const historicalEventsMultiplier = HISTORICAL_EVENTS_MULTIPLIER

const baseWithCausalChains = injectCausalChains(baseHistoricalEvents)
const baseWithDetails = injectMilestoneDetails(baseWithCausalChains)

export const historicalEvents: HistoricalEvent[] = expandHistoricalEvents(baseWithDetails)
