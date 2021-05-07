const { badRequestError } = require('../errors');
const logger = require('../logger');
const { verifyToken } = require('../utils/jwt');

exports.authenticated = (req, res, next) => {
  try {
    const accessToken = req.headers.authorization;

    if (!accessToken) throw new Error();

    const payload = verifyToken(accessToken);

    const { user: id, name } = payload;
    if (!id || !name) throw new Error();

    res.locals.user = { id, name };

    next();
  } catch (error) {
    logger.error(`jsonwebtoken:validation: ${error.message}`);
    throw badRequestError('invalid token');
  }
};
