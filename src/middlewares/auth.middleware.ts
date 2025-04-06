import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../utils/prisma';
import { AppError } from '../types/errors';
import { config } from '../config/config';


declare global {
  namespace Express {
    export interface Request {
      user?: any;
    }
  }
}

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

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // For demo, assume header contains user id
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  // Normally, verify the token here. We'll assume authHeader is a user id.
  req.user = { id: parseInt(authHeader) }; // TypeScript may need declaration merging.
  next();
};


