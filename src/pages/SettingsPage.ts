import { Page, expect, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class SettingsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // Locators
  private get avatarInput(): Locator {
    return this.page.getByPlaceholder('URL of profile picture');
  }
  private get usernameInput(): Locator {
    return this.page.getByPlaceholder('Username');
  }
  private get bioInput(): Locator {
    return this.page.getByPlaceholder('Short bio about you');
  }
  private get emailInput(): Locator {
    return this.page.getByPlaceholder('Email');
  }
  private get passwordInput(): Locator {
    return this.page.getByPlaceholder('New Password');
  }
  private get saveButton(): Locator {
    return this.page.getByRole('button', { name: 'Update Settings' });
  }
  private get logoutButton(): Locator {
    return this.page.getByRole('button', { name: 'Or click here to logout.' });
  }
  get errorMessages(): Locator {
    return this.page.locator('.error-messages li');
  }

  private async typeValue(locator: Locator, value: string): Promise<void> {
    await locator.click({ clickCount: 3 });
    if (value) {
      await locator.pressSequentially(value, { delay: 20 });
    } else {
      await locator.fill('');
    }
  }

  async navigate(): Promise<void> {
    await this.goto('/settings');
    await this.saveButton.waitFor({ state: 'visible', timeout: 10_000 });
  }

  async fillForm(fields: {
    username?: string;
    email?: string;
    bio?: string;
    image?: string;
  }): Promise<void> {
    if (fields.username !== undefined) await this.typeValue(this.usernameInput, fields.username);
    if (fields.email    !== undefined) await this.typeValue(this.emailInput,    fields.email);
    if (fields.bio      !== undefined) await this.typeValue(this.bioInput,      fields.bio);
    if (fields.image    !== undefined) await this.typeValue(this.avatarInput,   fields.image);
  }

  async updateBio(bio: string): Promise<void> {
    await this.typeValue(this.bioInput, bio);
  }

  async updateAvatar(url: string): Promise<void> {
    await this.typeValue(this.avatarInput, url);
  }

  async updateUsername(username: string): Promise<void> {
    await this.typeValue(this.usernameInput, username);
  }

  async updateEmail(email: string): Promise<void> {
    await this.typeValue(this.emailInput, email);
  }

  async save(): Promise<void> {
    await this.saveButton.click();
  }

  async logout(): Promise<void> {
    await this.logoutButton.click();
  }

  
  async assertAllFieldsVisible(): Promise<void> {
    await expect(this.avatarInput).toBeVisible();
    await expect(this.usernameInput).toBeVisible();
    await expect(this.bioInput).toBeVisible();
    await expect(this.emailInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.saveButton).toBeVisible();
  }

  async assertValidationError(): Promise<void> {
    await expect(this.errorMessages.first()).toBeVisible({ timeout: 10_000 });
  }
}
