import { Router } from 'express';
import { getSubdistricts } from '../controllers/subdistrict.controller';

const router = Router();

/**
 * @swagger
 * /api/subdistricts:
 *   get:
 *     tags: [Subdistricts]
 *     summary: ดึงรายชื่อตำบล (dropdown/search)
 *     description: ดึงรายชื่อตำบลทั้งหมด หรือค้นหาด้วยชื่อ (รองรับ select2)
 *     parameters:
 *       - in: query
 *         name: amphurId
 *         schema:
 *           type: integer
 *         description: filter เฉพาะตำบลในอำเภอนี้
 *       - in: query
 *         name: provinceId
 *         schema:
 *           type: integer
 *         description: filter เฉพาะตำบลในจังหวัดนี้
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: ค้นหาด้วยชื่อตำบล
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
 *                       DISTRICT_ID: { type: integer }
 *                       DISTRICT_NAME: { type: string }
 *                       AMPHUR_ID: { type: integer }
 *                       PROVINCE_ID: { type: integer }
 */
router.get('/subdistricts', getSubdistricts);

export default router;
