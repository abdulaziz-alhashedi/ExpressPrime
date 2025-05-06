import { registerUser, loginUser, refreshAccessToken } from '../../../src/services/auth.service';
import { prisma } from '../../../src/utils/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../../../src/config/config';
import { AppError, AuthenticationError } from '../../../src/types/errors';

// Mock the entire prisma module
jest.mock('../../../src/utils/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    }
  }
}));

// Mock bcrypt
jest.mock('bcryptjs', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

// Mock jsonwebtoken
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
  verify: jest.fn(),
}));

describe('Auth Service Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('registerUser', () => {
    it('should successfully register a new user', async () => {
      // Setup mocks
      const mockUser = { id: 1, email: 'test@example.com', password: 'hashedPassword', role: 'USER' };
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      (prisma.user.create as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      (jwt.sign as jest.Mock)
        .mockReturnValueOnce('access-token')
        .mockReturnValueOnce('refresh-token');

      // Execute
      const result = await registerUser('test@example.com', 'StrongPass#123');

      // Assert
      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
      expect(bcrypt.hash).toHaveBeenCalled();
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: { email: 'test@example.com', password: 'hashedPassword', role: 'USER' }
      });
      expect(jwt.sign).toHaveBeenCalledTimes(2);
      expect(result).toEqual({
        user: mockUser,
        token: 'access-token',
        refreshToken: 'refresh-token'
      });
    });

    it('should throw an error if user already exists', async () => {
      // Setup mocks
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: 1, email: 'test@example.com' });

      // Execute & Assert
      await expect(registerUser('test@example.com', 'StrongPass#123')).rejects.toThrow('User already exists');
    });

    it('should throw an error for weak password', async () => {
      // Execute & Assert
      await expect(registerUser('test@example.com', 'weak')).rejects.toThrow();
    });
  });

  describe('loginUser', () => {
    it('should successfully login a user with valid credentials', async () => {
      // Setup mocks
      const mockUser = { id: 1, email: 'test@example.com', password: 'hashedPassword', role: 'USER' };
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock)
        .mockReturnValueOnce('access-token')
        .mockReturnValueOnce('refresh-token');

      // Execute
      const result = await loginUser('test@example.com', 'password');

      // Assert
      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
      expect(bcrypt.compare).toHaveBeenCalledWith('password', 'hashedPassword');
      expect(jwt.sign).toHaveBeenCalledTimes(2);
      expect(result).toEqual({
        user: mockUser,
        token: 'access-token',
        refreshToken: 'refresh-token'
      });
    });

    it('should throw an error if user not found', async () => {
      // Setup mocks
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      // Execute & Assert
      await expect(loginUser('nonexistent@example.com', 'password')).rejects.toThrow(AuthenticationError);
    });

    it('should throw an error if password is incorrect', async () => {
      // Setup mocks
      const mockUser = { id: 1, email: 'test@example.com', password: 'hashedPassword', role: 'USER' };
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      // Execute & Assert
      await expect(loginUser('test@example.com', 'wrongpassword')).rejects.toThrow(AuthenticationError);
    });
  });

  describe('refreshAccessToken', () => {
    it('should generate a new access token with valid refresh token', async () => {
      // Setup mocks
      (jwt.verify as jest.Mock).mockImplementation((token, secret, callback) => {
        callback(null, { userId: 1 });
      });
      (jwt.sign as jest.Mock).mockReturnValue('new-access-token');

      // Execute
      const result = await refreshAccessToken('valid-refresh-token');

      // Assert
      expect(jwt.verify).toHaveBeenCalledWith(
        'valid-refresh-token',
        config.REFRESH_TOKEN_SECRET,
        expect.any(Function)
      );
      expect(jwt.sign).toHaveBeenCalledWith({ userId: 1 }, config.JWT_SECRET, { expiresIn: '1h' });
      expect(result).toEqual({ token: 'new-access-token' });
    });

    it('should throw an error for invalid refresh token', async () => {
      // Setup mocks
      (jwt.verify as jest.Mock).mockImplementation((token, secret, callback) => {
        callback(new Error('Invalid token'), null);
      });

      // Execute & Assert
      await expect(refreshAccessToken('invalid-refresh-token')).rejects.toThrow('Invalid refresh token');
    });
  });
});
