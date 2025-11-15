import { Router } from 'express';
import { getAllHospitals, searchHospitals } from '../controllers/hospital.controller';

const router = Router();

// GET /api/hospitals
router.get('/hospitals', getAllHospitals);

// GET /api/hospitals/search?query=xxx
router.get('/hospitals/search', searchHospitals);

export default router;
