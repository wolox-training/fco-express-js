// const controller = require('./controllers/controller');
const { healthCheck } = require('./controllers/healthCheck');
const { post } = require('./controllers/weets');

exports.init = app => {
  app.get('/health', healthCheck);
  app.post('/weets', [], post);
  // app.put('/endpoint/put/path', [], controller.methodPUT);
  // app.post('/endpoint/post/path', [], controller.methodPOST);
};
