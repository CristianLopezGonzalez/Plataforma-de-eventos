import Joi from 'joi';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = Joi.object({
  // Node Environment
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),

  // Server Configuration
  PORT: Joi.number()
    .default(3000),

  HOST: Joi.string()
    .default('localhost'),

  // Database Configuration
  DATABASE_URL: Joi.string()
    .required()
    .messages({
      'any.required': 'DATABASE_URL es requerida',
      'string.empty': 'DATABASE_URL no puede estar vacía',
    }),

  // JWT Configuration
  JWT_SECRET: Joi.string()
    .required()
    .min(32)
    .messages({
      'any.required': 'JWT_SECRET es requerida',
      'string.min': 'JWT_SECRET debe tener al menos 32 caracteres',
    }),

  JWT_EXPIRATION: Joi.string()
    .default('7d')
    .messages({
      'string.pattern.base': 'JWT_EXPIRATION debe ser un formato válido (ej: 7d, 24h)',
    }),

  JWT_REFRESH_SECRET: Joi.string()
    .required()
    .min(32)
    .messages({
      'any.required': 'JWT_REFRESH_SECRET es requerida',
      'string.min': 'JWT_REFRESH_SECRET debe tener al menos 32 caracteres',
    }),

  JWT_REFRESH_EXPIRATION: Joi.string()
    .default('30d'),

  // Email Configuration (Nodemailer)
  SMTP_HOST: Joi.string()
    .required()
    .messages({
      'any.required': 'SMTP_HOST es requerida para enviar emails',
    }),

  SMTP_PORT: Joi.number()
    .default(587),

  SMTP_USER: Joi.string()
    .required()
    .email()
    .messages({
      'any.required': 'SMTP_USER es requerida',
      'string.email': 'SMTP_USER debe ser un email válido',
    }),

  SMTP_PASSWORD: Joi.string()
    .required()
    .messages({
      'any.required': 'SMTP_PASSWORD es requerida',
    }),

  SMTP_FROM_EMAIL: Joi.string()
    .email()
    .default('noreply@eventplatform.com'),

  SMTP_FROM_NAME: Joi.string()
    .default('Event Platform'),

  // Google Maps API
  GOOGLE_MAPS_API_KEY: Joi.string()
    .optional()
    .allow('')
    .messages({
      'string.empty': 'GOOGLE_MAPS_API_KEY no puede estar vacía si se proporciona',
    }),

  // Stripe Configuration
  STRIPE_SECRET_KEY: Joi.string()
    .optional()
    .allow('')
    .messages({
      'string.empty': 'STRIPE_SECRET_KEY no puede estar vacía si se proporciona',
    }),

  STRIPE_PUBLISHABLE_KEY: Joi.string()
    .optional()
    .allow('')
    .messages({
      'string.empty': 'STRIPE_PUBLISHABLE_KEY no puede estar vacía si se proporciona',
    }),

  // Cors Configuration
  CORS_ORIGIN: Joi.string()
    .default('http://localhost:3000'),

  // API Configuration
  API_VERSION: Joi.string()
    .default('v1'),

  API_PREFIX: Joi.string()
    .default('/api'),

  // Logging
  LOG_LEVEL: Joi.string()
    .valid('error', 'warn', 'info', 'debug')
    .default('info'),

  // File Upload
  MAX_FILE_SIZE: Joi.number()
    .default(5242880),

  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: Joi.number()
    .default(15 * 60 * 1000),

  RATE_LIMIT_MAX_REQUESTS: Joi.number()
    .default(100),

  // QR Code Configuration
  QR_CODE_SIZE: Joi.number()
    .default(200),

  // Pagination
  DEFAULT_PAGE_SIZE: Joi.number()
    .default(10),

  MAX_PAGE_SIZE: Joi.number()
    .default(100),
})
  .unknown(true)
  .required();

