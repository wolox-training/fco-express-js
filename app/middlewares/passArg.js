exports.passArgToUserLocals = value => (_, res, next) => {
  res.locals.user = value;
  next();
};
