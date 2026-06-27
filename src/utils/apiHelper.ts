import { APIRequestContext } from '@playwright/test';
import { ENV } from '../config/env';

export interface ArticlePayload {
  title: string;
  description: string;
  body: string;
  tagList?: string[];
}

export interface ArticleResponse {
  slug: string;
  title: string;
  description: string;
  body: string;
  tagList: string[];
}

export class ApiHelper {
  private token = '';
  private readonly baseUrl = ENV.API_BASE_URL;

  constructor(readonly apiContext: APIRequestContext) {}

  async init(email: string, password: string): Promise<void> {
    const response = await this.apiContext.post(`${this.baseUrl}/api/users/login`, {
      data: { user: { email, password } },
    });

    if (!response.ok()) {
      throw new Error(`Login failed: ${response.status()} ${await response.text()}`);
    }

    const body = await response.json();
    this.token = body.user.token;
  }

  getToken(): string {
    return this.token;
  }

  private headers() {
    return {
      Authorization: `Token ${this.token}`,
      'Content-Type': 'application/json',
    };
  }

  async createArticle(payload: ArticlePayload): Promise<ArticleResponse> {
    const response = await this.apiContext.post(`${this.baseUrl}/api/articles`, {
      headers: this.headers(),
      data: { article: payload },
    });

    if (!response.ok()) {
      throw new Error(`Create article failed: ${response.status()} ${await response.text()}`);
    }

    const body = await response.json();
    return body.article as ArticleResponse;
  }

  async deleteArticle(slug: string): Promise<void> {
    const response = await this.apiContext.delete(`${this.baseUrl}/api/articles/${slug}`, {
      headers: this.headers(),
    });

    if (!response.ok()) {
      if (response.status() !== 404) {
        throw new Error(`Delete article failed: ${response.status()} ${await response.text()}`);
      }
    }
  }

  async getArticlesByTag(tag: string): Promise<ArticleResponse[]> {
    const response = await this.apiContext.get(`${this.baseUrl}/api/articles?tag=${encodeURIComponent(tag)}&limit=10`, {
      headers: this.headers(),
    });

    const body = await response.json();
    return body.articles as ArticleResponse[];
  }

  async getTags(): Promise<string[]> {
    const response = await this.apiContext.get(`${this.baseUrl}/api/tags`);
    const body = await response.json();
    return body.tags as string[];
  }

  async getCurrentUser(): Promise<{
    email: string;
    username: string;
    bio: string | null;
    image: string | null;
  }> {
    const response = await this.apiContext.get(`${this.baseUrl}/api/user`, {
      headers: this.headers(),
    });
    const body = await response.json();
    return body.user;
  }

  async updateUserSettings(settings: {
    bio?: string;
    image?: string;
    username?: string;
    email?: string;
  }): Promise<void> {
    const response = await this.apiContext.put(`${this.baseUrl}/api/user`, {
      headers: this.headers(),
      data: { user: settings },
    });

    if (!response.ok()) {
      throw new Error(`Update settings failed: ${response.status()} ${await response.text()}`);
    }
  }
}
