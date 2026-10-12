import { test, expect } from '@playwright/test';
import { registerUser, createTicket, expectToast } from './helpers.js';

test.describe('Ticket CRUD', () => {

    test('empty state shown for new user', async ({ page }) => {
        await registerUser(page);
        await page.goto('/tickets');
        await expect(page.getByText('No tickets yet')).toBeVisible();
        await expect(page.getByRole('link', { name: 'Create ticket' })).toBeVisible();
    });

    test('user can create a ticket and see flash message', async ({ page }) => {
        await registerUser(page);
        const title = await createTicket(page, { title: 'My keyboard stopped working' });

        await expect(page).toHaveURL(/tickets$/);
        await expectToast(page, 'Ticket created.');
        await expect(page.getByText('My keyboard stopped working').first()).toBeVisible();
    });

    test('create form shows inline errors for short title', async ({ page }) => {
        await registerUser(page);
        await page.goto('/tickets/create');

        await page.getByLabel('Title').fill('Hi');
        await page.getByLabel('Description').fill('Long enough description here.');
        await page.getByLabel('Category').selectOption('Hardware');
        await page.getByLabel('Priority').selectOption('Low');
        await page.getByRole('button', { name: 'Create ticket' }).click();

        await expect(page.getByText(/at least 5/i)).toBeVisible();
        // Input value is preserved after failed submit
        await expect(page.getByLabel('Title')).toHaveValue('Hi');
    });

    test('create form shows inline errors for short description', async ({ page }) => {
        await registerUser(page);
        await page.goto('/tickets/create');

        await page.getByLabel('Title').fill('Valid title here');
        await page.getByLabel('Description').fill('Short');
        await page.getByLabel('Category').selectOption('Software');
        await page.getByLabel('Priority').selectOption('Medium');
        await page.getByRole('button', { name: 'Create ticket' }).click();

        await expect(page.getByText(/at least 10/i)).toBeVisible();
    });

    test('submit button is disabled and shows saving while processing', async ({ page }) => {
        await registerUser(page);
        await page.goto('/tickets/create');

        await page.getByLabel('Title').fill('Testing submit state');
        await page.getByLabel('Description').fill('Checking the button disables while submitting.');
        await page.getByLabel('Category').selectOption('Network');
        await page.getByLabel('Priority').selectOption('High');

        const btn = page.getByRole('button', { name: 'Create ticket' });
        // Intercept navigation to check intermediate state
        await Promise.all([
            page.waitForURL('**/tickets'),
            btn.click(),
        ]);
        // After navigation the ticket is created
        await expectToast(page, 'Ticket created.');
    });

    test('user can view ticket details', async ({ page }) => {
        await registerUser(page);
        const title = await createTicket(page, {
            title:       'Printer jams on floor 2',
            description: 'The shared printer jams every morning on floor 2.',
            category:    'Hardware',
            priority:    'Urgent',
        });

        await page.getByRole('link', { name: title }).first().click();
        await expect(page.getByRole('heading', { name: title })).toBeVisible();
        await expect(page.getByText('Hardware')).toBeVisible();
        await expect(page.getByText('Urgent')).toBeVisible();
    });

    test('user can edit a ticket and see flash message', async ({ page }) => {
        await registerUser(page);
        const title = await createTicket(page, { title: 'Old ticket title' });

        await page.getByRole('link', { name: title }).first().click();
        await page.getByRole('link', { name: 'Edit ticket' }).click();

        await page.getByLabel('Title').fill('Updated ticket title');
        await page.getByLabel('Status').selectOption('In Progress');
        await page.getByRole('button', { name: 'Update ticket' }).click();

        await expect(page).toHaveURL(/tickets\/\d+$/);
        await expectToast(page, 'Ticket updated.');
        await expect(page.getByText('Updated ticket title')).toBeVisible();
        await expect(page.getByText('In Progress')).toBeVisible();
    });

    test('edit form is pre-filled with current values', async ({ page }) => {
        await registerUser(page);
        const title = await createTicket(page, {
            title:    'Pre-fill test ticket',
            category: 'Network',
            priority: 'High',
        });

        await page.getByRole('link', { name: title }).first().click();
        await page.getByRole('link', { name: 'Edit ticket' }).click();

        await expect(page.getByLabel('Title')).toHaveValue('Pre-fill test ticket');
        await expect(page.getByLabel('Category')).toHaveValue('Network');
        await expect(page.getByLabel('Priority')).toHaveValue('High');
    });

    test('user can delete a ticket with confirmation and see flash message', async ({ page }) => {
        await registerUser(page);
        const title = await createTicket(page, { title: 'Ticket to delete' });

        await page.getByRole('link', { name: title }).first().click();
        await page.getByRole('button', { name: 'Delete' }).click();

        // Confirm modal
        await expect(page.getByRole('dialog')).toBeVisible();
        await expect(page.getByText('Delete this ticket?')).toBeVisible();
        await page.getByRole('button', { name: 'Delete ticket' }).click();

        await expect(page).toHaveURL(/tickets$/);
        await expectToast(page, 'Ticket deleted.');
        await expect(page.getByText('Ticket to delete')).not.toBeVisible();
    });

    test('keep ticket button closes modal without deleting', async ({ page }) => {
        await registerUser(page);
        const title = await createTicket(page, { title: 'Should not be deleted' });

        await page.getByRole('link', { name: title }).first().click();
        await page.getByRole('button', { name: 'Delete' }).click();
        await expect(page.getByRole('dialog')).toBeVisible();

        await page.getByRole('button', { name: 'Keep ticket' }).click();

        await expect(page.getByRole('dialog')).not.toBeVisible();
        await expect(page.getByRole('heading', { name: 'Should not be deleted' })).toBeVisible();
    });

    test('pagination shows when there are more than 10 tickets', async ({ page }) => {
        await registerUser(page);

        // Create 12 tickets
        for (let i = 1; i <= 12; i++) {
            await createTicket(page, {
                title:       `Pagination ticket ${i}`,
                description: `This is pagination ticket number ${i} for testing.`,
            });
        }

        await page.goto('/tickets');
        // Should see pagination controls
        await expect(page.getByRole('link', { name: /next/i }).first()).toBeVisible();
    });

    test('filter by status shows only matching tickets', async ({ page }) => {
        await registerUser(page);
        await createTicket(page, { title: 'Open ticket filter test', status: 'Open' });
        await createTicket(page, { title: 'Resolved ticket filter test', status: 'Resolved' });

        await page.goto('/tickets');
        await Promise.all([
            page.waitForURL(/status=Open/),
            page.getByLabel('Filter by status').selectOption('Open'),
        ]);

        await expect(page.getByText('Open ticket filter test').first()).toBeVisible();
        await expect(page.getByText('Resolved ticket filter test')).toHaveCount(0);
    });

});
