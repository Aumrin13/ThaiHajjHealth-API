import { Request, Response } from 'express';
import prisma from '../config/database';

// GET /api/districts?amphurId=&provinceId=&search=
export const getAllDistricts = async (req: Request, res: Response) => {
  const { amphurId, provinceId, search } = req.query;
  try {
    const where: any = {};
    if (amphurId) where.AMPHUR_ID = Number(amphurId);
    if (provinceId) where.PROVINCE_ID = Number(provinceId);
    if (search) {
      where.DISTRICT_NAME = { contains: String(search) };
    }
    const districts = await prisma.subdistrict.findMany({
      where,
      orderBy: { DISTRICT_NAME: 'asc' },
    });
    res.json({ success: true, data: districts });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch districts', error });
  }
};

// GET /api/districts/search?query=xxx
export const searchDistricts = async (req: Request, res: Response) => {
  const { query } = req.query;
  try {
    const districts = await prisma.subdistrict.findMany({
      where: {
        OR: [
          { DISTRICT_NAME: { contains: String(query) } },
          { DISTRICT_CODE: { contains: String(query) } },
        ],
      },
    });
    res.json({ success: true, data: districts });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to search districts', error });
  }
};
