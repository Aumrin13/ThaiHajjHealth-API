import { Router } from 'express';
import { getAllDistricts, searchDistricts } from '../controllers/district.controller';

const router = Router();

// GET /api/districts
router.get('/districts', getAllDistricts);

// GET /api/districts/search?query=xxx
router.get('/districts/search', searchDistricts);

export default router;
