# Chrono Atlas 高风险特性（待人工审阅）

> 由 chrono-atlas-review 于 2026-04-12 22:22 标记
> 这些特性评审得分较高但风险较大，建议人工审阅后决定是否实现
> ⚠️ 不会被 chrono-atlas-impl 自动执行

## ⚠️ 1. 文明竞速排行榜（动态条形图竞赛）

- **方向**：数据探索
- **规模**：L
- **评审总分**：4.05 / 5.0
- **高风险原因**：
  - L 规模特性，涉及全新的动画引擎（bar chart race），实现复杂度高
  - 需要 requestAnimationFrame 级别的性能优化，11000+ 事件的分桶计算量大
  - 需要在 App.tsx 中注册新视图模式或独立入口，增加应用复杂度
  - 动画在移动端性能未知
- **描述**：一个可播放的动态条形竞赛图——按年份推进，展示各文明圈的"累计事件数"动态排名变化。
- **实现思路**：新增 CivilizationRace.tsx 组件，用 civilizations.ts 的文明圈定义，按年份分桶（每 50 年一帧），CSS transition 做条形图动画。
- **降低风险的建议**：
  - 先做静态版本（不带动画），确认数据逻辑和布局正确
  - 动画用 CSS transition 而非 JS 计算，降低性能负担
  - 限制最大帧数（120 帧 = 6000 年 / 50 年），用 requestAnimationFrame 控制节奏
  - 在移动端降级为静态图

## ⚠️ 2. 每周文明回顾周报

- **方向**：交互体验
- **规模**：S
- **评审总分**：3.75 / 5.0
- **高风险原因**：
  - 需要修改 `useProgress.ts` 的 localStorage 数据格式（从 `string[]` 改为带时间戳的对象数组），属于核心状态管理变更
  - 旧用户的 localStorage 格式需要向后兼容迁移
  - 如果迁移出错，用户已有的阅读进度可能丢失
- **描述**：基于用户过去 7 天的浏览记录，自动生成一份"本周文明探索周报"。
- **实现思路**：新增 useWeeklyReview hook + WeeklyReview.tsx 弹窗。
- **降低风险的建议**：
  - 不修改现有 readIds 格式，而是新增一个独立的 localStorage key（`chrono-atlas-read-log`）记录带时间戳的阅读日志
  - 现有 `useProgress` 完全不改，新增 `useReadLog` hook 做增量记录
  - 这样即使新功能出问题，也不影响现有进度系统
