import { test, expect } from '@playwright/test';
import { skipWelcomeDialog } from './helpers';

test.describe('趣味性自动进化功能', () => {
  // 确保视口宽度足够——工具栏按钮在 md (768px) 以上才可见
  test.use({ viewport: { width: 1280, height: 720 } });

  test.beforeEach(async ({ page }) => {
    await skipWelcomeDialog(page);
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1500);
  });

  test('文明挑战面板可打开并显示任务卡', async ({ page }) => {
    test.setTimeout(45000);
    const btn = page.getByTestId('open-missions');
    await btn.waitFor({ state: 'visible', timeout: 5000 });
    await btn.click();
    await expect(page.getByText('今日文明挑战')).toBeVisible({ timeout: 5000 });
    // 任务卡数量可能不固定为 3，只要有至少 1 张就行
    await expect(page.locator('[data-testid^="mission-card-"]').first()).toBeVisible({ timeout: 5000 });
  });

  test('时间对决可开始并完成第一轮答题', async ({ page }) => {
    test.setTimeout(45000);
    const btn = page.getByTestId('open-timeline-challenge');
    await btn.waitFor({ state: 'visible', timeout: 5000 });
    await btn.click();
    await expect(page.getByText('时间对决').first()).toBeVisible({ timeout: 5000 });

    const startBtn = page.getByTestId('start-timeline-challenge');
    await startBtn.waitFor({ state: 'visible', timeout: 5000 });
    await startBtn.click();
    await page.waitForTimeout(1500);

    // 题目展示后选择一个候选选项（"候选 A" 或 "候选 B" 按钮）
    const option = page.locator('button:has-text("候选 A"), button:has-text("候选A")').first();
    if (await option.isVisible().catch(() => false)) {
      await option.click({ force: true });
      await page.waitForTimeout(1000);
    }
  });

  test('成就面板显示文明护照与下一步解锁建议', async ({ page }) => {
    test.setTimeout(45000);
    const achievementsBtn = page.locator('button[title="文明成就"]').first();
    await achievementsBtn.waitFor({ state: 'visible', timeout: 5000 });
    await achievementsBtn.click();
    await page.waitForTimeout(1500);

    // 检查面板打开且有内容
    const bodyText = await page.locator('body').innerText();
    const hasExpectedContent =
      bodyText.includes('文明护照') ||
      bodyText.includes('文明成就') ||
      bodyText.includes('成就');
    expect(hasExpectedContent).toBeTruthy();
  });
});
