# Chrono Atlas — 产品设计文档

> **产品名称**：Chrono Atlas（时间地图）  
> **产品定位**：6000 年人类文明交互式时间线可视化探索平台  
> **文档版本**：v3.0  
> **更新日期**：2026-04-06  
> **在线地址**：http://211.159.224.65:3001

---

## 一、产品概览

Chrono Atlas 是一个覆盖公元前 4000 年至公元 2030 年的交互式历史知识平台。它将近 6000 条历史事件（1199 条基础事件 + 5x 自动扩展）组织在 12 个类目、70+ 个国家/地区、10 个时代分期的多维数据体系中，通过 5 种视图模式、10+ 种交互功能和游戏化成就系统，让用户从"看数据"变成"感受历史"。

### 核心数据

| 维度 | 数值 |
|------|------|
| 时间跨度 | 公元前 4000 年 — 公元 2030 年（6030 年） |
| 基础事件 | 1,199 条 |
| 扩展后总事件 | 5,995 条（含 4 类衍生上下文事件） |
| 事件类目 | 12 个（文学/科学/音乐/艺术/哲学/历史/技术/建筑/宗教/军事/探索/医学） |
| 国家/地区 | 76 个（覆盖 8 大洲） |
| 时代分期 | 10 个（远古文明 → 现代） |
| 里程碑事件 | significance=3，改变文明走向的关键节点 |
| 数据库大小 | ~8.28 MB（SQLite） |

---

## 二、技术架构

### 2.1 技术栈

| 层级 | 技术 |
|------|------|
| 前端框架 | React 19 + TypeScript 5.9 |
| 构建工具 | Vite 7 |
| 样式方案 | TailwindCSS 3 + tailwindcss-animate |
| UI 原语 | Radix UI（Dialog / ScrollArea / Slider / Tooltip） |
| 图标 | Lucide React（1000+ SVG 图标） |
| 后端框架 | Express 5 |
| 数据库 | SQLite（better-sqlite3）+ FTS5 全文搜索 |
| 运行时 | Node.js 20 |
| E2E 测试 | Playwright |
| 部署 | Docker 多阶段构建 → 腾讯云轻量应用服务器（上海） |

### 2.2 架构模式

前后端分离的 Monorepo 架构：

```
history-amazing/
├── app/                          # 前端 SPA
│   └── src/
│       ├── components/  (29 个业务组件 + 8 个 UI 基础组件)
│       ├── hooks/       (6 个自定义 Hook)
│       ├── lib/         (5 个工具模块)
│       └── data/        (16 个数据文件)
├── server/                       # 后端 API
│   └── src/
│       ├── index.ts     (Express 路由 + 静态托管)
│       ├── db.ts        (SQLite 连接 + Schema)
│       └── seed.ts      (数据种子脚本)
├── e2e/                          # E2E 测试
├── Dockerfile                    # 多阶段 Docker 构建
└── package.json                  # Monorepo 根
```

### 2.3 API 设计

| 端点 | 功能 |
|------|------|
| `GET /api/events` | 事件列表（支持类目/地区/年份/关键词筛选 + FTS5 全文搜索 + CJK LIKE 回退） |
| `GET /api/events/:id` | 单事件详情 |
| `GET /api/events/:id/context` | 事件关联上下文（同期事件/同类事件/因果关联事件） |
| `GET /api/stats` | 全局统计数据 |
| `GET /health` | 健康检查 |

---

## 三、功能模块全景

### 3.1 五种核心视图

| 视图 | 组件 | 功能说明 |
|------|------|----------|
| **时间线** | `TimelineView` | 主视图。按年份分组展示事件卡片列表，支持时代氛围变色、因果弧线连接、收藏标记、回到顶部、EraSidebar 时代快速跳转、滚动进度指示器 |
| **矩阵热力图** | `MatrixView` | 10 时代 × 12 类目的交叉网格，颜色深浅表示事件密度，支持 hover Tooltip、点击查看详情、下钻跳转到时间线 |
| **东西方对照** | `CompareView` | 东方/西方事件左右分列，同一时间轴对齐呈现文明交汇点，"共振线"标注东西方同时期事件 |
| **数据统计** | `StatsView` | 集成时代分布条形图、类目分布、地区分布排名、事件密度折线图、人物词云、地区-时代热力图，条形图点击可下钻 |
| **文明图谱** | `CivilizationMapView` | 76 国王朝时间线纵向色块图，按 12 大地理分组展示，支持缩放/重置，独立获取全量数据不受筛选器影响 |

### 3.2 交互功能（15 项）

