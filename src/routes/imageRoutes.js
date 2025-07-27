import express from 'express';
import multer from 'multer';
import { asyncHandler } from '../lib/asyncHandler.js';
import { uploadImage } from '../controllers/imageController.js'

const imageRouter = express.Router();

const upload = multer({ dest: 'uploads/'});

imageRouter.post('/', upload.single('image'), asyncHandler(uploadImage));

export default imageRouter;