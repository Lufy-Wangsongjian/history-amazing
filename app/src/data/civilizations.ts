import type { Region } from './types'

/**
 * 文明圈定义
 *
 * 将世界分为 8 个主要文明圈，每个文明圈包含若干个 Region。
 * 用于 CompareView 多文明对比。
 */

export interface CivilizationCircle {
  id: string
  label: string
  shortLabel: string      // 短名（用于窄屏标签）
  color: string           // 主题色
  bgColor: string         // 背景色（低透明度）
  borderColor: string     // 边框色
  regions: Set<Region>
  description: string     // 一句话描述
}

export const CIVILIZATION_CIRCLES: CivilizationCircle[] = [
  {
    id: 'east-asia',
    label: '东亚文明',
    shortLabel: '东亚',
    color: '#DE2910',
    bgColor: 'rgba(222,41,16,0.06)',
    borderColor: 'rgba(222,41,16,0.15)',
    regions: new Set<Region>([
      'china', 'taiwan', 'hong-kong', 'macau', 'japan', 'korea', 'north-korea', 'mongolia',
      'vietnam',
    ]),
    description: '以儒学、汉字文化圈和稻作农业为纽带的文明体系',
  },
  {
    id: 'south-asia',
    label: '印度文明',
    shortLabel: '印度',
    color: '#FF9933',
    bgColor: 'rgba(255,153,51,0.06)',
    borderColor: 'rgba(255,153,51,0.15)',
    regions: new Set<Region>([
      'india', 'pakistan', 'bangladesh', 'sri-lanka', 'nepal', 'bhutan',
    ]),
    description: '以印度教、佛教和梵文传统为核心的文明体系',
  },
  {
    id: 'middle-east',
    label: '中东文明',
    shortLabel: '中东',
    color: '#006C35',
    bgColor: 'rgba(0,108,53,0.06)',
    borderColor: 'rgba(0,108,53,0.15)',
    regions: new Set<Region>([
      'iran', 'iraq', 'turkey', 'israel', 'lebanon', 'jordan', 'saudi-arabia', 'syria',
      'afghanistan', 'egypt', 'morocco', 'algeria',
    ]),
    description: '两河流域、波斯和伊斯兰文明的交汇之地',
  },
  {
    id: 'europe',
    label: '欧洲文明',
    shortLabel: '欧洲',
    color: '#003399',
    bgColor: 'rgba(0,51,153,0.06)',
    borderColor: 'rgba(0,51,153,0.15)',
    regions: new Set<Region>([
      'uk', 'france', 'germany', 'italy', 'spain', 'portugal', 'greece', 'russia', 'ukraine',
      'netherlands', 'poland', 'austria', 'sweden', 'finland', 'switzerland', 'belgium',
      'czech', 'norway', 'denmark', 'ireland', 'romania', 'hungary', 'serbia',
    ]),
    description: '以希腊罗马传统和基督教为根基的文明体系',
  },
  {
    id: 'americas',
    label: '美洲文明',
    shortLabel: '美洲',
    color: '#3C3B6E',
    bgColor: 'rgba(60,59,110,0.06)',
    borderColor: 'rgba(60,59,110,0.15)',
    regions: new Set<Region>([
      'usa', 'mexico', 'brazil', 'argentina', 'peru', 'colombia', 'venezuela', 'bolivia',
      'canada', 'chile', 'cuba',
    ]),
    description: '从玛雅阿兹特克到近代新大陆的多元文明',
  },
  {
    id: 'africa',
    label: '非洲文明',
    shortLabel: '非洲',
    color: '#009739',
    bgColor: 'rgba(0,151,57,0.06)',
    borderColor: 'rgba(0,151,57,0.15)',
    regions: new Set<Region>([
      'ethiopia', 'nigeria', 'south-africa', 'mali', 'ghana', 'kenya', 'tanzania', 'sudan',
    ]),
    description: '人类的摇篮，从库施到桑海帝国的多彩文明',
  },
  {
    id: 'southeast-asia',
    label: '东南亚文明',
    shortLabel: '东南亚',
    color: '#032EA1',
    bgColor: 'rgba(3,46,161,0.06)',
    borderColor: 'rgba(3,46,161,0.15)',
    regions: new Set<Region>([
      'thailand', 'cambodia', 'laos', 'myanmar', 'indonesia', 'philippines', 'malaysia',
      'singapore',
    ]),
    description: '印度教、佛教与海洋贸易交织的热带文明',
  },
  {
    id: 'central-asia',
    label: '中亚文明',
    shortLabel: '中亚',
    color: '#00AFCA',
    bgColor: 'rgba(0,175,202,0.06)',
    borderColor: 'rgba(0,175,202,0.15)',
    regions: new Set<Region>([
      'kazakhstan', 'uzbekistan',
    ]),
    description: '丝绸之路的十字路口，游牧与定居文化的交汇',
  },
]

/** 根据 Region 查找所属文明圈 */
export function getCivilizationCircle(region: Region): CivilizationCircle | undefined {
  return CIVILIZATION_CIRCLES.find(c => c.regions.has(region))
}

/** 用 Region 反查 civilization id */
export function getCivilizationId(region: Region): string | undefined {
  return CIVILIZATION_CIRCLES.find(c => c.regions.has(region))?.id
}

/** 根据 id 获取文明圈 */
export function getCivilizationById(id: string): CivilizationCircle | undefined {
  return CIVILIZATION_CIRCLES.find(c => c.id === id)
}
