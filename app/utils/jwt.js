const { sign } = require('jsonwebtoken');

const { secret } = require('../../config').common.session;

exports.signPayload = (payload, opts) => sign(payload, secret, opts);
