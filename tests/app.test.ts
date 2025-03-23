import request from 'supertest';
import app from '../src/app';
import { registerTestUser, loginTestUser } from './authTestHelpers';

describe('GET /api/v1/health', () => {
  it('should return status OK', async () => {
    const res = await request(app).get('/api/v1/health');
    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty('status', 'OK');
  });
});

describe('POST /api/v1/auth/register', () => {
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({ email: "test@example.com", password: "StrongPass#123" });
    expect(res.status).toEqual(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('email', "test@example.com");
  });
  it('should return 400 for invalid email', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({ email: "invalid-email", password: "StrongPass#123" });
    expect(res.status).toEqual(400);
    expect(res.body).toHaveProperty('errors');
  });
});

describe('POST /api/v1/auth/login', () => {
  it('should login a registered user', async () => {
    // Register a user using the helper
    const { email, password } = (await registerTestUser({ email: "login@test.com" })).email
      ? { email: "login@test.com", password: "StrongPass#123" }
      : { email: "login@test.com", password: "StrongPass#123" };
    const res = await loginTestUser(email, password);
    expect(res).toHaveProperty('token');
  });
  it('should return 401 for wrong credentials', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: "nonexistent@test.com", password: "wrongpass" });
    expect(res.status).toEqual(401);
  });
});

describe('GET /api/v1/auth/profile', () => {
  it('should get user profile with valid token', async () => {
    // Register and login user using helper functions
    const { email, password } = (await registerTestUser({ email: "profile@test.com" })).email
      ? { email: "profile@test.com", password: "StrongPass#123" }
      : { email: "profile@test.com", password: "StrongPass#123" };
    const loginRes = await loginTestUser(email, password);
    const token = loginRes.token;
    expect(token).toBeDefined();
    const profileRes = await request(app)
      .get('/api/v1/auth/profile')
      .set('Authorization', `Bearer ${token}`);
    expect(profileRes.status).toEqual(200);
    expect(profileRes.body.user).toHaveProperty('email', email);
  });
});

describe('GET /api/v1/docs', () => {
  it('should return the swagger documentation page', async () => {
    const res = await request(app).get('/api/v1/docs');
    expect(res.status).toEqual(200);
    expect(res.headers['content-type']).toMatch(/html/);
  });
});

describe('GET /api/v1/nonexistent', () => {
  it('should return 404 for unknown endpoint', async () => {
    const res = await request(app).get('/api/v1/nonexistent');
    expect(res.status).toEqual(404);
    expect(res.body).toHaveProperty('message');
  });
});

describe('Unit tests for auth.service', () => {
  const { registerUser } = require('../src/services/auth.service');
  const { PASSWORD_REQUIREMENT_MESSAGE } = require('../src/utils/passwordValidator'); // <-- added import

  it('should throw an error when registering with a weak password', async () => {
    await expect(registerUser('unit@example.com', 'weakpass')).rejects.toThrow(PASSWORD_REQUIREMENT_MESSAGE); // <-- updated check
  });
});

describe('Unit tests for user.service', () => {
  const { getAllUsers } = require('../src/services/user.service');

  it('should return an array when retrieving all users', async () => {
    const users = await getAllUsers();
    expect(Array.isArray(users)).toBe(true);
  });
});
