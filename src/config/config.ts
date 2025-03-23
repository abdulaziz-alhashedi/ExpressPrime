/**
 * Application Configuration Module
 *
 * This module uses envalid to validate and clean the runtime environment variables.
 * It provides strongly-typed configuration options (e.g., PORT, DATABASE_URL, JWT secrets)
 * that are used across the application.
 */

import { cleanEnv, str, port, num } from 'envalid';

export const config = cleanEnv(process.env, {
  DATABASE_URL: str(),
  JWT_SECRET: str(),
  REFRESH_TOKEN_SECRET: str(), 
  NODE_ENV: str({ choices: ['development', 'production', 'test'] }),
  PORT: port({ default: 3000 }),
  CORS_ORIGIN: str({ default: '*' }),
  API_KEY: str(),
  ADMIN_KEY: str(),
  BCRYPT_SALT_ROUNDS: num({ default: 12 }),
  ACCESS_TOKEN_SECRET: str(), 
});
