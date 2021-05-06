const { databaseError, badRequestError } = require('../errors');
const logger = require('../logger');
const { user: UserModel } = require('../models');
const { signPayload, jwtExpirationTimes } = require('../utils/jwt');
const { getPagination } = require('../utils/pagination');

const loggerPath = 'service:users';

exports.signUp = async userData => {
  try {
    const { email } = userData;
    const foundUser = await this.findByEmail(email);

    if (foundUser) throw badRequestError('email already exists');

    const createdUser = await UserModel.create(userData);
    logger.info(`${loggerPath}:signUp - created user successfully with username: ${createdUser.name}`);
    return createdUser;
  } catch (error) {
    logger.error(`${loggerPath}:signUp - database: ${error.message}`);
    throw error;
  }
};

exports.signIn = async userData => {
  try {
    const { email, password } = userData;
    const foundUser = await this.findByEmail(email);

    if (!foundUser) throw badRequestError('email does not exist');
    logger.info(`${loggerPath}:signIn - user found by email: ${JSON.stringify(foundUser)}`);

    const isValidPassword = await foundUser.comparePassword(password);

    if (!isValidPassword) throw badRequestError('invalid credentials');

    const {
      dataValues: { id, name, lastName }
    } = foundUser;

    const accessToken = signPayload(
      { user: id, name: `${name} ${lastName}` },
      { expiresIn: jwtExpirationTimes.accessToken }
    );

    return { accessToken };
  } catch (error) {
    logger.error(`${loggerPath}:signIn - database: ${error.message}`);
    throw error;
  }
};

exports.findByEmail = async email => {
  try {
    const foundUser = await UserModel.findOne({ where: { email } });

    return foundUser;
  } catch (error) {
    logger.error(`${loggerPath}:findByEmail - database: ${error.message}`);
    throw databaseError('database error in findByEmail');
  }
};

exports.getUsers = async (page, limit) => {
  try {
    const users = await UserModel.findAll({ ...getPagination(page, limit) });

    return users;
  } catch (error) {
    logger.error(`${loggerPath}:getUsers - database: ${error.message}`);
    throw databaseError('database error in getUsers');
  }
};
