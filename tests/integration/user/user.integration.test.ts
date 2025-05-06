import request from 'supertest';
import app from '../../../src/app';
import { prisma } from '../../../src/utils/prisma';

describe('User Management API Integration Tests', () => {
  // Store these for use across tests
  let adminEmail: string;
  let adminPassword: string;
  let adminToken: string;
  let regularUserEmail: string;
  let regularUserToken: string;
  let createdUserId: number;

  beforeAll(async () => {
    // Generate unique emails for this test run
    adminEmail = `admin_${Date.now()}@test.com`;
    adminPassword = 'StrongAdmin#123';
    regularUserEmail = `user_${Date.now()}@test.com`;
    
    // Create an admin user directly in the database for testing
    const adminUser = await prisma.user.create({
      data: {
        email: adminEmail,
        password: await require('bcryptjs').hash(adminPassword, 10),
        role: 'ADMIN'
      }
    });

    // Login as admin to get token
    const adminLoginRes = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: adminEmail,
        password: adminPassword
      });
    
    adminToken = adminLoginRes.body.token;

    // Create a regular user
    const regularUserRes = await request(app)
      .post('/api/v1/auth/register')
      .send({
        email: regularUserEmail,
        password: 'StrongUser#123'
      });
    
    regularUserToken = regularUserRes.body.token;
  });

  afterAll(async () => {
    // Clean up test users
    try {
      await prisma.user.deleteMany({
        where: {
          email: {
            in: [adminEmail, regularUserEmail]
          }
        }
      });
      
      if (createdUserId) {
        await prisma.user.delete({
          where: { id: createdUserId }
        }).catch(() => {
          // Ignore if already deleted
        });
      }
    } catch (error) {
      console.error('Test cleanup error:', error);
    }
  });

  describe('User Creation', () => {
    it('should allow admin to create a new user', async () => {
      const newUser = {
        email: `created_${Date.now()}@test.com`,
        password: 'Created#123',
        role: 'USER'
      };

      const res = await request(app)
        .post('/api/v1/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(newUser);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('email', newUser.email);
      
      // Save ID for later tests
      createdUserId = res.body.id;
    });

    it('should prevent regular users from creating users', async () => {
      const newUser = {
        email: `unauthorized_${Date.now()}@test.com`,
        password: 'Created#123',
        role: 'USER'
      };

      const res = await request(app)
        .post('/api/v1/users')
        .set('Authorization', `Bearer ${regularUserToken}`)
        .send(newUser);

      expect(res.status).toBe(403);
    });
  });

  describe('User Retrieval', () => {
    it('should allow admin to get all users', async () => {
      const res = await request(app)
        .get('/api/v1/users')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
    });

    it('should allow admin to get a specific user by ID', async () => {
      const res = await request(app)
        .get(`/api/v1/users/${createdUserId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('id', createdUserId);
    });

    it('should return 404 for non-existent user', async () => {
      const res = await request(app)
        .get('/api/v1/users/99999')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(404);
    });

    it('should prevent regular users from accessing user management APIs', async () => {
      const res = await request(app)
        .get('/api/v1/users')
        .set('Authorization', `Bearer ${regularUserToken}`);

      expect(res.status).toBe(403);
    });
  });

  describe('User Update', () => {
    it('should allow admin to update a user', async () => {
      const updatedEmail = `updated_${Date.now()}@test.com`;
      
      const res = await request(app)
        .put(`/api/v1/users/${createdUserId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          email: updatedEmail
        });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('id', createdUserId);
      expect(res.body).toHaveProperty('email', updatedEmail);
    });

    it('should prevent regular users from updating users', async () => {
      const res = await request(app)
        .put(`/api/v1/users/${createdUserId}`)
        .set('Authorization', `Bearer ${regularUserToken}`)
        .send({
          email: 'attempted_update@test.com'
        });

      expect(res.status).toBe(403);
    });
  });

  describe('User Deletion', () => {
    it('should allow admin to delete a user', async () => {
      const res = await request(app)
        .delete(`/api/v1/users/${createdUserId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('id', createdUserId);
      
      // Verify the user is actually deleted
      const checkRes = await request(app)
        .get(`/api/v1/users/${createdUserId}`)
        .set('Authorization', `Bearer ${adminToken}`);
        
      expect(checkRes.status).toBe(404);
    });

    it('should prevent regular users from deleting users', async () => {
      // Create another user to delete
      const newUser = {
        email: `to_delete_${Date.now()}@test.com`,
        password: 'Delete#123',
        role: 'USER'
      };

      const createRes = await request(app)
        .post('/api/v1/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(newUser);
        
      const userId = createRes.body.id;

      // Attempt deletion as regular user
      const res = await request(app)
        .delete(`/api/v1/users/${userId}`)
        .set('Authorization', `Bearer ${regularUserToken}`);

      expect(res.status).toBe(403);
      
      // Clean up
      await request(app)
        .delete(`/api/v1/users/${userId}`)
        .set('Authorization', `Bearer ${adminToken}`);
    });
  });
});
