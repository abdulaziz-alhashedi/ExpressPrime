import request from 'supertest';
import app from '../src/app';

export const registerTestUser = async (overrides: Partial<{ email: string; password: string }> = {}) => {
  const email = overrides.email || `user_${Date.now()}@test.com`;
  const password = overrides.password || 'StrongPass#123';
  const res = await request(app)
    .post('/api/v1/auth/register')
    .send({ email, password });
  return { user: res.body, email, password };
};

export const loginTestUser = async (email: string, password: string) => {
  const res = await request(app)
    .post('/api/v1/auth/login')
    .send({ email, password });
  return res.body;
};
