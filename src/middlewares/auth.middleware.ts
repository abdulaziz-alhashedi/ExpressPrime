import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../types/errors';

export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
	// Expect token in Authorization header in the format: Bearer <token>
	const authHeader = req.headers.authorization;
	if (!authHeader) {
		return next(new AppError("No token provided", 401));
	}
	const parts = authHeader.split(' ');
	if (parts.length !== 2 || parts[0] !== 'Bearer') {
		return next(new AppError("Invalid token format", 401));
	}
	const token = parts[1];
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET!);
		// Optionally, attach decoded payload to req
		(req as any).user = decoded;
		next();
	} catch (err) {
		return next(new AppError("Invalid token", 401));
	}
};
