import type { Request, Response, NextFunction } from 'express';
import { updateContext } from "../context/app_context.ts";

export const contextMiddleWare = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await updateContext();
    next();
  } catch (err) {
    next(err); // ส่งต่อไป error middleware
  }
};