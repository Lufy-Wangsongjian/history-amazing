import type { Region } from './types'

export interface ContinentGroup {
  name: string
  regions: Region[]
}

export const CONTINENT_GROUPS: ContinentGroup[] = [
  {
    name: '东亚',
    regions: ['china', 'japan', 'korea', 'mongolia'],
  },
  {
    name: '东南亚',
    regions: ['vietnam', 'thailand', 'cambodia', 'myanmar', 'indonesia', 'philippines', 'malaysia', 'singapore'],
  },
  {
    name: '南亚',
    regions: ['india', 'pakistan', 'sri-lanka', 'nepal'],
  },
  {
    name: '中亚与西亚',
    regions: ['iran', 'iraq', 'turkey', 'israel', 'saudi-arabia', 'syria', 'uzbekistan', 'afghanistan'],
  },
  {
    name: '欧洲',
    regions: ['uk', 'france', 'germany', 'italy', 'spain', 'portugal', 'greece', 'russia', 'netherlands', 'poland', 'austria', 'sweden', 'switzerland', 'belgium', 'czech', 'norway', 'denmark', 'ireland', 'romania', 'hungary'],
  },
  {
    name: '非洲',
    regions: ['egypt', 'ethiopia', 'nigeria', 'south-africa', 'morocco', 'mali', 'kenya', 'tanzania'],
  },
  {
    name: '美洲',
    regions: ['usa', 'mexico', 'brazil', 'argentina', 'peru', 'colombia', 'canada', 'chile', 'cuba'],
  },
  {
    name: '大洋洲',
    regions: ['australia', 'new-zealand'],
  },
  {
    name: '跨区域',
    regions: ['global'],
  },
]
