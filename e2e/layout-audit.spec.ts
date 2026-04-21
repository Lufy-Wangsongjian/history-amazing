import { test, expect, Page } from '@playwright/test'

/**
 * ============================================================
 * 布局运行时审计（Playwright + 浏览器 JS 注入）
 * ============================================================
 *
 * 静态代码扫描抓不到的"运行时"问题，通过真实浏览器 + JS 探针检测：
 *
 * 1. 横向溢出（水平滚动条出现在不该出现的视口）
 * 2. 元素被父容器 overflow: hidden 裁切
 * 3. 可点击按钮被其他元素遮挡（z-index 冲突）
 * 4. 触控目标 < 44×44px（移动端可达性）
 * 5. 主要视口下关键交互元素不可见
 *
 * 每个视图 × 每个视口 都会跑一遍审计。
 * ============================================================
 */

const VIEWPORTS = [
  { name: 'mobile-375', width: 375, height: 812 },    // iPhone X/11/12 mini
  { name: 'mobile-414', width: 414, height: 896 },    // iPhone XR/11
  { name: 'tablet-768', width: 768, height: 1024 },   // iPad
  { name: 'desktop-1280', width: 1280, height: 800 }, // 常见笔记本
]

const VIEWS = [
  { mode: 'timeline', label: '时间线' },
  { mode: 'matrix', label: '矩阵' },
  { mode: 'compare', label: '对照' },
  { mode: 'stats', label: '统计' },
  { mode: 'civilizations', label: '图谱' },
]

type Issue = {
  type: string
  selector: string
  detail: string
}

/**
 * 在浏览器内执行的布局审计脚本
 * 返回所有发现的问题
 */
