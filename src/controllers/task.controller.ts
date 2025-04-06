import { Request, Response, NextFunction } from 'express';
import { createtask as createtaskService, gettasks as gettasksService, updatetask as updatetaskService, deletetask as deletetaskService } from '../services/task.service';

export const createtask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user; // set by authMiddleware
    req.body.userId = user.id;
    const result = await createtaskService(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const gettasks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    const results = await gettasksService(user.id);
    res.json(results);
  } catch (error) {
    next(error);
  }
};

export const updatetask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    const result = await updatetaskService(req.params.id, req.body, user.id);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const deletetask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    await deletetaskService(req.params.id, user.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