| 功能 | 组件/文件 | 说明 |
|------|-----------|------|
| **随机穿越** | `TimeWarpOverlay` | 粒子星空隧道动画 → 年份滚动 → 白光闪烁 → 事件揭示，reveal 阶段可选"查看详情"或"关闭"，淡出过渡 |
| **连续漫游** | `AutoExplore` | 随机选 10 个事件（60% 里程碑优先），5 秒自动切换，播放/暂停/跳过控制 + 进度条导航 + 背景色随类目变化 |
| **历史知识测验** | `HistoryQuiz` | 自动生成 5 道选择题（年份/地区/类目/人物），评级系统（历史学霸/达人/新芽/探险家） |
| **个人收藏** | `FavoritesPanel` + `useFavorites` | 事件卡片/详情面板收藏按钮，按时代分组展示收藏列表，localStorage 持久化 |
| **历史人物图鉴** | `FigureGallery` | 从事件中提取所有人物，按出场次数排序，显示主要地区/类目/最早年份、关联事件列表，支持搜索 |
| **学习进度追踪** | `useProgress` | 打开事件详情自动标记已读，localStorage 持久化 |
| **文明成就系统** | `AchievementsPanel` | 27+ 个成就，四大类别（探索 5 / 时代 10 / 类目 12 / 特殊 2），进度条 + 解锁/未解锁分区展示 |
| **事件分享卡片** | `share-card.ts` | Canvas 渲染精美 PNG（品牌标题 + 年份 + 时代 + 标题 + 描述 + 地区国旗 + 类目色标），一键下载 |
| **历史上的今天** | `TodayInHistory` | 根据日期匹配历史事件，封面式大日期 + 精选深度推荐 + 事件列表 |
| **策展路线** | `CuratedPaths` | 预设主题探索路线（丝绸之路/文艺复兴等），引导式叙事浏览 |
| **趣味冷知识** | `fun-facts.ts` | 8 种自动生成（最古老事件/最忙碌世纪/最高频人物/持续最长事件/里程碑统计/最全球化领域/最爆的一年/中国占比），桌面端顶栏随机展示 |
| **键盘快捷键** | `useKeyboardShortcuts` | `/` 搜索、`J/K` 上下导航、`Esc` 关闭、`?` 帮助面板 |
| **搜索自动补全** | `SearchAutocomplete` | 实时建议匹配事件标题/描述/人物，内置热门搜索关键词，高亮匹配文本 |
| **欢迎引导** | `WelcomeDialog` | Canvas 粒子动画 + 3 个入口（今天/穿越/开始探索） |
| **URL 深度链接** | `useTimelineState` | 所有筛选条件双向同步 URL 参数，支持分享和浏览器导航 |

### 3.3 数据可视化（6 项）

| 组件 | 说明 |
|------|------|
| **EventDensityChart** | 6000 年按世纪分桶的事件密度柱状图，点击区间可跳转时间线 |
| **RegionEraHeatmap** | 8 大洲 × 10 时代交叉热力图，amber 色深浅表示密度，hover 显示数量 |
| **FigureWordCloud** | 前 60 位历史人物词云，字号映射出现频次（11-29px），哈希色彩，点击搜索 |
| **CausalArcs** | 时间线因果关系 SVG 弧线，选中事件后连接关联事件，分类色渐变 |
| **EraNavigator** | 底部时代导航条，密度曲线叠加 + 里程碑三角标记 + 事件计数 |
| **三级视觉权重** | 里程碑(光晕+大图标+徽章) → 转折点(左边框色条) → 文明切面(紧凑卡片) |

### 3.4 筛选与导航系统

| 组件 | 说明 |
|------|------|
| **FilterPanel** | 左侧筛选面板：搜索、视图切换、12 类目多选、8 大洲/70+ 国家分组多选、年份范围滑块、核心/衍生切换 |
| **ActiveFiltersBar** | 顶部激活筛选条件 Badge 栏，逐个移除或一键清除 |
| **EraSidebar** | 时间线左侧时代标注，随滚动高亮当前时代 |
| **MobileTabBar** | 移动端底部 Tab 栏，5 种视图模式快捷切换 |

---

## 四、设计优化建议落地追踪

以下对照此前两份设计文档（交互设计优化建议 + 视觉叙事方案）的建议项，标注当前落地状态。

### 4.1 交互设计优化（对照 `Chrono_Atlas_交互设计优化建议.md`）

