const nodemailer = require('nodemailer');

const { user, pass } = require('../../config').common.mailer;
const { externalApiError } = require('../errors');
const logger = require('../logger');

const loggerPath = 'service:mails';

const transporter = nodemailer.createTransport({
  host: 'smtp.mailtrap.io',
  port: 2525,
  auth: { user, pass }
});

exports.sendEmail = mailOptions => {
  logger.info(`${loggerPath}:sendMail: starting method with ${JSON.stringify(mailOptions)}`);
  mailOptions.from = "'Witter Contact' <59963594a8-6ba2fb@inbox.mailtrap.io>";
  logger.info(`${loggerPath}:sendMail: continue method with ${JSON.stringify(mailOptions)}`);
  transporter
    .sendMail(mailOptions)
    .then(res => logger.info(`${loggerPath}:sendMail: sent email - ${res.messageId}`))
    .catch(error => {
      logger.error(`${loggerPath}:sendMail: ${error.message}`);
      throw externalApiError('external service error in sendMail');
    });
};
