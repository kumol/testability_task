import { Page, expect, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class EditorPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // locators
  get titleInput(): Locator {
    return this.page.getByPlaceholder('Article Title');
  }
  private get descriptionInput(): Locator {
    return this.page.getByPlaceholder("What's this article about?");
  }
  private get bodyInput(): Locator {
    return this.page.getByPlaceholder('Write your article (in markdown)');
  }
  private get tagsInput(): Locator {
    return this.page.getByPlaceholder('Enter tags');
  }
  private get publishButton(): Locator {
    return this.page.getByRole('button', { name: 'Publish Article' });
  }
  get errorMessages(): Locator {
    return this.page.locator('.error-messages li');
  }
  private get publishedArticleH1(): Locator {
    return this.page.locator('h1').first();
  }

  async navigateToNew(): Promise<void> {
    await this.goto('/editor');
    await this.titleInput.waitFor({ state: 'visible', timeout: 30_000 });
  }

  async navigateToEdit(slug: string): Promise<void> {
    await this.goto(`/editor/${slug}`);
  }

  async fillArticleForm(data: {
    title: string;
    description: string;
    body: string;
    tags?: string[];
  }): Promise<void> {
    await this.titleInput.fill(data.title);
    await this.descriptionInput.fill(data.description);
    await this.bodyInput.fill(data.body);

    if (data.tags && data.tags.length > 0) {
      for (const tag of data.tags) {
        await this.tagsInput.fill(tag);
        await this.tagsInput.press('Enter');
      }
    }
  }

  async publish(): Promise<void> {
    await this.publishButton.click();
  }

  async createArticle(data: {
    title: string;
    description: string;
    body: string;
    tags?: string[];
  }): Promise<void> {
    await this.navigateToNew();
    await this.fillArticleForm(data);
    await this.publish();
  }

  async updateTitle(newTitle: string): Promise<void> {
    await this.titleInput.clear();
    await this.titleInput.fill(newTitle);
  }

  async assertPublished(expectedTitle: string): Promise<void> {
    await expect(this.page).toHaveURL(/\/article\/.+/, { timeout: 15_000 });
    await expect(this.publishedArticleH1).toContainText(expectedTitle, { timeout: 10_000 });
  }

  async assertValidationError(): Promise<void> {
    await expect(this.errorMessages.first()).toBeVisible({ timeout: 10_000 });
  }
}
