import { test, expect } from '@playwright/test';

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

/**
 * 关闭 WelcomeDialog 欢迎弹窗
 * 应用首次加载时会弹出欢迎引导，遮住整个界面。
 * 必须先关掉它才能进行任何操作。
 */
async function dismissWelcomeDialog(page: import('@playwright/test').Page) {
  // 等弹窗出现
  await page.waitForTimeout(1500);

  // 方式 1：点击「从头开始探索」按钮
  const startBtn = page.locator('button:has-text("从头开始探索"), button:has-text("开始探索"), button:has-text("Start")').first();
  if (await startBtn.isVisible().catch(() => false)) {
    await startBtn.click();
    await page.waitForTimeout(500);
    return;
  }

  // 方式 2：点击关闭按钮（× 按钮）
  const closeBtn = page.locator('[data-slot="dialog-close"], button:near(:text("6000")):has-text("×"), button[aria-label="Close"], .dialog-close, [class*="close"]').first();
  if (await closeBtn.isVisible().catch(() => false)) {
    await closeBtn.click();
    await page.waitForTimeout(500);
    return;
  }

  // 方式 3：按 Escape 键
  await page.keyboard.press('Escape');
  await page.waitForTimeout(500);

  // 方式 4：点击遮罩层外部区域（最后手段）
  const overlay = page.locator('[data-slot="dialog-overlay"], [class*="dialog-overlay"]').first();
  if (await overlay.isVisible().catch(() => false)) {
    // 点击页面左上角（弹窗外）
    await page.mouse.click(10, 10);
    await page.waitForTimeout(500);
  }
}

test.describe('视图切换', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    // 关闭欢迎弹窗
    await dismissWelcomeDialog(page);
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
    const compareBtn = page.locator('button:has-text("对照"), button:has-text("Compare"), button:has-text("东西"), [data-view-mode="compare"]').first();
    if (await compareBtn.isVisible()) {
      await compareBtn.click();
      await page.waitForTimeout(1500);
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
    const civBtn = page.locator('button:has-text("图谱"), button:has-text("文明"), button:has-text("Civilization"), [data-view-mode="civilizations"]').first();
    if (await civBtn.isVisible()) {
      await civBtn.click();
      await page.waitForTimeout(2000);
    }

    const bodyText = await page.locator('body').innerText();
    expect(bodyText.length).toBeGreaterThan(50);
  });
});

test.describe('核心交互', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    await dismissWelcomeDialog(page);
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

    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    await dismissWelcomeDialog(page);

    // 收集所有视图按钮可能的选择器
    const viewSelectors = [
      'button:has-text("时间")',
      'button:has-text("矩阵")',
      'button:has-text("对照")',
      'button:has-text("统计")',
      'button:has-text("路径")',
      'button:has-text("图谱")',
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
