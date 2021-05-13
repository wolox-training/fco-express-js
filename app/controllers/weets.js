const logger = require('../logger');
const { postWeetSerializer } = require('../serializers/weets');
const { getQuote, createWeet } = require('../services/weets');
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
