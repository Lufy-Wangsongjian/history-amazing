import type { HistoricalEvent } from './types'
import { ancientEvents, classicalEvents } from './events-ancient'
import { axialEvents, empireEvents } from './events-axial'
import { medievalEvents, preRenaissanceEvents } from './events-medieval'
import { renaissanceEvents, scientificRevolutionEvents } from './events-renaissance'
import { industrialEvents, modernEvents } from './events-modern'

export const historicalEvents: HistoricalEvent[] = [
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
