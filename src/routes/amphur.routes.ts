import { Router } from 'express';
import { getAllAmphurs, searchAmphurs } from '../controllers/amphur.controller';

const router = Router();

router.get('/amphurs', getAllAmphurs);
router.get('/amphurs/search', searchAmphurs);

export default router;
