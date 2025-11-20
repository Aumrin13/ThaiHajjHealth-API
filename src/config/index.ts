import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 4000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Database
  databaseUrl: process.env.DATABASE_URL,
  
  // JWT
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET || 'your-access-secret-key-change-in-production',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key-change-in-production',
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },
  
  // CORS
  cors: {
    origin: '*',
    credentials: true,
  },
  
  // File Upload
  upload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880'), // 5MB
    allowedImageTypes: ['image/jpeg', 'image/png', 'image/jpg'],
    allowedDocTypes: ['application/pdf', 'application/msword'],
  },
  
  // Pagination
  pagination: {
    defaultLimit: 10,
    maxLimit: 100,
  },
};
