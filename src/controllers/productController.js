import { PrismaClient } from '../generated/prisma/index.js';
import { throwHttpError } from '../utils/httpError.js';

const prisma = new PrismaClient();

export async function createProduct(req, res) {
  const product = await prisma.product.create({
    data: {
      ...req.body,
      userId: req.user.id,
    },
  });
  res.status(201).json(product);
}

export async function getProduct(req, res) {
  const id = parseInt(req.params.id, 10);

  const product = await prisma.product.findUnique({
    where: { id },
    include: { likes: true },
  });
  if (!product) {
    throwHttpError('Product not found', 404);
  }
  
  const productWithLikes = {
    ...product,
    likesCount: product.likes.length,
    isLiked: req.user
      ? product.likes.some((like) => like.userId === req.user.id)
      : false,
  };
  res.json(productWithLikes);
}

export async function updateProduct(req, res) {
  const id = parseInt(req.params.id, 10);

  const existingProduct = await prisma.product.findUnique({ where: { id } });
  if (!existingProduct) {
    throwHttpError('Product not found', 404);
  }

  const product = await prisma.product.update({
    where: { id },
    data: req.body,
  });
  res.json(product);
}

export async function deleteProduct(req, res) {
  const id = parseInt(req.params.id, 10);

  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) {
    throwHttpError('Product not found', 404);
  }

  await prisma.product.delete({ where: { id } });
  res.sendStatus(204);
}

export async function getProductList(req, res) {
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
    where,
    include: { likes: true },
  });
  
  const productsWithLikes = products.map((product) => ({
    ...product,
    likesCount: product.likes.length,
    isLiked: req.user
      ? product.likes.some((like) => like.userId === req.user.id)
      : false,
  }));
  
  res.json(productsWithLikes);
}

export async function createComment(req, res) {
  const productId = parseInt(req.params.id, 10);

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) {
    throwHttpError('Product not found', 404);
  }

  const comment = await prisma.comment.create({
    data: { productId, content: req.body.content, userId: req.user.id },
  });
  
  res.status(201).json(comment);
}

export async function getCommentList(req, res) {
  const productId = parseInt(req.params.id, 10);
  const { cursor, limit = 10 } = req.query;

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) {
    throwHttpError('Product not found', 404);
  }

  const comments = await prisma.comment.findMany({
    cursor: cursor ? { id: parseInt(cursor, 10) } : undefined,
    skip: cursor ? 1 : 0,
    take: parseInt(limit, 10),
    where: { productId },
  });

  res.json(comments);
}

export async function createLike(req, res) {
  const productId = parseInt(req.params.id, 10);

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) {
    throwHttpError('Product not found', 404);
  }

  const existingLike = await prisma.like.findFirst({
    where: { productId, userId: req.user.id },
  });
  if (existingLike) {
    throwHttpError('Like already exists', 400);
  }

  const like = await prisma.like.create({
    data: { productId, userId: req.user.id }
  });
  res.status(201).json(like);
}

export async function deleteLike(req, res) {
  const productId = parseInt(req.params.id, 10);

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) {
    throwHttpError('Product not found', 404);
  }

  const like = await prisma.like.findFirst({
    where: { productId, userId: req.user.id },
  });
  if (!like) {
    throwHttpError('Like not found', 404);
  }

  await prisma.like.delete({ where: { id: like.id } });

  res.sendStatus(204);
}