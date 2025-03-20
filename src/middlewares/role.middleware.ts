import { Request, Response, NextFunction } from 'express';
import { AppError } from '../types/errors';

export const ensureUserRole = (req: Request, res: Response, next: NextFunction) => {
	// If a role is submitted and it's not "USER", reject
	if (req.body.role && req.body.role !== 'USER') {
		return next(new AppError("Registration allowed only for normal users", 400));
	}
	// Force any role value to "USER"
	req.body.role = "USER";
	next();
};
