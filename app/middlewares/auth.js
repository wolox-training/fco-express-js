const { forbiddenError, unauthorizedError } = require('../errors');
const { RolesType } = require('../fixtures/users');
const logger = require('../logger');
const { verifyToken } = require('../utils/jwt');

exports.isAuthenticated = (req, _, next) => {
  const accessToken = req.headers.authorization;
  try {
    if (!accessToken) return next(unauthorizedError('token must be sent'));

    const payload = verifyToken(accessToken);

    const { user: id, name, role } = payload;
    if (!id || !name || !role) return next(forbiddenError('mistaken token'));

    req.user = { id, name, role };

    return next();
  } catch (error) {
    logger.info(`jsonwebtoken: ${error.message}`);
    return next(unauthorizedError('invalid token'));
  }
};

exports.isAdmin = (req, _, next) =>
  req.user.role === RolesType.ADMIN ? next() : next(forbiddenError('insufficient permissions'));
