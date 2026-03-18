// 历史事件的类目
export type Category =
  | 'literature'    // 文学
  | 'science'       // 科学
  | 'music'         // 音乐
  | 'art'           // 艺术
  | 'philosophy'    // 哲学
  | 'history'       // 历史事件
  | 'technology'    // 技术发明
  | 'architecture'  // 建筑
  | 'religion'      // 宗教与信仰
  | 'warfare'       // 军事与战争
  | 'exploration'   // 探索与地理
  | 'medicine'      // 医学与健康

export type Region =
  // 东亚
  | 'china'           // 中国
  | 'japan'           // 日本
  | 'korea'           // 韩国
  | 'mongolia'        // 蒙古
  // 东南亚
  | 'vietnam'         // 越南
  | 'thailand'        // 泰国
  | 'cambodia'        // 柬埔寨
  | 'myanmar'         // 缅甸
  | 'indonesia'       // 印度尼西亚
  | 'philippines'     // 菲律宾
  | 'malaysia'        // 马来西亚
  | 'singapore'       // 新加坡
  // 南亚
  | 'india'           // 印度
  | 'pakistan'         // 巴基斯坦
  | 'sri-lanka'       // 斯里兰卡
  | 'nepal'           // 尼泊尔
  // 中亚与西亚
  | 'iran'            // 伊朗/波斯
  | 'iraq'            // 伊拉克
  | 'turkey'          // 土耳其
  | 'israel'          // 以色列
  | 'saudi-arabia'    // 沙特阿拉伯
  | 'syria'           // 叙利亚
  | 'uzbekistan'      // 乌兹别克斯坦
  | 'afghanistan'     // 阿富汗
  // 欧洲
  | 'uk'              // 英国
  | 'france'          // 法国
  | 'germany'         // 德国
  | 'italy'           // 意大利
  | 'spain'           // 西班牙
  | 'portugal'        // 葡萄牙
  | 'greece'          // 希腊
  | 'russia'          // 俄罗斯
  | 'netherlands'     // 荷兰
  | 'poland'          // 波兰
  | 'austria'         // 奥地利
  | 'sweden'          // 瑞典
  | 'switzerland'     // 瑞士
  | 'belgium'         // 比利时
  | 'czech'           // 捷克
  | 'norway'          // 挪威
  | 'denmark'         // 丹麦
  | 'ireland'         // 爱尔兰
  | 'romania'         // 罗马尼亚
  | 'hungary'         // 匈牙利
  // 非洲
  | 'egypt'           // 埃及
  | 'ethiopia'        // 埃塞俄比亚
  | 'nigeria'         // 尼日利亚
  | 'south-africa'    // 南非
  | 'morocco'         // 摩洛哥
  | 'mali'            // 马里
  | 'kenya'           // 肯尼亚
  | 'tanzania'        // 坦桑尼亚
  // 美洲
  | 'usa'             // 美国
  | 'mexico'          // 墨西哥
  | 'brazil'          // 巴西
  | 'argentina'       // 阿根廷
  | 'peru'            // 秘鲁
  | 'colombia'        // 哥伦比亚
  | 'canada'          // 加拿大
  | 'chile'           // 智利
  | 'cuba'            // 古巴
  // 大洋洲
  | 'australia'       // 澳大利亚
  | 'new-zealand'     // 新西兰
  // 跨区域
  | 'global'          // 全球性

export interface HistoricalEvent {
  id: string
  year: number                // 负数表示公元前
  endYear?: number            // 可选，表示持续时间
  title: string
  description: string
  category: Category
  region: Region
  significance: 1 | 2 | 3    // 重要程度：1普通 2重要 3里程碑
  figure?: string             // 相关人物
  icon?: string               // 图标名
  relatedIds?: string[]       // 关联事件 ID（因果链）
}

export interface Era {
  name: string
  startYear: number
  endYear: number
  color: string
}

