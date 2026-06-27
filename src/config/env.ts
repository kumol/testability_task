import * as fs from 'fs';
import * as path from 'path';

function loadDotEnv(): void {
  const envFile = path.resolve(__dirname, '../../.env');
  if (!fs.existsSync(envFile)) return;

  const lines = fs.readFileSync(envFile, 'utf-8').split(/\r?\n/);
  for (const line of lines) {
    const match = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*)$/);
    if (!match) continue;
    const [, key, raw] = match;

    if (process.env[key] === undefined) {
      process.env[key] = raw.trim().replace(/^["']|["']$/g, '');
    }
  }
}

loadDotEnv();


function required(key: string): string {
  const value = process.env[key];
  if (!value) throw new Error(`Missing required env variable: ${key}. Check your .env file.`);
  return value;
}

/** Central config – import instead of hardcoding values. */
export const ENV = {
  BASE_URL: process.env.BASE_URL ?? 'https://conduit.bondaracademy.com',
  API_BASE_URL: process.env.API_BASE_URL ?? 'https://conduit-api.bondaracademy.com',
  USER_EMAIL: required('USER_EMAIL'),
  USER_PASSWORD: required('USER_PASSWORD'),
  USER_USERNAME: required('USER_USERNAME'),
} as const;
