import { Router } from 'express';
import { getAllAmphurs, searchAmphurs } from '../controllers/amphur.controller';

const router = Router();

/**
 * @swagger
 * /api/amphurs:
 *   get:
 *     tags: [Amphurs]
 *     summary: ดึงรายชื่ออำเภอ (dropdown/search)
 *     description: ดึงรายชื่ออำเภอทั้งหมด หรือค้นหาด้วยชื่อ/รหัส (รองรับ select2)
 *     parameters:
 *       - in: query
 *         name: provinceId
 *         schema:
 *           type: integer
 *         description: filter เฉพาะอำเภอในจังหวัดนี้
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: ค้นหาด้วยชื่ออำเภอ
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
 *                       AMPHUR_ID: { type: integer }
 *                       AMPHUR_NAME: { type: string }
 *                       PROVINCE_ID: { type: integer }
 */
router.get('/amphurs', getAllAmphurs);
router.get('/amphurs/search', searchAmphurs);

export default router;
