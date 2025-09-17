import { User } from '../generated/prisma';

export enum ResourceType {
  Product = 'product',
  Article = 'article',
  Comment = 'comment',
}

export interface CreateUserDto {
  email: string;
  nickname: string;
  password: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface TokenDto {
  accessToken: string;
  refreshToken: string;
}
