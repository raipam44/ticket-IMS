import { test, expect } from '@playwright/test';
import { registerUser, loginUser, logoutUser } from './helpers.js';

test.describe('Authentication', () => {

    test('guest is redirected to login when hitting /tickets', async ({ page }) => {
        await page.goto('/tickets');
        await expect(page).toHaveURL(/login/);
    });

    test('guest is redirected to login when hitting /dashboard', async ({ page }) => {
        await page.goto('/dashboard');
        await expect(page).toHaveURL(/login/);
    });

    test('register page loads', async ({ page }) => {
        await page.goto('/register');
        await expect(page.getByRole('button', { name: 'Register' })).toBeVisible();
        await expect(page.getByLabel('Name')).toBeVisible();
        await expect(page.getByLabel('Email')).toBeVisible();
    });

    test('user can register and land on dashboard', async ({ page }) => {
        await registerUser(page);
        await expect(page).toHaveURL(/dashboard/);
        await expect(page.getByText('Your queue')).toBeVisible();
    });

    test('register shows inline error for duplicate email', async ({ page }) => {
        const { email } = await registerUser(page);

        // Log out
        await logoutUser(page);

        // Try registering again with same email
        await page.goto('/register');
        await page.getByLabel('Name').fill('Duplicate User');
        await page.getByLabel('Email').fill(email);
        await page.getByLabel('Password', { exact: true }).fill('Password1!');
        await page.getByLabel('Confirm Password').fill('Password1!');
        await page.getByRole('button', { name: 'Register' }).click();

        await expect(page.getByText(/already been taken/i)).toBeVisible();
        await expect(page).not.toHaveURL(/dashboard/);
    });

    test('login shows error for wrong password', async ({ page }) => {
        const { email } = await registerUser(page);
        await logoutUser(page);

        await page.goto('/login');
        await page.getByLabel('Email').fill(email);
        await page.getByLabel('Password').fill('wrongpassword');
        await page.getByRole('button', { name: 'Log in' }).click();

        await expect(page.getByText(/credentials do not match/i)).toBeVisible();
    });

    test('user can log out', async ({ page }) => {
        await registerUser(page);
        await logoutUser(page);
        await expect(page).toHaveURL(/login|\/$/);
    });

    test('nav bar shows logged-in users name', async ({ page }) => {
        const { name } = await registerUser(page);
        await expect(page.getByText(name)).toBeVisible();
    });

});
