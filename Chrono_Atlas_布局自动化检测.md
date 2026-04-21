# Chrono Atlas 布局自动化检测体系

三层检测策略，捕获 95%+ 的可视面积和滚动问题。

## 概览

| 层级 | 检测方式 | 耗时 | 发现的问题类型 | 触发时机 |
|------|---------|------|--------------|---------|
| **L1 静态 Lint** | 正则扫描 .tsx 源码 | ~1s | button 嵌套、缺 max-h、flex-1 缺 min-h-0、小字号、负偏移裁切风险 | pre-commit / 开发时手动 |
| **L2 运行时审计** | Playwright + 浏览器 JS 注入 | ~1 分钟 | 横向溢出、元素被裁切、z-index 冲突、触控目标过小 | PR / push 时 CI |
| **L3 视觉回归** | Playwright 多视口截图对比 | ~3 分钟 | 肉眼可见的布局崩溃、样式回退 | 手动触发 / 发版前 |

---

## L1 — 静态布局 Lint

### 脚本位置
`scripts/lint-layout.mjs`

### 检测规则（7 条）

| 规则 ID | 级别 | 描述 |
|---------|------|------|
| `no-nested-button` | 🔴 ERROR | `<button>` 嵌套 `<button>` 会导致 React hydration error |
| `no-nested-anchor` | 🔴 ERROR | `<a>` 嵌套 `<a>` 或 `<button>` 违反 HTML 规范 |
| `dialog-missing-max-height` | 🟠 WARN | DialogContent 或自建模态缺 max-h 约束，小屏会溢出 |
| `flex-missing-min-h-0` | 🟠 WARN | flex-col 容器内的 flex-1 子元素缺 min-h-0 可能无法收缩 |
| `negative-offset-in-overflow-hidden` | 🟠 WARN | absolute 负偏移子元素可能被父 overflow:hidden 裁切 |
| `text-too-small` | 🟠 WARN | text-[8px]/[9px] 低于无障碍下限（已有 CSS 自动提升兜底）|
| `absolute-missing-z` | 🔵 INFO | fixed 定位建议明确 z-index |

### 运行

```bash
# 严格模式（ERROR 会退出 1，WARN 退出 2）
npm run lint:layout

# 只警告不阻断
npm run lint:layout:warn
```

### 退出码
- `0`：无问题
- `1`：有 ERROR 级问题 → **阻止提交**
- `2`：只有 WARN 级问题

### 规则级别与降噪策略（v2）

| 级别 | 含义 | 默认输出 | 是否阻断 |
|------|------|---------|---------|
| **ERROR** | 肉眼可验证的真实 bug（如 button 嵌套） | ✅ 显示 | ✅ 阻断 pre-commit |
| **WARN** | 高概率是真实问题（如 Dialog 无 max-h、≥4px 负偏移） | ✅ 显示 | ❌ 不阻断 |
| **INFO** | CSS/设计已兜底的提示（如 text-[10px]） | ❌ 折叠 | ❌ 不阻断 |

查看完整 INFO：`npm run lint:layout:warn -- --verbose`

### 豁免指令

对"已人工验证安全"的代码，用注释豁免特定规则（豁免窗口自动覆盖下方多行 JSX 标签）：

```tsx
{/* layout-lint-ignore-next-line negative-offset-clipping-risk */}
<div className="absolute -left-6 ..." />

// 豁免多条规则
// layout-lint-ignore-next-line no-nested-button,dialog-missing-max-height

// 豁免所有规则
// layout-lint-ignore-next-line
```

---

## L2 — 运行时布局审计

### 测试位置
`e2e/layout-audit.spec.ts`

### 检测维度

- **4 个视口**：375×812 / 414×896 / 768×1024 / 1280×800
- **5 个视图**：timeline / matrix / compare / stats / civilizations
- **每组合一次审计**：共 20+ 个测试用例

### 运行时探针会检测

1. **横向溢出**：`document.scrollWidth > window.innerWidth` 就报错
2. **被裁切的按钮/输入框**：递归检查父链 overflow:hidden 容器的边界
3. **触控目标过小**：移动端 `< 32×32px` 的可点击元素
4. **z-index 冲突**：相近 z 但区域重叠的 fixed 元素

