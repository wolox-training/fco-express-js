const { snakeToCamel, camelToSnake } = require('./strings');

exports.convertKeysFromSnakeToCamel = obj =>
  Object.keys(obj).reduce((acc, curr) => ({ ...acc, [snakeToCamel(curr)]: obj[curr] }), {});

exports.convertKeysFromCamelToSnake = obj =>
  Object.keys(obj).reduce((acc, curr) => ({ ...acc, [camelToSnake(curr)]: obj[curr] }), {});

exports.mapToSerializer = (obj, serializer) => {
  const serializedObj = serializer.reduce((acc, curr) => ({ ...acc, [curr]: obj[curr] }), {});

  return this.convertKeysFromCamelToSnake(serializedObj);
};
