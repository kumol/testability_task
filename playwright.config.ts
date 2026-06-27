import { defineConfig, devices } from '@playwright/test';
import { ENV } from './src/config/env';

export default defineConfig({
  globalSetup: './src/config/globalSetup',

  testDir: './tests',

  timeout: 60_000,
  expect: { timeout: 10_000 },

  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,

  fullyParallel: true,
  workers: process.env.CI ? 4 : 4,

  reporter: [
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['list'],
  ],

  use: {
    baseURL: ENV.BASE_URL,

    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], storageState: 'src/auth/storageState.json' },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'], storageState: 'src/auth/storageState.json' },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'], storageState: 'src/auth/storageState.json' },
    },
  ],

  outputDir: 'test-results/',
});
