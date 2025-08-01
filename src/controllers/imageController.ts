import cloudinary from '../utils/cloudinary.js';
import type { RequestHandler } from 'express';

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