import { Router } from 'express';
import { register, login, refresh, logout } from './controller';
import { validate } from '../../../middleware/validation';
import { authenticate } from '../../../middleware/auth';
import { authRateLimit } from '../../../middleware/rateLimit';
import { registerSchema, loginSchema, refreshSchema } from '../../../schemas/auth';

const router = Router();

router.post('/register', authRateLimit, validate(registerSchema), register);
router.post('/login', authRateLimit, validate(loginSchema), login);
router.post('/refresh', validate(refreshSchema), refresh);
router.post('/logout', authenticate, logout);

export default router;
