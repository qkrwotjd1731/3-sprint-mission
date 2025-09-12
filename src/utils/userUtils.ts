import jwt from 'jsonwebtoken';
import { User } from '../generated/prisma';
import { JWT_SECRET } from '../lib/constants';
import type { UserResponseDto } from '../types/userTypes';

export const createToken = (user: User, type?: 'refresh' | 'access') => {
  const payload = { id: user.id };
  const expiresIn = type === 'refresh' ? '2w' : '1h';

  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
  }

  return jwt.sign(payload, JWT_SECRET, { expiresIn });
};

export const filterSensitiveUserData = (user: User): UserResponseDto => {
  const { password, refreshToken, ...rest } = user;
  return rest;
};
