const { snakeToCamel, camelToSnake } = require('./strings');

exports.convertKeysFromSnakeToCamel = obj =>
  Object.keys(obj).reduce((acc, curr) => ({ ...acc, [snakeToCamel(curr)]: obj[curr] }), {});

exports.convertKeysFromCamelToSnake = obj =>
  Object.keys(obj).reduce((acc, curr) => ({ ...acc, [camelToSnake(curr)]: obj[curr] }), {});

exports.convertValuesToArray = obj => Object.values(obj);

exports.plainToSerializer = (obj, serializer) =>
  serializer.reduce((acc, curr) => {
    if (typeof curr !== 'object') {
      return { ...acc, [camelToSnake(curr)]: obj[curr] };
    }

    const entry = Object.entries(curr)[0];
    if (typeof entry[1][0] !== 'object') {
      return { ...acc, [camelToSnake(entry[0])]: this.plainToSerializer(obj[entry[0]], entry[1]) };
    }

    return {
      ...acc,
      [camelToSnake(entry[0])]: obj[entry[0]].map(subObj => this.plainToSerializer(subObj, entry[1][0]))
    };
  }, {});

exports.plainToMapper = (obj, mapper) => {
  const mappedObj = mapper.reduce((acc, curr) => ({ ...acc, [curr]: obj[curr] }), {});

  return this.convertKeysFromSnakeToCamel(mappedObj);
};
