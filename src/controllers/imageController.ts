import cloudinary from '../utils/cloudinary';
import type { RequestHandler } from 'express';

// 이미지 업로드
export const uploadImage: RequestHandler = async (req, res) => {
  const filePath = req.file?.path;

  if (!filePath) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const result = await cloudinary.uploader.upload(filePath, {
     folder: 'sprint_mission'
  });

  return res.json({ imagePath: result.secure_url });
}