const { convertKeysFromSnakeToCamel } = require('../utils/objects');

exports.mapSnakeToCamel = (req, _, next) => {
  req.body = convertKeysFromSnakeToCamel(req.body);

  next();
};
