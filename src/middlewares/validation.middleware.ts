import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import { isStrongPassword } from '../utils/passwordValidator';

export const validate = (method: string) => {
  switch (method) {
    case 'register': {
      return [
        body('email').isEmail().withMessage('Email must be valid'),
        body('password').custom(value => {
          if (!isStrongPassword(value)) {
            throw new Error('Password must be at least 10 characters long and include uppercase, lowercase, digit, and special character');
          }
          return true;
        })
      ];
    }
    case 'login': {
      return [
        body('email').isEmail().withMessage('Email must be valid'),
        // For login, just non-empty check
        body('password').notEmpty().withMessage('Password is required')
      ];
    }
    default: {
      return [];
    }
  }
};

export const validationMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};