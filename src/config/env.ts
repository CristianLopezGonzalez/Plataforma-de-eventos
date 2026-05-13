import Joi from 'joi';
import dotenv from 'dotenv';
import { Config } from '../types/envTypes';
dotenv.config();

const envSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),

  PORT: Joi.number()
    .default(3000),

  DATABASE_URL: Joi.string().required().messages({
    'any.required': 'DATABASE_URL es requerida',
  }),

  JWT_SECRET: Joi.string().required().min(32).messages({
    'any.required': 'JWT_SECRET es requerida',
    'string.min': 'JWT_SECRET debe tener al menos 32 caracteres',
  }),

  JWT_EXPIRES_IN: Joi.string().default('1h'),
  JWT_REFRESH_EXPIRES_IN: Joi.string().default('7d'),
  GOOGLE_MAPS_API_KEY: Joi.string().required().messages({
    'any.required': 'GOOGLE_MAPS_API_KEY es requerida',
  }),
  CORS_ORIGIN: Joi.string().default('*'),
  FILE_MAX_SIZE: Joi.number().default(5 * 1024 * 1024),
  RATE_LIMIT_WINDOW_MS: Joi.number().default(15 * 60 * 1000),
  RATE_LIMIT_MAX_REQUESTS: Joi.number().default(100),
  QR_CODE_SIZE: Joi.number().default(300),
  DEFAULT_PAGE_SIZE: Joi.number().default(20),
  MAX_PAGE_SIZE: Joi.number().default(100),
})
  .unknown(true)
  .required();



const configValidation = envSchema.validate(process.env, {
  allowUnknown: true,
  abortEarly: false,
});

if (configValidation.error) {
  const errorDetails = configValidation.error.details
    .map((detail) => `- ${detail.message}`)
    .join('\n');

  console.error('Error en validación de variables de entorno:\n', errorDetails);
  process.exit(1);
}

console.log('Variables de entorno validadas correctamente');

export const config: Config = {
  nodeEnv: configValidation.value.NODE_ENV,
  isDevelopment: configValidation.value.NODE_ENV === 'development',
  isProduction: configValidation.value.NODE_ENV === 'production',
  isTest: configValidation.value.NODE_ENV === 'test',

  port: configValidation.value.PORT,
  databaseUrl: configValidation.value.DATABASE_URL,

  jwt: {
    secret: configValidation.value.JWT_SECRET,
    expiresIn: configValidation.value.JWT_EXPIRES_IN,
    refreshExpiresIn: configValidation.value.JWT_REFRESH_EXPIRES_IN,
  },

  googleMapsApiKey: configValidation.value.GOOGLE_MAPS_API_KEY,
  corsOrigin: configValidation.value.CORS_ORIGIN,
  fileMaxSize: configValidation.value.FILE_MAX_SIZE,

  rateLimit: {
    windowMs: configValidation.value.RATE_LIMIT_WINDOW_MS,
    maxRequests: configValidation.value.RATE_LIMIT_MAX_REQUESTS,
  },

  qrCodeSize: configValidation.value.QR_CODE_SIZE,

  pagination: {
    defaultPageSize: configValidation.value.DEFAULT_PAGE_SIZE,
    maxPageSize: configValidation.value.MAX_PAGE_SIZE,
  },
};