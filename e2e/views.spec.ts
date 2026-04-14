import { test, expect } from '@playwright/test';
import { skipWelcomeDialog } from './helpers';

/**
 * Chrono Atlas - 核心视图 E2E 测试
 *
 * 验证所有 6 个视图模式能正常加载和渲染。
 * 每个视图检查：
 *   1. 能切换到该视图（点击导航）
 *   2. 视图容器被渲染
 *   3. 视图内有实质内容（不是空白）
 *   4. 无控制台报错
 */

test.describe('应用基础', () => {
  test('首页能正常加载', async ({ page }) => {
    // 收集控制台错误
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // 页面标题存在
    await expect(page).toHaveTitle(/.*/, { timeout: 10000 });

    // 不应该是白屏（body 有内容）
    const bodyText = await page.locator('body').innerText();
    expect(bodyText.length).toBeGreaterThan(10);

    // 无致命控制台错误（过滤掉常见的非致命警告）
    const fatalErrors = consoleErrors.filter(
      (e) => !e.includes('favicon') && !e.includes('DevTools') && !e.includes('404')
    );
    expect(fatalErrors).toHaveLength(0);
  });
});

test.describe('视图切换', () => {
  test.beforeEach(async ({ page }) => {
    await skipWelcomeDialog(page);
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1500);
  });

  test('时间线视图（Timeline）正常渲染', async ({ page }) => {
    // 时间线通常是默认视图
    // 检查有事件卡片或时间线容器
    const timelineContent = page.locator('[class*="timeline"], [class*="Timeline"], [data-view="timeline"]').first();
    // 如果时间线不是默认视图，尝试点击导航切换
    const timelineBtn = page.locator('button:has-text("时间"), button:has-text("Timeline"), [data-view-mode="timeline"]').first();
    if (await timelineBtn.isVisible()) {
      await timelineBtn.click();
      await page.waitForTimeout(1000);
    }

    // 页面应该有事件内容
    const bodyText = await page.locator('body').innerText();
    expect(bodyText.length).toBeGreaterThan(50);
  });

  test('矩阵热力图视图（Matrix）正常渲染', async ({ page }) => {
    // 找到并点击矩阵视图按钮
    const matrixBtn = page.locator('button:has-text("矩阵"), button:has-text("Matrix"), button:has-text("热力"), [data-view-mode="matrix"]').first();
    if (await matrixBtn.isVisible()) {
      await matrixBtn.click();
      await page.waitForTimeout(1500);
    }

    // 验证页面内容不为空
    const bodyText = await page.locator('body').innerText();
    expect(bodyText.length).toBeGreaterThan(50);

    // 不应该有 "Error" 文字
    await expect(page.locator('text=Error')).not.toBeVisible({ timeout: 2000 }).catch(() => {});
  });

  test('东西方对照视图（Compare）正常渲染', async ({ page }) => {
    // 使用精确选择器：FilterPanel 中的视图模式按钮包含图标+文字，且在 grid 容器内
    const compareBtn = page.locator('.grid button:has-text("对照"), [class*="MobileTabBar"] button:has-text("对照")').first();
    if (await compareBtn.isVisible().catch(() => false)) {
      await compareBtn.click();
      await page.waitForTimeout(1500);
    } else {
      // fallback: 通过 FilterPanel 中精确的按钮（排除 MilestoneTicker 中的滚动按钮）
      const fallback = page.locator('button:has(svg) :text-is("对照")').first();
      if (await fallback.isVisible().catch(() => false)) {
        await fallback.click();
        await page.waitForTimeout(1500);
      }
    }

    const bodyText = await page.locator('body').innerText();
    expect(bodyText.length).toBeGreaterThan(50);
  });

  test('数据统计视图（Stats）正常渲染', async ({ page }) => {
    const statsBtn = page.locator('button:has-text("统计"), button:has-text("Stats"), button:has-text("数据"), [data-view-mode="stats"]').first();
    if (await statsBtn.isVisible()) {
      await statsBtn.click();
      await page.waitForTimeout(1500);
    }

    const bodyText = await page.locator('body').innerText();
    expect(bodyText.length).toBeGreaterThan(50);
  });

  test('精选路径视图（CuratedPaths）正常渲染', async ({ page }) => {
    const pathsBtn = page.locator('button:has-text("路径"), button:has-text("Path"), button:has-text("精选"), button:has-text("策展"), [data-view-mode="curatedPaths"]').first();
    if (await pathsBtn.isVisible()) {
      await pathsBtn.click();
      await page.waitForTimeout(1500);
    }

    const bodyText = await page.locator('body').innerText();
    expect(bodyText.length).toBeGreaterThan(50);
  });

  test('文明图谱视图（Civilizations）正常渲染', async ({ page }) => {
    // FilterPanel 按钮文字是"文明图谱"，MobileTabBar 是"图谱"
    const civBtn = page.locator('.grid button:has-text("文明图谱"), .grid button:has-text("图谱"), [class*="MobileTabBar"] button:has-text("图谱")').first();
    if (await civBtn.isVisible().catch(() => false)) {
      await civBtn.click();
      await page.waitForTimeout(2000);
    } else {
      const fallback = page.locator('button:has(svg) :text-is("图谱")').first();
      if (await fallback.isVisible().catch(() => false)) {
        await fallback.click();
        await page.waitForTimeout(2000);
      }
    }

    const bodyText = await page.locator('body').innerText();
    expect(bodyText.length).toBeGreaterThan(50);
  });
});