| 优先级 | 建议项 | 状态 | 实现说明 |
|:---:|--------|:---:|----------|
| P0 | #1 首次进入缺乏引导 | ✅ 已完成 | `WelcomeDialog` Canvas 粒子动画 + 3 入口（今天/穿越/开始探索） |
| P0 | #2 时间线长列表滚动 | ✅ 已完成 | `EraSidebar` 时代快速跳转 + 回到顶部浮动按钮 + 滚动进度条 + 底部 `EraNavigator` sticky 导航 |
| P0 | #3 详情层级混乱 | ✅ 已完成 | 简化为两层：卡片点击展开摘要 → 右侧抽屉（`EventDetail` Drawer）+ 上/下一条导航 |
| P1 | #4 穿越缺仪式感 | ✅ 已完成 | `TimeWarpOverlay` 粒子隧道 + 年份滚动 + 白光 + 事件揭示 + 时间线位置条 + 淡出过渡 |
| P1 | #5 对照视图不够直观 | ✅ 已完成 | 双列并行时间线 + 共振连线 SVG + 中心脉冲光点动画 |
| P1 | #6 筛选反馈不足 | ✅ 已完成 | 类目选中态背景填充 + 地区全选复选框 + `ActiveFiltersBar` 筛选条件标签 |
| P1 | #7 统计维度单一 | ✅ 已完成 | 新增 `EventDensityChart` 密度折线图 + `RegionEraHeatmap` 地域时代热力图 + `FigureWordCloud` 人物词云 + 条形图点击下钻 |
| P2 | #8 今天弹窗简陋 | ✅ 已完成 | 封面式大日期 + 精选深度推荐 + N年前标签 + 入场动画 |
| P2 | #9 搜索体验 | ✅ 已完成 | `SearchAutocomplete` 自动补全 + 关键词高亮 + 热门搜索推荐 |
| P2 | #10 卡片视觉层级 | ✅ 已完成 | 三级视觉权重系统（里程碑/转折点/文明切面） + 历史配图 + 分类色时代纹样 |
| P2 | #11 矩阵交互 | ✅ 已完成 | hover Tooltip + 色阶图例 + 点击下钻跳转时间线 |
| P2 | #12 移动端 | ✅ 已完成 | `MobileTabBar` 底部标签栏 + 侧边栏抽屉式滑出 |

**额外建议落地：**

| 建议 | 状态 |
|------|:---:|
| 个人收藏与学习路径 | ✅ `FavoritesPanel` + `useFavorites` |
| 知识问答/测验模式 | ✅ `HistoryQuiz` 5 题测验 + 评级 |
| URL 深度链接 | ✅ `useTimelineState` URL 参数同步 |
| 键盘快捷键 | ✅ `useKeyboardShortcuts` J/K/Esc/?// |

### 4.2 视觉叙事方案（对照 `Chrono_Atlas_视觉叙事方案.md`）

| 方向 | 状态 | 实现说明 |
|------|:---:|----------|
| 方向一：沉浸式文明开场 | ✅ 已完成 | `WelcomeDialog` Canvas 粒子宇宙动画 + 渐显标题 + 3 入口 |
| 方向二：事件卡片视觉权重分层 | ✅ 已完成 | 三级权重（里程碑大号图标+光晕+徽章 / 转折点左边框 / 文明切面紧凑） + stagger 入场动画 |
| 方向三：因果连线可视化 | ✅ 已完成 | `CausalArcs` SVG 弧线 + 选中淡化 + 对照视图共振线 |
| 方向四：时代氛围系统 | ✅ 已完成 | 时间线滚动 `data-era-mood` CSS 变量切换 + 世纪涟漪装饰线 + 里程碑时代纹样 SVG |
| 方向五：微交互叙事节奏 | ✅ 已完成 | stagger 入场瀑布 + 筛选 filter-enter 过渡 + 视图切换 view-transition-enter + 今天心跳效果 |
| 方向六-Layer 3：国旗系统 | ✅ 已完成 | `RegionFlag` SVG 旗帜（核心国家）+ emoji fallback |
| 方向七：策展路线系统 | ✅ 已完成 | `CuratedPaths` 预设主题路线 |
| 方向七：时代快速跳转条 | ✅ 已完成 | `EraSidebar` 左侧浮动 + `EraNavigator` 底部密度导航 |

---

## 五、最近一轮新增特性（v3.0，2026-04-06）

本轮通过 WorkBuddy skill 自动进化了 10 个特性：

