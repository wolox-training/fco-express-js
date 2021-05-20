const { healthCheck } = require('./controllers/healthCheck');
const { signUp, signUpAdmin, signIn, getUsers, signOut } = require('./controllers/users');
const { postWeet, getWeets, rateWeet } = require('./controllers/weets');
const { signUpDto, signInDto, getUsersDto } = require('./dtos/users');
const { getWeetsDto, rateWeetDto } = require('./dtos/weets');
const { signUpMapper, signInMapper } = require('./mappers/users');
const { isAuthenticated, isAdmin } = require('./middlewares/auth');
const { toMap } = require('./middlewares/toMap');
const { existsEmail } = require('./middlewares/users');
const { validationSchema } = require('./middlewares/validationSchema');

exports.init = app => {
  app.get('/health', healthCheck);

  // user endpoints
  app.post(
    '/admin/users',
    [isAuthenticated, isAdmin, signUpDto, validationSchema, toMap(signUpMapper)],
    signUpAdmin
  );
  app.post('/users', [signUpDto, validationSchema, existsEmail, toMap(signUpMapper)], signUp);
  app.post('/users/sessions', [signInDto, validationSchema, toMap(signInMapper)], signIn);
  app.post('/users/sessions/invalidate_all', [isAuthenticated], signOut);
  app.get('/users', [isAuthenticated, getUsersDto, validationSchema], getUsers);

  // weet endpoints
  app.post('/weets', [isAuthenticated], postWeet);
  app.get('/weets', [isAuthenticated, getWeetsDto, validationSchema], getWeets);
  app.post('/weets/:id/ratings', [isAuthenticated, rateWeetDto, validationSchema], rateWeet);
};
