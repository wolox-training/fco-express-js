const { signUp } = require('../services/users');
const logger = require('../logger');
const { mapToSerializer } = require('../utils/objects');
const { signUpSerializer } = require('../serializers/users');

const loggerPath = 'controller:users';

exports.signUp = async (req, res, next) => {
  try {
    logger.info(`${loggerPath}:signUp:starting`);
    const { body: userData } = req;
    const createdUser = await signUp(userData);
    return res.status(201).send(mapToSerializer(createdUser, signUpSerializer));
  } catch (error) {
    logger.error(`${loggerPath}:signUp:database: ${error.message}`);
    return next(error);
  }
};
