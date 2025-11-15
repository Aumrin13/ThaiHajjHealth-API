import { Request, Response } from 'express';
import prisma from '../config/database';

// GET /api/amphurs?provinceId=&search=
export const getAllAmphurs = async (req: Request, res: Response) => {
  const { provinceId, search } = req.query;
  try {
    const where: any = {};
    if (provinceId) where.PROVINCE_ID = Number(provinceId);
    if (search) {
      where.AMPHUR_NAME = { contains: String(search) };
    }
    const amphurs = await prisma.amphur.findMany({
      where,
      orderBy: { AMPHUR_NAME: 'asc' },
    });
    res.json({ success: true, data: amphurs });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch amphurs', error });
  }
};

// GET /api/amphurs/search?query=xxx
export const searchAmphurs = async (req: Request, res: Response) => {
  const { query } = req.query;
  try {
    const amphurs = await prisma.amphur.findMany({
      where: {
        OR: [
          { AMPHUR_NAME: { contains: String(query) } },
          { AMPHUR_CODE: { contains: String(query) } },
        ],
      },
    });
    res.json({ success: true, data: amphurs });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to search amphurs', error });
  }
};
