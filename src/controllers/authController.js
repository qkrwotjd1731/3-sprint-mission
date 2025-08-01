import { PrismaClient } from '../generated/prisma/index.js';
import bcrypt from 'bcrypt';
import { createToken, filterSensitiveUserData } from '../utils/userUtils.js';
import { HttpError } from '../utils/httpError.js';

const prisma = new PrismaClient();

export async function createUser(req, res) {
  const { email, nickname, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const existedUser = await prisma.user.findUnique({ where: { email } });
  if (existedUser) {
    throw new HttpError('User already exists', 422, { email });
  }

  const user = await prisma.user.create({
    data: { email, nickname, password: hashedPassword},
  });

  res.status(201).json(filterSensitiveUserData(user));
}

export async function login(req, res) {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new HttpError('User not found', 404);
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new HttpError('Unauthorized', 401);
  }

  const accessToken = createToken(user);
  const refreshToken = createToken(user, 'refresh');
  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken },
  });
  res.cookie('refreshToken', refreshToken, {
    path: '/auth/refresh',
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
  });

  res.json({ accessToken });
}

export async function logout(req, res) {
  res.clearCookie('refreshToken', {
    path: '/auth/refresh',
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
  });

  res.status(200).json({ message: 'Logout successfully' });
}

export async function refreshToken(req, res) {
  const { userId } = req.user;

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new HttpError('User not found', 404);
  }

  const accessToken = createToken(user);
  const newRefreshToken = createToken(user, 'refresh');

  await prisma.user.update({
    where: { id: userId },
    data: { refreshToken: newRefreshToken },
  });

  res.cookie('refreshToken', newRefreshToken, {
    path: '/auth/refresh',
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
  });
  
  res.status(200).json({ accessToken });
}