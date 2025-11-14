import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  updateUserStatus,
  updateUserRole,
} from '../controllers/users.controller';
import { validate } from '../middleware/validation.middleware';
import { createUserSchema, updateUserSchema } from '../validators/user.validator';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.post('/', authorize('ADMIN'), validate(createUserSchema), createUser);
router.put('/:id', authorize('ADMIN'), validate(updateUserSchema), updateUser);
router.delete('/:id', authorize('ADMIN'), deleteUser);
router.patch('/:id/status', authorize('ADMIN'), updateUserStatus);
router.patch('/:id/role', authorize('ADMIN'), updateUserRole);

export default router;
