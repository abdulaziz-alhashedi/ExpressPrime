import { Request, Response, NextFunction } from 'express';
import * as userController from '../../../src/controllers/user.controller';
import * as userService from '../../../src/services/user.service';
import { AppError } from '../../../src/types/errors';
import { 
  createMockRequest, 
  createMockResponse, 
  createMockNext,
  assertAppError
} from '../../common/testHelpers';

// Mock the user service
jest.mock('../../../src/services/user.service');

describe('User Controller Tests', () => {
  // Test fixtures
  const TEST_USERS = [
    { id: 1, email: 'user1@example.com', role: 'USER' },
    { id: 2, email: 'user2@example.com', role: 'ADMIN' }
  ];
  
  const ADMIN_USER = { id: 3, role: 'ADMIN' };
  const REGULAR_USER = { id: 4, role: 'USER' };
  
  // Test setup variables
  let mockRequest: Partial<Request> & { user?: any };
  let mockResponse: Partial<Response>;
  let mockNext: jest.MockedFunction<NextFunction>;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Setup mock request/response/next
    mockRequest = createMockRequest();
    mockResponse = createMockResponse();
    mockNext = createMockNext();
  });

  /**
   * Executes a controller function with the standard mock objects
   */
  const executeController = async (
    controllerFn: Function, 
    req: Partial<Request> = mockRequest, 
    res: Partial<Response> = mockResponse, 
    next: jest.MockedFunction<NextFunction> = mockNext
  ): Promise<void> => {
    await controllerFn(req as Request, res as Response, next);
  };

  /**
   * Asserts that the response was a forbidden error (403)
   */
  const assertForbiddenAccess = (): void => {
    expect(mockNext).toHaveBeenCalledWith(expect.any(AppError));
    const error = mockNext.mock.calls[0][0] as unknown as AppError;
    expect(error.statusCode).toBe(403);
  };

  /**
   * Asserts that the response was successful (no error passed to next)
   */
  const assertSuccessResponse = (): void => {
    expect(mockNext).not.toHaveBeenCalled();
  };

  /**
   * Sets up the request for an admin user
   */
  const setupAdminUser = (): void => {
    mockRequest.user = ADMIN_USER;
  };

  /**
   * Sets up the request for a regular user
   */
  const setupRegularUser = (): void => {
    mockRequest.user = REGULAR_USER;
  };

  describe('getUsers', () => {
    it('should return all users when user is admin', async () => {
      // Setup
      setupAdminUser();
      (userService.getAllUsers as jest.Mock).mockResolvedValue(TEST_USERS);

      // Execute
      await executeController(userController.getUsers);

      // Assert
      expect(userService.getAllUsers).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith(TEST_USERS);
      assertSuccessResponse();
    });

    it('should call next with error if user is not admin', async () => {
      // Setup
      setupRegularUser();

      // Execute
      await executeController(userController.getUsers);

      // Assert
      expect(userService.getAllUsers).not.toHaveBeenCalled();
      expect(mockResponse.json).not.toHaveBeenCalled();
      assertForbiddenAccess();
    });
  });

  describe('getUser', () => {
    const USER_ID = 1;
    const USER_DETAILS = { id: USER_ID, email: 'user1@example.com', role: 'USER' };
    
    beforeEach(() => {
      mockRequest.params = { id: USER_ID.toString() };
    });
    
    it('should return a user when valid ID is provided', async () => {
      // Mock the service response
      (userService.getUserById as jest.Mock).mockResolvedValue(USER_DETAILS);

      // Execute
      await executeController(userController.getUser);

      // Assert
      expect(userService.getUserById).toHaveBeenCalledWith(USER_ID);
      expect(mockResponse.json).toHaveBeenCalledWith(USER_DETAILS);
      assertSuccessResponse();
    });

    it('should call next with error when user does not exist', async () => {
      // Setup different ID for non-existent user
      const NON_EXISTENT_ID = 999;
      mockRequest.params = { id: NON_EXISTENT_ID.toString() };
      
      const notFoundError = new AppError('User not found', 404);
      (userService.getUserById as jest.Mock).mockRejectedValue(notFoundError);

      // Execute
      await executeController(userController.getUser);

      // Assert
      expect(userService.getUserById).toHaveBeenCalledWith(NON_EXISTENT_ID);
      expect(mockResponse.json).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(notFoundError);
    });
  });

  describe('createUser', () => {
    const NEW_USER_DATA = { email: 'newuser@example.com', password: 'StrongPass#123' };
    const CREATED_USER = { id: 5, email: 'newuser@example.com' };
    
    beforeEach(() => {
      mockRequest.body = NEW_USER_DATA;
    });
    
    it('should create a user when admin and return 201 status', async () => {
      // Setup
      setupAdminUser();
      (userService.createNewUser as jest.Mock).mockResolvedValue(CREATED_USER);

      // Execute
      await executeController(userController.createUser);

      // Assert
      expect(userService.createNewUser).toHaveBeenCalledWith(
        NEW_USER_DATA.email, 
        NEW_USER_DATA.password
      );
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(CREATED_USER);
      assertSuccessResponse();
    });

    it('should call next with forbidden error if user is not admin', async () => {
      // Setup
      setupRegularUser();

      // Execute
      await executeController(userController.createUser);

      // Assert
      expect(userService.createNewUser).not.toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.json).not.toHaveBeenCalled();
      assertForbiddenAccess();
    });
  });

  describe('updateUser', () => {
    const USER_ID = 1;
    const UPDATE_DATA = { email: 'updated@example.com' };
    const UPDATED_USER = { id: USER_ID, email: 'updated@example.com', role: 'USER' };
    
    beforeEach(() => {
      mockRequest.params = { id: USER_ID.toString() };
      mockRequest.body = UPDATE_DATA;
    });
    
    it('should update a user successfully when admin', async () => {
      // Setup
      setupAdminUser();
      (userService.updateExistingUser as jest.Mock).mockResolvedValue(UPDATED_USER);

      // Execute
      await executeController(userController.updateUser);

      // Assert
      expect(userService.updateExistingUser).toHaveBeenCalledWith(
        USER_ID, 
        UPDATE_DATA.email, 
        undefined
      );
      expect(mockResponse.json).toHaveBeenCalledWith(UPDATED_USER);
      assertSuccessResponse();
    });

    it('should call next with forbidden error if user is not admin', async () => {
      // Setup
      setupRegularUser();

      // Execute
      await executeController(userController.updateUser);

      // Assert
      expect(userService.updateExistingUser).not.toHaveBeenCalled();
      expect(mockResponse.json).not.toHaveBeenCalled();
      assertForbiddenAccess();
    });
  });

  describe('deleteUser', () => {
    const USER_ID = 1;
    const DELETED_USER = { id: USER_ID, email: 'deleted@example.com', role: 'USER' };
    
    beforeEach(() => {
      mockRequest.params = { id: USER_ID.toString() };
    });
    
    it('should delete a user successfully', async () => {
      // Mock the service response
      (userService.deleteUserById as jest.Mock).mockResolvedValue(DELETED_USER);

      // Execute
      await executeController(userController.deleteUser);

      // Assert
      expect(userService.deleteUserById).toHaveBeenCalledWith(USER_ID);
      expect(mockResponse.status).toHaveBeenCalledWith(204);
      expect(mockResponse.send).toHaveBeenCalled();
      assertSuccessResponse();
    });

    it('should call next with error if deletion fails', async () => {
      // Setup different ID for non-existent user
      const NON_EXISTENT_ID = 999;
      mockRequest.params = { id: NON_EXISTENT_ID.toString() };
      
      const notFoundError = new AppError('User not found', 404);
      (userService.deleteUserById as jest.Mock).mockRejectedValue(notFoundError);

      // Execute
      await executeController(userController.deleteUser);

      // Assert
      expect(userService.deleteUserById).toHaveBeenCalledWith(NON_EXISTENT_ID);
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(notFoundError);
    });
  });
});
