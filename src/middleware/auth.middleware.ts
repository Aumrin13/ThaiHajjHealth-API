import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt';
import { sendError } from '../utils/responses';
import prisma from '../config/database';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    username: string;
    email: string;
    role: string;
  };
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      sendError(res, 'No token provided', 401);
      return;
    }

    const token = authHeader.substring(7);

    try {
      const decoded = verifyAccessToken(token);
      
      // Verify user still exists and is active
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: { id: true, username: true, email: true, role: true, status: true },
      });

      if (!user || user.status !== 'ACTIVE') {
        sendError(res, 'User not found or inactive', 401);
        return;
      }

      req.user = {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      };

      next();
    } catch (_error) {
      sendError(res, 'Invalid or expired token', 401);
      return;
    }
  } catch (_error) {
    sendError(res, 'Authentication failed', 500);
    return;
  }
};

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      sendError(res, 'Unauthorized', 401);
      return;
    }

    if (!roles.includes(req.user.role)) {
      sendError(res, 'Forbidden - Insufficient permissions', 403);
      return;
    }

    next();
  };
};
