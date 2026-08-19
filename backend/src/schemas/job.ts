import Joi from 'joi';

export const createJobSchema = Joi.object({
  address: Joi.string().min(5).required(),
  items_json: Joi.object().optional(),
  estimated_volume: Joi.number().min(0).optional(),
  special_instructions: Joi.string().optional(),
  scheduled_at: Joi.date().iso().optional(),
});

export const estimateSchema = Joi.object({
  image: Joi.string().base64().optional(),
});
