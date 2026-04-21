import { test, expect } from '@playwright/test'

/**
 * ============================================================
 * 视觉回归 + 多视口截图
 * ============================================================
 *
 * 用法：
 *   # 首次生成基准截图（master images）
 *   npx playwright test visual-regression --update-snapshots
 *
 *   # 后续对比（如果与基准不一致会 fail）
 *   npx playwright test visual-regression
 *
 * 截图保存在 e2e/visual-regression.spec.ts-snapshots/ 目录。
 * 只检测肉眼可见级别的大变化（threshold=0.1）。
 * ============================================================
 */

const VIEWPORTS = [
  { name: 'mobile', width: 375, height: 812 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1280, height: 800 },
]

const VIEW_BUTTONS = ['时间线', '矩阵', '对照', '统计', '图谱']

test.describe('视觉回归', () => {
  for (const vp of VIEWPORTS) {
    test.describe(`${vp.name} (${vp.width}×${vp.height})`, () => {
      test.use({ viewport: vp })

      test(`首页`, async ({ page }) => {
        await page.goto('/')
        await page.waitForLoadState('networkidle')
        const welcomeClose = page.getByRole('button', { name: /开始探索|跳过/ }).first()
        if (await welcomeClose.isVisible().catch(() => false)) {
          await welcomeClose.click()
          await page.waitForTimeout(300)
        }
        // 等待主要内容加载
        await page.waitForTimeout(1000)
        await expect(page).toHaveScreenshot(`home-${vp.name}.png`, {
          fullPage: false,
          maxDiffPixelRatio: 0.05,
          animations: 'disabled',
        })
      })

      // 各视图截图
      for (const label of VIEW_BUTTONS) {
        test(`${label}视图`, async ({ page }) => {
          await page.goto('/')
          await page.waitForLoadState('networkidle')
          const welcomeClose = page.getByRole('button', { name: /开始探索|跳过/ }).first()
          if (await welcomeClose.isVisible().catch(() => false)) {
            await welcomeClose.click()
            await page.waitForTimeout(300)
          }

          // 点击视图按钮
          const btn = page.getByRole('button', { name: label }).last()
          if (!(await btn.isVisible().catch(() => false))) {
            test.skip()
            return
          }
          await btn.click()
          await page.waitForTimeout(1000)

          await expect(page).toHaveScreenshot(`${label}-${vp.name}.png`, {
            fullPage: false,
            maxDiffPixelRatio: 0.05,
            animations: 'disabled',
          })
        })
      }
    })
  }
})
