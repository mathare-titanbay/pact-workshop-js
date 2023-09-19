import type { PlaywrightTestConfig } from '@playwright/test'

const config: PlaywrightTestConfig = {
  use: {
    headless: false,
    trace: 'on',
    baseURL: 'http://localhost:3000/'
  },
  webServer: {
    command: 'npm start',
    url: 'http://localhost:3000/',
  },
  testDir: './tests',
  reporter: 'html'
}

export default config
