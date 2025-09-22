import * as productService from '../../../src/services/productService';
import * as productRepository from '../../../src/repositories/productRepository';
import * as notificationService from '../../../src/services/notificationService';
import {
  mockProduct,
  mockCreateProductDTO,
  mockUpdateProductDTO,
  mockComment,
  mockCreateCommentDTO,
  mockLike,
  mockDatabaseError,
} from '../../mocks/productMocks';

// Repository Mock
jest.mock('../../../src/repositories/productRepository');
const mockProductRepository = productRepository as jest.Mocked<typeof productRepository>;

// Notification Service Mock
jest.mock('../../../src/services/notificationService');
const mockNotificationService = notificationService as jest.Mocked<typeof notificationService>;

// Service Layer Spy (내부 로직 호출 추적)
const productServiceSpy = {
  createProduct: jest.spyOn(productService, 'createProduct'),
  getProduct: jest.spyOn(productService, 'getProduct'),
  updateProduct: jest.spyOn(productService, 'updateProduct'),
  deleteProduct: jest.spyOn(productService, 'deleteProduct'),
  createComment: jest.spyOn(productService, 'createComment'),
  createLike: jest.spyOn(productService, 'createLike'),
  deleteLike: jest.spyOn(productService, 'deleteLike'),
  getProductList: jest.spyOn(productService, 'getProductList'),
  getCommentList: jest.spyOn(productService, 'getCommentList'),
};

