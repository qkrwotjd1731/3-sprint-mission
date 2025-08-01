import jwt from 'jsonwebtoken';
import { User } from '../generated/prisma';

export const createToken = (user: User, type?: 'refresh' | 'access') => {
  const payload = { id: user.id };
  const expiresIn = type === 'refresh' ? '2w' : '1h';
  
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
  }
  
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
}

export const filterSensitiveUserData = (user: User) => {
  const { password, refreshToken, ...rest } = user;
  return rest;
}