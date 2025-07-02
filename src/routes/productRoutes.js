import express from 'express';
import { asyncHandler } from '../lib/asyncHandler.js';
import * as productController from '../controllers/productController.js';
import { validateCreateProduct, validateUpdateProduct } from '../middlewares/validateProduct.js';
import { validateCreateComment } from '../middlewares/validateComment.js';

const productRouter = express.Router();

productRouter.route('/')
  .post(validateCreateProduct, asyncHandler(productController.createProduct))
  .get(asyncHandler(productController.getProductList));

productRouter.route('/:id')
  .get(asyncHandler(productController.getProduct))
  .patch(validateUpdateProduct, asyncHandler(productController.updateProduct))
  .delete(asyncHandler(productController.deleteProduct));

productRouter.route('/:id/comments')
  .post(validateCreateComment, asyncHandler(productController.createComment))
  .get(asyncHandler(productController.getCommentList));
  
export default productRouter;
