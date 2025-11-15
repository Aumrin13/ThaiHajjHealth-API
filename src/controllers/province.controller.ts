import { Request, Response } from 'express';
import prisma from '../config/database';

// GET /api/provinces?search=
export const getAllProvinces = async (req: Request, res: Response) => {
  const { search } = req.query;
  try {
    const where: any = {};
    if (search) {
      where.PROVINCE_NAME = { contains: String(search) };
    }
    const provinces = await prisma.province.findMany({
      where,
      orderBy: { PROVINCE_NAME: 'asc' },
    });
    res.json({ success: true, data: provinces });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch provinces', error });
  }
};

// GET /api/provinces/search?query=xxx
export const searchProvinces = async (req: Request, res: Response) => {
  const { query } = req.query;
  try {
    const provinces = await prisma.province.findMany({
      where: {
        OR: [
          { PROVINCE_NAME: { contains: String(query) } },
          { PROVINCE_CODE: { contains: String(query) } },
        ],
      },
    });
    res.json({ success: true, data: provinces });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to search provinces', error });
  }
};
