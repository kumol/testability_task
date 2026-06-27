import { test as setup, expect } from '@playwright/test';
import path from 'path';
import { ENV } from '../config/env';

const AUTH_FILE = path.join(__dirname, '../../src/auth/storageState.json');

setup('authenticate', async ({ page }) => {
  const response = await page.goto('/login', { waitUntil: 'networkidle' });
  const isAlreadyLoggedIn = page.url().includes('/login') === false;
  if (isAlreadyLoggedIn) {
    await page.context().storageState({ path: AUTH_FILE });
    return;
  }

  await page.getByPlaceholder('Email').fill(ENV.USER_EMAIL);
  await page.getByPlaceholder('Password').fill(ENV.USER_PASSWORD);
  await page.getByRole('button', { name: 'Sign in' }).click();

  await expect(page.getByRole('link', { name: ENV.USER_USERNAME })).toBeVisible({ timeout: 15_000 });

  await page.context().storageState({ path: AUTH_FILE });
});
