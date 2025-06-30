import { PrismaClient } from '../generated/prisma/index.js';

const prisma = new PrismaClient();

export async function createProduct(req, res) {
  const product = await prisma.product.create({
    data: req.validatedData,
  });

  res.status(201).send(product);
}

export async function getProduct(req, res) {
  const id = Number(req.params.id);
  const product = await prisma.product.findUniqueOrThrow({
    where: { id },
  });
  
  const { updatedAt, ...productWithoutUpdatedAt } = product;
  res.send(productWithoutUpdatedAt);
}

export async function updateProduct(req, res) {
  const id = Number(req.params.id);

  const product = await prisma.product.update({
    where: { id },
    data: req.validatedData,
  });
  res.send(product);
}

export async function deleteProduct(req, res) {
  const id = Number(req.params.id);
  const product = await prisma.product.findUnique({ where: { id } });

  if (!product) {
    return res.sendStatus(404);
  }

  await prisma.product.delete({ where: { id } });
  res.sendStatus(204);
}

export async function getProductList(req, res) {
  const { offset = 0, limit = 10, orderBy, keyword } = req.query;
  const products = await prisma.product.findMany({
    skip: parseInt(offset),
    take: parseInt(limit),
    orderBy: orderBy === 'recent' ? { createdAt: 'desc' } : { id: 'asc' },
    where: keyword
    ? {
        OR: [
          { name: { contains: keyword, mode: 'insensitive' } },
          { description: { contains: keyword, mode: 'insensitive' } },
        ],
      }
    : {},
  });
  
  const productList = products.map(product => {
    const { id, name, price, createdAt } = product;
    return { id, name, price, createdAt };
  });
  
  res.send(productList);
}

export async function createComment(req, res) {
  const productId = Number(req.params.id);

  const comment = await prisma.comment.create({
    data: { productId, ...req.validatedData },
  });
  
  res.status(201).send(comment);
}

export async function getCommentList(req, res) {
  const productId = Number(req.params.id);
  const { cursor, limit = 10 } = req.query;

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) {
    return res.sendStatus(404);
  }

  const comments = await prisma.comment.findMany({
    cursor: cursor ? { id: parseInt(cursor) } : undefined,
    skip: cursor ? 1 : 0,
    take: parseInt(limit),
    where: { productId },
  });

  res.send(comments);
}