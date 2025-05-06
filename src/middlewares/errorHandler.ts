import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  logger.error(err);
  const response =
    process.env.NODE_ENV === 'production'
      ? { message: 'Internal Server Error' }  // hide internal details
      : (typeof err.toJSON === 'function' ? err.toJSON() : { message: err.message, stack: err.stack });
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json(response);
};
