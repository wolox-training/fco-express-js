exports.paginationSchema = {
  page: {
    optional: true,
    in: ['query'],
    isInt: { errorMessage: 'page must be integer' },
    toInt: true
  },
  limit: {
    optional: true,
    in: ['query'],
    isInt: { errorMessage: 'limit must be integer' },
    toInt: true
  }
};
