import { Router } from 'express';
import { register, login } from '../controllers/auth.controller';
import { validate, validationMiddleware } from '../middlewares/validation.middleware';
import rateLimit from 'express-rate-limit';

const router = Router();

// Rate limiter for login endpoint
const loginLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 5,
	message: "Too many login attempts. Please try again after 15 minutes."
});

router.post('/register', validate('register'), validationMiddleware, register);
router.post('/login', loginLimiter, validate('login'), validationMiddleware, login);

export default router;
