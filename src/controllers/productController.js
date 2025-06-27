import { PrismaClient } from '../generated/prisma/index.js';
import { create } from 'superstruct';
import { CreateProductStruct } from '../../struct.js';

const prisma = new PrismaClient();

export async function createProduct(req, res) {
  const data = create(req.body, CreateProductStruct);

  const createdProduct = await prisma.product.create({
    data,
  });

  res.status(201).send(createdProduct);
}
