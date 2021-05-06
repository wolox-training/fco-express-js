exports.paginationSchema = {
  page: {
    optional: true,
    isInt: { errorMessage: 'page must be integer' },
    toInt: true
  },
  limit: {
    optional: true,
    isInt: { errorMessage: 'limit must be integer' },
    toInt: true
  }
};
