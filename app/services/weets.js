const { default: Axios } = require('axios');
const logger = require('../logger');

const config = require('../../config');

exports.getQuote = async () => {
  try {
    const { data } = await Axios.get(config.common.api.randomWeetsApi);
    return data;
  } catch (error) {
    logger.error(error);
    return error;
  }
};
