import { Router } from 'express';
import { getAllProvinces, searchProvinces } from '../controllers/province.controller';

const router = Router();

/**
 * @swagger
 * /api/provinces:
 *   get:
 *     tags: [Provinces]
 *     summary: ดึงรายชื่อจังหวัด (dropdown/search)
 *     description: ดึงรายชื่อจังหวัดทั้งหมด หรือค้นหาด้วยชื่อ (รองรับ select2)
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: ค้นหาด้วยชื่อจังหวัด
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       PROVINCE_ID: { type: integer }
 *                       PROVINCE_NAME: { type: string }
 */
router.get('/provinces', getAllProvinces);
router.get('/provinces/search', searchProvinces);

export default router;