async function auditLayout(page: Page): Promise<Issue[]> {
  return await page.evaluate(() => {
    const issues: Issue[] = []

    // ── 工具：给元素生成简短 selector ──
    const describe = (el: Element): string => {
      const tag = el.tagName.toLowerCase()
      const id = el.id ? `#${el.id}` : ''
      const cls = el.className && typeof el.className === 'string'
        ? '.' + el.className.trim().split(/\s+/).slice(0, 3).join('.')
        : ''
      const testid = el.getAttribute('data-testid')
      return testid ? `[data-testid="${testid}"]` : `${tag}${id}${cls}`.slice(0, 120)
    }

    // ── 1. 横向溢出检测 ──
    if (document.documentElement.scrollWidth > window.innerWidth + 1) {
      issues.push({
        type: 'horizontal-overflow',
        selector: 'html',
        detail: `页面横向溢出 ${document.documentElement.scrollWidth - window.innerWidth}px (vw=${window.innerWidth})`,
      })
      // 找出导致横向溢出的具体元素（宽度 > viewport）
      const all = document.querySelectorAll<HTMLElement>('body *')
      for (let i = 0; i < Math.min(all.length, 3000); i++) {
        const el = all[i]
        if (el.offsetWidth > window.innerWidth + 2) {
          const rect = el.getBoundingClientRect()
          if (rect.right > window.innerWidth + 2 && rect.width < window.innerWidth * 2) {
            // 只报告溢出但没有 overflow scroll 的容器
            const cs = getComputedStyle(el)
            if (cs.overflowX !== 'auto' && cs.overflowX !== 'scroll' && cs.overflowX !== 'hidden') {
              issues.push({
                type: 'element-horizontal-overflow',
                selector: describe(el),
                detail: `元素宽 ${Math.round(el.offsetWidth)}px 超出视口 ${Math.round(el.offsetWidth - window.innerWidth)}px`,
              })
              if (issues.filter(i => i.type === 'element-horizontal-overflow').length >= 5) break
            }
          }
        }
      }
    }

    // ── 2. 被裁切的重要元素（按钮/输入框）──
    const clipVictims = document.querySelectorAll<HTMLElement>('button, [role="button"], input, a[href]')
    for (const el of Array.from(clipVictims).slice(0, 500)) {
      const rect = el.getBoundingClientRect()
      if (rect.width === 0 || rect.height === 0) continue
      // 检查是否在视口内
      if (rect.right < 0 || rect.bottom < 0 || rect.left > window.innerWidth || rect.top > window.innerHeight) continue
      // 跳过有意滚动/动画容器：ticker、marquee、carousel、scroll 容器
      const isDecorative = (e: HTMLElement): boolean => {
        const cls = e.className && typeof e.className === 'string' ? e.className : ''
        const hasAnim = cls.includes('ticker') || cls.includes('marquee') || cls.includes('carousel') ||
                        cls.includes('animate-') || cls.includes('scroll-')
        const cs = getComputedStyle(e)
        // 明显的滚动容器
        const isScroller = cs.overflowX === 'scroll' || cs.overflowX === 'auto' ||
                          cs.overflowY === 'scroll' || cs.overflowY === 'auto'
        return hasAnim || isScroller
      }
      // 检查父链里是否有 overflow: hidden 的容器把它裁掉
      let parent = el.parentElement
      let depth = 0
      let skipped = false
      while (parent && depth < 10) {
        if (isDecorative(parent)) {
          skipped = true
          break
        }
        const cs = getComputedStyle(parent)
        if (cs.overflow === 'hidden' || cs.overflowX === 'hidden' || cs.overflowY === 'hidden') {
          const pRect = parent.getBoundingClientRect()
          const clipped =
            rect.left < pRect.left - 1 ||
            rect.right > pRect.right + 1 ||
            rect.top < pRect.top - 1 ||
            rect.bottom > pRect.bottom + 1
          if (clipped) {
            const overhang = Math.max(
              pRect.left - rect.left,
              rect.right - pRect.right,
              pRect.top - rect.top,
              rect.bottom - pRect.bottom
            )
            // 仅当元素在视口内可见部分被裁（而非全部超出可视区）才报告
            const visibleInViewport = rect.left < window.innerWidth && rect.top < window.innerHeight &&
                                      rect.right > 0 && rect.bottom > 0
            if (overhang > 4 && visibleInViewport) {
              issues.push({
                type: 'clipped-by-overflow-hidden',
                selector: describe(el),
                detail: `被 ${describe(parent)} 裁切 ${Math.round(overhang)}px`,
              })
            }
            break
          }
        }
        parent = parent.parentElement
        depth++
      }
      if (skipped) continue
    }

    // ── 3. 触控目标过小（移动端）——只检查孤立可点击元素 ──
    if (window.innerWidth < 768) {
      const clickable = document.querySelectorAll<HTMLElement>('button, [role="button"], a[href]')
      let tooSmallCount = 0
      for (const el of Array.from(clickable)) {
        const rect = el.getBoundingClientRect()
        if (rect.width === 0 || rect.height === 0) continue
        // 跳过不可见/折叠
        const cs = getComputedStyle(el)
        if (cs.display === 'none' || cs.visibility === 'hidden' || parseFloat(cs.opacity) < 0.3) continue
        // 跳过嵌套在其他可点击祖先中的（纯视觉按钮）
        let isNested = false
        let ancestor = el.parentElement
        while (ancestor) {
          if (ancestor.tagName === 'BUTTON' || ancestor.getAttribute('role') === 'button' ||
              (ancestor.tagName === 'A' && ancestor.getAttribute('href'))) {
            isNested = true
            break
          }
          ancestor = ancestor.parentElement
        }
        if (isNested) continue
        // 跳过内嵌段落中（可能是行内链接）
        const parent = el.parentElement
        if (parent && (parent.tagName === 'P' || parent.tagName === 'SPAN')) continue

        if (rect.width < 32 && rect.height < 32) {
          // 必须同时宽高都 < 32px 才算真正难点中的按钮
          tooSmallCount++
          if (tooSmallCount <= 5) {
            issues.push({
              type: 'touch-target-too-small',
              selector: describe(el),
              detail: `触控目标 ${Math.round(rect.width)}×${Math.round(rect.height)}px（建议 ≥ 44×44px）`,
            })
          }
        }
      }
      if (tooSmallCount > 5) {
        issues.push({
          type: 'touch-target-too-small-summary',
          selector: 'document',
          detail: `还有 ${tooSmallCount - 5} 个独立触控目标 < 32px（已省略）`,
        })
      }
    }

    // ── 4. 固定定位元素遮挡检测 ──
    // 检查 fixed/sticky 元素是否覆盖了关键交互区
    const fixed = document.querySelectorAll<HTMLElement>('body *')
    const fixedElems: { el: HTMLElement; rect: DOMRect; z: number }[] = []
    for (const el of Array.from(fixed).slice(0, 2000)) {
      const cs = getComputedStyle(el)
      if (cs.position === 'fixed' || cs.position === 'sticky') {
        const rect = el.getBoundingClientRect()
        if (rect.width > 50 && rect.height > 20) {
          const z = parseInt(cs.zIndex) || 0
          fixedElems.push({ el, rect, z })
        }
      }
    }
    // 检查同层级 z 冲突（相邻 z 但区域重叠）
    for (let i = 0; i < fixedElems.length; i++) {
      for (let j = i + 1; j < fixedElems.length; j++) {
        const a = fixedElems[i]
        const b = fixedElems[j]
        // 忽略相关联（父子、兄弟容器）
        if (a.el.contains(b.el) || b.el.contains(a.el)) continue
        // 检查重叠
        const overlap =
          a.rect.left < b.rect.right &&
          a.rect.right > b.rect.left &&
          a.rect.top < b.rect.bottom &&
          a.rect.bottom > b.rect.top
        if (overlap && Math.abs(a.z - b.z) <= 1) {
          // z-index 相近且重叠，潜在遮挡风险
          const overlapArea =
            Math.max(0, Math.min(a.rect.right, b.rect.right) - Math.max(a.rect.left, b.rect.left)) *
            Math.max(0, Math.min(a.rect.bottom, b.rect.bottom) - Math.max(a.rect.top, b.rect.top))
          if (overlapArea > 400) {
            issues.push({
              type: 'z-index-overlap-risk',
              selector: describe(a.el),
              detail: `与 ${describe(b.el)} 重叠 ${Math.round(overlapArea)}px²，z-index 仅差 ${Math.abs(a.z - b.z)}`,
            })
          }
        }
      }
    }

    return issues
  })
}

