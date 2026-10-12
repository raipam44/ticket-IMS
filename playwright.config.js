import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    testDir: './e2e',
    timeout: 30_000,
    retries: 1,
    workers: 1, // sequential — app uses a shared SQLite db in test env

    use: {
        baseURL:           'http://localhost:8000',
        headless:          true,
        screenshot:        'only-on-failure',
        video:             'retain-on-failure',
        trace:             'retain-on-failure',
        actionTimeout:     10_000,
        navigationTimeout: 15_000,
    },

    projects: [
        {
            name: 'chromium',
            use:  { ...devices['Desktop Chrome'] },
        },
        {
            name: 'mobile',
            use:  { ...devices['Pixel 5'] }, // 393px — tests responsive layout
        },
    ],

    // Start Laravel dev server before running tests
    webServer: {
        command:   'php artisan serve --port=8000',
        url:       'http://localhost:8000',
        timeout:   30_000,
        reuseExistingServer: !process.env.CI,
    },
});
