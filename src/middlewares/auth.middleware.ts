import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../utils/prisma';
import { AppError } from '../types/errors';

export const authenticateJWT = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.JWT_SECRET!, async (err, user: any) => {
      if (err) {
        return next(new AppError('Invalid token', 403));
      }

      try {
        const dbUser = await prisma.user.findUnique({ where: { id: user.userId } });
        if (!dbUser) {
          return next(new AppError('User not found', 401));
        }
        (req as any).user = dbUser;
        next();
      } catch (error) {
        return next(new AppError('Internal server error', 500));
      }
    });
  } else {
    return next(new AppError('Token not provided', 401));
  }
};
