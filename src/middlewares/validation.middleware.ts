import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

export const validate = (method: string) => {
  switch (method) {
    case 'register': {
      return [
        body('email').isEmail().withMessage('Email must be valid'),
        body('password')
          .isLength({ min: 10 })
          .withMessage('Password must be at least 10 characters long'),
      ];
    }
    case 'login': {
      return [
        body('email').isEmail().withMessage('Email must be valid'),
        body('password')
          .isLength({ min: 10 })
          .withMessage('Password must be at least 10 characters long'),
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