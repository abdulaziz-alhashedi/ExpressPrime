import request from 'supertest';
import app from '../src/app';

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
    // First register a user
    await request(app)
      .post('/api/v1/auth/register')
      .send({ email: "login@test.com", password: "StrongPass#123" });
    
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: "login@test.com", password: "StrongPass#123" });
    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty('token');
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
    // Register a new user
    const regRes = await request(app)
      .post('/api/v1/auth/register')
      .send({ email: "profile@test.com", password: "StrongPass#123" });
    expect(regRes.status).toEqual(201);

    // Log in using registered credentials
    const loginRes = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: "profile@test.com", password: "StrongPass#123" });
    expect(loginRes.status).toEqual(200);
    const token = loginRes.body.token;
    expect(token).toBeDefined();

    // Call profile endpoint using the token
    const profileRes = await request(app)
      .get('/api/v1/auth/profile')
      .set('Authorization', `Bearer ${token}`);
    expect(profileRes.status).toEqual(200);
    expect(profileRes.body).toHaveProperty('user');
    expect(profileRes.body.user).toHaveProperty('email', "profile@test.com");
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

  it('should throw an error when registering with a weak password', async () => {
    await expect(registerUser('unit@example.com', 'weakpass')).rejects.toThrow(/weak/);
  });
});

describe('Unit tests for user.service', () => {
  const { getAllUsers } = require('../src/services/user.service');

  it('should return an array when retrieving all users', async () => {
    const users = await getAllUsers();
    expect(Array.isArray(users)).toBe(true);
  });
});
