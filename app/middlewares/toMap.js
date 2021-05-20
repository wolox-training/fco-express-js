const { plainToMapper } = require('../utils/objects');

exports.toMap = mapper => (req, _, next) => {
  req.body = plainToMapper(req.body, mapper);
  next();
};
