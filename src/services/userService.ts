import bcrypt from 'bcrypt';
import * as userRepository from '../repositories/userRepository';
import { findLikes } from '../repositories/productRepository';
import { HttpError } from '../utils/httpError';
import { filterSensitiveUserData } from '../utils/userUtils';
import type { UserResponseDto, UpdateUserDto, UpdatePasswordDto } from '../types/userTypes';
import type { ProductWithLikesDto } from '../types/productTypes';
import type { OffsetQueryDto } from '../types/queryTypes';

// 유저 조회
export const getUser = async (id: number): Promise<UserResponseDto> => {
  const user = await userRepository.findById(id);
  if (!user) throw new HttpError('User not found', 404);
  return filterSensitiveUserData(user);
};

// 유저 수정
export const updateUser = async (id: number, data: UpdateUserDto): Promise<UserResponseDto> => {
  const updatedUser = await userRepository.updateUser(id, data);
  return filterSensitiveUserData(updatedUser);
};

// 비밀번호 변경
export const updatePassword = async (id: number, data: UpdatePasswordDto): Promise<void> => {
  const { currentPassword, newPassword } = data;

  const user = await userRepository.findById(id);
  if (!user) throw new HttpError('User not found', 404);

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) throw new HttpError('Unauthorized', 401);

  const hashedNewPassword = await bcrypt.hash(newPassword, 10);
  await userRepository.updatePassword(id, hashedNewPassword);
};

// 유저 상품 목록 조회
export const getUserProductList = async (
  userId: number,
  query: OffsetQueryDto,
): Promise<{
  products: ProductWithLikesDto[];
  totalCount: number;
}> => {
  const { offset, limit, orderBy, keyword } = query;

  const [products, totalCount] = await Promise.all([
    userRepository.findProducts(userId, offset, limit, orderBy, keyword),
    userRepository.countProducts(userId, keyword),
  ]);

  const productsWithLikes = await Promise.all(
    products.map(async (product) => {
      const likes = await findLikes(product.id);
      return {
        ...product,
        likesCount: likes.length,
        isLiked: likes.some((like) => like.userId === userId),
      };
    }),
  );

  return { products: productsWithLikes, totalCount };
};

// 유저 좋아요 상품 목록 조회
export const getUserLikeProductList = async (
  userId: number,
  query: OffsetQueryDto,
): Promise<{
  products: ProductWithLikesDto[];
  totalCount: number;
}> => {
  const { offset, limit, orderBy, keyword } = query;

  const [products, totalCount] = await Promise.all([
    userRepository.findLikeProducts(userId, offset, limit, orderBy, keyword),
    userRepository.countLikeProducts(userId, keyword),
  ]);

  const productsWithLikes = await Promise.all(
    products.map(async (product) => {
      const likes = await findLikes(product.id);
      return {
        ...product,
        likesCount: likes.length,
        isLiked: true,
      };
    }),
  );

  return { products: productsWithLikes, totalCount };
};
