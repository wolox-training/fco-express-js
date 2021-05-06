const { verifyToken } = require('../utils/jwt');

exports.authSchema = {
  authorization: {
    isJWT: { errorMessage: 'token must be a json web token' },
    custom: (accessToken, { res }) => {
      verifyToken(accessToken, (err, payload) => {
        if (err) throw new Error('invalid token');

        const { user: id, name } = payload;

        if (!id || !name) throw new Error('invalid token');

        res.locals.user = { id, name };
      });
    }
  }
};
