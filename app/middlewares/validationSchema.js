const { validationResult } = require('express-validator');

const { badRequestError } = require('../errors');

exports.validationSchema = (req, _, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) throw badRequestError(errors.mapped());

  next();
};
