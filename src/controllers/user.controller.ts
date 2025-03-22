import { Request, Response, NextFunction } from 'express';
import * as userService from '../services/user.service';
import { AppError } from '../types/errors';
import logger from '../utils/logger';

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    if (user.role !== 'ADMIN') {
      return next(new AppError('Forbidden - Only admin can access', 403));
    }
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (error) {
    next(error);
  }
};

export const getUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id, 10);
    const user = await userService.getUserById(id);
    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const admin = (req as any).user;
    if (admin.role !== 'ADMIN') {
      return next(new AppError('Forbidden - Only admin can create users', 403));
    }
    const { email, password } = req.body;
    const newUser = await userService.createNewUser(email, password);
    logger.info(`User ${admin.id} created a new user with id ${newUser.id}.`);
    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const admin = (req as any).user;
    if (admin.role !== 'ADMIN') {
      return next(new AppError('Forbidden - Only admin can update users', 403));
    }
    const id = parseInt(req.params.id, 10);
    const { email, password } = req.body;
    const updatedUser = await userService.updateExistingUser(id, email, password);
    logger.info(`User ${admin.id} updated user ${updatedUser.id}.`);
    res.json(updatedUser);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id, 10);
    await userService.deleteUserById(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
