import { test, expect } from '../src/fixtures/base.fixtures';
import { DataGenerator } from '../src/utils/dataGenerator';

test.describe('Create New Article', () => {
  let createdSlug: string | null = null;

  test.afterEach(async ({ apiHelper }) => {
    if (createdSlug) {
      await apiHelper.deleteArticle(createdSlug).catch(() => {});
      createdSlug = null;
    }
  });

  test('should create a new article with all fields and verify it is published', async ({
    editorPage,
    articlePage,
    page,
  }) => {
    const article = DataGenerator.articlePayload();

    await editorPage.navigateToNew();
    await editorPage.fillArticleForm(article);
    await editorPage.publish();

    await editorPage.assertPublished(article.title);
    createdSlug = page.url().split('/article/')[1];

    await expect(articlePage.editButton).toBeVisible();
    await expect(articlePage.deleteButton).toBeVisible();
  });

  test('should create an article without tags and verify it appears on global feed', async ({
    editorPage,
    articlePage,
    homePage,
    page,
  }) => {
    const article = DataGenerator.articlePayload({ tagList: [] });

    await editorPage.navigateToNew();
    await editorPage.fillArticleForm({ ...article, tags: [] });
    await editorPage.publish();

    await expect(page).toHaveURL(/\/article\/.+/, { timeout: 15_000 });
    createdSlug = page.url().split('/article/')[1];

    await articlePage.assertTitle(article.title);

    await homePage.navigate();
    await expect(homePage.articlePreviews.first()).toBeVisible({ timeout: 15_000 });
    await homePage.assertArticleVisible(article.title);
  });

  test('should show validation error when submitting an article with empty title', async ({
    editorPage,
    page,
  }) => {
    await editorPage.navigateToNew();
    await editorPage.fillArticleForm({
      title: DataGenerator.emptyString(),
      description: DataGenerator.articleDescription(),
      body: DataGenerator.articleBody(),
    });
    await editorPage.publish();

    await expect(page).toHaveURL(/\/editor/, { timeout: 8_000 });
    await editorPage.assertValidationError();
  });

  test('should show validation error when body is empty', async ({
    editorPage,
    page,
  }) => {
    await editorPage.navigateToNew();
    await editorPage.fillArticleForm({
      title: DataGenerator.articleTitle(),
      description: DataGenerator.articleDescription(),
      body: DataGenerator.emptyString(),
    });
    await editorPage.publish();

    await expect(page).toHaveURL(/\/editor/, { timeout: 8_000 });
    await editorPage.assertValidationError();
  });
});
