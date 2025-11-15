import Joi from 'joi';

export const createUserSchema = Joi.object({
  username: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  fullName: Joi.string().required(),
  role: Joi.string().valid('ADMIN', 'STAFF', 'EXECUTIVE', 'DOCTOR').optional(),
  hospital: Joi.string().optional(),
  phoneNumber: Joi.string().optional(),
  address: Joi.string().max(255).optional(),
  subdistrict: Joi.string().max(100).optional(),
  district: Joi.string().max(100).optional(),
  province: Joi.string().max(100).optional(),
  workplace: Joi.string().max(255).optional(),
  position: Joi.string().max(100).optional(),
});

export const updateUserSchema = Joi.object({
  fullName: Joi.string().optional(),
  hospital: Joi.string().optional(),
  phoneNumber: Joi.string().optional(),
  address: Joi.string().max(255).optional(),
  subdistrict: Joi.string().max(100).optional(),
  district: Joi.string().max(100).optional(),
  province: Joi.string().max(100).optional(),
  workplace: Joi.string().max(255).optional(),
  position: Joi.string().max(100).optional(),
});
