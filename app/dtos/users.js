const { checkSchema } = require('express-validator');
const { authSchema } = require('../schemas/auth');

const { credentialSchema } = require('../schemas/credential');
const { paginationSchema } = require('../schemas/pagination');
const { userSchema } = require('../schemas/user');

exports.signUpDto = checkSchema({ ...userSchema, ...credentialSchema }, ['body']);

exports.signInDto = checkSchema({ ...credentialSchema }, ['body']);

exports.getUsersDto = checkSchema({ ...paginationSchema, ...authSchema });
