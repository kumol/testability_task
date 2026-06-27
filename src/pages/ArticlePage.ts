import { Page, expect, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { ENV } from '../config/env';

export class ArticlePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // locators
  get articleTitle(): Locator {
    return this.page.locator('.article-page h1').first();
  }
  get articleBody(): Locator {
    return this.page.locator('.article-content');
  }
  get editButton(): Locator {
    return this.page.getByRole('link', { name: 'Edit Article' }).first();
  }
  get deleteButton(): Locator {
    return this.page.getByRole('button', { name: 'Delete Article' }).first();
  }
  get tagList(): Locator {
    return this.page.locator('.article-page .tag-list .tag-default');
  }
  get authorName(): Locator {
    return this.page.locator('.article-meta .author').first();
  }

  async navigate(slug: string): Promise<void> {
    await this.goto(`/article/${slug}`);
  }

  async deleteArticle(): Promise<void> {
    await this.deleteButton.click();
  }

  async clickEdit(): Promise<void> {
    await this.editButton.click();
    await expect(this.page).toHaveURL(/\/editor\/.+/, { timeout: 10_000 });
  }

  async assertTitle(title: string): Promise<void> {
    await expect(this.articleTitle).toContainText(title, { timeout: 10_000 });
  }

  async assertDeleted(): Promise<void> {
    await expect(this.page).toHaveURL(ENV.BASE_URL + '/', { timeout: 15_000 });
  }

  async assertTagVisible(tag: string): Promise<void> {
    await expect(this.tagList.filter({ hasText: tag })).toBeVisible({ timeout: 8_000 });
  }
}
