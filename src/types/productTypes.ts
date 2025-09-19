// 타입 정의
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  tags: string[];
  userId: number;
  createdAt: Date;
  updatedAt: Date;
}

// DTO
export type CreateProductDTO = Omit<Product, 'id' | 'createdAt' | 'updatedAt'>;

export type UpdateProductDTO = Partial<CreateProductDTO> & { userId: number };

export interface ProductWithLikesDTO extends Product {
  likesCount: number;
  isLiked: boolean;
}