// 类目配置
export const CATEGORY_CONFIG: Record<Category, { label: string; color: string; icon: string }> = {
  literature:   { label: '文学',   color: '#E8A87C', icon: 'book-open' },
  science:      { label: '科学',   color: '#41B3A3', icon: 'flask-conical' },
  music:        { label: '音乐',   color: '#C38D9E', icon: 'music' },
  art:          { label: '艺术',   color: '#E27D60', icon: 'palette' },
  philosophy:   { label: '哲学',   color: '#85CDCA', icon: 'brain' },
  history:      { label: '历史',   color: '#D4A574', icon: 'landmark' },
  technology:   { label: '技术',   color: '#659DBD', icon: 'cog' },
  architecture: { label: '建筑',   color: '#DAAD86', icon: 'building-2' },
  religion:     { label: '宗教',   color: '#9B59B6', icon: 'church' },
  warfare:      { label: '军事',   color: '#C0392B', icon: 'swords' },
  exploration:  { label: '探索',   color: '#2980B9', icon: 'compass' },
  medicine:     { label: '医学',   color: '#27AE60', icon: 'heart-pulse' },
}

export const REGION_CONFIG: Record<Region, { label: string; flag: string; color: string }> = {
  // 东亚
  'china':         { label: '中国',       flag: '🇨🇳', color: '#DE2910' },
  'japan':         { label: '日本',       flag: '🇯🇵', color: '#BC002D' },
  'korea':         { label: '韩国',       flag: '🇰🇷', color: '#003478' },
  'mongolia':      { label: '蒙古',       flag: '🇲🇳', color: '#015197' },
  // 东南亚
  'vietnam':       { label: '越南',       flag: '🇻🇳', color: '#DA251D' },
  'thailand':      { label: '泰国',       flag: '🇹🇭', color: '#2D2A4A' },
  'cambodia':      { label: '柬埔寨',     flag: '🇰🇭', color: '#032EA1' },
  'myanmar':       { label: '缅甸',       flag: '🇲🇲', color: '#FECB00' },
  'indonesia':     { label: '印度尼西亚', flag: '🇮🇩', color: '#CE1126' },
  'philippines':   { label: '菲律宾',     flag: '🇵🇭', color: '#0038A8' },
  'malaysia':      { label: '马来西亚',   flag: '🇲🇾', color: '#010066' },
  'singapore':     { label: '新加坡',     flag: '🇸🇬', color: '#EF3340' },
  // 南亚
  'india':         { label: '印度',       flag: '🇮🇳', color: '#FF9933' },
  'pakistan':       { label: '巴基斯坦',   flag: '🇵🇰', color: '#01411C' },
  'sri-lanka':     { label: '斯里兰卡',   flag: '🇱🇰', color: '#8D153A' },
  'nepal':         { label: '尼泊尔',     flag: '🇳🇵', color: '#DC143C' },
  // 中亚与西亚
  'iran':          { label: '伊朗',       flag: '🇮🇷', color: '#239F40' },
  'iraq':          { label: '伊拉克',     flag: '🇮🇶', color: '#007A3D' },
  'turkey':        { label: '土耳其',     flag: '🇹🇷', color: '#E30A17' },
  'israel':        { label: '以色列',     flag: '🇮🇱', color: '#0038B8' },
  'saudi-arabia':  { label: '沙特阿拉伯', flag: '🇸🇦', color: '#006C35' },
  'syria':         { label: '叙利亚',     flag: '🇸🇾', color: '#CE1126' },
  'uzbekistan':    { label: '乌兹别克斯坦', flag: '🇺🇿', color: '#1EB53A' },
  'afghanistan':   { label: '阿富汗',     flag: '🇦🇫', color: '#000000' },
  // 欧洲
  'uk':            { label: '英国',       flag: '🇬🇧', color: '#00247D' },
  'france':        { label: '法国',       flag: '🇫🇷', color: '#002395' },
  'germany':       { label: '德国',       flag: '🇩🇪', color: '#DD0000' },
  'italy':         { label: '意大利',     flag: '🇮🇹', color: '#008C45' },
  'spain':         { label: '西班牙',     flag: '🇪🇸', color: '#AA151B' },
  'portugal':      { label: '葡萄牙',     flag: '🇵🇹', color: '#006600' },
  'greece':        { label: '希腊',       flag: '🇬🇷', color: '#0D5EAF' },
  'russia':        { label: '俄罗斯',     flag: '🇷🇺', color: '#0039A6' },
  'netherlands':   { label: '荷兰',       flag: '🇳🇱', color: '#AE1C28' },
  'poland':        { label: '波兰',       flag: '🇵🇱', color: '#DC143C' },
  'austria':       { label: '奥地利',     flag: '🇦🇹', color: '#ED2939' },
  'sweden':        { label: '瑞典',       flag: '🇸🇪', color: '#006AA7' },
  'switzerland':   { label: '瑞士',       flag: '🇨🇭', color: '#FF0000' },
  'belgium':       { label: '比利时',     flag: '🇧🇪', color: '#2D2926' },
  'czech':         { label: '捷克',       flag: '🇨🇿', color: '#11457E' },
  'norway':        { label: '挪威',       flag: '🇳🇴', color: '#BA0C2F' },
  'denmark':       { label: '丹麦',       flag: '🇩🇰', color: '#C60C30' },
  'ireland':       { label: '爱尔兰',     flag: '🇮🇪', color: '#169B62' },
  'romania':       { label: '罗马尼亚',   flag: '🇷🇴', color: '#002B7F' },
  'hungary':       { label: '匈牙利',     flag: '🇭🇺', color: '#436F4D' },
  // 非洲
  'egypt':         { label: '埃及',       flag: '🇪🇬', color: '#C8102E' },
  'ethiopia':      { label: '埃塞俄比亚', flag: '🇪🇹', color: '#009739' },
  'nigeria':       { label: '尼日利亚',   flag: '🇳🇬', color: '#008751' },
  'south-africa':  { label: '南非',       flag: '🇿🇦', color: '#007749' },
  'morocco':       { label: '摩洛哥',     flag: '🇲🇦', color: '#C1272D' },
  'mali':          { label: '马里',       flag: '🇲🇱', color: '#14B53A' },
  'kenya':         { label: '肯尼亚',     flag: '🇰🇪', color: '#006600' },
  'tanzania':      { label: '坦桑尼亚',   flag: '🇹🇿', color: '#1EB53A' },
  // 美洲
  'usa':           { label: '美国',       flag: '🇺🇸', color: '#3C3B6E' },
  'mexico':        { label: '墨西哥',     flag: '🇲🇽', color: '#006847' },
  'brazil':        { label: '巴西',       flag: '🇧🇷', color: '#009C3B' },
  'argentina':     { label: '阿根廷',     flag: '🇦🇷', color: '#74ACDF' },
  'peru':          { label: '秘鲁',       flag: '🇵🇪', color: '#D91023' },
  'colombia':      { label: '哥伦比亚',   flag: '🇨🇴', color: '#FCD116' },
  'canada':        { label: '加拿大',     flag: '🇨🇦', color: '#FF0000' },
  'chile':         { label: '智利',       flag: '🇨🇱', color: '#D52B1E' },
  'cuba':          { label: '古巴',       flag: '🇨🇺', color: '#002A8F' },
  // 大洋洲
  'australia':     { label: '澳大利亚',   flag: '🇦🇺', color: '#00008B' },
  'new-zealand':   { label: '新西兰',     flag: '🇳🇿', color: '#00247D' },
  // 跨区域
  'global':        { label: '全球',       flag: '🌐', color: '#6B7280' },
}

