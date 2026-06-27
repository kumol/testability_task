import { Page, Locator } from '@playwright/test';

export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  async goto(path: string): Promise<void> {
    await this.page.goto(path);
  }

  async waitForNetworkIdle(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  get url(): string {
    return this.page.url();
  }

  getByText(text: string): Locator {
    return this.page.getByText(text, { exact: false });
  }

  navLink(name: string): Locator {
    return this.page.getByRole('link', { name });
  }
}
