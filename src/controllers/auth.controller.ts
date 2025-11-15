import { Response } from 'express';
import bcrypt from 'bcrypt';
import prisma from '../config/database';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { sendSuccess, sendError } from '../utils/responses';
import { AuthRequest } from '../middleware/auth.middleware';
import logger from '../config/logger';

export const login = async (req: AuthRequest, res: Response) => {
  try {
    const { username, password } = req.body;

    const user = await prisma.user.findFirst({
      where: {
        OR: [{ username }, { email: username }],
      },
    });

    if (!user) {
      return sendError(res, 'Invalid credentials', 401);
    }

    if (user.status !== 'ACTIVE') {
      return sendError(res, 'Account is inactive', 403);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return sendError(res, 'Invalid credentials', 401);
    }

    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const refreshToken = generateRefreshToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    await prisma.user.update({
      where: { id: user.id },
      data: {
        refreshToken,
        lastLogin: new Date(),
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'LOGIN',
        entity: 'User',
        entityId: user.id,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
      },
    });

    logger.info(`User logged in: ${user.username}`);

    return sendSuccess(res, {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
      accessToken,
      refreshToken,
    }, 'Login successful');
  } catch (error) {
    logger.error('Login error:', error);
    return sendError(res, 'Login failed', 500);
  }
};

export const register = async (req: AuthRequest, res: Response) => {
  try {
    const { username, email, password, fullName, role, hospital, phoneNumber, address, subdistrict, district, province, workplace, position } = req.body;

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ username }, { email }],
      },
    });

    if (existingUser) {
      return sendError(res, 'Username or email already exists', 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        fullName,
        role: role || 'STAFF',
        hospital,
        phoneNumber,
        address,
        subdistrict,
        district,
        province,
        workplace,
        position,
      },
      select: {
        id: true,
        username: true,
        email: true,
        fullName: true,
        role: true,
        hospital: true,
        phoneNumber: true,
        address: true,
        subdistrict: true,
        district: true,
        province: true,
        workplace: true,
        position: true,
        createdAt: true,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: req.user?.id,
        action: 'CREATE',
        entity: 'User',
        entityId: user.id,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
      },
    });

    logger.info(`New user registered: ${user.username}`);

    return sendSuccess(res, user, 'User registered successfully', 201);
  } catch (error) {
    logger.error('Registration error:', error);
    return sendError(res, 'Registration failed', 500);
  }
};

export const refreshToken = async (req: AuthRequest, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return sendError(res, 'Refresh token required', 400);
    }

    const decoded = verifyRefreshToken(refreshToken);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user || user.refreshToken !== refreshToken) {
      return sendError(res, 'Invalid refresh token', 401);
    }

    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return sendSuccess(res, { accessToken }, 'Token refreshed');
  } catch (error) {
    logger.error('Refresh token error:', error);
    return sendError(res, 'Token refresh failed', 401);
  }
};

export const logout = async (req: AuthRequest, res: Response) => {
  try {
    await prisma.user.update({
      where: { id: req.user!.id },
      data: { refreshToken: null },
    });

    await prisma.auditLog.create({
      data: {
        userId: req.user!.id,
        action: 'LOGOUT',
        entity: 'User',
        entityId: req.user!.id,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
      },
    });

    logger.info(`User logged out: ${req.user!.username}`);

    return sendSuccess(res, null, 'Logged out successfully');
  } catch (error) {
    logger.error('Logout error:', error);
    return sendError(res, 'Logout failed', 500);
  }
};

export const me = async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: {
        id: true,
        username: true,
        email: true,
        fullName: true,
        role: true,
        hospital: true,
        phoneNumber: true,
        status: true,
        lastLogin: true,
        createdAt: true,
      },
    });

    return sendSuccess(res, user, 'User data retrieved');
  } catch (error) {
    logger.error('Get user error:', error);
    return sendError(res, 'Failed to get user data', 500);
  }
};

export const changePassword = async (req: AuthRequest, res: Response) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
    });

    if (!user) {
      return sendError(res, 'User not found', 404);
    }

    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      return sendError(res, 'Current password is incorrect', 400);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: req.user!.id },
      data: { password: hashedPassword, refreshToken: null },
    });

    await prisma.auditLog.create({
      data: {
        userId: req.user!.id,
        action: 'UPDATE',
        entity: 'User',
        entityId: req.user!.id,
        changes: { action: 'PASSWORD_CHANGED' },
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
      },
    });

    logger.info(`Password changed: ${user.username}`);

    return sendSuccess(res, null, 'Password changed successfully');
  } catch (error) {
    logger.error('Change password error:', error);
    return sendError(res, 'Failed to change password', 500);
  }
};
