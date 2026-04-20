# Chrono Atlas 移动端优化清单

基线评分：6/10（2026-04-20）。待完成后目标：9/10。

## 优先级 P0（直接影响可用性）

- [ ] Header 重构：移动端简化为 Logo + 搜索 + 汉堡菜单
- [ ] CompareView 移动端布局降级（2-3 文明圈或纵向视图）
- [ ] 滑动手势三件套：EventDetail 右滑关闭、上下切换、卡片左滑

## 优先级 P1（显著影响体验）

- [ ] EventDetail Header 精简（移动端仅关闭+上下一条）
- [ ] TimelineView 右侧悬浮按钮移动端隐藏
- [ ] 全局最小字号 11px（批量替换 text-[8px]/[9px]/[10px]）
- [ ] 游戏/弹窗组件移动端适配（Quiz/Riddle/Memory/Sorter 等）

## 优先级 P2（细节打磨）

- [ ] 触控目标 ≥ 44×44px（按钮 padding 调整）
- [ ] AIChatPanel 悬浮球避开 Tab 栏，面板改底部抽屉
- [ ] PWA 化（manifest + Service Worker）
- [ ] iOS 安全区域（viewport-fit=cover + safe-area-inset）
- [ ] 搜索框字号 ≥ 16px 防 iOS 自动缩放
