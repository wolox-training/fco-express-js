const { healthCheck } = require('./controllers/healthCheck');
const { signUp, signIn, getUsers } = require('./controllers/users');
const { postWeet, getWeets } = require('./controllers/weets');
const { signUpDto, signInDto, getUsersDto } = require('./dtos/users');
const { getWeetsDto } = require('./dtos/weets');
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
  app.get('/users', [authenticated, getUsersDto, validationSchema], getUsers);

  // weet endpoints
  app.post('/weets', [authenticated], postWeet);
  app.get('/weets', [authenticated, getWeetsDto, validationSchema], getWeets);
};
