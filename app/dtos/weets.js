const { checkSchema } = require('express-validator');

const { paginationSchema } = require('../schemas/pagination');

exports.getWeetsDto = checkSchema({ ...paginationSchema });
