const { healthCheck } = require('./controllers/healthCheck');
const { signUp, signIn, getUsers } = require('./controllers/users');
const { signUpDto, signInDto, getUsersDto } = require('./dtos/users');
const { authenticated } = require('./middlewares/auth');
const { mapSnakeToCamel } = require('./middlewares/mappers');
const { existsEmail } = require('./middlewares/users');
const { validationSchema } = require('./middlewares/validationSchema');

exports.init = app => {
  app.get('/health', healthCheck);

  // user endpoints
  app.post('/users', [signUpDto, validationSchema, existsEmail, mapSnakeToCamel], signUp);
  app.post('/users/sessions', [signInDto, validationSchema], signIn);
  app.get('/users', [authenticated, getUsersDto, validationSchema], getUsers);
};
