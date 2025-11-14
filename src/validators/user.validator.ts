import Joi from 'joi';

export const createUserSchema = Joi.object({
  username: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  fullName: Joi.string().required(),
  role: Joi.string().valid('ADMIN', 'STAFF', 'EXECUTIVE').optional(),
  hospital: Joi.string().optional(),
  phoneNumber: Joi.string().optional(),
});

export const updateUserSchema = Joi.object({
  fullName: Joi.string().optional(),
  hospital: Joi.string().optional(),
  phoneNumber: Joi.string().optional(),
});
