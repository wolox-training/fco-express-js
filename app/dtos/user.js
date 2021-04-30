const { checkSchema } = require('express-validator');

const { credentialSchema } = require('../schemas/credential');
const { userSchema } = require('../schemas/user');

exports.signUpDto = checkSchema(
  {
    ...userSchema,
    ...credentialSchema
  },
  ['body']
);
