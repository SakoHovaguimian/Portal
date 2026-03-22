import { test, expect, type Page } from '@playwright/test';

async function login(page: Page) {
  await page.goto('/login');
  await page.getByLabel('Email').fill('sako@example.com');
  await page.getByLabel('Password').fill('password123');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page).toHaveURL(/dashboard/, { timeout: 15000 });
}

test('profile updates and logout returns to login', async ({ page }) => {
  await login(page);
  await page.getByRole('button', { name: 'Profile' }).click();
  await expect(page).toHaveURL(/profile/);
  await page.getByLabel('First name').fill('Sako Updated');
  await page.getByRole('button', { name: 'Save profile' }).click();
  await expect(page.getByLabel('First name')).toHaveValue('Sako Updated');
  await page.getByRole('button', { name: 'Logout' }).click();
  await page.getByRole('button', { name: 'Log out' }).click();
  await expect(page).toHaveURL(/login/, { timeout: 15000 });
});

test('experience page renders as an immersive full-screen route', async ({ page }) => {
  await login(page);
  await page.getByRole('link', { name: 'Open experience' }).click();
  await expect(page).toHaveURL(/experience/);
  await expect(page.getByText('Build conversion-ready hero pages and operational portals from one starter.')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Workflow' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Back to dashboard' })).toBeVisible();
});