interface EnvConfig {
  nodeEnv: string;
  isDevelopment: boolean;
  isProduction: boolean;
  isTest: boolean;
  port: number;
  host: string;
  databaseUrl: string;
  jwt: {
    secret: string;
    expiration: string;
    refreshSecret: string;
    refreshExpiration: string;
  };
  smtp: {
    host: string;
    port: number;
    user: string;
    password: string;
    fromEmail: string;
    fromName: string;
  };
  googleMaps: {
    apiKey: string | null;
  };
  stripe: {
    secretKey: string | null;
    publishableKey: string | null;
  };
  cors: {
    origin: string;
  };
  api: {
    version: string;
    prefix: string;
  };
  logging: {
    level: string;
  };
  fileUpload: {
    maxSize: number;
  };
  rateLimit: {
    windowMs: number;
    maxRequests: number;
  };
  qrCode: {
    size: number;
  };
  pagination: {
    defaultPageSize: number;
    maxPageSize: number;
  };
}

let validatedEnv: Joi.ValidationResult<any>;

try {
  validatedEnv = envSchema.validate(process.env, {
    abortEarly: false,
    allowUnknown: true,
  });

  if (validatedEnv.error) {
    const errorDetails = validatedEnv.error.details
      .map((detail) => `- ${detail.message}`)
      .join('\n');

    console.error('Error en validación de variables de entorno:\n', errorDetails);
    process.exit(1);
  }

  console.log('Variables de entorno validadas correctamente');
} catch (error) {
  console.error('Error al validar variables de entorno:', error);
  process.exit(1);
}

export const config: EnvConfig = {
  // Environment
  nodeEnv: validatedEnv.value.NODE_ENV,
  isDevelopment: validatedEnv.value.NODE_ENV === 'development',
  isProduction: validatedEnv.value.NODE_ENV === 'production',
  isTest: validatedEnv.value.NODE_ENV === 'test',

  // Server
  port: validatedEnv.value.PORT,
  host: validatedEnv.value.HOST,

  // Database
  databaseUrl: validatedEnv.value.DATABASE_URL,

  // JWT
  jwt: {
    secret: validatedEnv.value.JWT_SECRET,
    expiration: validatedEnv.value.JWT_EXPIRATION,
    refreshSecret: validatedEnv.value.JWT_REFRESH_SECRET,
    refreshExpiration: validatedEnv.value.JWT_REFRESH_EXPIRATION,
  },

  // Email (SMTP)
  smtp: {
    host: validatedEnv.value.SMTP_HOST,
    port: validatedEnv.value.SMTP_PORT,
    user: validatedEnv.value.SMTP_USER,
    password: validatedEnv.value.SMTP_PASSWORD,
    fromEmail: validatedEnv.value.SMTP_FROM_EMAIL,
    fromName: validatedEnv.value.SMTP_FROM_NAME,
  },

  // Google Maps
  googleMaps: {
    apiKey: validatedEnv.value.GOOGLE_MAPS_API_KEY || null,
  },

  // Stripe
  stripe: {
    secretKey: validatedEnv.value.STRIPE_SECRET_KEY || null,
    publishableKey: validatedEnv.value.STRIPE_PUBLISHABLE_KEY || null,
  },

  // CORS
  cors: {
    origin: validatedEnv.value.CORS_ORIGIN,
  },

  // API
  api: {
    version: validatedEnv.value.API_VERSION,
    prefix: validatedEnv.value.API_PREFIX,
  },

  // Logging
  logging: {
    level: validatedEnv.value.LOG_LEVEL,
  },

  // File Upload
  fileUpload: {
    maxSize: validatedEnv.value.MAX_FILE_SIZE,
  },

  // Rate Limiting
  rateLimit: {
    windowMs: validatedEnv.value.RATE_LIMIT_WINDOW_MS,
    maxRequests: validatedEnv.value.RATE_LIMIT_MAX_REQUESTS,
  },

  // QR Code
  qrCode: {
    size: validatedEnv.value.QR_CODE_SIZE,
  },

  // Pagination
  pagination: {
    defaultPageSize: validatedEnv.value.DEFAULT_PAGE_SIZE,
    maxPageSize: validatedEnv.value.MAX_PAGE_SIZE,
  },
};

export default config;