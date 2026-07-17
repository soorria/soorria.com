import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/interactions',
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:4321',
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    // The Vercel adapter does not implement `astro preview`; use Astro's dev
    // server locally and validate runtime parity on a Vercel Preview.
    command: 'ASTRO_DEV_BACKGROUND=0 pnpm dev:astro --host 127.0.0.1 --port 4321',
    url: 'http://127.0.0.1:4321/blog/event-delegation',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
})
