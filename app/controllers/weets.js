const { getQuote } = require('../services/weets');

exports.post = async (_, res) => {
  const { joke: weet } = await getQuote();
  res.status(200).send({ weet });
};
