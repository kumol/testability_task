import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // -- Locators
  private get emailInput() {
    return this.page.getByPlaceholder('Email');
  }
  private get passwordInput() {
    return this.page.getByPlaceholder('Password');
  }
  private get signInButton() {
    return this.page.getByRole('button', { name: 'Sign in' });
  }
  get errorMessages() {
    return this.page.locator('.error-messages li');
  }
  userNavLink(username: string) {
    return this.page.getByRole('link', { name: username });
  }

  async navigate(): Promise<void> {
    await this.goto('/login');
  }

  async login(email: string, password: string): Promise<void> {
    await this.navigate();
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.signInButton.click();
  }

  async assertLoggedIn(username: string): Promise<void> {
    await expect(this.userNavLink(username)).toBeVisible({ timeout: 15_000 });
  }

  async assertLoginError(): Promise<void> {
    await expect(this.errorMessages.first()).toBeVisible({ timeout: 10_000 });
  }
}
