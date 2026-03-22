import { test, expect } from '@playwright/test';

test('mock login reaches the dashboard shell', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('Email').fill('sako@example.com');
  await page.getByLabel('Password').fill('password123');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page).toHaveURL(/dashboard/, { timeout: 15000 });
  await expect(page.getByText('Semantic Web Framework')).toBeVisible();
});

test('mock signup creates an account and signs into the dashboard shell', async ({ page }) => {
  const email = `operator.${Date.now()}@example.com`;

  await page.goto('/signup');
  await page.getByLabel('First name').fill('Nova');
  await page.getByLabel('Last name').fill('Operator');
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Password').fill('password123');
  await page.getByRole('button', { name: 'Create account' }).click();

  await expect(page).toHaveURL(/dashboard/, { timeout: 15000 });
  await expect(page.getByText('Semantic Web Framework')).toBeVisible();

  await page.getByRole('button', { name: 'Logout' }).click();
  await page.getByRole('button', { name: 'Log out' }).click();
  await expect(page).toHaveURL(/login/, { timeout: 15000 });
  await page.getByRole('link', { name: 'Create account' }).click();
  await expect(page).toHaveURL(/signup/);
});
