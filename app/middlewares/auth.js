const { forbiddenError, unauthorizedError } = require('../errors');
const logger = require('../logger');
const { verifyToken } = require('../utils/jwt');

exports.authenticated = (req, _, next) => {
  const accessToken = req.headers.authorization;
  try {
    if (!accessToken) return next(unauthorizedError('token must be sent'));

    const payload = verifyToken(accessToken);

    const { user: id, name } = payload;
    if (!id || !name) return next(forbiddenError('mistaken token'));

    req.user = { id, name };

    return next();
  } catch (error) {
    logger.info(`jsonwebtoken: ${error.message}`);
    return next(unauthorizedError('invalid token'));
  }
};
