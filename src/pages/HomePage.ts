import { Page, expect, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // locators
  get globalFeedTab(): Locator {
    return this.page.getByRole('link', { name: 'Global Feed' });
  }
  get yourFeedTab(): Locator {
    return this.page.getByRole('link', { name: 'Your Feed' });
  }
  get newArticleLink(): Locator {
    return this.page.getByRole('link', { name: 'New Article' });
  }
  get settingsLink(): Locator {
    return this.page.getByRole('link', { name: 'Settings' });
  }
  get tagList(): Locator {
    return this.page.locator('.tag-list a.tag-pill');
  }
  get articleList(): Locator {
    return this.page.locator('article-list, app-article-list, .article-preview');
  }
  get articlePreviewTitles(): Locator {
    return this.page.locator('.article-preview h1');
  }
  get activeTag(): Locator {
    return this.page.locator('.nav-pills .nav-item .nav-link.active');
  }
  get articlePreviews(): Locator {
    return this.page.locator('.article-preview');
  }
  get sidebarTagList(): Locator {
    return this.page.locator('.sidebar .tag-list');
  }
  get sidebar(): Locator {
    return this.page.locator('.sidebar');
  }

  articlePreviewByTitle(title: string): Locator {
    return this.articlePreviewTitles.filter({ hasText: title });
  }
  feedTab(name: string): Locator {
    return this.page.locator('.nav-pills .nav-item .nav-link', { hasText: name });
  }

  async navigate(): Promise<void> {
    await this.goto('/');
  }

  async clickTag(tagName: string): Promise<void> {
    await this.sidebarTagList.getByText(tagName, { exact: true }).click();
  }

  async assertTagFeedActive(tagName: string): Promise<void> {
    await expect(this.activeTag).toContainText(tagName, { timeout: 10_000 });
  }

  async assertArticleVisible(title: string): Promise<void> {
    await expect(this.articlePreviewByTitle(title)).toBeVisible({ timeout: 10_000 });
  }

  async assertNoArticlesWithTitle(title: string): Promise<void> {
    await expect(this.articlePreviewByTitle(title)).toHaveCount(0);
  }

  async clickGlobalFeed(): Promise<void> {
    await this.globalFeedTab.click();
    await this.articlePreviews.first().waitFor({ state: 'visible', timeout: 15_000 }).catch(() => {});
  }
}
