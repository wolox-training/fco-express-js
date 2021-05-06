const { signUp, signIn, getUsers } = require('../services/users');
const logger = require('../logger');
const { mapToSerializer } = require('../utils/objects');
const { signUpSerializer, signInSerializer, getUsersSerializer } = require('../serializers/users');

const loggerPath = 'controller:users';

exports.signUp = async (req, res, next) => {
  try {
    const { body: userData } = req;
    logger.info(
      `${loggerPath}:signUp: starting signUp method with the next body ${JSON.stringify(userData)}`
    );

    const createdUser = await signUp(userData);
    return res.status(201).send(mapToSerializer(createdUser, signUpSerializer));
  } catch (error) {
    return next(error);
  }
};

exports.signIn = async (req, res, next) => {
  try {
    const { body: userData } = req;
    logger.info(
      `${loggerPath}:signIn: starting signIn method with the next body ${JSON.stringify(userData)}`
    );

    const response = await signIn(userData);
    return res.status(200).send(mapToSerializer(response, signInSerializer));
  } catch (error) {
    return next(error);
  }
};

exports.getUsers = async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    logger.info(`${loggerPath}:getUsers: starting getUsers method with page: ${page} and limit ${limit}`);

    const users = await getUsers(page, limit);
    return res.status(200).send(mapToSerializer({ users }, getUsersSerializer));
  } catch (error) {
    return next(error);
  }
};
