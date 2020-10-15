import Joi from 'joi';
import normalizeEmail from 'normalize-email';

const Schema = Joi.object({
  normalized: Joi.string().email().required(),
  raw: Joi.string().email().required(),
});

Schema.fromText = (email) => ({
  normalized: normalizeEmail(email),
  raw: email,
});

export default Schema;
