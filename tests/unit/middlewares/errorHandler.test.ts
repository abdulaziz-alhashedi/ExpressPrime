import { Request, Response, NextFunction } from 'express';
import { errorHandler } from '../../../src/middlewares/errorHandler';
import logger from '../../../src/utils/logger';
import { 
  AppError, 
  ValidationError, 
  AuthenticationError, 
  NotFoundError,
  DatabaseError
} from '../../../src/types/errors';

// Mock logger
jest.mock('../../../src/utils/logger', () => ({
  error: jest.fn()
}));

describe('Error Handler Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.MockedFunction<NextFunction>;
  const originalNodeEnv = process.env.NODE_ENV;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    mockNext = jest.fn();
    jest.clearAllMocks();
  });

  afterAll(() => {
    // Restore original environment
    process.env.NODE_ENV = originalNodeEnv;
  });

  it('should handle AppError with proper status code and details', () => {
    // Setup
    const appError = new AppError('Test error', 418, 'TEST_ERROR', true, { test: 'data' });
    
    // Execute
    errorHandler(appError, mockRequest as Request, mockResponse as Response, mockNext);
    
    // Assert
    expect(logger.error).toHaveBeenCalledWith(appError);
    expect(mockResponse.status).toHaveBeenCalledWith(418);
    expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({
      message: 'Test error',
      errorCode: 'TEST_ERROR',
      details: { test: 'data' }
    }));
  });

  it('should handle ValidationError with 400 status code', () => {
    // Setup
    const validationError = new ValidationError('Invalid data', 'email', { foo: 'bar' });
    
    // Execute
    errorHandler(validationError, mockRequest as Request, mockResponse as Response, mockNext);
    
    // Assert
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({
      message: 'Invalid data',
      errorCode: 'VALIDATION_ERROR',
      details: expect.objectContaining({
        code: 'VALIDATION_ERROR',
        field: 'email'
      })
    }));
  });

  it('should handle AuthenticationError with 401 status code', () => {
    // Setup
    const authError = new AuthenticationError('Unauthorized access');
    
    // Execute
    errorHandler(authError, mockRequest as Request, mockResponse as Response, mockNext);
    
    // Assert
    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({
      message: 'Unauthorized access',
      errorCode: 'AUTH_ERROR'
    }));
  });

  it('should handle NotFoundError with 404 status code', () => {
    // Setup
    const notFoundError = new NotFoundError('User not found', 'user');
    
    // Execute
    errorHandler(notFoundError, mockRequest as Request, mockResponse as Response, mockNext);
    
    // Assert
    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({
      message: 'User not found',
      errorCode: 'NOT_FOUND_ERROR'
    }));
  });

  it('should handle DatabaseError with 500 status code', () => {
    // Setup
    const dbError = new DatabaseError('Database query failed', 'select');
    
    // Execute
    errorHandler(dbError, mockRequest as Request, mockResponse as Response, mockNext);
    
    // Assert
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({
      message: 'Database query failed',
      errorCode: 'DATABASE_ERROR'
    }));
  });

  it('should handle generic Error with 500 status code', () => {
    // Setup
    const genericError = new Error('Something went wrong');
    
    // Execute
    errorHandler(genericError, mockRequest as Request, mockResponse as Response, mockNext);
    
    // Assert
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({
      message: 'Something went wrong'
    }));
  });

  it('should provide limited error details in production environment', () => {
    // Setup
    process.env.NODE_ENV = 'production';
    const error = new Error('Detailed error information');
    
    // Execute
    errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);
    
    // Assert
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Internal Server Error' });
    
    // Restore test environment
    process.env.NODE_ENV = 'test';
  });
});
