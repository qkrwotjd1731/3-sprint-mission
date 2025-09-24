import * as UserService from '../services/userService';
import type { RequestHandler } from 'express';
import type { UpdateUserDTO, UpdatePasswordDTO } from '../types/userTypes';
import type { OffsetQueryDto } from '../types/queryTypes';

// 내 정보 조회
export const getMe: RequestHandler = async (req, res) => {
  const id = req.user!.id;

  const user = await UserService.getUser(id);
  res.status(200).json(user);
};

// 내 정보 수정
export const updateMe: RequestHandler = async (req, res) => {
  const id = req.user!.id;
  const data: UpdateUserDTO = req.body;

  const updatedUser = await UserService.updateUser(id, data);
  res.status(200).json(updatedUser);
};

// 비밀번호 변경
export const updatePassword: RequestHandler = async (req, res) => {
  const id = req.user!.id;
  const data: UpdatePasswordDTO = req.body;

  await UserService.updatePassword(id, data);
  res.status(200).json({ message: '비밀번호가 성공적으로 변경되었습니다.' });
};

// 내 상품 목록 조회
export const getMyProductList: RequestHandler = async (req, res) => {
  const userId = req.user!.id;
  const query = req.validatedQuery as OffsetQueryDto;

  const { products, totalCount } = await UserService.getUserProductList(userId, query);

  const nextOffset = products.length === query.limit ? query.offset + products.length : null;

  res.status(200).json({ products, totalCount, nextOffset });
};

// 내 좋아요 상품 목록 조회
export const getMyLikeProductList: RequestHandler = async (req, res) => {
  const userId = req.user!.id;
  const query = req.validatedQuery as OffsetQueryDto;

  const { products, totalCount } = await UserService.getUserLikeProductList(userId, query);

  const nextOffset = products.length === query.limit ? query.offset + products.length : null;

  res.status(200).json({ products, totalCount, nextOffset });
};
