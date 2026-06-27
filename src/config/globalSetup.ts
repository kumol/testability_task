import { FullConfig } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';
import { ENV } from './env';

const AUTH_FILE = path.join(__dirname, '../../src/auth/storageState.json');

function isTokenValid(token: string): boolean {
  try {
    const payloadB64 = token.split('.')[1];
    const payload = JSON.parse(Buffer.from(payloadB64, 'base64').toString('utf-8'));
    const fiveMinMs = 5 * 60 * 1000;
    return typeof payload.exp === 'number' && payload.exp * 1000 > Date.now() + fiveMinMs;
  } catch {
    return false;
  }
}

export default async function globalSetup(_config: FullConfig): Promise<void> {
  if (fs.existsSync(AUTH_FILE)) {
    try {
      const saved = JSON.parse(fs.readFileSync(AUTH_FILE, 'utf-8'));
      const token: string =
        (saved.origins ?? [])
          .flatMap((o: { localStorage?: { name: string; value: string }[] }) => o.localStorage ?? [])
          .find((item: { name: string; value: string }) => item.name === 'jwtToken')?.value ?? '';

      if (isTokenValid(token)) {
        console.log('[globalSetup] Valid JWT found on disk – skipping login.');
        return;
      }
    } catch {
      console.error('[globalSetup] Error reading saved auth state.');
    }
  }

  console.log('[globalSetup] Authenticating via API…');

  const response = await fetch(`${ENV.API_BASE_URL}/api/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      user: { email: ENV.USER_EMAIL, password: ENV.USER_PASSWORD },
    }),
  });

  if (!response.ok) {
    throw new Error(
      `[globalSetup] API login failed – ${response.status} ${response.statusText}\n${await response.text()}`,
    );
  }

  const body = await response.json() as { user: { token: string; username: string; email: string } };
  const { token, username, email } = body.user;

  const storageState = {
    origins: [
      {
        origin: ENV.BASE_URL,
        localStorage: [{ name: 'jwtToken', value: token }],
      },
    ],
  };

  fs.mkdirSync(path.dirname(AUTH_FILE), { recursive: true });
  fs.writeFileSync(AUTH_FILE, JSON.stringify(storageState, null, 2));
  console.log(`[globalSetup] Login successful! Signed in as "${username}" (${email})`);
}