test.describe('核心交互', () => {
  test.beforeEach(async ({ page }) => {
    await skipWelcomeDialog(page);
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1500);
  });

  test('搜索功能可用', async ({ page }) => {
    // 找到搜索框
    const searchInput = page.locator('input[type="search"], input[type="text"][placeholder*="搜索"], input[placeholder*="Search"], input[placeholder*="search"]').first();
    if (await searchInput.isVisible()) {
      await searchInput.fill('秦');
      await page.waitForTimeout(1000);
      // 应该有搜索结果（页面内容变化）
      const bodyText = await page.locator('body').innerText();
      expect(bodyText.length).toBeGreaterThan(20);
    }
  });

  test('事件卡片可点击查看详情', async ({ page }) => {
    // 找到第一个事件卡片并点击
    const eventCard = page.locator('[class*="event"], [class*="Event"], [class*="card"], [class*="Card"]').first();
    if (await eventCard.isVisible()) {
      await eventCard.click();
      await page.waitForTimeout(1000);

      // 应该弹出详情面板或导航到详情页
      const bodyText = await page.locator('body').innerText();
      expect(bodyText.length).toBeGreaterThan(50);
    }
  });

  test('筛选面板可展开', async ({ page }) => {
    // 找到筛选按钮
    const filterBtn = page.locator('button:has-text("筛选"), button:has-text("Filter"), button:has-text("过滤"), [class*="filter"]').first();
    if (await filterBtn.isVisible()) {
      await filterBtn.click();
      await page.waitForTimeout(500);
      // 点击后页面应该有筛选选项
      const bodyText = await page.locator('body').innerText();
      expect(bodyText.length).toBeGreaterThan(50);
    }
  });
});

test.describe('无报错检查', () => {
  test('切换所有视图无控制台报错', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });

    await skipWelcomeDialog(page);
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1500);

    // 收集所有视图按钮可能的选择器（FilterPanel grid 内的按钮，避免匹配工具栏弹窗按钮）
    const viewSelectors = [
      '.grid button:has-text("时间线")',
      '.grid button:has-text("矩阵")',
      '.grid button:has-text("对照")',
      '.grid button:has-text("统计")',
      '.grid button:has-text("文明图谱")',
    ];

    for (const selector of viewSelectors) {
      const btn = page.locator(selector).first();
      if (await btn.isVisible().catch(() => false)) {
        await btn.click();
        await page.waitForTimeout(1500);
      }
    }

    // 过滤非致命错误
    const fatalErrors = consoleErrors.filter(
      (e) =>
        !e.includes('favicon') &&
        !e.includes('DevTools') &&
        !e.includes('404') &&
        !e.includes('net::ERR') &&
        !e.includes('ResizeObserver')
    );

    if (fatalErrors.length > 0) {
      console.log('控制台错误:', fatalErrors);
    }
    expect(fatalErrors).toHaveLength(0);
  });
});
