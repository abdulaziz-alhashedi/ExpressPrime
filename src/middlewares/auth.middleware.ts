import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../utils/prisma';
import { AppError } from '../types/errors';
import { config } from '../config/config';

export const authenticateJWT = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return next(new AppError('Token not provided', 401));
  const token = authHeader.split(' ')[1];
  
  try {
    const payload = jwt.verify(token, config.JWT_SECRET) as { userId: number };
    const dbUser = await prisma.user.findUnique({ where: { id: payload.userId } });
    if (!dbUser) return next(new AppError('User not found', 401));
    (req as any).user = dbUser;
    next();
  } catch (err) {
    return next(new AppError('Invalid token', 403));
  }
};
