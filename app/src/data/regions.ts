import type { Region } from './types'

export interface ContinentGroup {
  name: string
  regions: Region[]
}

export const CONTINENT_GROUPS: ContinentGroup[] = [
  {
    name: '东亚',
    regions: ['china', 'taiwan', 'hong-kong', 'macau', 'japan', 'korea', 'north-korea', 'mongolia'],
  },
  {
    name: '东南亚',
    regions: ['vietnam', 'thailand', 'cambodia', 'laos', 'myanmar', 'indonesia', 'philippines', 'malaysia', 'singapore'],
  },
  {
    name: '南亚',
    regions: ['india', 'pakistan', 'bangladesh', 'sri-lanka', 'nepal', 'bhutan'],
  },
  {
    name: '中亚与西亚',
    regions: ['kazakhstan', 'iran', 'iraq', 'turkey', 'israel', 'lebanon', 'jordan', 'saudi-arabia', 'syria', 'uzbekistan', 'afghanistan'],
  },
  {
    name: '欧洲',
    regions: ['uk', 'france', 'germany', 'italy', 'spain', 'portugal', 'greece', 'russia', 'ukraine', 'netherlands', 'poland', 'austria', 'sweden', 'finland', 'switzerland', 'belgium', 'czech', 'norway', 'denmark', 'ireland', 'romania', 'hungary', 'serbia'],
  },
  {
    name: '非洲',
    regions: ['egypt', 'ethiopia', 'nigeria', 'south-africa', 'morocco', 'algeria', 'mali', 'sudan', 'ghana', 'kenya', 'tanzania'],
  },
  {
    name: '美洲',
    regions: ['usa', 'mexico', 'brazil', 'argentina', 'peru', 'colombia', 'venezuela', 'bolivia', 'canada', 'chile', 'cuba'],
  },
  {
    name: '大洋洲',
    regions: ['australia', 'new-zealand'],
  },
]

export const ALL_REGIONS = Array.from(new Set(CONTINENT_GROUPS.flatMap(group => group.regions)))

const ALL_REGION_SET = new Set<Region>(ALL_REGIONS)

export function getVisibleSelectedRegions(selectedRegions: Iterable<Region>) {
  return Array.from(selectedRegions).filter(region => ALL_REGION_SET.has(region))
}

export function getEffectiveRegionFilters(selectedRegions: Iterable<Region>) {
  const visibleRegions = getVisibleSelectedRegions(selectedRegions)

  if (visibleRegions.length === 0 || visibleRegions.length === ALL_REGIONS.length) {
    return []
  }

  return visibleRegions
}
