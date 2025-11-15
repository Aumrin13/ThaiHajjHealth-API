import { Router } from 'express';
import { getSubdistricts } from '../controllers/subdistrict.controller';

const router = Router();

router.get('/subdistricts', getSubdistricts);

export default router;
