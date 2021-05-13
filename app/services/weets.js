const { default: Axios } = require('axios');

const { urlApi } = require('../../config').common.geekJokesApi;
const { databaseError, externalApiError } = require('../errors');
const logger = require('../logger');
const { Weet: WeetModel } = require('../models');
const { getPagination } = require('../utils/pagination');

const loggerPath = 'service:weets';

exports.getQuote = async () => {
  try {
    const { data } = await Axios.get(urlApi);
    logger.info(`${loggerPath}:getQuote:data:${JSON.stringify(data)}`);
    return data;
  } catch (error) {
    logger.error(`${loggerPath}:getQuote:error:${error.message}`);
    throw externalApiError('problems with geek jokes external service');
  }
};

exports.createWeet = async weetData => {
  try {
    logger.info(`${loggerPath}:createWeet receiving this data: ${JSON.stringify(weetData)}`);
    const weet = await WeetModel.create(weetData);
    return weet;
  } catch (error) {
    logger.error(`${loggerPath}:createWeet: ${error.message}`);
    throw databaseError('database error in createWeet');
  }
};

exports.findAllWeets = async (page, limit) => {
  try {
    const weets = await WeetModel.findAll({ ...getPagination(page, limit) });
    return weets;
  } catch (error) {
    logger.error(`${loggerPath}:findAllWeets: ${error.message}`);
    throw databaseError('database error in findAllWeets');
  }
};
