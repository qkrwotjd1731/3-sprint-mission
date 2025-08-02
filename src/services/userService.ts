import bcrypt from 'bcrypt';
import * as UserRepository from '../repositories/userRepository';
import { findLikes } from '../repositories/productRepository';
import { HttpError } from '../utils/httpError';
import { filterSensitiveUserData } from '../utils/userUtils';
import { UserResponseDto, UpdateUserDto, UpdatePasswordDto } from '../types/userTypes';
import { ProductWithLikesDto } from '../types/productTypes';
import { OffsetQueryDto } from '../types/queryTypes';

export const getUser = async (id: number): Promise<UserResponseDto> => {
  const user = await UserRepository.findById(id);
  if (!user) throw new HttpError('User not found', 404);
  return filterSensitiveUserData(user);
}

export const updateUser = async (id: number, data: UpdateUserDto): Promise<UserResponseDto> => {
  const updatedUser = await UserRepository.updateUser(id, data);
  return filterSensitiveUserData(updatedUser);
}

export const updatePassword = async (id: number, data: UpdatePasswordDto): Promise<void> => {
  const { currentPassword, newPassword } = data;

  const user = await UserRepository.findById(id);
  if (!user) throw new HttpError('User not found', 404);

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) throw new HttpError('Unauthorized', 401);

  const hashedNewPassword = await bcrypt.hash(newPassword, 10);
  await UserRepository.updatePassword(id, hashedNewPassword);
}

export const getUserProductList = async (userId: number, query: OffsetQueryDto): Promise<{
  products: ProductWithLikesDto[];
  totalCount: number;
}> => {
  const { offset, limit, orderBy, keyword } = query;

  const [products, totalCount] = await Promise.all([
    UserRepository.findProducts(userId, offset, limit, orderBy, keyword),
    UserRepository.countProducts(userId, keyword)
  ]);

  const productsWithLikes = await Promise.all(products.map(async (product) => {
    const likes = await findLikes(product.id);
    return {
      ...product,
      likesCount: likes.length,
      isLiked: product.userId ? likes.some((like) => like.userId === product.userId) : false,
    };
  }));

  return { products: productsWithLikes, totalCount };
}

export const getUserLikeList = async (userId: number, query: OffsetQueryDto): Promise<{
  products: ProductWithLikesDto[];
  totalCount: number;
}> => {
  const { offset, limit, orderBy, keyword } = query;

  const [products, totalCount] = await Promise.all([
    UserRepository.findLikeProducts(userId, offset, limit, orderBy, keyword),
    UserRepository.countLikeProducts(userId, keyword)
  ]);

  const productsWithLikes = await Promise.all(products.map(async (product) => {
    const likes = await findLikes(product.id);
    return {
      ...product,
      likesCount: likes.length,
      isLiked: true,
    };
  }));

  return { products: productsWithLikes, totalCount };
}