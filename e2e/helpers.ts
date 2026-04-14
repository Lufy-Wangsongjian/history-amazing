import type { Page } from '@playwright/test';

/**
 * 跳过 WelcomeDialog 欢迎弹窗
 * 
 * 通过预设 localStorage 来阻止弹窗出现（最可靠的方式）
 * 如果弹窗仍然出现，则尝试点击按钮或按 Escape 关闭
 */
export async function dismissWelcomeDialog(page: Page) {
  // 方式 1（最可靠）：在页面加载前通过 addInitScript 设置 localStorage
  // 注意：这个方法需要在 page.goto() 之前调用才有效
  // 如果在 goto 之后调用，则使用方式 2-4

  // 等待页面稳定
  await page.waitForTimeout(2000);

  // 检查弹窗是否存在
  const overlay = page.locator('.fixed.inset-0.z-50, [class*="dialog-overlay"]').first();
  if (!(await overlay.isVisible().catch(() => false))) {
    return; // 弹窗不存在或已关闭
  }

  // 方式 2：点击「从头开始探索」按钮
  const startBtn = page.locator('button:has-text("从头开始探索"), button:has-text("开始探索")').first();
  if (await startBtn.isVisible().catch(() => false)) {
    await startBtn.click({ force: true }); // force: true 绕过 overlay 拦截
    await page.waitForTimeout(800);
    // 验证弹窗已关闭
    if (!(await overlay.isVisible().catch(() => false))) return;
  }

  // 方式 3：按 Escape
  await page.keyboard.press('Escape');
  await page.waitForTimeout(800);
  if (!(await overlay.isVisible().catch(() => false))) return;

  // 方式 4：直接设置 localStorage 并刷新
  await page.evaluate(() => {
    try {
      window.localStorage.setItem('chrono-atlas-welcome-dismissed', '1');
    } catch {}
  });
  await page.reload();
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1500);
}

/**
 * 在 page.goto() 之前调用，通过 addInitScript 预设 localStorage 跳过弹窗
 * 这是最可靠的方式，弹窗根本不会出现
 */
export async function skipWelcomeDialog(page: Page) {
  await page.addInitScript(() => {
    try {
      window.localStorage.setItem('chrono-atlas-welcome-dismissed', '1');
    } catch {}
  });
}
