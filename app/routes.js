const { healthCheck } = require('./controllers/healthCheck');
const { signUp, signIn, getUsers } = require('./controllers/users');
const { signUpDto, signInDto, getUsersDto } = require('./dtos/users');
const { RolesType } = require('./fixtures/roles');
const { authenticated } = require('./middlewares/auth');
const { mapSnakeToCamel } = require('./middlewares/mappers');
const { passArgToUserLocals } = require('./middlewares/passArg');
const { validationSchema } = require('./middlewares/validationSchema');

exports.init = app => {
  app.get('/health', healthCheck);

  // user endpoints
  app.post(
    '/admin/users',
    [signUpDto, validationSchema, mapSnakeToCamel, passArgToUserLocals({ role: RolesType.ADMIN })],
    signUp
  );
  app.post(
    '/users',
    [signUpDto, validationSchema, mapSnakeToCamel, passArgToUserLocals({ role: RolesType.REGULAR })],
    signUp
  );
  app.post('/users/sessions', [signInDto, validationSchema], signIn);
  app.get('/users', [getUsersDto, validationSchema, authenticated], getUsers);
};
