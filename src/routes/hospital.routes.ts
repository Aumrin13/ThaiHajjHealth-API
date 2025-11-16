import { Router } from 'express';
import { getAllHospitals, searchHospitals, getHospitalsByLocation } from '../controllers/hospital.controller';
/**
 * @swagger
 * /api/hospitals/by-location:
 *   get:
 *     tags: [Hospitals]
 *     summary: ดึงรายชื่อโรงพยาบาลตามจังหวัด อำเภอ ตำบล
 *     description: ดึงรายชื่อโรงพยาบาลโดย filter ตามจังหวัด อำเภอ ตำบล (ใช้กับ dropdown cascade)
 *     parameters:
 *       - in: query
 *         name: province
 *         schema:
 *           type: string
 *         description: ชื่อจังหวัด
 *       - in: query
 *         name: amphur
 *         schema:
 *           type: string
 *         description: ชื่ออำเภอ
 *       - in: query
 *         name: district
 *         schema:
 *           type: string
 *         description: ชื่อตำบล
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
 *                       hos_id: { type: integer }
 *                       hos_name: { type: string }
 *                       code_hos5: { type: string }
 *                       province_name: { type: string }
 *                       amphur_name: { type: string }
 *                       district_name: { type: string }
 */
router.get('/hospitals/by-location', getHospitalsByLocation);

const router = Router();

/**
 * @swagger
 * /api/hospitals:
 *   get:
 *     tags: [Hospitals]
 *     summary: ดึงรายชื่อโรงพยาบาล (dropdown/search)
 *     description: ดึงรายชื่อโรงพยาบาลทั้งหมด หรือค้นหาด้วยชื่อ/รหัส 5 หลัก (รองรับ select2)
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: ค้นหาด้วยชื่อหรือรหัสโรงพยาบาล
 *       - in: query
 *         name: code_hos5
 *         schema:
 *           type: string
 *         description: filter ด้วยรหัส 5 หลัก
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
 *                       hos_id: { type: integer }
 *                       hos_name: { type: string }
 *                       code_hos5: { type: string }
 *                       province_name: { type: string }
 *                       amphur_name: { type: string }
 *                       district_name: { type: string }
 */
router.get('/hospitals', getAllHospitals);

// GET /api/hospitals/search?query=xxx
router.get('/hospitals/search', searchHospitals);

export default router;