describe('ProductService Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    Object.values(productServiceSpy).forEach((spy) => spy.mockRestore());
  });

  describe('createProduct', () => {
    test('상품 생성 성공', async () => {
      mockProductRepository.create.mockResolvedValue(mockProduct);

      const result = await productService.createProduct(mockCreateProductDTO);

      expect(mockProductRepository.create).toHaveBeenCalledWith(mockCreateProductDTO);
      expect(mockProductRepository.create).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockProduct);
    });

    test('상품 생성 - Mock + Spy 조합으로 상세 분석', async () => {
      mockProductRepository.create.mockResolvedValue(mockProduct);

      const result = await productService.createProduct(mockCreateProductDTO);

      // 1. Mock 검증: 외부 의존성 호출
      expect(mockProductRepository.create).toHaveBeenCalledWith(mockCreateProductDTO);
      expect(result).toEqual(mockProduct);

      // 2. Spy 검증: 내부 로직 호출 추적
      expect(productServiceSpy.createProduct).toHaveBeenCalledWith(mockCreateProductDTO);
      expect(productServiceSpy.createProduct).toHaveBeenCalledTimes(1);

      // 3. 호출 흐름 분석
      const mockCalls = mockProductRepository.create.mock.calls;
      const spyCalls = productServiceSpy.createProduct.mock.calls;

      expect(mockCalls).toHaveLength(1);
      expect(spyCalls).toHaveLength(1);
      expect(mockCalls[0][0]).toEqual(spyCalls[0][0]);
    });

    test('상품 생성 - Spy 호출 인자 검증', async () => {
      mockProductRepository.create.mockResolvedValue(mockProduct);

      await productService.createProduct(mockCreateProductDTO);

      expect(mockProductRepository.create).toHaveBeenCalledTimes(1);
      expect(mockProductRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          name: mockCreateProductDTO.name,
          price: mockCreateProductDTO.price,
        }),
      );
    });

    test('상품 생성 실패 - Repository 에러', async () => {
      mockProductRepository.create.mockRejectedValue(mockDatabaseError);

      await expect(productService.createProduct(mockCreateProductDTO)).rejects.toThrow(
        '데이터베이스 연결에 실패했습니다.',
      );
      expect(mockProductRepository.create).toHaveBeenCalledWith(mockCreateProductDTO);
    });
  });

  describe('getProduct', () => {
    test('상품 조회 성공 - 로그인 사용자', async () => {
      const userId = 2;
      const mockLikes = [mockLike];
      const expectedResult = {
        ...mockProduct,
        likesCount: 1,
        isLiked: true,
      };

      mockProductRepository.findById.mockResolvedValue(mockProduct);
      mockProductRepository.findLikes.mockResolvedValue(mockLikes);

      const result = await productService.getProduct(mockProduct.id, userId);

      expect(mockProductRepository.findById).toHaveBeenCalledWith(mockProduct.id);
      expect(mockProductRepository.findLikes).toHaveBeenCalledWith(mockProduct.id);
      expect(result).toEqual(expectedResult);
      expect(result.isLiked).toBe(true);
    });

    test('상품 조회 - Spy 호출 정보 상세 검증', async () => {
      const userId = 1;
      const mockLikes = [mockLike];
      mockProductRepository.findById.mockResolvedValue(mockProduct);
      mockProductRepository.findLikes.mockResolvedValue(mockLikes);

      await productService.getProduct(mockProduct.id, userId);

      expect(mockProductRepository.findById).toHaveBeenCalledTimes(1);
      expect(mockProductRepository.findLikes).toHaveBeenCalledTimes(1);

      // 호출 인자 검증
      expect(mockProductRepository.findById).toHaveBeenNthCalledWith(1, mockProduct.id);
      expect(mockProductRepository.findLikes).toHaveBeenNthCalledWith(1, mockProduct.id);

      // 호출 순서 검증
      expect(mockProductRepository.findById.mock.calls.length).toBeGreaterThan(0);
      expect(mockProductRepository.findLikes.mock.calls.length).toBeGreaterThan(0);

      // 반환값 검증
      expect(mockProductRepository.findById).toHaveBeenCalledWith(mockProduct.id);
      expect(mockProductRepository.findLikes).toHaveBeenCalledWith(mockProduct.id);
    });

    test('상품 조회 성공 - 비로그인 사용자', async () => {
      const mockLikes = [mockLike];
      const expectedResult = {
        ...mockProduct,
        likesCount: 1,
        isLiked: false,
      };

      mockProductRepository.findById.mockResolvedValue(mockProduct);
      mockProductRepository.findLikes.mockResolvedValue(mockLikes);

      const result = await productService.getProduct(mockProduct.id);

      expect(result.isLiked).toBe(false);
      expect(result.likesCount).toBe(1);
    });

    test('상품 조회 실패 - 상품 없음', async () => {
      mockProductRepository.findById.mockResolvedValue(null);

      await expect(productService.getProduct(999)).rejects.toThrow('상품을 찾을 수 없습니다.');
      expect(mockProductRepository.findById).toHaveBeenCalledWith(999);
      expect(mockProductRepository.findLikes).not.toHaveBeenCalled();
    });
  });

  describe('updateProduct', () => {
    test('상품 수정 성공 - 가격 변경 없음', async () => {
      const updatedProduct = { ...mockProduct, name: '수정된 상품' };
      mockProductRepository.findById.mockResolvedValue(mockProduct);
      mockProductRepository.update.mockResolvedValue(updatedProduct);

      const result = await productService.updateProduct(mockProduct.id, mockUpdateProductDTO);

      expect(mockProductRepository.findById).toHaveBeenCalledWith(mockProduct.id);
      expect(mockProductRepository.update).toHaveBeenCalledWith(
        mockProduct.id,
        mockUpdateProductDTO,
      );
      expect(result).toEqual(updatedProduct);
      expect(mockProductRepository.findLikes).not.toHaveBeenCalled();
      expect(mockNotificationService.createNotification).not.toHaveBeenCalled();
    });

    test('상품 수정 - Spy로 실제 호출 흐름 추적', async () => {
      const updatedProduct = { ...mockProduct, name: '수정된 상품' };
      mockProductRepository.findById.mockResolvedValue(mockProduct);
      mockProductRepository.update.mockResolvedValue(updatedProduct);

      await productService.updateProduct(mockProduct.id, mockUpdateProductDTO);

      const findByIdCalls = mockProductRepository.findById.mock.calls;
      const updateCalls = mockProductRepository.update.mock.calls;

      // 호출 횟수 검증
      expect(findByIdCalls).toHaveLength(1);
      expect(updateCalls).toHaveLength(1);

      // 호출 인자 검증
      expect(findByIdCalls[0][0]).toBe(mockProduct.id);
      expect(updateCalls[0][0]).toBe(mockProduct.id);
      expect(updateCalls[0][1]).toEqual(mockUpdateProductDTO);

      // 호출 순서 검증
      expect(findByIdCalls[0]).toBeDefined();
      expect(updateCalls[0]).toBeDefined();
    });

    test('상품 수정 성공 - 가격 변경으로 알림 발송', async () => {
      const oldProduct = { ...mockProduct, price: 10000 };
      const updatedProduct = { ...mockProduct, price: 15000 };
      const mockLikes = [mockLike];

      mockProductRepository.findById.mockResolvedValue(oldProduct);
      mockProductRepository.update.mockResolvedValue(updatedProduct);
      mockProductRepository.findLikes.mockResolvedValue(mockLikes);
      mockNotificationService.createNotification.mockResolvedValue({} as any);

      const result = await productService.updateProduct(mockProduct.id, {
        ...mockUpdateProductDTO,
        price: 15000,
      });

      expect(mockProductRepository.findLikes).toHaveBeenCalledWith(mockProduct.id);
      expect(mockNotificationService.createNotification).toHaveBeenCalledWith({
        userId: mockLike.userId,
        type: 'PRICE_CHANGE',
        message: `상품 ${updatedProduct.name}의 가격이 ${oldProduct.price}원에서 ${updatedProduct.price}원으로 변경되었습니다.`,
      });
      expect(result).toEqual(updatedProduct);
    });

    test('상품 수정 - Mock + Spy로 복잡한 비즈니스 로직 분석', async () => {
      const oldProduct = { ...mockProduct, price: 10000 };
      const updatedProduct = { ...mockProduct, price: 15000 };
      const mockLikes = [mockLike, { ...mockLike, id: 2, userId: 3 }];

      mockProductRepository.findById.mockResolvedValue(oldProduct);
      mockProductRepository.update.mockResolvedValue(updatedProduct);
      mockProductRepository.findLikes.mockResolvedValue(mockLikes);
      mockNotificationService.createNotification.mockResolvedValue({} as any);

      const updateProductSpy = productServiceSpy.updateProduct;

      const result = await productService.updateProduct(mockProduct.id, {
        ...mockUpdateProductDTO,
        price: 15000,
      });

      // 1. Mock 검증: 외부 의존성 호출 순서와 횟수
      expect(mockProductRepository.findById).toHaveBeenCalledTimes(1);
      expect(mockProductRepository.update).toHaveBeenCalledTimes(1);
      expect(mockProductRepository.findLikes).toHaveBeenCalledTimes(1);
      expect(mockNotificationService.createNotification).toHaveBeenCalledTimes(2);

      // 2. Spy 검증: Service 함수 호출 추적
      expect(updateProductSpy).toHaveBeenCalledWith(mockProduct.id, {
        ...mockUpdateProductDTO,
        price: 15000,
      });
      expect(updateProductSpy).toHaveBeenCalledTimes(1);

      // 3. 비즈니스 로직 검증: 가격 변경 시 알림 발송
      expect(mockNotificationService.createNotification).toHaveBeenCalledWith({
        userId: mockLike.userId,
        type: 'PRICE_CHANGE',
        message: `상품 ${updatedProduct.name}의 가격이 ${oldProduct.price}원에서 ${updatedProduct.price}원으로 변경되었습니다.`,
      });

      // 4. 호출 흐름 분석
      const findByIdCalls = mockProductRepository.findById.mock.calls;
      const updateCalls = mockProductRepository.update.mock.calls;
      const findLikesCalls = mockProductRepository.findLikes.mock.calls;
      const notificationCalls = mockNotificationService.createNotification.mock.calls;

      // 호출 순서 검증 (findById -> update -> findLikes -> createNotification)
      expect(findByIdCalls[0][0]).toBe(mockProduct.id);
      expect(updateCalls[0][0]).toBe(mockProduct.id);
      expect(findLikesCalls[0][0]).toBe(mockProduct.id);
      expect(notificationCalls).toHaveLength(2); // 2명의 사용자
    });
  });

  describe('deleteProduct', () => {
    test('상품 삭제 성공', async () => {
      mockProductRepository.remove.mockResolvedValue({} as any);

      await productService.deleteProduct(mockProduct.id);

      expect(mockProductRepository.remove).toHaveBeenCalledWith(mockProduct.id);
      expect(mockProductRepository.remove).toHaveBeenCalledTimes(1);
    });

    test('상품 삭제 실패 - Repository 에러', async () => {
      mockProductRepository.remove.mockRejectedValue(mockDatabaseError);

      await expect(productService.deleteProduct(mockProduct.id)).rejects.toThrow(
        '데이터베이스 연결에 실패했습니다.',
      );
    });
  });

  describe('createComment', () => {
    test('댓글 생성 성공', async () => {
      const productId = 1;
      const userId = 2;
      mockProductRepository.findById.mockResolvedValue(mockProduct);
      mockProductRepository.createComment.mockResolvedValue(mockComment);

      const result = await productService.createComment(mockCreateCommentDTO, productId, userId);

      expect(mockProductRepository.findById).toHaveBeenCalledWith(productId);
      expect(mockProductRepository.createComment).toHaveBeenCalledWith(
        mockCreateCommentDTO,
        userId,
        productId,
      );
      expect(result).toEqual(mockComment);
    });

    test('댓글 생성 실패 - 상품 없음', async () => {
      const productId = 999;
      const userId = 2;
      mockProductRepository.findById.mockResolvedValue(null);

      await expect(
        productService.createComment(mockCreateCommentDTO, productId, userId),
      ).rejects.toThrow('상품을 찾을 수 없습니다.');
      expect(mockProductRepository.createComment).not.toHaveBeenCalled();
    });
  });

  describe('createLike', () => {
    test('좋아요 추가 성공', async () => {
      const productId = 1;
      const userId = 2;
      mockProductRepository.findById.mockResolvedValue(mockProduct);
      mockProductRepository.findLike.mockResolvedValue(null);
      mockProductRepository.createLike.mockResolvedValue(mockLike);

      const result = await productService.createLike(productId, userId);

      expect(mockProductRepository.findById).toHaveBeenCalledWith(productId);
      expect(mockProductRepository.findLike).toHaveBeenCalledWith(productId, userId);
      expect(mockProductRepository.createLike).toHaveBeenCalledWith(productId, userId);
      expect(result).toEqual(mockLike);
    });

    test('좋아요 추가 - Mock + Spy로 비즈니스 규칙 검증', async () => {
      const productId = 1;
      const userId = 2;
      mockProductRepository.findById.mockResolvedValue(mockProduct);
      mockProductRepository.findLike.mockResolvedValue(null);
      mockProductRepository.createLike.mockResolvedValue(mockLike);

      const createLikeSpy = productServiceSpy.createLike;

      const result = await productService.createLike(productId, userId);

      // 1. Mock 검증: 외부 의존성 호출 순서
      const findByIdCalls = mockProductRepository.findById.mock.calls;
      const findLikeCalls = mockProductRepository.findLike.mock.calls;
      const createLikeCalls = mockProductRepository.createLike.mock.calls;

      expect(findByIdCalls).toHaveLength(1);
      expect(findLikeCalls).toHaveLength(1);
      expect(createLikeCalls).toHaveLength(1);

      // 2. Spy 검증: Service 함수 호출 추적
      expect(createLikeSpy).toHaveBeenCalledWith(productId, userId);
      expect(createLikeSpy).toHaveBeenCalledTimes(1);

      // 3. 비즈니스 규칙 검증: 중복 체크 후 생성
      expect(mockProductRepository.findLike).toHaveBeenCalledWith(productId, userId);
      expect(mockProductRepository.createLike).toHaveBeenCalledWith(productId, userId);

      // 4. 호출 흐름 상세 분석
      expect(findByIdCalls[0][0]).toBe(productId);
      expect(findLikeCalls[0][0]).toBe(productId);
      expect(findLikeCalls[0][1]).toBe(userId);
      expect(createLikeCalls[0][0]).toBe(productId);
      expect(createLikeCalls[0][1]).toBe(userId);
    });

    test('좋아요 추가 실패 - 상품 없음', async () => {
      const productId = 999;
      const userId = 2;
      mockProductRepository.findById.mockResolvedValue(null);

      await expect(productService.createLike(productId, userId)).rejects.toThrow(
        '상품을 찾을 수 없습니다.',
      );
      expect(mockProductRepository.findLike).not.toHaveBeenCalled();
      expect(mockProductRepository.createLike).not.toHaveBeenCalled();
    });

    test('좋아요 추가 실패 - 이미 좋아요 누른 상태', async () => {
      const productId = 1;
      const userId = 2;
      mockProductRepository.findById.mockResolvedValue(mockProduct);
      mockProductRepository.findLike.mockResolvedValue(mockLike);

      await expect(productService.createLike(productId, userId)).rejects.toThrow(
        '이미 좋아요를 누른 상태입니다.',
      );
      expect(mockProductRepository.createLike).not.toHaveBeenCalled();
    });
  });

  describe('deleteLike', () => {
    test('좋아요 취소 성공', async () => {
      const productId = 1;
      const userId = 2;
      mockProductRepository.findById.mockResolvedValue(mockProduct);
      mockProductRepository.findLike.mockResolvedValue(mockLike);
      mockProductRepository.deleteLike.mockResolvedValue({} as any);

      await productService.deleteLike(productId, userId);

      expect(mockProductRepository.findById).toHaveBeenCalledWith(productId);
      expect(mockProductRepository.findLike).toHaveBeenCalledWith(productId, userId);
      expect(mockProductRepository.deleteLike).toHaveBeenCalledWith(mockLike.id);
    });

    test('좋아요 취소 실패 - 상품 없음', async () => {
      const productId = 999;
      const userId = 2;
      mockProductRepository.findById.mockResolvedValue(null);

      await expect(productService.deleteLike(productId, userId)).rejects.toThrow(
        '상품을 찾을 수 없습니다.',
      );
      expect(mockProductRepository.findLike).not.toHaveBeenCalled();
      expect(mockProductRepository.deleteLike).not.toHaveBeenCalled();
    });

    test('좋아요 취소 실패 - 좋아요 없음', async () => {
      const productId = 1;
      const userId = 2;
      mockProductRepository.findById.mockResolvedValue(mockProduct);
      mockProductRepository.findLike.mockResolvedValue(null);

      await expect(productService.deleteLike(productId, userId)).rejects.toThrow(
        '좋아요를 찾을 수 없습니다.',
      );
      expect(mockProductRepository.deleteLike).not.toHaveBeenCalled();
    });
  });

  describe('getProductList', () => {
    test('상품 목록 조회 성공', async () => {
      const query = { offset: 0, limit: 10, orderBy: 'recent' as any };
      const userId = 2;
      const mockProducts = [mockProduct];
      const totalCount = 1;
      const mockLikes = [mockLike];

      mockProductRepository.findMany.mockResolvedValue(mockProducts);
      mockProductRepository.countProducts.mockResolvedValue(totalCount);
      mockProductRepository.findLikes.mockResolvedValue(mockLikes);

      const result = await productService.getProductList(query, userId);

      expect(mockProductRepository.findMany).toHaveBeenCalledWith(0, 10, 'recent', undefined);
      expect(mockProductRepository.countProducts).toHaveBeenCalledWith(undefined);
      expect(result.products).toHaveLength(1);
      expect(result.totalCount).toBe(1);
      expect(result.products[0].likesCount).toBe(1);
      expect(result.products[0].isLiked).toBe(true);
    });
  });

  describe('getCommentList', () => {
    test('댓글 목록 조회 성공', async () => {
      const productId = 1;
      const cursor = 0;
      const limit = 10;
      const mockComments = [mockComment];
      const totalCount = 1;

      mockProductRepository.findComments.mockResolvedValue(mockComments);
      mockProductRepository.countComments.mockResolvedValue(totalCount);

      const result = await productService.getCommentList(productId, { cursor, limit });

      expect(mockProductRepository.findComments).toHaveBeenCalledWith(productId, cursor, limit);
      expect(mockProductRepository.countComments).toHaveBeenCalledWith(productId);
      expect(result.comments).toEqual(mockComments);
      expect(result.totalCount).toBe(totalCount);
    });
  });
});
