import { Router } from 'express';
import { body } from 'express-validator';
import {
  changePasswordController,
  loginController,
  refreshController,
  signupController,
} from '../controllers/auth';
import { requireAuth } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { authLoginValidator, authSignupValidator } from '../utils/validators';

const router = Router();

router.post('/signup', authSignupValidator, validateRequest, signupController);
router.post('/login', authLoginValidator, validateRequest, loginController);
router.post('/refresh', body('refreshToken').isString().notEmpty(), validateRequest, refreshController);
router.post(
  '/change-password',
  requireAuth,
  [body('currentPassword').isString(), body('nextPassword').isLength({ min: 8 })],
  validateRequest,
  changePasswordController,
);

export default router;
