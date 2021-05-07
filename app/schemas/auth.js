exports.authSchema = {
  authorization: {
    in: ['headers'],
    isJWT: { errorMessage: 'token must be a json web token' }
  }
};
