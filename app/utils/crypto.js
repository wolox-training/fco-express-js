const { hash, genSalt } = require('bcrypt');

exports.hashText = async text => {
  const salt = await genSalt();
  const hashedText = await hash(text, salt);
  return hashedText;
};