| # | 特性 | 组件 | 描述 |
|---|------|------|------|
| 1 | 历史人物词云 | `FigureWordCloud` | 从事件中提取高频人物名，按出现次数映射字号，哈希色彩，点击搜索跳转 |
| 2 | 地域×时代交叉热力图 | `RegionEraHeatmap` | 8 大洲 × 10 时代矩阵，amber 色深浅表示密度，hover Tooltip |
| 3 | 统计条形图交互跳转 | `StatsView` | 时代分布条形图改为 button，点击清空筛选 → 设置年份范围 → 切换到时间线 |
| 4 | 事件分享卡片 | `share-card.ts` | Canvas 渲染 2x 分辨率 PNG，品牌标题/年份/时代/标题/描述/国旗/类目/人物/里程碑 |
| 5 | 连续穿越模式 | `AutoExplore` | 10 事件幻灯片（60% 里程碑优先），5s 自动切换，播放/暂停/跳过 + 进度条 |
| 6 | 趣味历史冷知识 | `fun-facts.ts` | 8 种自动生成，桌面端顶栏 xl 宽度随机展示 |
| 8 | 历史人物图鉴 | `FigureGallery` | 全部人物按出场次数排序，显示主要地区/类目，支持搜索过滤 |
| 9 | 学习进度追踪 | `useProgress` | localStorage 持久化已读事件 ID，成就面板显示进度条 |
| 10 | 文明成就徽章系统 | `AchievementsPanel` | 27+ 个成就（探索 5 / 时代 10 / 类目 12 / 特殊 2），解锁/未解锁分区展示 |
| — | 移动端底部标签栏 | `MobileTabBar` | 5 种视图模式的移动端快捷切换入口 |

---

## 六、已知问题与技术债务

### 6.1 已修复的 Bug（本轮）

| 文件 | 问题 | 修复 |
|------|------|------|
| `share-card.ts` | Canvas `getContext('2d')` 非空断言 | 加 null 检查 |
| `fun-facts.ts` | 空数组 `reduce` 崩溃 + 公元后年份计算错误 | 首行 guard + 正负区分 |
| `App.tsx` | localStorage 读写未 try-catch | 加异常保护 |
| `App.tsx` | useCallback 依赖 `[state]` 导致 memoization 失效 | 改为具体 setter 函数 |
| `HistoryQuiz.tsx` | `questions[currentIdx]` 无 null guard + 除零 | 加前置检查 |
| `TimeWarpOverlay` | 三个 useEffect 共享 timeoutRefs 导致定时器互相清除 | 拆分独立 ref |
| `CompareView` / `TimelineView` | eraGroups 首项空数组崩溃 | `currentEra` 初始值改为 `null` |
| `CivilizationMapView` | 缩放时滚动位置被重置 | `hasScrolledRef` 标记 |
| `useKeyboardShortcuts` | 频繁重注册 keydown listener | ref 模式重写 |

### 6.2 低优先级待优化

| 问题 | 影响 |
|------|------|
| `TodayInHistory` 手动模态框缺少 Escape 键关闭和焦点陷阱 | 无障碍 |
| `StatsView` 时代条形图 button 缺 `w-full`，点击区域偏小 | 交互 |
| JS bundle 534KB（超 500KB 警告） | 性能（建议 code-splitting） |
| 所有事件一次性加载到前端内存 | 大数据集性能（建议分页/虚拟滚动） |

---

## 七、部署信息

| 项 | 值 |
|----|-----|
| 部署平台 | 腾讯云轻量应用服务器（上海） |
| 实例 ID | `lhins-kv89rfm0` |
| 公网 IP | `211.159.224.65` |
| 端口映射 | 宿主 3001 → 容器 3000 |
| 容器名 | `chrono-atlas` |
| 镜像 | `chrono-atlas:latest`（多阶段 Docker 构建） |
| 健康检查 | `GET /health` 每 30 秒 |
| GitHub | `https://github.com/Lufy-Wangsongjian/history-amazing.git` |

---

## 八、未来迭代方向

### 8.1 短期（1-2 周）

- JS bundle code-splitting（动态 import 非核心视图）
- 虚拟滚动优化时间线大列表性能
- `TodayInHistory` 改用 Dialog 组件（无障碍）
- 事件关系图谱视图（Graph/Network 可视化因果链）

### 8.2 中期（1-2 月）

- AI 生成时代主题背景图（方向六-Layer 1/2）
- 国际化（i18n）支持英文界面
- 用户账号体系 + 云端同步收藏/进度
- 更丰富的策展路线内容（10+ 条编辑路线）
- 事件评论/社区标注功能

### 8.3 长期

- 移动端原生应用（React Native / PWA）
- AI 驱动的个性化历史推荐引擎
- 多人协作标注与策展
- 对接外部知识图谱（Wikidata / DBpedia）

---

*文档由 Chrono Atlas 开发团队维护 · 2026.04.06*
