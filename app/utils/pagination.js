exports.getPagination = (page = 0, limit = 10) => {
  const offset = page * limit;
  return { offset, limit };
};
