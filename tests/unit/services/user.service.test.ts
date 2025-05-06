import { getAllUsers, getUserById, createNewUser, updateExistingUser, deleteUserById } from '../../../src/services/user.service';
import { prisma } from '../../../src/utils/prisma';
import { NotFoundError, AppError } from '../../../src/types/errors';

// Mock the prisma module
jest.mock('../../../src/utils/prisma', () => ({
  prisma: {
    user: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    }
  }
}));

describe('User Service Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllUsers', () => {
    it('should return all users', async () => {
      // Setup mock
      const mockUsers = [
        { id: 1, email: 'user1@example.com', role: 'USER' },
        { id: 2, email: 'user2@example.com', role: 'ADMIN' }
      ];
      (prisma.user.findMany as jest.Mock).mockResolvedValue(mockUsers);

      // Execute
      const result = await getAllUsers();

      // Assert
      expect(prisma.user.findMany).toHaveBeenCalled();
      expect(result).toEqual(mockUsers);
    });
  });

  describe('getUserById', () => {
    it('should return a user when valid ID is provided', async () => {
      // Setup mock
      const mockUser = { id: 1, email: 'user1@example.com', role: 'USER' };
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      // Execute
      const result = await getUserById(1);

      // Assert
      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundError when user does not exist', async () => {
      // Setup mock
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      // Execute & Assert
      await expect(getUserById(999)).rejects.toThrow(AppError);
    });
  });

  describe('createNewUser', () => {
    it('should successfully create a user', async () => {
      // Setup mock
      const userData = { email: 'newuser@example.com', password: 'StrongPass#123' };
      const mockUser = { id: 3, email: userData.email };
      (prisma.user.create as jest.Mock).mockResolvedValue(mockUser);

      // Execute
      const result = await createNewUser(userData.email, userData.password);

      // Assert
      expect(prisma.user.create).toHaveBeenCalled();
      expect(result).toEqual(mockUser);
    });
  });

  describe('updateExistingUser', () => {
    it('should successfully update a user', async () => {
      // Setup mock
      const userId = 1;
      const updateData = { email: 'updated@example.com' };
      const mockUser = { id: userId, email: 'updated@example.com', role: 'USER' };
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: userId });
      (prisma.user.update as jest.Mock).mockResolvedValue(mockUser);

      // Execute
      const result = await updateExistingUser(userId, updateData.email);

      // Assert
      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { id: userId } });
      expect(prisma.user.update).toHaveBeenCalled();
      expect(result).toEqual(mockUser);
    });

    it('should throw AppError when user does not exist', async () => {
      // Setup mock
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      // Execute & Assert
      await expect(updateExistingUser(999, 'test@example.com')).rejects.toThrow(AppError);
    });
  });

  describe('deleteUserById', () => {
    it('should successfully delete a user', async () => {
      // Setup mock
      const userId = 1;
      const mockUser = { id: userId, email: 'delete@example.com', role: 'USER' };
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (prisma.user.delete as jest.Mock).mockResolvedValue(mockUser);

      // Execute
      const result = await deleteUserById(userId);

      // Assert
      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { id: userId } });
      expect(prisma.user.delete).toHaveBeenCalledWith({ where: { id: userId } });
      expect(result).toEqual(mockUser);
    });

    it('should throw AppError when user does not exist', async () => {
      // Setup mock
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      // Execute & Assert
      await expect(deleteUserById(999)).rejects.toThrow(AppError);
    });
    
    it('should throw AppError when attempting to delete an admin user', async () => {
      // Setup mock
      const userId = 1;
      const mockUser = { id: userId, email: 'admin@example.com', role: 'ADMIN' };
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      // Execute & Assert
      await expect(deleteUserById(userId)).rejects.toThrow(AppError);
      expect(prisma.user.delete).not.toHaveBeenCalled();
    });
  });
});