// 时代划分
export const ERAS: Era[] = [
  { name: '远古文明',     startYear: -4000, endYear: -2000, color: '#8B7355' },
  { name: '古典时代',     startYear: -2000, endYear: -500,  color: '#CD853F' },
  { name: '轴心时代',     startYear: -500,  endYear: 0,     color: '#DAA520' },
  { name: '帝国时代',     startYear: 0,     endYear: 500,   color: '#B8860B' },
  { name: '中世纪',       startYear: 500,   endYear: 1200,  color: '#4A6741' },
  { name: '文艺复兴前夜', startYear: 1200,  endYear: 1400,  color: '#4682B4' },
  { name: '文艺复兴',     startYear: 1400,  endYear: 1600,  color: '#9370DB' },
  { name: '科学革命',     startYear: 1600,  endYear: 1800,  color: '#20B2AA' },
  { name: '工业时代',     startYear: 1800,  endYear: 1900,  color: '#708090' },
  { name: '现代',         startYear: 1900,  endYear: 2030,  color: '#4169E1' },
]

export function formatYear(year: number): string {
  if (year < 0) return `公元前 ${Math.abs(year)} 年`
  return `公元 ${year} 年`
}

export function getEra(year: number): Era | undefined {
  return ERAS.find(e => year >= e.startYear && year < e.endYear)
}
