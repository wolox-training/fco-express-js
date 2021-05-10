const { unauthorizedError } = require('../errors');
const logger = require('../logger');
const { verifyToken } = require('../utils/jwt');

exports.authenticated = (req, _, next) => {
  const accessToken = req.headers.authorization;
  try {
    if (!accessToken) throw new Error();

    const payload = verifyToken(accessToken);

    const { user: id, name } = payload;
    if (!id || !name) throw new Error();

    req.user = { id, name };

    return next();
  } catch (error) {
    logger.info(`jsonwebtoken: ${error.message}`);
    return next(unauthorizedError('invalid token'));
  }
};
