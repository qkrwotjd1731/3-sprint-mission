import { Router } from 'express';
import multer from 'multer';
import { asyncHandler } from '../lib/asyncHandler';
import { uploadImage } from '../controllers/imageController';

const imageRouter = Router();

// 메모리 스토리지 사용 (파일을 디스크에 저장하지 않음)
const upload = multer({ storage: multer.memoryStorage() });

imageRouter.post('/', upload.single('image'), asyncHandler(uploadImage));

export default imageRouter;
