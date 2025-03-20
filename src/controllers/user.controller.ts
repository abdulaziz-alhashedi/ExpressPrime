import { Request, Response, NextFunction } from 'express';
import { prisma } from '../utils/prisma';
import AppError from '../utils/AppError';
import bcrypt from 'bcryptjs';

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, email: true, createdAt: true }
    });
    res.json(users);
  } catch (error) {
    next(error);
  }
};

export const getUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id);
    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true, createdAt: true }
    });
    if (!user) return next(new AppError("User not found", 404));
    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: { email, password: hashedPassword }
    });
    res.status(201).json({ id: newUser.id, email: newUser.email });
  } catch (error: any) {
    next(new AppError("User creation failed", 500, true, error));
  }
};

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id);
    const { email, password } = req.body;
    const data: any = {};
    if (email) data.email = email;
    if (password) data.password = await bcrypt.hash(password, 10);
    const updatedUser = await prisma.user.update({
      where: { id },
      data
    });
    res.json({ id: updatedUser.id, email: updatedUser.email });
  } catch (error: any) {
    next(new AppError("User update failed", 500, true, error));
  }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id);
    // Retrieve logged in user's id from JWT payload (set by auth middleware)
    const loggedInUserId = (req as any).user?.userId;
    if (loggedInUserId === id) {
      // Fetch target user to confirm role
      const userToDelete = await prisma.user.findUnique({ where: { id } });
      if (userToDelete?.role === 'ADMIN') {
        return next(new AppError("Admin cannot remove themselves", 403));
      }
    }
    await prisma.user.delete({ where: { id } });
    res.status(204).send();
  } catch (error: any) {
    next(new AppError("User deletion failed", 500, true, error));
  }
};
