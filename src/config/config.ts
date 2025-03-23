import { cleanEnv, str, port, num } from 'envalid';

export const config = cleanEnv(process.env, {
  DATABASE_URL: str(),
  JWT_SECRET: str(),
  REFRESH_TOKEN_SECRET: str({ default: process.env.JWT_SECRET }),
  NODE_ENV: str({ choices: ['development', 'production', 'test'] }),
  PORT: port({ default: 3000 }),
  CORS_ORIGIN: str({ default: '*' }),
  API_KEY: str(),
  ADMIN_KEY: str(),
  BCRYPT_SALT_ROUNDS: num({ default: 12 }),
});
