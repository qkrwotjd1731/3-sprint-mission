import { PrismaClient } from '../src/generated/prisma/index.js';
import { PRODUCTS, ARTICLE, COMMENT } from './mock.js';

const prisma = new PrismaClient();

async function main() {
  await prisma.product.deleteMany();
  await prisma.article.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.user.deleteMany();
  await prisma.like.deleteMany();

  await prisma.$executeRaw`TRUNCATE TABLE "Product", "Article", "Comment", "User", "Like" RESTART IDENTITY CASCADE`;

  await prisma.product.createMany({
    data: PRODUCTS,
    skipDuplicates: true,
  });

  await prisma.article.createMany({
    data: ARTICLE,
    skipDuplicates: true,
  });

  await prisma.comment.createMany({
    data: COMMENT,
    skipDuplicates: true,
  });

  await prisma.user.createMany({
    data: USER,
    skipDuplicates: true,
  });

  await prisma.like.createMany({
    data: LIKES, 
    skipDuplicates: true,
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (err) => {
    console.error(err);
    await prisma.$disconnect();
    process.exit(1);
  });