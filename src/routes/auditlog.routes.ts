import { Router } from 'express';
import { getAllAuditLogs, createAuditLog } from '../controllers/auditlog.controller';

const router = Router();

router.get('/audit-logs', getAllAuditLogs);
router.post('/audit-logs', createAuditLog);

export default router;
