const { badRequestError } = require('../errors');
const { RolesType } = require('../fixtures/roles');
const logger = require('../logger');
const { signUpSerializer, signInSerializer, getUsersSerializer } = require('../serializers/users');
const { createUser, findAllUsers, findUserByEmail } = require('../services/users');
const { isOriginalText } = require('../utils/crypto');
const { signPayload } = require('../utils/jwt');
const { mapToSerializer } = require('../utils/objects');
const { accessTokenExpirationTime } = require('../../config').common.session.times;

const loggerPath = 'controller:users';

exports.signUp = async (req, res, next) => {
  try {
    logger.info(`${loggerPath}:signUp: role is ${res.locals.user.role}`);
    const { body: userData } = req;
    userData.role = res.locals.user.role;
    logger.info(
      `${loggerPath}:signUp: starting signUp method with the next body ${JSON.stringify(userData)}`
    );

    const foundUser = await findUserByEmail(userData.email);
    logger.info(`${loggerPath}:signUp: found user by email is ${foundUser}`);

    const wantToBeAdmin = userData.role === RolesType.ADMIN;

    let user = null;

    if (foundUser) {
      const isAdmin = foundUser.role === RolesType.ADMIN;
      if ((isAdmin && wantToBeAdmin) || !wantToBeAdmin) throw badRequestError('email already exists');

      foundUser.role = RolesType.ADMIN;
      user = await foundUser.save();
    } else {
      user = await createUser(userData);
    }

    return res.status(201).send(mapToSerializer(user, signUpSerializer));
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
