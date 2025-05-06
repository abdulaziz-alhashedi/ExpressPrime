import request from 'supertest';
import app from '../../../src/app';
import { prisma } from '../../../src/utils/prisma';

// import { getAllUsers, getUserById, createUser, updateUser, deleteUser } from '../../../src/services/user.service';



describe('Authentication Flow Integration Tests', () => {
  // Store these for use across tests
  let userEmail: string;
  let userPassword: string;
  let accessToken: string;
  let refreshToken: string;

  beforeAll(async () => {
    // Generate a unique email for this test run
    userEmail = `integration_${Date.now()}@test.com`;
    userPassword = 'StrongPass#123';
  });

  afterAll(async () => {
    // Clean up test user
    try {
      await prisma.user.deleteMany({
        where: {
          email: userEmail
        }
      });
    } catch (error) {
      console.error('Test cleanup error:', error);
    }
  });

  describe('Registration Flow', () => {
    it('should successfully register a new user', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: userEmail,
          password: userPassword
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('email', userEmail);
      expect(res.body).toHaveProperty('token');
      expect(res.body).toHaveProperty('refreshToken');
    });

    it('should prevent registration with same email', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: userEmail,
          password: userPassword
        });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('message', 'User already exists');
    });

    it('should prevent registration with weak password', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: `another_${Date.now()}@test.com`,
          password: 'weak'
        });

      expect(res.status).toBe(400);
    });
  });

  describe('Login Flow', () => {
    it('should successfully login with valid credentials', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: userEmail,
          password: userPassword
        });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body).toHaveProperty('refreshToken');

      // Save tokens for later tests
      accessToken = res.body.token;
      refreshToken = res.body.refreshToken;
    });

    it('should reject login with incorrect password', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: userEmail,
          password: 'WrongPassword#123'
        });

      expect(res.status).toBe(401);
    });

    it('should reject login with non-existent user', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'nonexistent@test.com',
          password: userPassword
        });

      expect(res.status).toBe(401);
    });
  });

  describe('Profile Access', () => {
    it('should allow access to profile with valid token', async () => {
      const res = await request(app)
        .get('/api/v1/auth/profile')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('user');
      expect(res.body.user).toHaveProperty('email', userEmail);
    });

    it('should deny access without token', async () => {
      const res = await request(app)
        .get('/api/v1/auth/profile');

      expect(res.status).toBe(401);
    });

    it('should deny access with invalid token', async () => {
      const res = await request(app)
        .get('/api/v1/auth/profile')
        .set('Authorization', 'Bearer invalid-token');

      expect(res.status).toBe(403);
    });
  });

  describe('Token Refresh Flow', () => {
    it('should issue new access token with valid refresh token', async () => {
      const res = await request(app)
        .post('/api/v1/auth/refresh')
        .send({
          refreshToken: refreshToken
        });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
      
      // Update access token
      accessToken = res.body.token;
    });

    it('should deny refresh with invalid refresh token', async () => {
      const res = await request(app)
        .post('/api/v1/auth/refresh')
        .send({
          refreshToken: 'invalid-refresh-token'
        });

      expect(res.status).toBe(403);
    });

    it('should still access profile with new access token', async () => {
      const res = await request(app)
        .get('/api/v1/auth/profile')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('user');
    });
  });
});
