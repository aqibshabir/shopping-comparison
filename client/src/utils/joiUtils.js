import Joi from "joi";

export const userSchema = Joi.object({
  email: Joi.string().min(3).max(30).required(),
  password: Joi.string().min(6).required(),
  confirmPassword: Joi.string().valid(Joi.ref("password")).required().messages({
    "any.only": "Passwords do not match.",
  }),
  hasTescoCard: Joi.boolean().required(),
  hasNectarCard: Joi.boolean().required(),
  hasAsdaCard: Joi.boolean().required(),
  hasMorrisonsCard: Joi.boolean().required(),
  hasWaitroseCard: Joi.boolean().required(),
  hasIcelandCard: Joi.boolean().required(),
});

export const ingredientSchema = Joi.object({
  ingredientInput: Joi.string()
    .regex(/^[a-zA-Z]+$/)
    .min(3)
    .max(20)
    .required(),
});
