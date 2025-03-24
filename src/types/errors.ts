export interface ErrorDetails {
  code: string;
  field?: string;
  info?: Record<string, any>;
}

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly errorCode: string;
  public readonly isOperational: boolean;
  public readonly details?: any;
  public readonly timestamp: Date;

  constructor(
    message: string,
    statusCode: number,
    errorCode: string = 'APP_ERROR',
    isOperational = true,
    details?: any
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.isOperational = isOperational;
    this.details = details;
    this.timestamp = new Date();
    Error.captureStackTrace(this, this.constructor);
  }

  // New method to return a sanitized error object
  toJSON() {
    return {
      message: this.message,
      statusCode: this.statusCode,
      errorCode: this.errorCode,
      timestamp: this.timestamp,
      ...(this.details && { details: this.details })
    };
  }
}

// Usage tip: In your controllers/catch blocks, use "catch (error: unknown)" and check error type
// before accessing properties. This helps prevent unexpected runtime errors.

export class ValidationError extends AppError {
  constructor(message: string, field?: string, info?: Record<string, any>) {
    super(message, 400, 'VALIDATION_ERROR', true, { code: 'VALIDATION_ERROR', field, info });
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string, info?: Record<string, any>) {
    super(message, 401, 'AUTH_ERROR', true, { code: 'AUTH_ERROR', info });
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string, info?: Record<string, any>) {
    super(message, 403, 'FORBIDDEN_ERROR', true, { code: 'FORBIDDEN_ERROR', info });
  }
}

export class NotFoundError extends AppError {
  constructor(message: string, resource?: string, info?: Record<string, any>) {
    super(message, 404, 'NOT_FOUND_ERROR', true, { code: 'NOT_FOUND_ERROR', field: resource, info });
  }
}

export class DatabaseError extends AppError {
  constructor(message: string, operation?: string, info?: Record<string, any>) {
    super(message, 500, 'DATABASE_ERROR', true, { code: 'DATABASE_ERROR', field: operation, info });
  }
}

export class RateLimitError extends AppError {
  constructor(message: string, info?: Record<string, any>) {
    super(message, 429, 'RATE_LIMIT_ERROR', true, { code: 'RATE_LIMIT_ERROR', info });
  }
}

export class ConflictError extends AppError {
  constructor(message: string, resource?: string, info?: Record<string, any>) {
    super(message, 409, 'CONFLICT_ERROR', true, { code: 'CONFLICT_ERROR', field: resource, info });
  }
}