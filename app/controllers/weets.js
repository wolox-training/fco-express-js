const logger = require('../logger');
const { postWeetSerializer, getWeetsSerializer } = require('../serializers/weets');
const { getQuote, createWeet, findAllWeets } = require('../services/weets');
const { mapToSerializer } = require('../utils/objects');
const { validateContent } = require('../validations/weets');

const loggerPath = 'controller:weet';

exports.postWeet = async (req, res, next) => {
  try {
    const { id: userId } = req.user;
    logger.info(`${loggerPath}:postWeet: starting postWeet method with userId - ${userId}}`);
    let { joke: content } = await getQuote();
    logger.info(
      `${loggerPath}:postWeet: continue postWeet method with content - ${JSON.stringify(content)}}`
    );

    content = validateContent(content);
    const weetData = { content, userId };
    const weet = await createWeet(weetData);
    return res.status(201).send(mapToSerializer(weet, postWeetSerializer));
  } catch (error) {
    logger.error(`${loggerPath}:postWeet: ${error.message}`);
    return next(error);
  }
};

exports.getWeets = async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    logger.info(`${loggerPath}:getWeets: starting method with page: ${page} and limit ${limit}`);

    const weets = await findAllWeets(page, limit);
    return res.status(200).send(mapToSerializer({ weets }, getWeetsSerializer));
  } catch (error) {
    logger.error(`${loggerPath}:getWeets: ${error.message}`);
    return next(error);
  }
};
