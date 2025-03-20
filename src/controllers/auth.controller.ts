import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../utils/prisma';
import { AppError, AuthenticationError } from '../types/errors';

export const register = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { email, password, role } = req.body;
		// Default to 'USER' role
		let roleToAssign = 'USER';
		// If the request tries to register an admin, validate the special admin key
		if (role && role === 'ADMIN') {
			const adminKey = req.headers['x-admin-key'];
			if (!adminKey || adminKey !== process.env.ADMIN_KEY) {
				return next(new AppError('Invalid admin key', 403));
			}
			roleToAssign = 'ADMIN';
		}
		
		// Check if user already exists
		const existingUser = await prisma.user.findUnique({ where: { email } });
		if (existingUser) {
			return next(new AppError('User already exists', 400));
		}
		
		const hashedPassword = await bcrypt.hash(password, 10);
		const user = await prisma.user.create({
			data: { 
				email, 
				password: hashedPassword,
				role: roleToAssign
			}
		});
		
		// Generate a JWT token for the new user
		const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '1h' });
		
		res.status(201).json({ id: user.id, email: user.email, token });
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