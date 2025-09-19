export enum ResourceType {
  Product = 'product',
  Article = 'article',
  Comment = 'comment',
}

export interface CreateUserDTO {
  email: string;
  nickname: string;
  password: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface TokenDTO {
  accessToken: string;
  refreshToken: string;
}
