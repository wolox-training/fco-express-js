const { snakeToCamel, camelToSnake } = require('./strings');

exports.convertKeysFromSnakeToCamel = obj =>
  Object.keys(obj).reduce((acc, curr) => ({ ...acc, [snakeToCamel(curr)]: obj[curr] }), {});

exports.convertKeysFromCamelToSnake = obj =>
  Object.keys(obj).reduce((acc, curr) => ({ ...acc, [camelToSnake(curr)]: obj[curr] }), {});
