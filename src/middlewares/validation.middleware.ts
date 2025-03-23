import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import { isStrongPassword, PASSWORD_REQUIREMENT_MESSAGE } from '../utils/passwordValidator';

export const validate = (method: string) => {
  switch (method) {
    case 'register': {
      return [
        body('email').isEmail().withMessage('Email must be valid'),
        body('password').custom(value => {
          if (!isStrongPassword(value)) {
            throw new Error(PASSWORD_REQUIREMENT_MESSAGE);
          }
          return true;
        })
      ];
    }
    case 'login': {
      return [
        body('email').isEmail().withMessage('Email must be valid'),
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