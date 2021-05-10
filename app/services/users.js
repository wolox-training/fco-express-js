const { databaseError } = require('../errors');
const logger = require('../logger');
const { user: UserModel } = require('../models');

const loggerPath = 'service:users';

exports.signUp = async userData => {
  try {
    const createdUser = await UserModel.create(userData);
    logger.info(`${loggerPath}:signUp - created user successfully with username: ${createdUser.name}`);

    return createdUser;
  } catch (error) {
    logger.error(`${loggerPath}:signUp - database: ${error.message}`);
    throw databaseError('database error in signUp');
  }
};

exports.findUserByEmail = async email => {
  try {
    const foundUser = await UserModel.findOne({ where: { email } });

    return foundUser;
  } catch (error) {
    logger.error(`${loggerPath}:findByEmail - database: ${error.message}`);
    throw databaseError('database error in findByEmail');
  }
};
