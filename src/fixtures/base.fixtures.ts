import { test as base, APIRequestContext, request } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { EditorPage } from '../pages/EditorPage';
import { ArticlePage } from '../pages/ArticlePage';
import { SettingsPage } from '../pages/SettingsPage';
import { ApiHelper } from '../utils/apiHelper';
import { ENV } from '../config/env';

type Fixtures = {
  homePage: HomePage;
  editorPage: EditorPage;
  articlePage: ArticlePage;
  settingsPage: SettingsPage;
  apiHelper: ApiHelper;
  apiContext: APIRequestContext;
};

export const test = base.extend<Fixtures>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },

  editorPage: async ({ page }, use) => {
    await use(new EditorPage(page));
  },

  articlePage: async ({ page }, use) => {
    await use(new ArticlePage(page));
  },

  settingsPage: async ({ page }, use) => {
    await use(new SettingsPage(page));
  },

  apiContext: async ({}, use) => {
    const ctx = await request.newContext({
      baseURL: ENV.API_BASE_URL,
    });
    await use(ctx);
    await ctx.dispose();
  },

  apiHelper: async ({ apiContext }, use) => {
    const helper = new ApiHelper(apiContext);
    await helper.init(ENV.USER_EMAIL, ENV.USER_PASSWORD);
    await use(helper);
  },
});

export { expect } from '@playwright/test';
