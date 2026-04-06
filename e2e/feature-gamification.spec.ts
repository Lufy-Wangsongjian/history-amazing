import { test, expect } from '@playwright/test';

async function dismissWelcomeDialog(page: import('@playwright/test').Page) {
  await page.waitForTimeout(1500);
  const startBtn = page.locator('button:has-text("从头开始探索"), button:has-text("开始探索")').first();
  if (await startBtn.isVisible().catch(() => false)) {
    await startBtn.click();
    await page.waitForTimeout(500);
    return;
  }
  await page.keyboard.press('Escape');
  await page.waitForTimeout(500);
}

test.describe('趣味性自动进化功能', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    await dismissWelcomeDialog(page);
  });

  test('文明挑战面板可打开并显示任务卡', async ({ page }) => {
    await page.getByTestId('open-missions').click();
    await expect(page.getByText('今日文明挑战')).toBeVisible();
    await expect(page.locator('[data-testid^="mission-card-"]')).toHaveCount(3);
  });

  test('时间对决可开始并完成第一轮答题', async ({ page }) => {
    await page.getByTestId('open-timeline-challenge').click();
    await expect(page.getByRole('heading', { name: '时间对决' }).last()).toBeVisible();

    await page.getByTestId('start-timeline-challenge').click();
    await expect(page.getByText(/哪件事更早发生|哪件事更晚发生/)).toBeVisible();

    const firstChoice = page.locator('button:has-text("候选 A")').first();
    await firstChoice.click();

    await expect(page.getByRole('button', { name: /下一轮|查看成绩/ })).toBeVisible();
  });

  test('成就面板显示文明护照与下一步解锁建议', async ({ page }) => {
    const achievementsBtn = page.locator('button[title="文明成就"]').first();
    await achievementsBtn.click();

    await expect(page.getByRole('heading', { name: '文明护照' })).toBeVisible();
    await expect(page.getByRole('heading', { name: '下一步最容易解锁' })).toBeVisible();
  });
});
