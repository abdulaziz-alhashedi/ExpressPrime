/**
 * Authentication Controller
 *
 * This module contains controller functions for handling:
 * - User registration (creating new users with strong password validation)
 * - User login (verifying credentials and issuing JWT and refresh tokens)
 * - Access token refresh
 *
 * It acts as a bridge between HTTP requests and authentication business logic.
 */

import { Request, Response, NextFunction } from 'express';
import { registerUser, loginUser, refreshAccessToken } from '../services/auth.service';
import { AppError } from '../types/errors';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const { user, token, refreshToken } = await registerUser(email, password);
    res.status(201).json({ id: user.id, email: user.email, token, refreshToken });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const { token, refreshToken } = await loginUser(email, password);
    res.json({ token, refreshToken });
  } catch (error) {
    next(error);
  }
};

export const refreshTokenHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return next(new AppError('Refresh token missing', 400));
    }
    const result: any = await refreshAccessToken(refreshToken);
    res.json(result);
  } catch (error) {
    next(error);
  }
};