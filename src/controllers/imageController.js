import cloudinary from '../utils/cloudinary.js';

export async function uploadImage(req, res) {
  const filePath = req.file.path;

  const result = await cloudinary.uploader.upload(filePath, {
     folder: 'sprint_mission'
  });

  return res.json({ imagePath: result.secure_url });
}