const { badRequestError } = require('../errors');
const logger = require('../logger');
const { findUserByEmail } = require('../services/users');

const loggerPath = 'middleware:users';

exports.existsEmail = async (req, _, next) => {
  try {
    const {
      body: { email }
    } = req;
    const foundUser = await findUserByEmail(email);

    if (foundUser) throw badRequestError('email already exists');

    next();
  } catch (error) {
    logger.error(`${loggerPath}:existsEmail: ${error.message}`);
    next(error);
  }
};
