import { Router } from 'express';
import { getUsers, getUserById, blockUser, searchUsers } from '../controllers/usersController';
import { validateUserId, validateSearchQuery } from '../middleware/validation';
import { authenticateToken } from '../middleware/auth';
import { requireAdmin, requireAdminOrSelf } from '../middleware/roleCheck';

const router = Router();



router.get('/', authenticateToken, requireAdmin, getUsers);
router.get('/search', validateSearchQuery, authenticateToken, requireAdmin, searchUsers);
router.get('/:id', validateUserId, authenticateToken, requireAdminOrSelf, getUserById);
router.patch('/:id/block', validateUserId, authenticateToken, requireAdminOrSelf, blockUser);

export default router;