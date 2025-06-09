import Ajv from 'ajv';

require('dotenv').config();

const mongooseURL = process.env.MONGOOSE_URL;

const ajv = new Ajv({ allErrors: true });
require('ajv-formats')(ajv);

const mongooseURLSchema = {
  type: 'string',
  format: 'uri',
};
const mongooseURLValidate = ajv.compile(mongooseURLSchema);

if (!mongooseURL || !mongooseURLValidate(mongooseURL)) {
  throw mongooseURLValidate.errors;
}

export const MONGOOSE_URL = mongooseURL;
