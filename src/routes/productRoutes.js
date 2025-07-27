import express from 'express';
import { asyncHandler } from '../lib/asyncHandler.js';
import * as productController from '../controllers/productController.js';
import { validateCreateProduct, validateUpdateProduct } from '../validators/validateProduct.js';
import { validateOffsetParams, validateCursorParams } from '../validators/validateQuery.js';
import { validateCreateComment } from '../validators/validateComment.js';
import { verifyAccessToken, verifyResourceAuth } from '../middlewares/auth.js';

const productRouter = express.Router();

productRouter.route('/')
  .post(validateCreateProduct, verifyAccessToken, asyncHandler(productController.createProduct))
  .get(validateOffsetParams, asyncHandler(productController.getProductList));

productRouter.route('/:id')
  .get(asyncHandler(productController.getProduct))
  .patch(validateUpdateProduct, verifyAccessToken, verifyResourceAuth('product'), asyncHandler(productController.updateProduct))
  .delete(verifyAccessToken, verifyResourceAuth('product'), asyncHandler(productController.deleteProduct));

productRouter.route('/:id/comments')
  .post(validateCreateComment, verifyAccessToken, asyncHandler(productController.createComment))
  .get(validateCursorParams, asyncHandler(productController.getCommentList));

productRouter.route('/:id/likes')
  .post(verifyAccessToken, asyncHandler(productController.createLike))
  .delete(verifyAccessToken, asyncHandler(productController.deleteLike));
  
export default productRouter;
