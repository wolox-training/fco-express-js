const { databaseError, badRequestError } = require('../errors');
const logger = require('../logger');
const { user: UserModel } = require('../models');

const loggerPath = 'service:users';

exports.signUp = async userData => {
  try {
    const createdUser = await UserModel.create(userData);

    if (!createdUser) {
      logger.error(`${loggerPath}:signUp:logic`);
      throw badRequestError('bad request error');
    }

    logger.info(`${loggerPath}:signUp:username: ${createdUser.name}`);
    return createdUser;
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
