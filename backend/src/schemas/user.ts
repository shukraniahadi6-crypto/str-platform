import Joi from 'joi';

export const updateProfileSchema = Joi.object({
  first_name: Joi.string().optional(),
  last_name: Joi.string().optional(),
  bio: Joi.string().optional(),
  vehicle_type: Joi.string().optional(),
  vehicle_capacity_yd3: Joi.number().optional(),
});

export const verifyDriverSchema = Joi.object({
  license_url: Joi.string().uri().optional(),
  insurance_url: Joi.string().uri().optional(),
});
