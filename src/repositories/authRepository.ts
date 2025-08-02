import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

export const create = (email: string, nickname: string, hashedPassword: string) =>
  prisma.user.create({ data: { email, nickname, password: hashedPassword } });

export const findById = (id: number) =>
    prisma.user.findUnique({ where: { id } });

export const findByEmail = (email: string) =>
  prisma.user.findUnique({ where: { email } });

export const saveRefreshToken = (id: number, refreshToken: string) =>
  prisma.user.update({ where: { id }, data: { refreshToken } });

export const clearRefreshToken = (id: number) =>
  prisma.user.update({ where: { id }, data: { refreshToken: null } });