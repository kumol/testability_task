import { test, expect } from '../src/fixtures/base.fixtures';
import { DataGenerator } from '../src/utils/dataGenerator';
import { ENV } from '../src/config/env';

const USER = {
  email: ENV.USER_EMAIL,
  username: ENV.USER_USERNAME,
};

test.describe('Update User Settings', () => {
  let savedImage: string | null = null;

  test.afterEach(async ({ apiHelper }) => {
    if (savedImage !== null) {
      await apiHelper.updateUserSettings({ image: savedImage }).catch(() => {});
      savedImage = null;
    }
    await apiHelper.updateUserSettings({ bio: '' }).catch(() => {});
  });

  test('should update bio and verify the change is saved via API', async ({
    settingsPage,
    apiHelper,
    page,
  }) => {
    const newBio = DataGenerator.bio();
    await settingsPage.navigate();
    await settingsPage.fillForm({ username: USER.username, email: USER.email, bio: newBio });

    const [saveResponse] = await Promise.all([
      page.waitForResponse(r => r.url().includes('/api/user') && r.request().method() === 'PUT', { timeout: 15_000 }),
      settingsPage.save(),
    ]);
    expect(saveResponse.ok()).toBeTruthy();

    const userData = await apiHelper.getCurrentUser();
    expect(userData.bio).toBe(newBio);
  });

  test('should update avatar URL and verify it is saved via API', async ({
    settingsPage,
    apiHelper,
    page,
  }) => {
    savedImage = `${ENV.API_BASE_URL}/images/smiley-cyrus.jpeg`;

    const newAvatarUrl = DataGenerator.imageUrl();
    await settingsPage.navigate();
    await settingsPage.fillForm({ username: USER.username, email: USER.email, image: newAvatarUrl });

    const [saveResponse] = await Promise.all([
      page.waitForResponse(r => r.url().includes('/api/user') && r.request().method() === 'PUT', { timeout: 15_000 }),
      settingsPage.save(),
    ]);
    expect(saveResponse.ok()).toBeTruthy();

    const userData = await apiHelper.getCurrentUser();
    expect(userData.image).toBe(newAvatarUrl);
  });

  test('should display correct user info via the REST API', async ({ apiHelper }) => {
    const userData = await apiHelper.getCurrentUser();
    expect(userData.email).toBe(USER.email);
    expect(userData.username).toBe(USER.username);
  });

  test('settings page should render all form fields and Update Settings button', async ({
    settingsPage,
  }) => {
    await settingsPage.navigate();
    await settingsPage.assertAllFieldsVisible();
  });

  test('should stay on settings when email is blank on save', async ({
    settingsPage,
    page,
  }) => {
    await settingsPage.navigate();
    await settingsPage.fillForm({ username: USER.username, email: '' });
    await settingsPage.save();
    await expect(page).toHaveURL(/\/settings/, { timeout: 10_000 });
  });

  test('should stay on settings when username is blank on save', async ({
    settingsPage,
    page,
  }) => {
    await settingsPage.navigate();
    await settingsPage.fillForm({ username: '', email: USER.email });
    await settingsPage.save();
    await expect(page).toHaveURL(/\/settings/, { timeout: 10_000 });
  });
});
