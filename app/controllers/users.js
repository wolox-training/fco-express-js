const { badRequestError } = require('../errors');
const { RolesType } = require('../fixtures/users');
const logger = require('../logger');
const {
  signUpSerializer,
  signInSerializer,
  getUsersSerializer,
  signOutSerializer
} = require('../serializers/users');
const { sendEmail } = require('../services/emails');
const {
  createUser,
  findAllUsers,
  findUserByEmail,
  createOrUpdateUser,
  updateUser
} = require('../services/users');
const { isOriginalText } = require('../utils/crypto');
const { signPayload } = require('../utils/jwt');
const { plainToSerializer } = require('../utils/objects');
const { accessTokenExpirationTime } = require('../../config').common.session.times;

const loggerPath = 'controller:users';

exports.signUp = async (req, res, next) => {
  try {
    const { body: userData } = req;
    logger.info(`${loggerPath}:signUp: starting method with the next body ${JSON.stringify(userData)}`);

    const createdUser = await createUser(userData);

    sendEmail({
      to: userData.email,
      subject: 'Welcome to Witter!',
      text: `We are delighted that you are here ${userData.name} ${userData.lastName}.`
    });

    return res.status(201).send(plainToSerializer(createdUser, signUpSerializer));
  } catch (error) {
    return next(error);
  }
};

exports.signUpAdmin = async (req, res, next) => {
  try {
    const { body: userData } = req;
    userData.role = RolesType.ADMIN;
    logger.info(`${loggerPath}:signUpAdmin: starting method with the next body ${JSON.stringify(userData)}`);

    sendEmail({
      to: userData.email,
      subject: 'Welcome to Witter!',
      text: `${userData.name} ${userData.lastName}, you have the power!`
    });

    const createdOrUpdatedUser = await createOrUpdateUser(userData);
    logger.info(`${loggerPath}:signUpAdmin: createdOrUpdatedUser - ${JSON.stringify(createdOrUpdatedUser)}`);
    return res.status(201).send(plainToSerializer(createdOrUpdatedUser, signUpSerializer));
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
      dataValues: { id, name, lastName, password: hashedPassword, role }
    } = foundUser;

    const isValidPassword = await isOriginalText(password, hashedPassword);

    if (!isValidPassword) throw badRequestError('invalid credentials');

    await updateUser({ authenticated: true }, id);

    const accessToken = signPayload(
      { user: id, name: `${name} ${lastName}`, role },
      { expiresIn: accessTokenExpirationTime }
    );

    return res.status(200).send(plainToSerializer({ accessToken }, signInSerializer));
  } catch (error) {
    return next(error);
  }
};

exports.signOut = async (req, res, next) => {
  try {
    const { id: userId } = req.user;

    const updatedUser = await updateUser({ authenticated: false }, userId);

    return res.status(200).send(plainToSerializer(updatedUser, signOutSerializer));
  } catch (error) {
    return next(error);
  }
};

exports.getUsers = async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    logger.info(`${loggerPath}:getUsers: starting getUsers method with page: ${page} and limit ${limit}`);

    const users = await findAllUsers(page, limit);
    return res.status(200).send(plainToSerializer({ users }, getUsersSerializer));
  } catch (error) {
    return next(error);
  }
};
