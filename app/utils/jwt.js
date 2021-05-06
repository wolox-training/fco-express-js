const { sign } = require('jsonwebtoken');

const { jwtSecret } = require('../../config').common.api;

exports.jwtExpirationTimes = {
  accessToken: 60 * 15
};

exports.signPayload = (payload, opts) => sign(payload, jwtSecret, opts);
