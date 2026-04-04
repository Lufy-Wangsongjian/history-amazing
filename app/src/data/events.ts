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
]

export const historicalEventsMultiplier = HISTORICAL_EVENTS_MULTIPLIER

export const historicalEvents: HistoricalEvent[] = expandHistoricalEvents(baseHistoricalEvents)
