import { User } from '../generated/prisma';

export type UserResponseDto = Omit<User, 'password' | 'refreshToken'>;

export interface UpdateUserDto {
  name?: string;
  email?: string;
  image?: string;
}

export interface UpdatePasswordDto {
  currentPassword: string;
  newPassword: string;
}