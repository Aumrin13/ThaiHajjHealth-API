import { Response } from 'express';
import bcrypt from 'bcrypt';
import prisma from '../config/database';
import { sendSuccess, sendError, sendPaginated } from '../utils/responses';
import { AuthRequest } from '../middleware/auth.middleware';
import logger from '../utils/logger';

export const getAllUsers = async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string;
    const role = req.query.role as string;
    const status = req.query.status as string;

    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.OR = [
        { username: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { fullName: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (role) {
      where.role = role;
    }

    if (status) {
      where.status = status;
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
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
          updatedAt: true,
          address: true,
          subdistrict: true,
          district: true,
          province: true,
          workplace: true,
          position: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count({ where }),
    ]);

    return sendPaginated(res, users, total, page, limit, 'Users retrieved successfully');
  } catch (error) {
    logger.error('Get users error:', error);
    return sendError(res, 'Failed to get users', 500);
  }
};

export const getUserById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
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
        updatedAt: true,
        address: true,
        subdistrict: true,
        district: true,
        province: true,
        workplace: true,
        position: true,
      },
    });

    if (!user) {
      return sendError(res, 'User not found', 404);
    }

    return sendSuccess(res, user, 'User retrieved successfully');
  } catch (error) {
    logger.error('Get user error:', error);
    return sendError(res, 'Failed to get user', 500);
  }
};

export const createUser = async (req: AuthRequest, res: Response) => {
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
        status: true,
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
        userId: req.user!.id,
        action: 'CREATE',
        entity: 'User',
        entityId: user.id,
        changes: { username, email, role },
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
      },
    });

    logger.info(`User created: ${user.username} by ${req.user!.username}`);

    return sendSuccess(res, user, 'User created successfully', 201);
  } catch (error) {
    logger.error('Create user error:', error);
    return sendError(res, 'Failed to create user', 500);
  }
};

export const updateUser = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { fullName, hospital, phoneNumber, address, subdistrict, district, province, workplace, position } = req.body;

    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      return sendError(res, 'User not found', 404);
    }

    const updated = await prisma.user.update({
      where: { id },
      data: {
        fullName,
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
        status: true,
        address: true,
        subdistrict: true,
        district: true,
        province: true,
        workplace: true,
        position: true,
        updatedAt: true,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: req.user!.id,
        action: 'UPDATE',
        entity: 'User',
        entityId: id,
        changes: { fullName, hospital, phoneNumber, address, subdistrict, district, province, workplace, position },
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
      },
    });

    logger.info(`User updated: ${user.username} by ${req.user!.username}`);

    return sendSuccess(res, updated, 'User updated successfully');
  } catch (error) {
    logger.error('Update user error:', error);
    return sendError(res, 'Failed to update user', 500);
  }
};

export const deleteUser = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    if (id === req.user!.id) {
      return sendError(res, 'Cannot delete your own account', 400);
    }

    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      return sendError(res, 'User not found', 404);
    }

    await prisma.user.delete({ where: { id } });

    await prisma.auditLog.create({
      data: {
        userId: req.user!.id,
        action: 'DELETE',
        entity: 'User',
        entityId: id,
        changes: { username: user.username },
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
      },
    });

    logger.info(`User deleted: ${user.username} by ${req.user!.username}`);

    return sendSuccess(res, null, 'User deleted successfully');
  } catch (error) {
    logger.error('Delete user error:', error);
    return sendError(res, 'Failed to delete user', 500);
  }
};

export const updateUserStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['ACTIVE', 'INACTIVE', 'SUSPENDED'].includes(status)) {
      return sendError(res, 'Invalid status', 400);
    }

    const user = await prisma.user.update({
      where: { id },
      data: { status },
      select: {
        id: true,
        username: true,
        status: true,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: req.user!.id,
        action: 'UPDATE',
        entity: 'User',
        entityId: id,
        changes: { status },
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
      },
    });

    logger.info(`User status updated: ${user.username} to ${status}`);

    return sendSuccess(res, user, 'User status updated successfully');
  } catch (error) {
    logger.error('Update status error:', error);
    return sendError(res, 'Failed to update user status', 500);
  }
};

export const updateUserRole = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['ADMIN', 'STAFF', 'EXECUTIVE'].includes(role)) {
      return sendError(res, 'Invalid role', 400);
    }

    const user = await prisma.user.update({
      where: { id },
      data: { role },
      select: {
        id: true,
        username: true,
        role: true,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: req.user!.id,
        action: 'UPDATE',
        entity: 'User',
        entityId: id,
        changes: { role },
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
      },
    });

    logger.info(`User role updated: ${user.username} to ${role}`);

    return sendSuccess(res, user, 'User role updated successfully');
  } catch (error) {
    logger.error('Update role error:', error);
    return sendError(res, 'Failed to update user role', 500);
  }
};
