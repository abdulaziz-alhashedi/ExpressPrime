import request from 'supertest';
import app from '../src/app';
import { 
  registerTestUser, 
  loginTestUser, 
  TEST_PASSWORD, 
  generateTestEmail,
  authenticatedRequest
} from './common/testHelpers';
import { PASSWORD_REQUIREMENT_MESSAGE } from '../src/utils/passwordValidator';

describe('API Health Check', () => {
  it('should return status OK from health endpoint', async () => {
    const res = await request(app).get('/api/v1/health');
    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty('status', 'OK');
  });
});

describe('Authentication API', () => {
  describe('Registration', () => {
    it('should register a new user and return 201 status', async () => {
      // Generate unique test email
      const email = generateTestEmail();
      
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({ email, password: TEST_PASSWORD });
        
      expect(res.status).toEqual(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('email', email);
      expect(res.body).toHaveProperty('token');
      expect(res.body).toHaveProperty('refreshToken');
    });
    
    it('should return 400 for invalid email format', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({ email: "invalid-email", password: TEST_PASSWORD });
        
      expect(res.status).toEqual(400);
      expect(res.body).toHaveProperty('errors');
    });
  });

  describe('Login', () => {
    let testEmail: string;
    
    beforeAll(async () => {
      // Register a user for login tests
      const { credentials } = await registerTestUser();
      testEmail = credentials.email;
    });
    
    it('should login a registered user and return tokens', async () => {
      const { authData } = await loginTestUser(testEmail, TEST_PASSWORD);
      
      expect(authData).toHaveProperty('token');
      expect(authData).toHaveProperty('refreshToken');
    });
    
    it('should return 401 for wrong credentials', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: "nonexistent@test.com", password: "wrongpass" });
        
      expect(res.status).toEqual(401);
    });
  });

  describe('Profile Access', () => {
    let token: string;
    let userEmail: string;
    
    beforeAll(async () => {
      // Register and login a user for profile tests
      const { credentials } = await registerTestUser();
      userEmail = credentials.email;
      
      const { authData } = await loginTestUser(credentials.email, credentials.password);
      token = authData.token;
    });
    
    it('should get user profile with valid token', async () => {
      const profileRes = await authenticatedRequest(token).get('/api/v1/auth/profile');
      
      expect(profileRes.status).toEqual(200);
      expect(profileRes.body.user).toHaveProperty('email', userEmail);
    });
    
    it('should return 401 when accessing profile without token', async () => {
      const res = await request(app).get('/api/v1/auth/profile');
      expect(res.status).toEqual(401);
    });
  });
});

describe('API Documentation', () => {
  it('should return the swagger documentation page', async () => {
    const res = await request(app).get('/api/v1/docs');
    expect(res.status).toEqual(200);
    expect(res.headers['content-type']).toMatch(/html/);
  });
});

describe('Error Handling', () => {
  it('should return 404 for unknown endpoint', async () => {
    const res = await request(app).get('/api/v1/nonexistent');
    expect(res.status).toEqual(404);
    expect(res.body).toHaveProperty('message');
  });
});

describe('Service Unit Tests', () => {
  describe('auth.service', () => {
    const { registerUser } = require('../src/services/auth.service');

    it('should throw an error when registering with a weak password', async () => {
      await expect(registerUser('unit@example.com', 'weakpass'))
        .rejects.toThrow(PASSWORD_REQUIREMENT_MESSAGE);
    });
  });

  describe('user.service', () => {
    const { getAllUsers } = require('../src/services/user.service');

    it('should return an array when retrieving all users', async () => {
      const users = await getAllUsers();
      expect(Array.isArray(users)).toBe(true);
    });
  });
});
