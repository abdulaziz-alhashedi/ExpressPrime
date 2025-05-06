import { Request, Response, NextFunction } from 'express';
import { register, login, refreshTokenHandler } from '../../../src/controllers/auth.controller';
import * as authService from '../../../src/services/auth.service';
import { AppError } from '../../../src/types/errors';
import { 
  createMockRequest, 
  createMockResponse, 
  createMockNext,
  assertAppError
} from '../../common/testHelpers';

// Mock the auth service
jest.mock('../../../src/services/auth.service');

describe('Auth Controller Tests', () => {
  // Test fixtures
  const validCredentials = { 
    email: 'test@example.com', 
    password: 'StrongPass#123' 
  };
  
  const mockUser = { 
    id: 1, 
    email: 'test@example.com' 
  };
  
  const authTokens = {
    token: 'jwt-token',
    refreshToken: 'refresh-token'
  };
  
  // Test setup variables
  let mockRequest: Partial<Request>;
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

  // Helper function to execute controller with standard mocks
  const executeController = async (
    controllerFn: Function, 
    req: Partial<Request> = mockRequest, 
    res: Partial<Response> = mockResponse, 
    next: jest.MockedFunction<NextFunction> = mockNext
  ) => {
    await controllerFn(req as Request, res as Response, next);
  };

  describe('register', () => {
    beforeEach(() => {
      mockRequest.body = validCredentials;
    });
    
    it('should successfully register a user and return 201 status', async () => {
      // Mock the service response
      (authService.registerUser as jest.Mock).mockResolvedValue({
        user: mockUser,
        ...authTokens
      });

      // Execute
      await executeController(register);

      // Assert
      expect(authService.registerUser).toHaveBeenCalledWith(
        validCredentials.email, 
        validCredentials.password
      );
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        id: mockUser.id,
        email: mockUser.email,
        ...authTokens
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should call next with error if registration fails', async () => {
      // Setup with weak password
      const weakCredentials = { 
        email: 'test@example.com', 
        password: 'weak' 
      };
      mockRequest.body = weakCredentials;
      
      const mockError = new Error('Registration failed');
      (authService.registerUser as jest.Mock).mockRejectedValue(mockError);

      // Execute
      await executeController(register);

      // Assert
      expect(authService.registerUser).toHaveBeenCalledWith(
        weakCredentials.email, 
        weakCredentials.password
      );
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.json).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(mockError);
    });
  });

  describe('login', () => {
    beforeEach(() => {
      mockRequest.body = validCredentials;
    });
    
    it('should successfully login a user', async () => {
      // Mock the service response
      (authService.loginUser as jest.Mock).mockResolvedValue(authTokens);

      // Execute
      await executeController(login);

      // Assert
      expect(authService.loginUser).toHaveBeenCalledWith(
        validCredentials.email, 
        validCredentials.password
      );
      expect(mockResponse.json).toHaveBeenCalledWith(authTokens);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should call next with error if login fails', async () => {
      // Setup with invalid credentials
      const invalidCredentials = { 
        email: 'nonexistent@example.com', 
        password: 'password' 
      };
      mockRequest.body = invalidCredentials;
      
      const mockError = new Error('Invalid credentials');
      (authService.loginUser as jest.Mock).mockRejectedValue(mockError);

      // Execute
      await executeController(login);

      // Assert
      expect(authService.loginUser).toHaveBeenCalledWith(
        invalidCredentials.email, 
        invalidCredentials.password
      );
      expect(mockResponse.json).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(mockError);
    });
  });

  describe('refreshTokenHandler', () => {
    it('should refresh access token successfully', async () => {
      // Setup
      const validRefreshToken = 'valid-refresh-token';
      mockRequest.body = { refreshToken: validRefreshToken };
      
      const refreshResponse = { token: 'new-access-token' };
      
      // Mock the service response
      (authService.refreshAccessToken as jest.Mock).mockResolvedValue(refreshResponse);

      // Execute
      await executeController(refreshTokenHandler);

      // Assert
      expect(authService.refreshAccessToken).toHaveBeenCalledWith(validRefreshToken);
      expect(mockResponse.json).toHaveBeenCalledWith(refreshResponse);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should call next with error if refresh token is missing', async () => {
      // Setup with missing token
      mockRequest.body = {}; // Missing refreshToken

      // Execute
      await executeController(refreshTokenHandler);

      // Assert
      expect(authService.refreshAccessToken).not.toHaveBeenCalled();
      expect(mockResponse.json).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalled();
      
      // Verify the error properties
      const error = mockNext.mock.calls[0][0] as unknown as AppError;
      expect(error).toBeInstanceOf(AppError);
      expect(error.message).toBe('Refresh token missing');
      expect(error.statusCode).toBe(400);
    });

    it('should call next with error if token refresh fails', async () => {
      // Setup with invalid token
      const invalidRefreshToken = 'invalid-refresh-token';
      mockRequest.body = { refreshToken: invalidRefreshToken };
      
      const mockError = new Error('Invalid token');
      (authService.refreshAccessToken as jest.Mock).mockRejectedValue(mockError);

      // Execute
      await executeController(refreshTokenHandler);

      // Assert
      expect(authService.refreshAccessToken).toHaveBeenCalledWith(invalidRefreshToken);
      expect(mockResponse.json).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(mockError);
    });
  });
});
