import { test, expect } from '@playwright/test';
import { skipWelcomeDialog } from './helpers';

/**
 * Chrono Atlas - 健壮性 & 边界条件 E2E 测试
 *
 * 验证应用在异常场景下的表现：
 *   - 控制台无 JS 错误（捕获运行时 crash）
 *   - 空数据/边界数据不崩溃
 *   - localStorage 不可用时不崩溃
 *   - 各功能模块的边界操作
 */

test.describe('运行时错误捕获', () => {
  test('全页面交互过程中无 JS 运行时错误', async ({ page }) => {
    test.setTimeout(45000);
    const jsErrors: string[] = [];

    // 捕获未处理的 JS 异常（最重要的）
    page.on('pageerror', (error) => {
      jsErrors.push(`[pageerror] ${error.message}`);
    });

    // 捕获控制台 error 级别输出
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        const text = msg.text();
        // 过滤非致命的浏览器噪音
        if (!text.includes('favicon') &&
            !text.includes('DevTools') &&
            !text.includes('net::ERR') &&
            !text.includes('ResizeObserver') &&
            !text.includes('404')) {
          jsErrors.push(`[console.error] ${text}`);
        }
      }
    });

    await skipWelcomeDialog(page);
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1500);

    // 遍历所有视图 —— 使用 FilterPanel 中 grid 内的精确按钮
    const viewButtons = [
      '.grid button:has-text("时间线")',
      '.grid button:has-text("矩阵")',
      '.grid button:has-text("对照")',
      '.grid button:has-text("统计")',
      '.grid button:has-text("文明图谱")',
    ];

    for (const selector of viewButtons) {
      const btn = page.locator(selector).first();
      if (await btn.isVisible().catch(() => false)) {
        await btn.click();
        await page.waitForTimeout(1500);
      }
    }

    // 尝试搜索
    const searchInput = page.locator('input[placeholder*="搜索"], input[placeholder*="Search"]').first();
    if (await searchInput.isVisible().catch(() => false)) {
      await searchInput.fill('秦始皇');
      await page.waitForTimeout(500);
      await searchInput.clear();
      await page.waitForTimeout(500);
    }

    // 尝试穿越功能
    const randomBtn = page.locator('button:has-text("穿越"), button:has-text("随机")').first();
    if (await randomBtn.isVisible().catch(() => false)) {
      await randomBtn.click();
      await page.waitForTimeout(1000);
    }

    // 尝试历史上的今天
    const todayBtn = page.locator('button:has-text("今天"), button:has-text("Today")').first();
    if (await todayBtn.isVisible().catch(() => false)) {
      await todayBtn.click();
      await page.waitForTimeout(1000);
      // 关闭弹窗
      await page.keyboard.press('Escape');
      await page.waitForTimeout(500);
    }

    if (jsErrors.length > 0) {
      console.log('发现的 JS 错误:', jsErrors);
    }
    expect(jsErrors, `发现 ${jsErrors.length} 个 JS 运行时错误`).toHaveLength(0);
  });
});

