import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure upload directories exist
const uploadDir = process.env.UPLOAD_PATH || './uploads';
const dirs = ['images', 'documents', 'certificates', 'lab-results'];

dirs.forEach(dir => {
  const fullPath = path.join(uploadDir, dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }
});

// Storage configuration
const storage = multer.diskStorage({
  destination: (_req, file, cb) => {
    let folder = 'documents';
    
    if (file.mimetype.startsWith('image/')) {
      folder = 'images';
    }
    
    if (file.fieldname === 'certificate') {
      folder = 'certificates';
    }
    
    if (file.fieldname === 'labImage' || file.fieldname === 'labResult') {
      folder = 'lab-results';
    }

    cb(null, path.join(uploadDir, folder));
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

// File filter
const fileFilter = (_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, GIF, PDF, and DOC files are allowed.'));
  }
};

// Multer configuration
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760'), // 10MB default
  },
});
