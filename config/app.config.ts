import Ajv from 'ajv';
import { BcryptConfig } from './bcrypt.config';

require('dotenv').config();

const ajv = new Ajv({ allErrors: true });

require('ajv-formats')(ajv);

const configSchema = {
  type: 'object',
  properties: {
    APP_ENV: {
      type: 'string',
      enum: ['dev', 'staging', 'production'],
    },
    NEXT_PUBLIC_API_URL: { type: 'string' },
  },
  required: ['APP_ENV'],
};

const validate = ajv.compile(configSchema);

const defaultConfig = {
  APP_ENV: 'dev',
  NEXT_PUBLIC_API_URL: '/api',
};

export const AppConfig = {
  APP_ENV: process.env.APP_ENV || defaultConfig.APP_ENV,
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || defaultConfig.NEXT_PUBLIC_API_URL,
  SALT: parseInt(BcryptConfig.SALT_ROUNDS.toString()),
};

if (!validate(AppConfig)) {
  throw validate.errors;
}
