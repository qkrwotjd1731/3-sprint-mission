import { Router } from 'express';
import multer from 'multer';
import { asyncHandler } from '../lib/asyncHandler';
import { uploadImage } from '../controllers/imageController'

const imageRouter = Router();

const upload = multer({ dest: 'uploads/'});

imageRouter.post('/', upload.single('image'), asyncHandler(uploadImage));

export default imageRouter;