// 타입 정의
export interface User {
  id: number;
  email: string;
  nickname: string;
  password: string;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// DTO
export type UserResponseDTO = Omit<User, 'password'>;

export interface UpdateUserDTO {
  nickname?: string;
  email?: string;
  image?: string;
}

export interface UpdatePasswordDTO {
  currentPassword: string;
  newPassword: string;
}
