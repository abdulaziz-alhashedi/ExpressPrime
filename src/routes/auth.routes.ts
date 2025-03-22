import { Router } from 'express';
import { register, login } from '../controllers/auth.controller';
import { validate, validationMiddleware } from '../middlewares/validation.middleware';
import { authenticateJWT } from '../middlewares/auth.middleware';
import { authLimiter, registrationLimiter, profileUpdateLimiter } from '../middlewares/rateLimiter.middleware';

const router = Router();

router.post('/register', registrationLimiter, validate('register'), validationMiddleware, register);
router.post('/login', authLimiter, validate('login'), validationMiddleware, login);

router.get('/profile', authenticateJWT, profileUpdateLimiter, (req, res) => {
	return res.json({ user: (req as any).user });
});

export default router;
