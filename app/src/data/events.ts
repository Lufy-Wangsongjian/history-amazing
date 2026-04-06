import type { HistoricalEvent } from './types'
import { expandHistoricalEvents, HISTORICAL_EVENTS_MULTIPLIER } from './event-expansion'
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
]

export const historicalEventsMultiplier = HISTORICAL_EVENTS_MULTIPLIER

export const historicalEvents: HistoricalEvent[] = expandHistoricalEvents(baseHistoricalEvents)
