import jwt from 'jsonwebtoken';

export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'thh-access-secret-key';
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'thh-refresh-secret-key';

export const generateAccessToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, ACCESS_SECRET, {
    expiresIn: '15m',
  });
};

export const generateRefreshToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, REFRESH_SECRET, {
    expiresIn: '7d',
  });
};

export const verifyAccessToken = (token: string): JwtPayload => {
  try {
    return jwt.verify(token, ACCESS_SECRET) as JwtPayload;
  } catch (_error) {
    throw new Error('Invalid access token');
  }
};

export const verifyRefreshToken = (token: string): JwtPayload => {
  try {
    return jwt.verify(token, REFRESH_SECRET) as JwtPayload;
  } catch (_error) {
    throw new Error('Invalid refresh token');
  }
};
