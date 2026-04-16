import type { HistoricalEvent } from './types'

/**
 * 中国历史名人群像扩充
 *
 * 1. 为现有中国事件补充/修正 figure 字段
 * 2. 新增 8 个以人物为中心的中国事件
 */

// ── figure 字段补丁 ──────────────────────────────────────
const FIGURE_PATCHES: Record<string, string> = {
  // events-china-dynasties.ts 中缺失 figure 的事件
  'cn032': '司马炎',               // 西晋
  'cn033': '黄巢',                 // 唐朝中后期
  'cn034': '蒋介石/孙中山',        // 中华民国

  // events-modern.ts
  'h008': '陈独秀/蔡元培',         // 五四运动

  // events-ancient.ts
  'e011': '商朝卜官',              // 甲骨文

  // events-medieval.ts
  'd004': '杨坚/杨广',             // 隋朝统一
}

/**
 * 将 figure 补丁注入到事件中（不覆盖已有 figure）
 */
export function injectChinaFigures(events: HistoricalEvent[]): HistoricalEvent[] {
  return events.map(event => {
    const patch = FIGURE_PATCHES[event.id]
    if (!patch) return event
    // 只在没有 figure 或 figure 为空时注入
    if (event.figure && event.figure.trim()) return event
    return { ...event, figure: patch }
  })
}

// ── 新增以人物为中心的中国事件 ──────────────────────────────────
export const chinaFigureEvents: HistoricalEvent[] = [
  {
    id: 'cfig001',
    year: -259,
    title: '嬴政出生·未来的千古一帝',
    description: '秦国王室嬴政出生于赵国邯郸。39年后，他将统一六国，成为中国第一位皇帝，彻底重塑中华文明的政治基因。',
    category: 'history',
    region: 'china',
    significance: 2,
    figure: '秦始皇',
  },
  {
    id: 'cfig002',
    year: 200,
    title: '华佗·中国外科医学先驱',
    description: '东汉末年名医华佗发明麻沸散（世界最早的全身麻醉药），擅长外科手术，创编五禽戏强身健体功法。',
    category: 'medicine',
    region: 'china',
    significance: 2,
    figure: '华佗',
  },
  {
    id: 'cfig003',
    year: 629,
    title: '玄奘西行取经',
    description: '唐代高僧玄奘只身西行五万里赴天竺取经，历时17年，带回657部佛经，其旅途记录《大唐西域记》成为研究中亚南亚的珍贵史料。',
    category: 'religion',
    region: 'china',
    significance: 2,
    figure: '玄奘',
    relatedIds: ['cex002'],
  },
  {
    id: 'cfig004',
    year: 1130,
    title: '岳飞·精忠报国',
    description: '南宋名将岳飞率岳家军抗金，战功赫赫，后被秦桧以"莫须有"罪名杀害。"精忠报国"成为中华民族忠义精神的象征。',
    category: 'warfare',
    region: 'china',
    significance: 2,
    figure: '岳飞/秦桧',
  },
  {
    id: 'cfig005',
    year: 1587,
    title: '万历十五年·被忽视的转折',
    description: '明万历十五年表面平静无事，但张居正已死、戚继光被弃、李贽入狱——黄仁宇认为这一年暗藏了明朝衰亡的全部密码。',
    category: 'history',
    region: 'china',
    significance: 2,
    figure: '万历帝/张居正/戚继光/李贽',
  },
  {
    id: 'cfig006',
    year: -372,
    title: '孟子·儒家亚圣',
    description: '孟子继承并发展孔子学说，提出"性善论""民为贵、社稷次之、君为轻"等核心思想，被尊为"亚圣"。',
    category: 'philosophy',
    region: 'china',
    significance: 2,
    figure: '孟子',
    relatedIds: ['e020'],
  },
  {
    id: 'cfig007',
    year: 1283,
    title: '文天祥就义·留取丹心照汗青',
    description: '南宋丞相文天祥在蒙古军攻灭南宋后拒绝投降，被囚三年不屈，写下《正气歌》《过零丁洋》后从容就义，成为中国忠义气节的永恒典范。',
    category: 'history',
    region: 'china',
    significance: 2,
    figure: '文天祥',
  },
  {
    id: 'cfig008',
    year: 1839,
    title: '林则徐虎门销烟',
    description: '钦差大臣林则徐在广东虎门海滩当众销毁2万余箱鸦片，展示了中国抵抗外来毒品侵害的决心，但随即引发中英鸦片战争。',
    category: 'history',
    region: 'china',
    significance: 2,
    figure: '林则徐',
    relatedIds: ['chm001'],
  },
]
