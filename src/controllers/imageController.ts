import { uploadToS3 } from '../utils/s3';
import type { RequestHandler } from 'express';

// 이미지 업로드
export const uploadImage: RequestHandler = async (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).json({ error: '파일이 없습니다.' });
  }

  const result = await uploadToS3(file.buffer, file.originalname, {
    folder: 'sprint_mission',
    contentType: file.mimetype,
  });

  return res.status(200).json({ imagePath: result.url });
};