test.describe('localStorage 异常容错', () => {
  test('localStorage 不可用时应用不崩溃', async ({ page }) => {
    const jsErrors: string[] = [];
    page.on('pageerror', (error) => {
      jsErrors.push(error.message);
    });

    // 在页面加载前禁用 localStorage
    await page.addInitScript(() => {
      Object.defineProperty(window, 'localStorage', {
        get() {
          throw new DOMException('Storage disabled', 'SecurityError');
        },
      });
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    // 应用应该正常加载，不崩溃
    const bodyText = await page.locator('body').innerText();
    expect(bodyText.length).toBeGreaterThan(10);

    // 不应有未捕获的致命错误（localStorage 相关的错误应该被 try-catch）
    const fatalErrors = jsErrors.filter(e =>
      !e.includes('Storage disabled') && // 预期的错误
      !e.includes('localStorage')
    );
    expect(fatalErrors).toHaveLength(0);
  });
});

test.describe('边界数据场景', () => {
  test.beforeEach(async ({ page }) => {
    await skipWelcomeDialog(page);
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1500);
  });

  test('搜索不存在的内容不崩溃', async ({ page }) => {
    const jsErrors: string[] = [];
    page.on('pageerror', (error) => jsErrors.push(error.message));

    const searchInput = page.locator('input[placeholder*="搜索"], input[placeholder*="Search"]').first();
    if (await searchInput.isVisible().catch(() => false)) {
      // 搜索一个绝对不存在的内容
      await searchInput.fill('zzzzz不存在的事件xyz12345');
      await page.waitForTimeout(1000);

      // 页面不应崩溃
      const bodyText = await page.locator('body').innerText();
      expect(bodyText.length).toBeGreaterThan(10);
      expect(jsErrors).toHaveLength(0);
    }
  });

  test('快速连续切换视图不崩溃', async ({ page }) => {
    test.setTimeout(60000);
    const jsErrors: string[] = [];
    page.on('pageerror', (error) => jsErrors.push(error.message));

    const viewButtons = [
      '.grid button:has-text("时间线")',
      '.grid button:has-text("矩阵")',
      '.grid button:has-text("文明图谱")',
      '.grid button:has-text("统计")',
      '.grid button:has-text("对照")',
    ];

    // 快速连续点击（不等待渲染完成）
    for (let round = 0; round < 2; round++) {
      for (const selector of viewButtons) {
        const btn = page.locator(selector).first();
        if (await btn.isVisible().catch(() => false)) {
          await btn.click();
          await page.waitForTimeout(200); // 故意很短，制造竞态
        }
      }
    }

    // 等最后一次渲染完成
    await page.waitForTimeout(2000);
    expect(jsErrors).toHaveLength(0);
  });

  test('连续多次触发穿越功能不崩溃', async ({ page }) => {
    test.setTimeout(60000);
    const jsErrors: string[] = [];
    page.on('pageerror', (error) => jsErrors.push(error.message));

    const randomBtn = page.locator('button:has-text("穿越"), button:has-text("随机")').first();
    if (await randomBtn.isVisible().catch(() => false)) {
      // 连续快速点击穿越 5 次
      for (let i = 0; i < 5; i++) {
        await randomBtn.click();
        await page.waitForTimeout(300);
      }
      await page.waitForTimeout(1000);
      expect(jsErrors).toHaveLength(0);
    }
  });
});

test.describe('新增功能模块验证', () => {
  test.beforeEach(async ({ page }) => {
    await skipWelcomeDialog(page);
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1500);
  });

  test('收藏功能不崩溃（如果存在）', async ({ page }) => {
    const jsErrors: string[] = [];
    page.on('pageerror', (error) => jsErrors.push(error.message));

    // 工具栏中的"我的收藏"按钮
    const favBtn = page.locator('button[title="我的收藏"]').first();
    if (await favBtn.isVisible().catch(() => false)) {
      await favBtn.click();
      await page.waitForTimeout(1500);
      // 关闭面板
      await page.keyboard.press('Escape');
      await page.waitForTimeout(500);
    }

    const fatalErrors = jsErrors.filter(e => !e.includes('ResizeObserver'));
    expect(fatalErrors).toHaveLength(0);
  });

  test('历史问答功能不崩溃（如果存在）', async ({ page }) => {
    const jsErrors: string[] = [];
    page.on('pageerror', (error) => jsErrors.push(error.message));

    // 工具栏中的"历史知识测验"按钮
    const quizBtn = page.locator('button[title="历史知识测验"]').first();
    if (await quizBtn.isVisible().catch(() => false)) {
      await quizBtn.click();
      await page.waitForTimeout(2000);

      // 如果有"开始测验"按钮，尝试点击
      const startBtn = page.locator('button:has-text("开始测验")').first();
      if (await startBtn.isVisible().catch(() => false)) {
        await startBtn.click();
        await page.waitForTimeout(1500);
      }

      // 关闭面板
      await page.keyboard.press('Escape');
      await page.waitForTimeout(500);
    }

    const fatalErrors = jsErrors.filter(e => !e.includes('ResizeObserver'));
    expect(fatalErrors).toHaveLength(0);
  });
});
