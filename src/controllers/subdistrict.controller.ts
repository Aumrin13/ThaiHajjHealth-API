import { Request, Response } from 'express';
import prisma from '../config/database';

// GET /api/subdistricts?amphurId=&provinceId=&search=
export const getSubdistricts = async (req: Request, res: Response) => {
  const { amphurId, provinceId, search } = req.query;
  try {
    const where: any = {};
    if (amphurId) where.AMPHUR_ID = Number(amphurId);
    if (provinceId) where.PROVINCE_ID = Number(provinceId);
    if (search) {
      where.DISTRICT_NAME = { contains: String(search) };
    }
    const subdistricts = await prisma.subdistrict.findMany({
      where,
      orderBy: { DISTRICT_NAME: 'asc' },
    });
    res.json({ success: true, data: subdistricts });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch subdistricts', error });
  }
};
