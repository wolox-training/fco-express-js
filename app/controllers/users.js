const { createUser, findAllUsers, findUserByEmail } = require('../services/users');
const logger = require('../logger');
const { mapToSerializer } = require('../utils/objects');
const { signUpSerializer, signInSerializer, getUsersSerializer } = require('../serializers/users');
const { isOriginalText } = require('../utils/crypto');
const { signPayload } = require('../utils/jwt');
const { accessTokenExpirationTime } = require('../../config').common.session.times;
const { badRequestError } = require('../errors');

const loggerPath = 'controller:users';

exports.signUp = async (req, res, next) => {
  try {
    const { body: userData } = req;
    logger.info(
      `${loggerPath}:signUp: starting signUp method with the next body ${JSON.stringify(userData)}`
    );

    const createdUser = await createUser(userData);
    return res.status(201).send(mapToSerializer(createdUser, signUpSerializer));
  } catch (error) {
    return next(error);
  }
};

exports.signIn = async (req, res, next) => {
  try {
    const {
      body: { email, password }
    } = req;
    logger.info(`${loggerPath}:signIn: starting signIn method with the next body ${{ email, password }}`);

    const foundUser = await findUserByEmail(email);

    if (!foundUser) throw badRequestError('invalid credentials');
    logger.info(`${loggerPath}:signIn - user found by email: ${JSON.stringify(foundUser)}`);

    const {
      dataValues: { id, name, lastName, password: hashedPassword }
    } = foundUser;

    const isValidPassword = await isOriginalText(password, hashedPassword);

    if (!isValidPassword) throw badRequestError('invalid credentials');

    const accessToken = signPayload(
      { user: id, name: `${name} ${lastName}` },
      { expiresIn: accessTokenExpirationTime }
    );

    return res.status(200).send(mapToSerializer({ accessToken }, signInSerializer));
  } catch (error) {
    return next(error);
  }
};

exports.getUsers = async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    logger.info(`${loggerPath}:getUsers: starting getUsers method with page: ${page} and limit ${limit}`);

    const users = await findAllUsers(page, limit);
    return res.status(200).send(mapToSerializer({ users }, getUsersSerializer));
  } catch (error) {
    return next(error);
  }
};
