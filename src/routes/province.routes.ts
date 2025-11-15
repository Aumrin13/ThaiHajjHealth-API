import { Router } from 'express';
import { getAllProvinces, searchProvinces } from '../controllers/province.controller';

const router = Router();

router.get('/provinces', getAllProvinces);
router.get('/provinces/search', searchProvinces);

export default router;
