import * as authService from '../services/authService';
import type { RequestHandler } from 'express';
import type { CreateUserDTO, LoginDTO } from '../types/authTypes';

// 유저 생성
export const createUser: RequestHandler = async (req, res) => {
  const data: CreateUserDTO = req.body;

  const user = await authService.createUser(data);
  res.status(201).json(user);
};

// 로그인
export const login: RequestHandler = async (req, res) => {
  const data: LoginDTO = req.body;

  const { accessToken, refreshToken } = await authService.login(data);

  res.cookie('refreshToken', refreshToken, {
    path: '/auth/refresh',
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
  });

  res.status(200).json({ accessToken });
};

// 로그아웃
export const logout: RequestHandler = async (req, res) => {
  const id = req.user!.id;

  await authService.logout(id);

  res.clearCookie('refreshToken', {
    path: '/auth/refresh',
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
  });

  res.status(200).json({ message: '로그아웃을 성공했습니다.' });
};

// 토큰 갱신
export const refreshToken: RequestHandler = async (req, res) => {
  const id = req.user!.id;

  const { accessToken, refreshToken } = await authService.refreshToken(id);

  res.cookie('refreshToken', refreshToken, {
    path: '/auth/refresh',
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
  });

  res.status(200).json({ accessToken });
};
