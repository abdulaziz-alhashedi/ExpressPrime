import { Request, Response, NextFunction } from 'express';
import { prisma } from '../utils/prisma';
import { AppError } from '../types/errors';
import { User as UserModel } from '@prisma/client';
import logger from '../utils/logger';
import bcrypt from 'bcryptjs';

const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS) || 12;

function isStrongPassword(password: string): boolean {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{10,}$/.test(password);
}

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;

    if (user.role !== 'ADMIN') {
      return next(new AppError('Forbidden - Only admin can access', 403));
    }

    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    next(new AppError('Failed to get users', 500, true, error));
  }
};

export const getUser = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { id } = req.params;

		const user = await prisma.user.findUnique({
			where: {
				id: parseInt(id, 10),
			},
		});

		if (!user) {
			return next(new AppError('User not found', 404));
		}

		res.json(user);
	} catch (error) {
		next(new AppError('Failed to get user', 500, true, error));
	}
};

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;

    if (user.role !== 'ADMIN') {
      logger.warn(`User ${user.id} tried to create a new user without admin rights.`);
      return next(new AppError('Forbidden - Only admin can create users', 403));
    }

    const { email, password } = req.body;

    if (!isStrongPassword(password)) {
      return next(new AppError('Provided password is weak. Please provide a stronger password with minimum 10 characters, including uppercase, lowercase, numeric digit, and special character.', 400));
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    logger.info(`User ${user.id} created a new user with id ${newUser.id}.`);
    res.status(201).json(newUser);
  } catch (error) {
    logger.error('Failed to create user', error);
    next(new AppError('Failed to create user', 500, true, error));
  }
};

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    const { id } = req.params;
    const { email, password } = req.body;

    if (user.role !== 'ADMIN') {
      logger.warn(`User ${user.id} tried to update user ${id} without admin rights.`);
      return next(new AppError('Forbidden - Only admin can update users', 403));
    }

    const userIdToUpdate = parseInt(id, 10);

    if (isNaN(userIdToUpdate)) {
      logger.warn(`Invalid user ID format: ${id}`);
      return next(new AppError('Invalid user ID format', 400));
    }

    const existingUser = await prisma.user.findUnique({ where: { id: userIdToUpdate } });

    if (!existingUser) {
      logger.warn(`User to update not found: ${id}`);
      return next(new AppError('User not found', 404));
    }

    if (password && !isStrongPassword(password)) {
      return next(new AppError('Provided password is weak. Please provide a stronger password with minimum 10 characters, including uppercase, lowercase, numeric digit, and special character.', 400));
    }

    const hashedPassword = password ? await bcrypt.hash(password, saltRounds) : undefined;

    const updatedUser = await prisma.user.update({
      where: {
        id: userIdToUpdate,
      },
      data: {
        email,
        password: hashedPassword,
      },
    });

    logger.info(`User ${user.id} updated user ${updatedUser.id}.`);
    res.json(updatedUser);
  } catch (error) {
    logger.error(`Failed to update user ${req.params.id}`, error);
    next(new AppError('Failed to update user', 500, true, error));
  }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { id } = req.params;

    // Prevent deleting the admin user
    const userToDelete = await prisma.user.findUnique({
      where: { id: parseInt(id) },
    });

    if (!userToDelete) {
      return next(new AppError('User not found', 404));
    }

    if (userToDelete.role === 'ADMIN') {
      return next(new AppError('Forbidden - cannot delete admin', 403));
    }

		await prisma.user.delete({
			where: {
				id: parseInt(id, 10),
			},
		});

		res.status(204).send();
	} catch (error) {
		next(new AppError('Failed to delete user', 500, true, error));
	}
};
