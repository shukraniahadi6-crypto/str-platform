import { Router } from 'express';
import { getMe, updateProfile, verifyDriver } from './controller';
import { authenticate } from '../../../middleware/auth';
import { validate } from '../../../middleware/validation';
import { updateProfileSchema, verifyDriverSchema } from '../../../schemas/user';

const router = Router();

router.use(authenticate);
router.get('/me', getMe);
router.put('/profile', validate(updateProfileSchema), updateProfile);
router.post('/verify-driver', validate(verifyDriverSchema), verifyDriver);

export default router;
