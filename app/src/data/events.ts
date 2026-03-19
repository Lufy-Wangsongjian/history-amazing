import type { HistoricalEvent } from './types'
import { expandHistoricalEvents, HISTORICAL_EVENTS_MULTIPLIER } from './event-expansion'
import { ancientEvents, classicalEvents } from './events-ancient'
import { axialEvents, empireEvents } from './events-axial'
import { medievalEvents, preRenaissanceEvents } from './events-medieval'
import { renaissanceEvents, scientificRevolutionEvents } from './events-renaissance'
import { industrialEvents, modernEvents } from './events-modern'

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
]

export const historicalEventsMultiplier = HISTORICAL_EVENTS_MULTIPLIER

export const historicalEvents: HistoricalEvent[] = expandHistoricalEvents(baseHistoricalEvents)
