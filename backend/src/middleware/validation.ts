import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';

export const validateRequest = (req: Request, _res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    next({ statusCode: 400, message: 'Validation failed', details: errors.array() });
    return;
  }
  next();
};
