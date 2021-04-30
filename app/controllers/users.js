const { signUp } = require('../services/users');

exports.signUp = async (req, res) => {
  const { body: userData } = req;
  const createdUser = await signUp(userData);
  res.status(201).send(createdUser);
};
