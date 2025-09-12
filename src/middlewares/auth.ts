import { expressjwt } from 'express-jwt';
import { prisma } from '../lib/prisma';
import { JWT_SECRET } from '../lib/constants';
import { HttpError } from '../utils/httpError';
import { ResourceType } from '../types/authTypes';
import type { RequestHandler } from 'express';

export const verifyAccessToken = expressjwt({
  secret: JWT_SECRET as string,
  algorithms: ['HS256'],
  requestProperty: 'user',
  getToken: (req) => req.headers.authorization?.split(' ')[1],
});

export const optionalAuth: RequestHandler = (req, res, next) => {
  if (req.headers.authorization) {
    return verifyAccessToken(req, res, next);
  }
  req.user = undefined;
  next();
};

export const verifyRefreshToken = expressjwt({
  secret: JWT_SECRET as string,
  algorithms: ['HS256'],
  requestProperty: 'user',
  getToken: (req) => req.cookies.refreshToken,
});

export const verifyResourceAuth = (
  resourceType: ResourceType
): RequestHandler => {
  return async (req, res, next) => {
    const id = parseInt(req.params.id);
    try {
      let resource;

      switch (resourceType) {
        case ResourceType.Product:
          resource = await prisma.product.findUnique({ where: { id } });
          break;
        case ResourceType.Article:
          resource = await prisma.article.findUnique({ where: { id } });
          break;
        case ResourceType.Comment:
          resource = await prisma.comment.findUnique({ where: { id } });
          break;
        default:
          throw new HttpError('Invalid resource type', 400);
      }

      if (!resource) {
        throw new HttpError('Not found', 404);
      }

      if (resource.userId !== req.user?.id) {
        throw new HttpError('Forbidden', 403);
      }

      return next();
    } catch (err) {
      return next(err);
    }
  };
};