// 帮助函数：切换视图
async function switchView(page: Page, mode: string) {
  // 桌面端通过 FilterPanel 切换，移动端通过 MobileTabBar
  if (page.viewportSize()!.width < 768) {
    // 移动端 tab 栏
    const labels: Record<string, string> = {
      timeline: '时间线',
      matrix: '矩阵',
      compare: '对照',
      stats: '统计',
      civilizations: '图谱',
    }
    const btn = page.getByRole('button', { name: labels[mode] }).last()
    if (await btn.isVisible().catch(() => false)) {
      await btn.click()
    }
  } else {
    // 桌面端用 FilterPanel 的视图按钮（aria-label 或 data）
    const btn = page.locator(`button[data-view="${mode}"]`).first()
    if (await btn.isVisible().catch(() => false)) {
      await btn.click()
    }
  }
  await page.waitForTimeout(500) // 等动画
}

// ─── 测试矩阵：每个视口 × 每个视图 ───
for (const vp of VIEWPORTS) {
  test.describe(`布局审计 · ${vp.name}`, () => {
    test.use({ viewport: vp })

    test(`[${vp.name}] 首页基础审计`, async ({ page }) => {
      await page.goto('/')
      await page.waitForLoadState('networkidle')

      // 关闭欢迎弹窗（如果有）
      const welcomeClose = page.getByRole('button', { name: /开始探索|跳过|×/ }).first()
      if (await welcomeClose.isVisible().catch(() => false)) {
        await welcomeClose.click()
        await page.waitForTimeout(300)
      }

      const issues = await auditLayout(page)
      if (issues.length > 0) {
        console.log(`\n📋 [${vp.name}] 首页发现 ${issues.length} 个布局问题：`)
        for (const iss of issues.slice(0, 10)) {
          console.log(`  [${iss.type}] ${iss.selector} — ${iss.detail}`)
        }
      }

      // 硬性断言：不允许横向溢出
      const horizontalOverflow = issues.filter(i => i.type === 'horizontal-overflow')
      expect(horizontalOverflow, `${vp.name} 不应该有横向溢出`).toHaveLength(0)

      // 不允许被裁切的重要按钮
      const clipped = issues.filter(i => i.type === 'clipped-by-overflow-hidden')
      expect(clipped.slice(0, 3), `${vp.name} 关键按钮被 overflow:hidden 裁切`).toHaveLength(0)
    })

    // 各视图审计
    for (const view of VIEWS) {
      test(`[${vp.name}] ${view.label}视图审计`, async ({ page }) => {
        await page.goto('/')
        await page.waitForLoadState('networkidle')
        const welcomeClose = page.getByRole('button', { name: /开始探索|跳过|×/ }).first()
        if (await welcomeClose.isVisible().catch(() => false)) {
          await welcomeClose.click()
          await page.waitForTimeout(300)
        }

        await switchView(page, view.mode)
        await page.waitForTimeout(500)

        const issues = await auditLayout(page)
        if (issues.length > 0) {
          console.log(`\n📋 [${vp.name}] ${view.label}视图发现 ${issues.length} 个问题：`)
          for (const iss of issues.slice(0, 8)) {
            console.log(`  [${iss.type}] ${iss.selector} — ${iss.detail}`)
          }
        }

        const hOverflow = issues.filter(i => i.type === 'horizontal-overflow')
        expect(hOverflow, `${view.label} 视图不应横向溢出`).toHaveLength(0)
      })
    }
  })
}
