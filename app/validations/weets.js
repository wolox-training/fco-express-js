const { badRequestError } = require('../errors');

const validData = {
  content: {
    minLength: 3,
    maxLength: 140
  }
};

const { content } = validData;

const validateContent = text => {
  if (text.length < content.minLength || text.length > content.maxLength) {
    throw badRequestError(
      `content must be at least ${content.minLength} characters long and a maximun of ${content.maxLength}`
    );
  }
};

module.exports = {
  validData,
  validateContent
};
