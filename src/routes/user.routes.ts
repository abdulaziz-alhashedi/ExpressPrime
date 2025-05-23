import { Router } from 'express';
import { body, param } from 'express-validator';
import { getUsers, getUser, createUser, updateUser, deleteUser } from '../controllers/user.controller';
import { validationMiddleware } from '../middlewares/validation.middleware';
import { authenticateJWT } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticateJWT);

router.get('/', getUsers);

router.get(
  '/:id',
  [param('id').isInt().withMessage('ID must be an integer')],
  validationMiddleware,
  getUser
);

router.post(
  '/',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password').custom(value => {
      const { isStrongPassword, PASSWORD_REQUIREMENT_MESSAGE } = require('../utils/passwordValidator');
      if (!isStrongPassword(value)) {
        throw new Error(PASSWORD_REQUIREMENT_MESSAGE);
      }
      return true;
    })
  ],
  validationMiddleware,
  createUser
);

router.put(
  '/:id',
  [
    param('id').isInt().withMessage('ID must be an integer'),
    body('email').optional().isEmail().withMessage('Invalid email format'),
    body('password').optional().custom(value => {
      const { isStrongPassword, PASSWORD_REQUIREMENT_MESSAGE } = require('../utils/passwordValidator');
      if (!isStrongPassword(value)) {
        throw new Error(PASSWORD_REQUIREMENT_MESSAGE);
      }
      return true;
    })
  ],
  validationMiddleware,
  updateUser
);

router.delete(
  '/:id',
  [param('id').isInt().withMessage('ID must be an integer')],
  validationMiddleware,
  deleteUser
);

export default router;
