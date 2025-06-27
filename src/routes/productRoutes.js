import express from 'express';
import { asyncHandler } from '../lib/asyncHandler.js';
import { createProduct } from '../controllers/productController.js';

const productRouter = express.Router();

productRouter.route('/')
  .post(asyncHandler(createProduct));

export default productRouter;
