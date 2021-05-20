const logger = require('../logger');
const { postWeetSerializer, getWeetsSerializer, rateWeetSerializer } = require('../serializers/weets');
const { createOrUpdateRating, findRatingByUserAndWeet } = require('../services/ratings');
const { getQuote, createWeet, findAllWeets } = require('../services/weets');
const { plainToSerializer } = require('../utils/objects');
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
    return res.status(201).send(plainToSerializer(weet, postWeetSerializer));
  } catch (error) {
    return next(error);
  }
};

exports.getWeets = async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    logger.info(`${loggerPath}:getWeets: starting method with page: ${page} and limit ${limit}`);

    const weets = await findAllWeets(page, limit);
    return res.status(200).send(plainToSerializer({ weets }, getWeetsSerializer));
  } catch (error) {
    return next(error);
  }
};

exports.rateWeet = async (req, res, next) => {
  try {
    const {
      body: { score },
      params: { id: weetId },
      user: { id: userId }
    } = req;
    const ratingData = { userId, weetId, score };
    logger.info(`${loggerPath}:rateWeet: starting method with rating data: ${ratingData}`);

    const foundRating = await findRatingByUserAndWeet(userId, weetId);

    if (foundRating && foundRating.score === score) {
      return res.status(201).send(plainToSerializer(foundRating, rateWeetSerializer));
    }

    const createdOrUpdatedRating = await createOrUpdateRating(ratingData, foundRating);
    return res.status(201).send(plainToSerializer(createdOrUpdatedRating, rateWeetSerializer));
  } catch (error) {
    return next(error);
  }
};
