export interface ErrorDetails {
  code: string;
  field?: string;
  info?: Record<string, any>;
}

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly details?: ErrorDetails;
  public readonly errorCode: string;

  constructor(message: string, statusCode: number, errorCode: string, isOperational = true, details?: ErrorDetails) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.isOperational = isOperational;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

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