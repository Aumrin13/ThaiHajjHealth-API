import { Request, Response } from 'express';
import prisma from '../config/database';

// GET /api/hospitals?search=&code_hos5=
export const getAllHospitals = async (req: Request, res: Response) => {
  const { search, code_hos5 } = req.query;
  try {
    const where: any = {};
    if (search) {
      where.OR = [
        { hos_name: { contains: String(search) } },
        { code_hos5: { contains: String(search) } },
      ];
    }
    if (code_hos5) {
      where.code_hos5 = String(code_hos5);
    }
    const hospitals = await prisma.hospital.findMany({
      where,
      orderBy: { hos_name: 'asc' },
    });
    res.json({ success: true, data: hospitals });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch hospitals', error });
  }
};

// GET /api/hospitals/search?query=xxx
export const searchHospitals = async (req: Request, res: Response) => {
  const { query } = req.query;
  try {
    const hospitals = await prisma.hospital.findMany({
      where: {
        OR: [
          { hos_name: { contains: String(query) } },
          { code_hos9: { contains: String(query) } },
          { code_hos5: { contains: String(query) } },
          { province_name: { contains: String(query) } },
          { amphur_name: { contains: String(query) } },
          { district_name: { contains: String(query) } },
        ],
      },
    });
    res.json({ success: true, data: hospitals });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to search hospitals', error });
  }
};
