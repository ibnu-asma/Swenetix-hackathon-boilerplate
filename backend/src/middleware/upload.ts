import multer from 'multer';
import path from 'path';
import { Request } from 'express';

// 1. Configure where and how files are stored
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, 'uploads/'); // Make sure to manually create an 'uploads' folder in your project root!
  },
  filename: (_req, file, cb) => {
    // Generates a unique name: unique-timestamp.jpg
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

// 2. Filter files to ensure they are images only
const fileFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images are allowed!') as any, false);
  }
};

export const upload = multer({ 
  storage, 
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 } // Limits file size to 2MB
});
