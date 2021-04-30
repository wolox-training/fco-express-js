const { databaseError } = require('../errors');
const logger = require('../logger');
const { user: UserModel } = require('../models');
const { signUpSerializer } = require('../serializers/users');
const { mapToSerializer } = require('../utils/objects');

const loggerPath = 'service:users';

exports.signUp = async userData => {
  try {
    const createdUser = await UserModel.create(userData);
    logger.info(`${loggerPath}:signUp:username: ${createdUser.name}`);
    return mapToSerializer(createdUser, signUpSerializer);
  } catch (error) {
    logger.error(`${loggerPath}:signUp:database: ${error.message}`);
    throw databaseError('database error in SignUp');
  }
};

exports.existsUserEmail = async email => {
  try {
    const foundEmail = await UserModel.findOne({ where: { email } });

    return !!foundEmail;
  } catch (error) {
    logger.error(`${loggerPath}:existsUserEmail:database: ${error.message}`);
    throw databaseError('database error in existsUserEmail');
  }
};
