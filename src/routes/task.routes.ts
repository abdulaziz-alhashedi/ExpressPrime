import { Router } from 'express';
import { createtask, gettasks, updatetask, deletetask } from '../controllers/task.controller';
import { validationMiddleware } from '../middlewares/validation.middleware';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.post('/', validationMiddleware, createtask);
router.get('/', gettasks);
router.put('/:id', validationMiddleware, updatetask);
router.delete('/:id', deletetask);

export default router;
