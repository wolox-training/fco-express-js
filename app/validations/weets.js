const { content } = {
  content: {
    minLength: 3,
    maxLength: 140
  }
};

exports.validateContent = text =>
  text.length >= content.minLength && text.length <= content.maxLength
    ? text
    : text.substring(0, content.maxLength);
