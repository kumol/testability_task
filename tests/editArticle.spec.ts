import { test, expect } from '../src/fixtures/base.fixtures';
import { DataGenerator } from '../src/utils/dataGenerator';

test.describe('Edit Article', () => {
  let articleSlug: string;
  let originalTitle: string;

  test.beforeEach(async ({ apiHelper }) => {
    const payload = DataGenerator.articlePayload();
    originalTitle = payload.title;
    const article = await apiHelper.createArticle(payload);
    articleSlug = article.slug;
  });

  test.afterEach(async ({ apiHelper }) => {
    if (articleSlug) {
      await apiHelper.deleteArticle(articleSlug).catch(() => {});
    }
  });

  test('should edit the article title and verify the change is persisted', async ({
    articlePage,
    editorPage,
    page,
  }) => {
    const updatedTitle = `EDITED – ${DataGenerator.articleTitle()}`;

    await articlePage.navigate(articleSlug);
    await articlePage.assertTitle(originalTitle);

    await articlePage.clickEdit();

    await editorPage.updateTitle(updatedTitle);
    await editorPage.publish();

    await expect(page).toHaveURL(/\/article\/.+/, { timeout: 15_000 });
    await articlePage.assertTitle(updatedTitle);
    articleSlug = page.url().split('/article/')[1];
  });

  test('should navigate to the editor via URL and update article body', async ({
    editorPage,
    page,
  }) => {
    const newBody = DataGenerator.articleBody();

    await editorPage.navigateToEdit(articleSlug);
    await editorPage.fillArticleForm({
      title: originalTitle,
      description: DataGenerator.articleDescription(),
      body: newBody,
    });
    await editorPage.publish();

    await expect(page).toHaveURL(/\/article\/.+/, { timeout: 15_000 });
    articleSlug = page.url().split('/article/')[1];
  });

  test('should not update article when navigating to a non-existent editor slug', async ({
    editorPage,
    page,
  }) => {
    const nonExistentSlug = `non-existent-article-slug-${Date.now()}`;
    await page.goto(`/editor/${nonExistentSlug}`, { waitUntil: 'networkidle' });

    const titleValue = await editorPage.titleInput.inputValue().catch(() => '');
    expect(titleValue).toBe('');
  });
});
