import { expect } from '@playwright/test';

/**
 * Register a new unique user and return their credentials.
 */
export async function registerUser(page, overrides = {}) {
    const ts    = Date.now();
    const email = overrides.email    ?? `user${ts}@test.com`;
    const pass  = overrides.password ?? 'Password1!';
    const name  = overrides.name     ?? `User ${ts}`;

    await page.goto('/register');
    await page.getByLabel('Name').fill(name);
    await page.getByLabel('Email').fill(email);
    await page.getByLabel('Password', { exact: true }).fill(pass);
    await page.getByLabel('Confirm Password').fill(pass);
    await page.getByRole('button', { name: 'Register' }).click();
    await page.waitForURL('**/dashboard');

    return { email, password: pass, name };
}

/**
 * Log in with an existing account.
 */
export async function loginUser(page, email, password = 'Password1!') {
    await page.goto('/login');
    await page.getByLabel('Email').fill(email);
    await page.getByLabel('Password').fill(password);
    await page.getByRole('button', { name: 'Log in' }).click();
    await page.waitForURL('**/dashboard');
}

/**
 * Create a ticket via the UI and return its title.
 */
export async function createTicket(page, overrides = {}) {
    const title = overrides.title ?? `Test ticket ${Date.now()}`;

    await page.goto('/tickets/create');
    await page.getByLabel('Title').fill(title);
    await page.getByLabel('Description').fill(overrides.description ?? 'This is a detailed enough description.');
    await page.getByLabel('Category').selectOption(overrides.category ?? 'Software');
    await page.getByLabel('Priority').selectOption(overrides.priority ?? 'Medium');
    await page.getByLabel('Status').selectOption(overrides.status ?? 'Open');
    await page.getByRole('button', { name: 'Create ticket' }).click();
    await page.waitForURL('**/tickets');

    return title;
}

/**
 * Assert a flash toast with the given text is visible.
 */
export async function expectToast(page, text) {
    await expect(page.getByRole('status').or(page.getByRole('alert'))).toContainText(text);
}

/**
 * Log out current user handling both desktop and mobile drawer.
 */
export async function logoutUser(page) {
    const menuBtn = page.getByLabel('Open menu');
    if (await menuBtn.isVisible().catch(() => false)) {
        await menuBtn.click();
    }
    await page.getByRole('button', { name: /log out/i }).click();
    await page.waitForURL(/login|\/$/);
}