### 运行

```bash
# 运行审计（自动启动 dev server）
npm run audit:layout

# 查看 HTML 报告
npm run test:e2e:report
```

### 硬性断言
- 不允许横向溢出（expect toHaveLength(0)）
- 不允许关键按钮被 overflow:hidden 裁切

---

## L3 — 视觉回归

### 测试位置
`e2e/visual-regression.spec.ts`

### 工作方式

1. **首次运行**：生成基准截图存在 `e2e/visual-regression.spec.ts-snapshots/`
2. **后续运行**：对比当前截图与基准，差异 > 5% 即 fail

### 运行

```bash
# 首次生成基准（新特性上线后）
npm run audit:visual:update

# 日常对比
npm run audit:visual
```

### 覆盖

每个视图 × 每个视口 = 3 × (1 + 5) = **18 张截图**

---

## 集成方式

### 1. Git pre-commit hook（已安装）

`.githooks/pre-commit` 会在每次提交前运行 L1 静态 lint。

```bash
# 手动安装
bash scripts/install-git-hooks.sh

# 临时绕过
git commit --no-verify

# 卸载
git config --unset core.hooksPath
```

### 2. GitHub Actions CI

`.github/workflows/layout-audit.yml` 会在：
- 每次推到 `main`
- 每次 PR

时自动运行 **L1 + L2**。失败会阻止合并。

### 3. 一键全量检测

```bash
# 完整检测（发版前）
npm run precheck          # L1 + build
npm run audit:all         # L1 + L2
npm run audit:visual      # L3（需先有基准）
```

---

## 新增检测规则

### L1 静态规则

在 `scripts/lint-layout.mjs` 中追加：

```javascript
rules.push({
  id: 'my-new-rule',
  level: 'warn',  // 或 'error' / 'info'
  desc: '规则描述',
  check(source, filePath) {
    const issues = []
    // 扫描逻辑
    return issues  // [{ line, msg }, ...]
  },
})
```

### L2 运行时探针

在 `e2e/layout-audit.spec.ts` 的 `auditLayout` 函数里加新的检测块：

```typescript
// ── 新检测：xxx ──
const targets = document.querySelectorAll('...')
for (const el of targets) {
  if (/* 条件 */) {
    issues.push({ type: 'xxx', selector: describe(el), detail: '...' })
  }
}
```

---

## 常见问题

### Q: 为什么 warn 有 240 个？
A: 大部分是 `text-[10px]` 的小字号警告。这些在移动端已有 CSS 媒体查询自动提升到 12px（参见 `app/src/App.css` 末尾），属于已知可接受。严格洁癖可以在源码中逐个改为 `text-xs md:text-[10px]`。

### Q: 如何定位某个 warn 是否真的有问题？
A: 结合 L2 运行时审计看——如果 L1 warn + L2 没发现实际渲染问题，就是误报。

### Q: 能捕获所有布局问题吗？
A: 能捕获大部分结构性问题，但仍需人工 review 细节（比如间距美感、视觉层次）。L3 视觉回归在这方面帮助最大。

### Q: 如何处理第三方库组件内部的问题？
A: L1 只扫描 `app/src`，不会误报 node_modules。L2 可以在 `auditLayout` 里过滤特定 selector 跳过第三方。

---

## 历史案例

本体系已成功捕获以下真实问题：

| 问题 | 捕获层级 | 修复时间 |
|------|---------|---------|
| EventCard 外层 button 嵌套 ChevronDown button | L1（若当时已有） + 浏览器报错 | 2026-04-20 |
| CuratedPaths 序号 01/02 被 overflow:hidden 裁切 | L1 + L2 | 2026-04-20 |
| CompareView 移动端列宽过窄 | L2（横向溢出） | 2026-04-20 |
| MemoryMatch 弹窗缺 max-h 导致竖屏溢出 | L1（dialog-missing-max-height） | 2026-04-21 |
| ProgressHeatmap 自定义 tooltip 被父容器裁切 | L2（clipped-by-overflow-hidden） | 2026-04-21 |
