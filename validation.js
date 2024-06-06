import Joi from "joi";

const userSchema = Joi.object({
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  email: Joi.string().email().required(),
  // Add more validation rules as needed
});

export const validateUser = (user) => {
  return userSchema.validate(user);
};
