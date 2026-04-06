import { defineConfig, devices } from '@playwright/test';

/**
 * Chrono Atlas E2E 测试配置
 *
 * 使用方式：
 *   npx playwright test                    # 运行所有测试
 *   npx playwright test --headed           # 带浏览器界面运行
 *   npx playwright test views.spec.ts      # 只运行视图测试
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html', { open: 'never' }],
    ['list'],
  ],
  timeout: 30000,

  use: {
    /* 默认访问本地开发服务器 */
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  /* 自动启动开发服务器 */
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 60000,
  },
});
