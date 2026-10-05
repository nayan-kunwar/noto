import 'dotenv/config';

function required(name: string, fallback?: string): string {
  const v = process.env[name] ?? fallback;
  if (!v) throw new Error(`Missing env: ${name}`);
  return v;
}

export const env = {
  PORT: Number(process.env['PORT'] ?? 3000),
  DATABASE_URL: required('DATABASE_URL', 'postgres://noto:noto_dev_password_change_me@localhost:5433/noto'),
  JWT_ACCESS_SECRET: required('JWT_ACCESS_SECRET', 'dev_access_secret_min_32_chars_1234567890'),
  JWT_REFRESH_SECRET: required('JWT_REFRESH_SECRET', 'dev_refresh_secret_min_32_chars_1234567890'),
  CORS_ORIGIN: process.env['CORS_ORIGIN'] ?? 'http://localhost:8081',
} as const;
