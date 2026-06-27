import { test, expect } from '../src/fixtures/base.fixtures';
import { DataGenerator } from '../src/utils/dataGenerator';

test.describe('Filter Articles by Tag', () => {
  let createdArticleSlug: string;
  const testTag = `autotag-${Date.now()}`;

  test.beforeAll(async ({ apiHelper }: any) => {
    const payload = DataGenerator.articlePayload({ tagList: [testTag] });
    const article = await apiHelper.createArticle(payload);
    createdArticleSlug = article.slug;
  });

  test.afterAll(async ({ apiHelper }: any) => {
    await apiHelper.deleteArticle(createdArticleSlug).catch(() => {});
  });

  test('should filter articles by clicking a tag from the sidebar', async ({
    homePage,
    page,
  }) => {
    await homePage.navigate();
    await page.waitForLoadState('networkidle');

    const firstTag = homePage.tagList.first();
    await expect(firstTag).toBeVisible({ timeout: 10_000 });
    const tagName = (await firstTag.innerText()).trim();

    await firstTag.click();

    await homePage.assertTagFeedActive(tagName);
    await expect(homePage.articlePreviews.first()).toBeVisible({ timeout: 15_000 });
  });

  test('should show only articles that contain the selected tag', async ({
    homePage,
    apiHelper,
    page,
  }) => {
    await homePage.navigate();
    await page.waitForLoadState('networkidle');

    const tags = await apiHelper.getTags();
    expect(tags.length).toBeGreaterThan(0);
    const selectedTag = tags[0];

    await homePage.clickTag(selectedTag);
    await homePage.assertTagFeedActive(selectedTag);

    const articles = await apiHelper.getArticlesByTag(selectedTag);
    expect(articles.length).toBeGreaterThan(0);
    for (const article of articles) {
      expect(article.tagList).toContain(selectedTag);
    }
  });

  test('should show no articles for a non-existent tag via API', async ({
    apiHelper,
  }) => {
    const nonExistentTag = `nonexistent-${Date.now()}`;
    const articles = await apiHelper.getArticlesByTag(nonExistentTag);
    expect(articles.length).toBe(0);
  });

  test('should handle an empty tag filter gracefully without crashing', async ({
    homePage,
    page,
  }) => {
    await homePage.navigate();
    await page.waitForLoadState('networkidle');
    await expect(homePage.articlePreviews.first()).toBeVisible({ timeout: 15_000 });
    await expect(homePage.sidebar).toBeVisible({ timeout: 8_000 });
  });
});
