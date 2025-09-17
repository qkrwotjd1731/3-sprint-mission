import { Router } from 'express';
import { asyncHandler } from '../lib/asyncHandler';
import * as productController from '../controllers/productController';
import { validateCreateProduct, validateUpdateProduct } from '../validators/validateProduct';
import { validateOffsetParams, validateCursorParams } from '../validators/validateQuery';
import { validateCreateComment } from '../validators/validateComment';
import { verifyAccessToken, verifyResourceAuth, optionalAuth } from '../middlewares/auth';
import { ResourceType } from '../types/authTypes';

const productRouter = Router();

productRouter
  .route('/')
  .post(validateCreateProduct, verifyAccessToken, asyncHandler(productController.createProduct))
  .get(optionalAuth, validateOffsetParams, asyncHandler(productController.getProductList));

productRouter
  .route('/:id')
  .get(optionalAuth, asyncHandler(productController.getProduct))
  .patch(
    validateUpdateProduct,
    verifyAccessToken,
    verifyResourceAuth(ResourceType.Product),
    asyncHandler(productController.updateProduct),
  )
  .delete(
    verifyAccessToken,
    verifyResourceAuth(ResourceType.Product),
    asyncHandler(productController.deleteProduct),
  );

productRouter
  .route('/:id/comments')
  .post(validateCreateComment, verifyAccessToken, asyncHandler(productController.createComment))
  .get(validateCursorParams, asyncHandler(productController.getCommentList));

productRouter
  .route('/:id/likes')
  .post(verifyAccessToken, asyncHandler(productController.createLike))
  .delete(verifyAccessToken, asyncHandler(productController.deleteLike));

export default productRouter;
