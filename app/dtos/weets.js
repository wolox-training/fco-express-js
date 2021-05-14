const { checkSchema } = require('express-validator');

const { paginationSchema } = require('../schemas/pagination');
const { weetSchema } = require('../schemas/weet');

exports.getWeetsDto = checkSchema({ ...paginationSchema });

exports.rateWeetDto = checkSchema({ ...weetSchema });
