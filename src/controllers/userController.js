import { PrismaClient } from '../generated/prisma/index.js';
import bcrypt from 'bcrypt';
import { filterSensitiveUserData } from '../utils/userUtils.js';
import { throwHttpError } from '../utils/httpError.js';

const prisma = new PrismaClient();

export async function getMe(req, res) {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
  });

  res.json(filterSensitiveUserData(user));
}

export async function updateMe(req, res) {
  const data = filterSensitiveUserData(req.body);
  const user = await prisma.user.update({
    where: { id: req.user.id },
    data,
  });

  res.json(filterSensitiveUserData(user));
}

export async function updatePassword(req, res) {
  const { currentPassword, newPassword } = req.body;

  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
  });

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    throwHttpError('Unauthorized', 401);
  }

  const hashedNewPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: req.user.id },
    data: { password: hashedNewPassword },
  });

  res.status(200).json({ message: 'Password updated successfully' });
}

export async function getMyProductList(req, res) {
  const { offset = 0, limit = 10, orderBy, keyword } = req.validatedQuery;

  const where = keyword
    ? {
        OR: [{ name: { contains: keyword } }, { description: { contains: keyword } }],
      }
    : {};
  const products = await prisma.product.findMany({
    skip: parseInt(offset, 10),
    take: parseInt(limit, 10),
    orderBy: orderBy === 'recent' ? { createdAt: 'desc' } : { id: 'asc' },
    where: { userId: req.user.id, ...where },
    include: {
      likes: true,
    },
  });

  const productsWithLikes = products.map((product) => ({
    ...product,
    isLiked: product.likes.some((like) => like.userId === req.user.id),
    likeCount: product.likes.length,
  }));
  res.json(productsWithLikes);
}