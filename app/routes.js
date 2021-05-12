const { healthCheck } = require('./controllers/healthCheck');
const { signUp, signUpAdmin, signIn, getUsers } = require('./controllers/users');
const { signUpDto, signInDto, getUsersDto } = require('./dtos/users');
const { isAuthenticated, isAdmin } = require('./middlewares/auth');
const { mapSnakeToCamel } = require('./middlewares/mappers');
const { existsEmail } = require('./middlewares/users');
const { validationSchema } = require('./middlewares/validationSchema');

exports.init = app => {
  app.get('/health', healthCheck);

  // user endpoints
  app.post(
    '/admin/users',
    [isAuthenticated, isAdmin, signUpDto, validationSchema, mapSnakeToCamel],
    signUpAdmin
  );
  app.post('/users', [signUpDto, validationSchema, mapSnakeToCamel, existsEmail], signUp);
  app.post('/users/sessions', [signInDto, validationSchema], signIn);
  app.get('/users', [isAuthenticated, getUsersDto, validationSchema], getUsers);
};
