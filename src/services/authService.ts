import bcrypt from 'bcrypt';
import * as authRepository from '../repositories/authRepository';
import { HttpError } from '../utils/httpError';
import { createToken, filterSensitiveUserData } from '../utils/userUtils';
import type { CreateUserDto, LoginDto, TokenDto } from '../types/authTypes';
import type { UserResponseDto } from '../types/userTypes';

// 유저 생성
export const createUser = async (data: CreateUserDto): Promise<UserResponseDto> => {
  const { email, nickname, password } = data;
  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await authRepository.findByEmail(email);
  if (existingUser) throw new HttpError('User already exists', 422, { email });

  const user = await authRepository.create(email, nickname, hashedPassword);
  return filterSensitiveUserData(user);
}

// 로그인
export const login = async (data: LoginDto): Promise<TokenDto> => {
  const { email, password } = data;
  const user = await authRepository.findByEmail(email);
  if (!user) throw new HttpError('User not found', 404);

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new HttpError('Unauthorized', 401);
  
  const accessToken = createToken(user);
  const refreshToken = createToken(user, 'refresh');

  await authRepository.saveRefreshToken(user.id, refreshToken);

  return { accessToken, refreshToken };
}

// 로그아웃
export const logout = async (id: number): Promise<void> => {
  const user = await authRepository.findById(id);
  if (!user) throw new HttpError('User not found', 404);

  if (!user.refreshToken) throw new HttpError('Already logged out', 401);

  await authRepository.clearRefreshToken(id);
}

// 토큰 갱신
export const refreshToken = async (id: number): Promise<TokenDto> => {
  const user = await authRepository.findById(id);
  if (!user) throw new HttpError('User not found', 404);

  const accessToken = createToken(user);
  const newRefreshToken = createToken(user, 'refresh');

  await authRepository.saveRefreshToken(id, newRefreshToken);

  return { accessToken, refreshToken: newRefreshToken };
}