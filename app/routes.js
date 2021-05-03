const { healthCheck } = require('./controllers/healthCheck');
const { signUp } = require('./controllers/users');
const { signUpDto } = require('./dtos/user');
const { mapSnakeToCamel } = require('./middlewares/mappers');
const { validationSchema } = require('./middlewares/validationSchema');

exports.init = app => {
  app.get('/health', healthCheck);

  // user endpoints
  app.post('/users', [signUpDto, validationSchema, mapSnakeToCamel], signUp);
};
