const { databaseError } = require('../errors');
const logger = require('../logger');
const { sequelize, User: UserModel, Rating: RatingModel, Weet: WeetModel } = require('../models');

const loggerPath = 'service:ratings';

exports.findRatingByUserAndWeet = async (userId, weetId) => {
  try {
    const foundRating = await RatingModel.findOne({ where: { userId, weetId } });
    return foundRating;
  } catch (error) {
    logger.error(`${loggerPath}:findRatingByUserAndWeet: ${error.message}`);
    throw databaseError('database error in findRatingByUserAndWeet');
  }
};

exports.createOrUpdateRating = async (ratingData, foundRating) => {
  let transaction = {};
  try {
    transaction = await sequelize.transaction();

    let createdOrUpdatedRating = null;

    if (foundRating) {
      foundRating.score = ratingData.score;
      createdOrUpdatedRating = await foundRating.save({ transaction });
    } else {
      createdOrUpdatedRating = await RatingModel.create(ratingData, { transaction });
    }

    const foundWeetOfAuthor = await WeetModel.findByPk(ratingData.weetId, { transaction });
    logger.info(
      `${loggerPath}:createOrUpdateRating: found weet of author is - ${JSON.stringify(foundWeetOfAuthor)}`
    );
    const foundWeets = await WeetModel.findAll({ where: { userId: foundWeetOfAuthor.userId }, transaction });
    logger.info(`${loggerPath}:createOrUpdateRating: found weets are - ${JSON.stringify(foundWeets)}`);

    const weetsIds = foundWeets.map(({ id }) => id);
    logger.info(
      `${loggerPath}:createOrUpdateRating: found weets are as array of ids - ${JSON.stringify(weetsIds)}`
    );
    const foundRatingsOfAuthor = await RatingModel.findAll({
      attributes: ['score'],
      where: { weetId: weetsIds },
      transaction
    });
    logger.info(
      `${loggerPath}:createOrUpdateRating: found ratings of author are - ${JSON.stringify(
        foundRatingsOfAuthor
      )}`
    );
    const totalScore = foundRatingsOfAuthor.reduce((acc, rating) => acc + rating.score, 0);
    logger.info(
      `${loggerPath}:createOrUpdateRating: sum score of found ratings is - ${JSON.stringify(totalScore)}`
    );

    const foundAuthor = await UserModel.findByPk(foundWeetOfAuthor.userId, { transaction });
    const positionByScore = foundAuthor.getPositionWith(totalScore);
    const needChangePosition = foundAuthor.position !== positionByScore;
    logger.info(
      `${loggerPath}:createOrUpdateRating: position by score is - ${positionByScore} ${needChangePosition}`
    );

    if (needChangePosition) {
      foundAuthor.position = positionByScore;
      await foundAuthor.save({ transaction });
    }

    await transaction.commit();
    return createdOrUpdatedRating;
  } catch (error) {
    logger.error(`${loggerPath}:createOrUpdateRating: ${error.message}`);
    await transaction.rollback();
    throw databaseError('database error in createOrUpdateRating');
  }
};
