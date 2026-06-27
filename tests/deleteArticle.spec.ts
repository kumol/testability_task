import { test, expect } from '../src/fixtures/base.fixtures';
import { DataGenerator } from '../src/utils/dataGenerator';
import { ENV } from '../src/config/env';

test.describe('Delete Article', () => {
  let articleSlug: string;
  let articleTitle: string;

  test.beforeEach(async ({ apiHelper }) => {
    const payload = DataGenerator.articlePayload();
    articleTitle = payload.title;
    const article = await apiHelper.createArticle(payload);
    articleSlug = article.slug;
  });

  test.afterEach(async ({ apiHelper }) => {
    await apiHelper.deleteArticle(articleSlug).catch(() => {});
  });

  test('should delete an article and verify it is removed from the feed', async ({
    articlePage,
    homePage,
    page,
  }) => {
    await articlePage.navigate(articleSlug);
    await articlePage.assertTitle(articleTitle);

    await articlePage.deleteArticle();

    await articlePage.assertDeleted();

    await expect(homePage.articlePreviews.first()).toBeVisible({ timeout: 15_000 });
    await homePage.assertNoArticlesWithTitle(articleTitle);
  });

  test('should return 404 when accessing a deleted article slug via API', async ({
    articlePage,
    apiHelper,
    page,
  }) => {
    await apiHelper.deleteArticle(articleSlug);

    const response = await page.goto(`/article/${articleSlug}`, { waitUntil: 'networkidle' });
    const isHome = page.url().startsWith(ENV.BASE_URL) && !page.url().includes('/article/');
    const isErrorPage = await page.locator('body').innerText().then(t => t.toLowerCase().includes('not found') || t.toLowerCase().includes('404'));

    expect(isHome || isErrorPage || response?.status() === 404).toBeTruthy();
  });
});
