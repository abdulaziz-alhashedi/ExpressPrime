import request from 'supertest';
import app from '../src/app';

describe('GET /api/health', () => {
  it('should return status OK', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toEqual(200);
    expect(res.body).toEqual({ status: 'OK' });
  });
});

describe('POST /api/register', () => {
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/register')
      .send({ email: "test@example.com", password: "password123" });
    expect(res.status).toEqual(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('email', "test@example.com");
  });
  it('should return 400 for invalid email', async () => {
    const res = await request(app)
      .post('/api/register')
      .send({ email: "invalid-email", password: "password123" });
    expect(res.status).toEqual(400);
    expect(res.body).toHaveProperty('errors');
  });
});

describe('POST /api/login', () => {
  it('should login a registered user', async () => {
    // First register a user for login
    await request(app)
      .post('/api/register')
      .send({ email: "login@test.com", password: "password123" });
    
    const res = await request(app)
      .post('/api/login')
      .send({ email: "login@test.com", password: "password123" });
    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });
  it('should return 401 for wrong credentials', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({ email: "nonexistent@test.com", password: "wrongpass" });
    expect(res.status).toEqual(401);
  });
});

describe('GET /api/docs', () => {
  it('should return the swagger documentation page', async () => {
    const res = await request(app).get('/api/docs');
    expect(res.status).toEqual(200);
    expect(res.headers['content-type']).toMatch(/html/);
  });
});
