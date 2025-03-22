import { Router } from 'express';
import { register, login } from '../controllers/auth.controller';
import { validate, validationMiddleware } from '../middlewares/validation.middleware';
import rateLimit from 'express-rate-limit';
import { authenticateJWT } from '../middlewares/auth.middleware';

const router = Router();

const loginLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 5,
	message: "Too many login attempts. Please try again after 15 minutes."
});

router.post('/register', validate('register'), validationMiddleware, register);
router.post('/login', loginLimiter, validate('login'), validationMiddleware, login);

router.get('/profile', authenticateJWT, (req, res) => {
	return res.json({ user: (req as any).user });
});

export default router;
