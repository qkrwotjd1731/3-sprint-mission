import type { RequestHandler } from 'express';

export const asyncHandler = (handler: RequestHandler): RequestHandler => {
  return async (req, res, next) => {
    try {
      const result = await handler(req, res, next);
      return result;
    } catch (err) {
      next(err);
    }
  };
}