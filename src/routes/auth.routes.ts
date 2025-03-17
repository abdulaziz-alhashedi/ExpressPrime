import { Router } from 'express';
import { register, login } from '../controllers/auth.controller';
import { validate } from '../middlewares/validation.middleware';

const router = Router();

router.post('/register', validate('register'), register);
router.post('/login', validate('login'), login);

export default router;
