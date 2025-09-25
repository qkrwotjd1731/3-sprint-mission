// 타입 정의
export interface User {
  id: number;
  email: string;
  nickname: string;
  password: string;
  refreshToken: string | null;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// DTO
export type UserResponseDTO = Omit<User, 'password' | 'refreshToken'>;

export interface UpdateUserDTO {
  nickname?: string;
  email?: string;
  image?: string;
}

export interface UpdatePasswordDTO {
  currentPassword: string;
  newPassword: string;
}
