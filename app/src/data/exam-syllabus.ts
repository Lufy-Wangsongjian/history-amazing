/**
 * 中考/高考历史大纲考点映射
 * 每个考点关联事件 ID 和关键词（用于模糊匹配）
 */

export interface ExamTopic {
  id: string
  name: string
  level: 'zhongkao' | 'gaokao' | 'both'
  module: string // 大纲模块
  keywords: string[]
  eventIds: string[]
  description: string
}

export const EXAM_TOPICS: ExamTopic[] = [
  // ──────── 中国古代史 ────────
  {
    id: 'exam-xia-shang-zhou',
    name: '夏商周的更替',
    level: 'both',
    module: '中国古代史',
    keywords: ['夏朝', '商朝', '西周', '青铜', '甲骨文', '分封制', '周武王'],
    eventIds: [],
    description: '夏商周三代更替、分封制与宗法制、青铜文明与甲骨文',
  },
  {
    id: 'exam-spring-autumn',
    name: '春秋战国的纷争与变革',
    level: 'both',
    module: '中国古代史',
    keywords: ['春秋', '战国', '商鞅变法', '百家争鸣', '孔子', '老子', '孟子', '韩非子', '墨子', '合纵连横'],
    eventIds: [],
    description: '春秋五霸与战国七雄、商鞅变法、百家争鸣',
  },
  {
    id: 'exam-qin-unification',
    name: '秦统一中国',
    level: 'both',
    module: '中国古代史',
    keywords: ['秦始皇', '统一', '郡县制', '焚书坑儒', '长城', '兵马俑', '秦朝'],
    eventIds: [],
    description: '秦始皇统一六国、中央集权制度的建立、万里长城',
  },
  {
    id: 'exam-han-dynasty',
    name: '汉朝的兴衰',
    level: 'both',
    module: '中国古代史',
    keywords: ['汉武帝', '丝绸之路', '张骞', '罢黜百家', '独尊儒术', '西汉', '东汉', '蔡伦', '造纸', '司马迁', '史记'],
    eventIds: [],
    description: '汉武帝大一统、丝绸之路、造纸术改进、《史记》',
  },
  {
    id: 'exam-three-kingdoms',
    name: '三国两晋南北朝',
    level: 'zhongkao',
    module: '中国古代史',
    keywords: ['三国', '魏晋', '南北朝', '诸葛亮', '赤壁之战', '北魏孝文帝', '民族融合'],
    eventIds: [],
    description: '三国鼎立、北魏孝文帝改革、民族融合',
  },
  {
    id: 'exam-sui-tang',
    name: '隋唐的繁荣与开放',
    level: 'both',
    module: '中国古代史',
    keywords: ['隋朝', '唐朝', '科举', '贞观之治', '开元盛世', '玄奘', '大运河', '唐太宗', '唐诗', '李白', '杜甫', '安史之乱'],
    eventIds: [],
    description: '科举制度、贞观之治、开元盛世、唐代文化繁荣',
  },
  {
    id: 'exam-song-yuan',
    name: '宋元时期',
    level: 'both',
    module: '中国古代史',
    keywords: ['宋朝', '元朝', '活字印刷', '指南针', '火药', '成吉思汗', '忽必烈', '岳飞', '王安石变法', '市舶司'],
    eventIds: [],
    description: '宋代经济繁荣、四大发明、蒙古帝国与元朝',
  },
  {
    id: 'exam-ming-qing',
    name: '明清时期',
    level: 'both',
    module: '中国古代史',
    keywords: ['明朝', '清朝', '郑和', '下西洋', '闭关锁国', '康熙', '雍正', '乾隆', '八股文', '朱元璋', '故宫', '紫禁城'],
    eventIds: [],
    description: '郑和下西洋、明清专制强化、闭关锁国政策',
  },

  // ──────── 中国近现代史 ────────
  {
    id: 'exam-opium-war',
    name: '鸦片战争与近代开端',
    level: 'both',
    module: '中国近现代史',
    keywords: ['鸦片战争', '南京条约', '林则徐', '虎门销烟', '不平等条约', '五口通商'],
    eventIds: [],
    description: '鸦片战争、《南京条约》、中国近代史的开端',
  },
  {
    id: 'exam-taiping',
    name: '太平天国运动',
    level: 'zhongkao',
    module: '中国近现代史',
    keywords: ['太平天国', '洪秀全', '天京'],
    eventIds: [],
    description: '太平天国运动的兴衰',
  },
  {
    id: 'exam-westernization',
    name: '洋务运动与维新变法',
    level: 'both',
    module: '中国近现代史',
    keywords: ['洋务运动', '维新变法', '戊戌变法', '李鸿章', '曾国藩', '康有为', '梁启超', '自强', '求富'],
    eventIds: [],
    description: '洋务运动、百日维新、近代化探索',
  },
  {
    id: 'exam-1911-revolution',
    name: '辛亥革命',
    level: 'both',
    module: '中国近现代史',
    keywords: ['辛亥革命', '孙中山', '中华民国', '三民主义', '武昌起义', '清帝退位'],
    eventIds: [],
    description: '辛亥革命、中华民国成立、封建帝制终结',
  },
  {
    id: 'exam-new-culture',
    name: '新文化运动与五四运动',
    level: 'both',
    module: '中国近现代史',
    keywords: ['新文化运动', '五四运动', '陈独秀', '鲁迅', '胡适', '马克思主义', '白话文'],
    eventIds: [],
    description: '新文化运动、五四爱国运动、马克思主义传播',
  },
  {
    id: 'exam-cpc-founding',
    name: '中国共产党成立',
    level: 'both',
    module: '中国近现代史',
    keywords: ['中国共产党', '一大', '嘉兴南湖', '长征', '遵义会议', '延安'],
    eventIds: [],
    description: '中共成立、国共合作与分裂、长征与遵义会议',
  },
  {
    id: 'exam-anti-japanese',
    name: '抗日战争',
    level: 'both',
    module: '中国近现代史',
    keywords: ['抗日战争', '七七事变', '卢沟桥', '南京大屠杀', '百团大战', '台儿庄', '抗战胜利'],
    eventIds: [],
    description: '全民族抗战、重大战役、抗战胜利',
  },
  {
    id: 'exam-prc-founding',
    name: '新中国成立',
    level: 'both',
    module: '中国近现代史',
    keywords: ['开国大典', '新中国', '土地改革', '抗美援朝', '三大改造'],
    eventIds: [],
    description: '中华人民共和国成立、社会主义改造',
  },
  {
    id: 'exam-reform-opening',
    name: '改革开放',
    level: 'both',
    module: '中国近现代史',
    keywords: ['改革开放', '深圳特区', '家庭联产承包', '邓小平', '经济特区', '社会主义市场经济', '一国两制'],
    eventIds: [],
    description: '十一届三中全会、经济特区、社会主义现代化建设',
  },

  // ──────── 世界古代史 ────────
  {
    id: 'exam-ancient-egypt',
    name: '古代埃及文明',
    level: 'both',
    module: '世界古代史',
    keywords: ['金字塔', '法老', '尼罗河', '象形文字', '图坦卡蒙', '埃及'],
    eventIds: [],
    description: '尼罗河文明、金字塔、法老统治',
  },
  {
    id: 'exam-mesopotamia',
    name: '两河流域文明',
    level: 'both',
    module: '世界古代史',
    keywords: ['两河流域', '美索不达米亚', '汉谟拉比', '楔形文字', '苏美尔', '巴比伦'],
    eventIds: [],
    description: '两河流域文明、《汉谟拉比法典》、楔形文字',
  },
  {
    id: 'exam-ancient-greece',
    name: '古希腊文明',
    level: 'both',
    module: '世界古代史',
    keywords: ['雅典', '民主', '斯巴达', '伯里克利', '奥运会', '希腊', '亚里士多德', '柏拉图', '苏格拉底', '亚历山大'],
    eventIds: [],
    description: '雅典民主制度、古希腊哲学与文化、亚历山大帝国',
  },
  {
    id: 'exam-roman-empire',
    name: '古罗马帝国',
    level: 'both',
    module: '世界古代史',
    keywords: ['罗马', '共和', '帝国', '凯撒', '奥古斯都', '罗马法', '角斗场', '基督教'],
    eventIds: [],
    description: '罗马共和国到帝国、罗马法、基督教的兴起',
  },
  {
    id: 'exam-ancient-india',
    name: '古代印度',
    level: 'zhongkao',
    module: '世界古代史',
    keywords: ['印度', '种姓制度', '佛教', '释迦牟尼', '阿育王', '莫卧儿'],
    eventIds: [],
    description: '种姓制度、佛教创立、孔雀王朝',
  },

  // ──────── 世界近现代史 ────────
  {
    id: 'exam-renaissance',
    name: '文艺复兴',
    level: 'both',
    module: '世界近现代史',
    keywords: ['文艺复兴', '达芬奇', '米开朗基罗', '莎士比亚', '人文主义', '但丁'],
    eventIds: [],
    description: '文艺复兴运动、人文主义思潮、文化巨匠',
  },
  {
    id: 'exam-age-of-discovery',
    name: '新航路开辟与殖民扩张',
    level: 'both',
    module: '世界近现代史',
    keywords: ['哥伦布', '麦哲伦', '达伽马', '新航路', '大航海', '殖民', '地理大发现'],
    eventIds: [],
    description: '新航路开辟、殖民扩张与世界市场形成',
  },
  {
    id: 'exam-english-revolution',
    name: '英国资产阶级革命',
    level: 'both',
    module: '世界近现代史',
    keywords: ['光荣革命', '权利法案', '君主立宪', '克伦威尔', '英国革命'],
    eventIds: [],
    description: '英国资产阶级革命、《权利法案》、君主立宪制',
  },
  {
    id: 'exam-american-independence',
    name: '美国独立战争',
    level: 'both',
    module: '世界近现代史',
    keywords: ['独立宣言', '华盛顿', '美国独立', '美国革命', '1776'],
    eventIds: [],
    description: '美国独立战争、《独立宣言》',
  },
  {
    id: 'exam-french-revolution',
    name: '法国大革命',
    level: 'both',
    module: '世界近现代史',
    keywords: ['法国大革命', '人权宣言', '攻占巴士底狱', '拿破仑', '启蒙运动', '卢梭', '伏尔泰', '孟德斯鸠'],
    eventIds: [],
    description: '启蒙运动、法国大革命、拿破仑帝国',
  },
  {
    id: 'exam-industrial-revolution',
    name: '工业革命',
    level: 'both',
    module: '世界近现代史',
    keywords: ['工业革命', '蒸汽机', '瓦特', '珍妮纺纱机', '工厂制', '铁路', '第二次工业革命', '电力', '爱迪生'],
    eventIds: [],
    description: '第一次工业革命、第二次工业革命、技术变革与社会影响',
  },
  {
    id: 'exam-ww1',
    name: '第一次世界大战',
    level: 'both',
    module: '世界近现代史',
    keywords: ['第一次世界大战', '一战', '萨拉热窝', '凡尔赛条约', '同盟国', '协约国'],
    eventIds: [],
    description: '一战的起因、过程和影响、凡尔赛体系',
  },
  {
    id: 'exam-russian-revolution',
    name: '俄国十月革命',
    level: 'both',
    module: '世界近现代史',
    keywords: ['十月革命', '列宁', '苏维埃', '布尔什维克', '苏联'],
    eventIds: [],
    description: '十月革命、世界上第一个社会主义国家的建立',
  },
  {
    id: 'exam-ww2',
    name: '第二次世界大战',
    level: 'both',
    module: '世界近现代史',
    keywords: ['第二次世界大战', '二战', '希特勒', '纳粹', '诺曼底', '珍珠港', '原子弹', '联合国', '法西斯', '斯大林格勒', '反法西斯'],
    eventIds: [],
    description: '二战的起因、主要战役、反法西斯战争胜利、联合国成立',
  },
  {
    id: 'exam-cold-war',
    name: '冷战',
    level: 'gaokao',
    module: '世界近现代史',
    keywords: ['冷战', '铁幕', '杜鲁门', '马歇尔计划', '北约', '华约', '柏林墙', '古巴导弹危机', '苏联解体'],
    eventIds: [],
    description: '美苏冷战、两极格局、苏联解体与冷战结束',
  },
  {
    id: 'exam-globalization',
    name: '经济全球化与多极化',
    level: 'gaokao',
    module: '世界近现代史',
    keywords: ['全球化', '世贸组织', 'WTO', '欧盟', '多极化', '信息革命', '互联网'],
    eventIds: [],
    description: '经济全球化趋势、世界多极化、信息技术革命',
  },
]

/** 按大纲模块分组 */
export const EXAM_MODULES = [
  '中国古代史', '中国近现代史', '世界古代史', '世界近现代史',
] as const

/** 判断一个事件是否匹配某考点 */
export function matchesExamTopic(event: { id: string; title: string; description: string }, topic: ExamTopic): boolean {
  if (topic.eventIds.includes(event.id)) return true
  const text = `${event.title} ${event.description}`
  return topic.keywords.some(kw => text.includes(kw))
}

/** 获取事件关联的所有考点 */
export function getExamTopicsForEvent(event: { id: string; title: string; description: string }): ExamTopic[] {
  return EXAM_TOPICS.filter(topic => matchesExamTopic(event, topic))
}
