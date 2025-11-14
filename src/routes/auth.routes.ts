import { Router } from 'express';
import { login, register, refreshToken, logout, me, changePassword } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import { loginSchema, registerSchema, changePasswordSchema } from '../validators/auth.validator';

const router = Router();

router.post('/login', validate(loginSchema), login);
router.post('/register', validate(registerSchema), register);
router.post('/refresh-token', refreshToken);
router.post('/logout', authenticate, logout);
router.get('/me', authenticate, me);
router.put('/change-password', authenticate, validate(changePasswordSchema), changePassword);

export default router;
