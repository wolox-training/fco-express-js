const { default: Axios } = require('axios');

const { urlApi } = require('../../config').common.geekJokesApi;
const errors = require('../errors');
const logger = require('../logger');

const loggerPath = 'service:weets';

exports.getQuote = async () => {
  try {
    const { data } = await Axios.get(urlApi);
    logger.info(`${loggerPath}:getQuote:data:${JSON.stringify(data)}`);
    return data;
  } catch (error) {
    logger.error(`${loggerPath}:getQuote:error:${error.message}`);
    throw errors.externalApiError('Have problems with geek jokes external service');
  }
};
