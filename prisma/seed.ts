import { prisma } from '../src/lib/prisma';
import { PRODUCTS, ARTICLES, COMMENTS, USERS, LIKES } from './mock';
import bcrypt from 'bcrypt';

const seed = async () => {
  await prisma.like.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.article.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  await prisma.$executeRaw`TRUNCATE TABLE "Like", "Comment", "Article", "Product", "User" RESTART IDENTITY CASCADE`;

  const hashedUsers = await Promise.all(
    USERS.map(async (user) => ({
      ...user,
      password: await bcrypt.hash(user.password, 10),
    })),
  );

  await prisma.user.createMany({
    data: hashedUsers,
    skipDuplicates: true,
  });

  await prisma.product.createMany({
    data: PRODUCTS,
    skipDuplicates: true,
  });

  await prisma.article.createMany({
    data: ARTICLES,
    skipDuplicates: true,
  });

  await prisma.comment.createMany({
    data: COMMENTS,
    skipDuplicates: true,
  });

  await prisma.like.createMany({
    data: LIKES,
    skipDuplicates: true,
  });
};

seed()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (err) => {
    console.error(err);
    await prisma.$disconnect();
    process.exit(1);
  });

export default seed;
