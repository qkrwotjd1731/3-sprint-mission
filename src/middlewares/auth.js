import { expressjwt } from 'express-jwt';
import { PrismaClient } from '../generated/prisma/index.js';
import { throwHttpError } from '../utils/httpError.js';

const prisma = new PrismaClient();

export const verifyAccessToken = expressjwt({
  secret: process.env.JWT_SECRET,
  algorithms: ['HS256'],
  requestProperty: 'user',
});

export const verifyRefreshToken = expressjwt({
  secret: process.env.JWT_SECRET,
  algorithms: ['HS256'],
  getToken: (req) => req.cookies.refreshToken,
});

export function verifyResourceAuth(resourceType) {
  return async function (req, res, next) {
    const id = parseInt(req.params.id);
    try {
      const resource = await prisma[resourceType].findUnique({ where: { id } });

      if (!resource) {
        throwHttpError('Not found', 404);
      }

      if (resource.userId !== req.user.userId) {
        throwHttpError('Forbidden', 403);
      }

      return next();
    } catch (err) {
      return next(err);
    }
  };
}