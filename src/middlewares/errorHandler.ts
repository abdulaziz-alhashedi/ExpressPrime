import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';
import { AppError } from '../types/errors';

// Improved error handler with proper type safety
export const errorHandler = (err: unknown, req: Request, res: Response, next: NextFunction): void => {
  // Log the error with request trace ID for correlation
  const traceId = req.headers['x-trace-id'] as string || 'unknown';
  logger.error(`Error [TraceID: ${traceId}]`, err);
  
  // Handle different types of errors
  if (err instanceof AppError) {
    // Our custom AppError instances with proper status codes and details
    const response = process.env.NODE_ENV === 'production'
      ? { message: err.message } // Only expose message in production
      : err.toJSON(); // Full details in development
      
    res.status(err.statusCode).json(response);
    return;
  } 
  
  // Handle other Error types (system errors, unexpected errors)
  const statusCode = 500;
  const response = process.env.NODE_ENV === 'production'
    ? { message: 'Internal Server Error' } // Generic message in production
    : { 
        message: err instanceof Error ? err.message : 'Unknown error',
        stack: err instanceof Error ? err.stack : undefined
      };
      
  res.status(statusCode).json(response);
};

// Error boundary middleware for async handlers
export const asyncHandler = 
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => 
  (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch((err) => {
      next(err);
    });
  };
