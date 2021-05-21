const app = require('./app');
const migrationsManager = require('./migrations');
const config = require('./config');
const logger = require('./app/logger');
const { sendEmailToEveryUserJob } = require('./app/cron-jobs/users');

const port = config.common.api.port || 8080;

Promise.resolve()
  .then(() => migrationsManager.check())
  .then(() => {
    sendEmailToEveryUserJob.start();

    app.listen(port);

    logger.info(`Listening on port: ${port}`);
  })
  .catch(logger.error);
