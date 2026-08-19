import { NextFunction, Request, Response } from 'express';
import { AppError } from '../utils/errors';

export const notFoundHandler = (_req: Request, _res: Response, next: NextFunction): void => {
  next(new AppError(404, 'Route not found'));
};

export const errorHandler = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  const statusCode =
    error instanceof AppError
      ? error.statusCode
      : typeof error === 'object' && error !== null && 'statusCode' in error
        ? Number((error as { statusCode: number }).statusCode)
        : 500;
  const message =
    error instanceof Error
      ? error.message
      : typeof error === 'object' && error !== null && 'message' in error
        ? String((error as { message: string }).message)
        : 'Internal server error';

  res.status(statusCode).json({
    error: {
      message,
      ...(process.env.NODE_ENV !== 'production' && error instanceof Error ? { stack: error.stack } : {}),
    },
  });
};
