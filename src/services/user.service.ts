import bcrypt from 'bcryptjs';
import { prisma } from '../utils/prisma';
import { AppError } from '../types/errors';
import logger from '../utils/logger';
import { config } from '../config/config';
import { isStrongPassword, PASSWORD_REQUIREMENT_MESSAGE } from '../utils/passwordValidator';

const saltRounds = config.BCRYPT_SALT_ROUNDS;

export const getAllUsers = async () => {
  return await prisma.user.findMany();
};

export const getUserById = async (id: number) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new AppError('User not found', 404);
  return user;
};

export const createNewUser = async (email: string, password: string) => {
  if (!isStrongPassword(password)) {
    throw new AppError(PASSWORD_REQUIREMENT_MESSAGE, 400);
  }
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return await prisma.user.create({ data: { email, password: hashedPassword } });
};

export const updateExistingUser = async (id: number, email?: string, password?: string) => {
  const existingUser = await prisma.user.findUnique({ where: { id } });
  if (!existingUser) throw new AppError('User not found', 404);
  let hashedPassword;
  if (password) {
    if (!isStrongPassword(password)) {
      throw new AppError('Provided password is weak.', 400);
    }
    hashedPassword = await bcrypt.hash(password, saltRounds);
  }
  return await prisma.user.update({
    where: { id },
    data: { email, ...(hashedPassword && { password: hashedPassword }) },
  });
};

export const deleteUserById = async (id: number) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new AppError('User not found', 404);
  if (user.role === 'ADMIN') throw new AppError('Forbidden - cannot delete admin', 403);
  return await prisma.user.delete({ where: { id } });
};
