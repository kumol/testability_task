import { faker } from '@faker-js/faker';

export class DataGenerator {
  static articleTitle(): string {
    const templates: (() => string)[] = [
      () => `How to ${faker.hacker.verb()} ${faker.hacker.adjective()} ${faker.hacker.noun()}`,
      () => `${faker.company.catchPhrase()}: A Complete Guide`,
      () => `The Future of ${faker.hacker.adjective()} ${faker.hacker.noun()}`,
      () => `Understanding ${faker.hacker.noun()} in Modern ${faker.hacker.adjective()} Systems`,
      () => `Getting Started with ${faker.hacker.adjective()} ${faker.hacker.noun()}`,
      () => `${faker.hacker.adjective()} ${faker.hacker.noun()} Best Practices`,
      () => `Why ${faker.hacker.adjective()} ${faker.hacker.noun()} Matters`,
    ];
    const phrase = templates[Math.floor(Math.random() * templates.length)]();
    const id = faker.string.alphanumeric(6).toUpperCase();
    return `${phrase} [${id}]`;
  }

  static articleDescription(): string {
    return faker.company.catchPhrase();
  }

  static articleBody(): string {
    return Array.from({ length: 6 }, () => faker.hacker.phrase()).join(' ');
  }

  static tags(count = 2): string[] {
    return Array.from({ length: count }, () =>
      faker.word.adjective().toLowerCase().replace(/\s+/g, '-'),
    );
  }

  static articlePayload(overrides?: Partial<{
    title: string;
    description: string;
    body: string;
    tagList: string[];
  }>) {
    return {
      title: DataGenerator.articleTitle(),
      description: DataGenerator.articleDescription(),
      body: DataGenerator.articleBody(),
      tagList: DataGenerator.tags(2),
      ...overrides,
    };
  }

  static bio(): string {
    return faker.person.bio().substring(0, 150);
  }

  static avatarUrl(): string {
    const seed = faker.string.alphanumeric(8);
    return `https://api.dicebear.com/7.x/initials/svg?seed=${seed}`;
  }

  static imageUrl(): string {
    return `https://picsum.photos/seed/${faker.string.alphanumeric(6)}/200/200`;
  }

  static emptyString(): string {
    return '';
  }

  static longString(length = 300): string {
    return faker.string.alpha(length);
  }
}
