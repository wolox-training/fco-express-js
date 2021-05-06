const { healthCheck } = require('./controllers/healthCheck');
const { signUp, signIn } = require('./controllers/users');
const { signUpDto, signInDto } = require('./dtos/users');
const { mapSnakeToCamel } = require('./middlewares/mappers');
const { validationSchema } = require('./middlewares/validationSchema');

exports.init = app => {
  app.get('/health', healthCheck);

  // user endpoints
  app.post('/users', [signUpDto, validationSchema, mapSnakeToCamel], signUp);
  app.post('/users/sessions', [signInDto, validationSchema], signIn);
};
