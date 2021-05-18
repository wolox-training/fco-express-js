const { databaseError } = require('../errors');
const logger = require('../logger');
const { User: UserModel } = require('../models');
const { getPagination } = require('../utils/pagination');

const loggerPath = 'service:users';

exports.createUser = async userData => {
  try {
    const createdUser = await UserModel.create(userData);
    logger.info(`${loggerPath}:createUser - created user successfully with username: ${createdUser.name}`);

    return createdUser;
  } catch (error) {
    logger.error(`${loggerPath}:createUser - database: ${error.message}`);
    throw databaseError('database error in createUser');
  }
};

exports.createOrUpdateUser = async userData => {
  try {
    const [createdOrUpdatedUser] = await UserModel.upsert(userData, { returning: true });
    return createdOrUpdatedUser;
  } catch (error) {
    logger.error(`${loggerPath}:createOrUpdateUser - database: ${error.message}`);
    throw databaseError('database error in createOrUpdateUser');
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

exports.findAllUsers = async (page, limit) => {
  try {
    const users = await UserModel.findAll({ ...getPagination(page, limit) });

    return users;
  } catch (error) {
    logger.error(`${loggerPath}:getUsers - database: ${error.message}`);
    throw databaseError('database error in getUsers');
  }
};

exports.updateUser = async (userData, userId) => {
  try {
    const [, [updatedUser]] = await UserModel.update(userData, { where: { id: userId }, returning: true });
    logger.info(`${loggerPath}:updateUser - updated user successfully: ${JSON.stringify(updatedUser)}`);

    return updatedUser;
  } catch (error) {
    logger.error(`${loggerPath}:updateUser - database: ${error.message}`);
    throw databaseError('database error in updateUser');
  }
};

exports.findUserByIdAndAuthenticated = async userId => {
  try {
    const foundUser = await UserModel.findOne({ where: { id: userId, authenticated: true } });

    return !!foundUser;
  } catch (error) {
    logger.error(`${loggerPath}:isAuthenticatedUser - database: ${error.message}`);
    throw databaseError('database error in isAuthenticatedUser');
  }
};
