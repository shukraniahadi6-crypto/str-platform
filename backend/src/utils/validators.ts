import { body } from 'express-validator';

export const authSignupValidator = [
  body('email').isEmail(),
  body('password').isLength({ min: 8 }),
  body('name').isString().notEmpty(),
  body('role').optional().isIn(['customer', 'courier', 'admin']),
];

export const authLoginValidator = [
  body('email').isEmail(),
  body('password').isString().notEmpty(),
];

export const createJobValidator = [
  body('title').isString().notEmpty(),
  body('description').isString().notEmpty(),
  body('pickupAddress').isString().notEmpty(),
  body('dropoffAddress').isString().notEmpty(),
  body('scheduledAt').optional().isISO8601(),
];
