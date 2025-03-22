import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../utils/prisma';
import { AppError, AuthenticationError } from '../types/errors';
import { Role } from '@prisma/client'; 

const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS) || 12;

function isStrongPassword(password: string): boolean {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{10,}$/.test(password);
}

export const register = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { email, password } = req.body;
		const roleToAssign = 'USER';

		if (!isStrongPassword(password)) {
			return next(new AppError('Provided password is weak. Please provide a stronger password with minimum 10 characters, including uppercase, lowercase, numeric digit, and special character.', 400));
		}
		
		const existingUser = await prisma.user.findUnique({ where: { email } });
		if (existingUser) {
			return next(new AppError('User already exists', 400));
		}
		
		const hashedPassword = await bcrypt.hash(password, saltRounds);
		const user = await prisma.user.create({
			data: { 
				email, 
				password: hashedPassword,
				role: roleToAssign as Role 
			}
		});
		
		const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '1h' });
		
		res.status(201).json({ id: user.id, email: user.email, token });
	} catch (error) {
		next(new AppError('Registration failed', 500, 'APP_ERROR', true, error));
	}
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { email, password } = req.body;
		
		const user = await prisma.user.findUnique({ where: { email } });
		if (!user || !(await bcrypt.compare(password, user.password))) {
			return next(new AuthenticationError('Invalid credentials'));
		}

		const accessToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
			expiresIn: '1h'
		});
    // Generate refresh token with longer expiry (7 days)
		const refreshToken = jwt.sign({ userId: user.id }, process.env.REFRESH_TOKEN_SECRET || process.env.JWT_SECRET!, {
			expiresIn: '7d'
		});

		res.json({ token: accessToken, refreshToken });
	} catch (error) {
		next(new AppError('Login failed', 500, 'APP_ERROR', true, error));
	}
};

export const refreshTokenHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return next(new AppError('Refresh token missing', 400));
    }
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET || process.env.JWT_SECRET!, (err: jwt.VerifyErrors | null, payload: any) => {
      if (err) {
        return next(new AppError('Invalid refresh token', 403));
      }
      const newAccessToken = jwt.sign({ userId: payload.userId }, process.env.JWT_SECRET!, { expiresIn: '1h' });
      return res.json({ token: newAccessToken });
    });
  } catch (error) {
    next(new AppError('Failed to refresh token', 500, 'APP_ERROR', true, error));
  }
};