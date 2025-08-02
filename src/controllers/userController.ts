import * as UserService from '../services/userService';
import type { RequestHandler } from 'express';
import { UpdateUserDto, UpdatePasswordDto } from '../types/userTypes';
import { OffsetQueryDto } from '../types/queryTypes';

export const getMe: RequestHandler = async (req, res) => {
  const id = req.user!.id;

  const user = await UserService.getUser(id);
  res.status(200).json(user);
}

export const updateMe: RequestHandler = async (req, res) => {
  const id = req.user!.id;
  const data: UpdateUserDto = req.body;

  const updatedUser = await UserService.updateUser(id, data);
  res.status(200).json(updatedUser);
}

export const updatePassword: RequestHandler = async (req, res) => {
  const id = req.user!.id;
  const data: UpdatePasswordDto = req.body;

  await UserService.updatePassword(id, data);
  res.status(200).json({ message: 'Password updated successfully' });
}

export const getMyProductList: RequestHandler = async (req, res) => {
  const userId = req.user!.id;
  const query: OffsetQueryDto = req.validatedQuery;

  const { products, totalCount } = await UserService.getUserProductList(userId, query);

  const nextOffset = products.length === query.limit
    ? query.offset + products.length 
    : null;

  res.status(200).json({ products, totalCount, nextOffset });
}

export const getMyLikeList: RequestHandler = async (req, res) => {
  const userId = req.user!.id;
  const query: OffsetQueryDto = req.validatedQuery;

  const { products, totalCount } = await UserService.getUserLikeList(userId, query);

  const nextOffset = products.length === query.limit
    ? query.offset + products.length 
    : null;

  res.status(200).json({ products, totalCount, nextOffset });
}