const { compare, genSalt, hash } = require('bcrypt');

exports.hashText = async text => {
  const salt = await genSalt();
  const hashedText = await hash(text, salt);
  return hashedText;
};

exports.isOriginalText = async (text, hashedText) => {
  const isOriginal = await compare(text, hashedText);

  return isOriginal;
};
