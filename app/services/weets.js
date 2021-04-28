const { default: Axios } = require('axios');

const config = require('../../config');
const errors = require('../errors');
const logger = require('../logger');

exports.getQuote = async () => {
  try {
    const { data } = await Axios.get(config.common.geekJokesApi);
    logger.info(data);
    return data;
  } catch (error) {
    logger.error(error);
    throw errors.externalApiError('Have problems with geek jokes external service');
  }
};
