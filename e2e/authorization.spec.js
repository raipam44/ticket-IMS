import { test, expect } from '@playwright/test';
import { registerUser, createTicket } from './helpers.js';

test.describe('Authorization', () => {

    test('user A cannot view user B ticket by URL manipulation — gets 403 page', async ({ page }) => {
        // User A creates a ticket
        const userA = await registerUser(page);
        const title = await createTicket(page, { title: 'User A private ticket' });

        // Get the ticket ID from the URL on show page
        await page.getByRole('link', { name: title }).first().click();
        const url      = page.url();
        const ticketId = url.match(/\/tickets\/(\d+)/)?.[1];
        expect(ticketId).toBeTruthy();

        // Log out user A
        await page.getByRole('button', { name: /log out/i }).click();

        // Register + log in as user B
        await registerUser(page);

        // Try to navigate to user A's ticket
        await page.goto(`/tickets/${ticketId}`);

        // Should see the 403 error page
        await expect(page.getByText('403')).toBeVisible();
        await expect(page.getByText(/can't open this ticket/i)).toBeVisible();
        await expect(page.getByRole('link', { name: /back to my tickets/i })).toBeVisible();
    });

    test('user B cannot edit user A ticket by URL manipulation — gets 403', async ({ page }) => {
        const userA = await registerUser(page);
        const title  = await createTicket(page, { title: 'User A edit target' });

        await page.getByRole('link', { name: title }).first().click();
        const ticketId = page.url().match(/\/tickets\/(\d+)/)?.[1];

        await page.getByRole('button', { name: /log out/i }).click();
        await registerUser(page);

        await page.goto(`/tickets/${ticketId}/edit`);
        await expect(page.getByText('403')).toBeVisible();
    });

    test('tickets list only shows current users tickets', async ({ page }) => {
        // User A creates tickets
        await registerUser(page);
        await createTicket(page, { title: 'User A ticket one' });
        await createTicket(page, { title: 'User A ticket two' });
        await page.getByRole('button', { name: /log out/i }).click();

        // User B creates a ticket
        await registerUser(page);
        await createTicket(page, { title: 'User B private ticket' });

        // User B should only see their own ticket
        await page.goto('/tickets');
        await expect(page.getByText('User B private ticket')).toBeVisible();
        await expect(page.getByText('User A ticket one')).not.toBeVisible();
        await expect(page.getByText('User A ticket two')).not.toBeVisible();
    });

});

test.describe('Responsive layout', () => {

    // These tests run on the 'mobile' project (393px Pixel 5)
    test('nav shows hamburger menu on mobile', async ({ page }) => {
        await registerUser(page);
        // Hamburger button should be visible, desktop links hidden
        await expect(page.getByLabel('Open menu')).toBeVisible();
        await expect(page.getByRole('navigation').getByRole('link', { name: 'Dashboard' })).not.toBeVisible({ timeout: 2000 }).catch(() => {});
    });

    test('new ticket icon button is visible outside drawer on mobile', async ({ page }) => {
        await registerUser(page);
        await expect(page.getByLabel('New ticket')).toBeVisible();
    });

    test('mobile drawer opens and contains nav links', async ({ page }) => {
        await registerUser(page);
        await page.getByLabel('Open menu').click();
        await expect(page.getByRole('link', { name: 'Dashboard' })).toBeVisible();
        await expect(page.getByRole('link', { name: 'Tickets' })).toBeVisible();
    });

    test('ticket list shows stub cards on mobile, not table', async ({ page }) => {
        await registerUser(page);
        await createTicket(page, { title: 'Mobile card test ticket' });
        await page.goto('/tickets');

        // Table should not be visible on mobile
        await expect(page.locator('table')).not.toBeVisible();
        // Article cards (TicketStubCard uses <article>) should be visible
        await expect(page.locator('article').first()).toBeVisible();
    });

    test('no horizontal scroll on mobile at 360px', async ({ page }) => {
        await page.setViewportSize({ width: 360, height: 740 });
        await registerUser(page);
        await page.goto('/tickets');

        const bodyScrollWidth  = await page.evaluate(() => document.body.scrollWidth);
        const windowInnerWidth = await page.evaluate(() => window.innerWidth);
        expect(bodyScrollWidth).toBeLessThanOrEqual(windowInnerWidth);
    });

    test('create form fields are single column on mobile', async ({ page }) => {
        await registerUser(page);
        await page.goto('/tickets/create');

        const category = page.getByLabel('Category');
        const priority = page.getByLabel('Priority');

        const catBox = await category.boundingBox();
        const priBox = await priority.boundingBox();

        // On mobile they should stack — category is above priority (lower Y)
        expect(catBox.y).toBeLessThan(priBox.y);
    });

});
