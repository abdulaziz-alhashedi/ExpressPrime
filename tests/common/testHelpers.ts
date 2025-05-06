import { Request, Response, NextFunction } from 'express';
import request from 'supertest';
import app from '../../src/app';
import { AppError } from '../../src/types/errors';

/**
 * Type-safe mock request factory for testing Express controllers
 */
export const createMockRequest = (overrides: Partial<Request> = {}): Partial<Request> & { user?: any } => {
  return {
    body: {},
    params: {},
    query: {},
    headers: {},
    ...overrides
  };
};

/**
 * Type-safe mock response factory for testing Express controllers
 */
export const createMockResponse = (): Partial<Response> => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  res.end = jest.fn().mockReturnValue(res);
  res.setHeader = jest.fn().mockReturnValue(res);
  return res;
};

/**
 * Type-safe mock next function
 */
export const createMockNext = (): jest.MockedFunction<NextFunction> => {
  return jest.fn();
};

/**
 * Utility to fix Promise rejection in tests
 */
export const expectAsync = async (promise: Promise<any>, matcher: (error: any) => void): Promise<void> => {
  try {
    await promise;
    fail('Expected promise to be rejected but it was resolved');
  } catch (error) {
    matcher(error);
  }
};

/**
 * Helper to assert that an error is an AppError with the expected status code
 */
export const assertAppError = (error: unknown, statusCode: number, message?: string): void => {
  expect(error).toBeInstanceOf(AppError);
  const appError = error as unknown as AppError;
  expect(appError.statusCode).toBe(statusCode);
  if (message) {
    expect(appError.message).toBe(message);
  }
};

/**
 * Helper to create a unique test email
 */
export const generateTestEmail = (prefix: string = 'test'): string => {
  return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 10000)}@test.com`;
};

/**
 * Standard test password that meets requirements
 */
export const TEST_PASSWORD = 'StrongPass#123';

/**
 * Helper to register a test user for integration tests
 */
export const registerTestUser = async (overrides: Partial<{ email: string; password: string }> = {}) => {
  const email = overrides.email || generateTestEmail();
  const password = overrides.password || TEST_PASSWORD;
  
  const res = await request(app)
    .post('/api/v1/auth/register')
    .send({ email, password });
    
  return { 
    response: res,
    user: res.body,
    credentials: { email, password }
  };
};

/**
 * Helper to login a test user for integration tests
 */
export const loginTestUser = async (email: string, password: string) => {
  const res = await request(app)
    .post('/api/v1/auth/login')
    .send({ email, password });
    
  return {
    response: res,
    authData: res.body
  };
};

/**
 * Helper to make authenticated requests
 */
export const authenticatedRequest = (token: string) => {
  return {
    get: (url: string) => request(app).get(url).set('Authorization', `Bearer ${token}`),
    post: (url: string, data?: any) => request(app).post(url).set('Authorization', `Bearer ${token}`).send(data),
    put: (url: string, data?: any) => request(app).put(url).set('Authorization', `Bearer ${token}`).send(data),
    delete: (url: string) => request(app).delete(url).set('Authorization', `Bearer ${token}`)
  };
};
