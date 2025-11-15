import { Request, Response } from 'express';
import prisma from '../config/database';

// GET /api/audit-logs
export const getAllAuditLogs = async (req: Request, res: Response) => {
  try {
    const logs = await prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      include: { user: true },
    });
    res.json({ success: true, data: logs });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch audit logs', error });
  }
};

// POST /api/audit-logs
export const createAuditLog = async (req: Request, res: Response) => {
  try {
    const { id, userId, action, entity, entityId, ipAddress, userAgent, changes } = req.body;
    const log = await prisma.auditLog.create({
      data: {
        id,
        userId,
        action,
        entity,
        entityId,
        ipAddress,
        userAgent,
        changes,
      },
    });
    res.status(201).json({ success: true, data: log });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create audit log', error });
  }
};
