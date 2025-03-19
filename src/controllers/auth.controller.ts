import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../utils/prisma';
import { AppError, AuthenticationError } from '../types/errors';

export const register = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { email, password } = req.body;
		const hashedPassword = await bcrypt.hash(password, 10);
		
		const user = await prisma.user.create({
			data: { email, password: hashedPassword }
		});

		res.status(201).json({ id: user.id, email: user.email });
	} catch (error) {
		next(new AppError('Registration failed', 500, true, error));
	}
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { email, password } = req.body;
		
		const user = await prisma.user.findUnique({ where: { email } });
		if (!user || !(await bcrypt.compare(password, user.password))) {
			return next(new AuthenticationError('Invalid credentials'));
		}

		const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
			expiresIn: '1h'
		});

		res.json({ token });
	} catch (error) {
		next(new AppError('Login failed', 500, true, error));
	}
};