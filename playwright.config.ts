import { defineConfig, devices } from '@playwright/test'

const externalBaseUrl = process.env.MIGRATION_BASE_URL

export default defineConfig({
  testDir: './tests/migration',
  // The current Next.js baseline intermittently returns a truncated RSC/JSON
  // response when many cold routes compile at once. Keep this contract file
  // serial so baseline failures describe route behaviour, not dev-server load.
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: externalBaseUrl ?? 'http://127.0.0.1:3000',
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: externalBaseUrl
    ? undefined
    : {
        command: 'pnpm dev:next --hostname 127.0.0.1 --port 3000',
        url: 'http://127.0.0.1:3000',
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      },
})
