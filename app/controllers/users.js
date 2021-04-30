const { signUp } = require('../services/users');
const logger = require('../logger');
const { databaseError } = require('../errors');

const loggerPath = 'controller:users';

exports.signUp = async (req, res) => {
  try {
    const { body: userData } = req;
    const createdUser = await signUp(userData);
    return res.status(201).send(createdUser);
  } catch (error) {
    logger.error(`${loggerPath}:signUp:database: ${error.message}`);
    throw databaseError('database error in SignUp');
  }
};
