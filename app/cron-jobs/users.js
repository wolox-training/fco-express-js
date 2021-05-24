const { CronJob } = require('cron');

const { sendEmail } = require('../services/emails');
const { findAllUsers } = require('../services/users');

exports.sendEmailToEveryUserJob = cronTime =>
  new CronJob(
    cronTime,
    async () => {
      const foundUsers = await findAllUsers(0, 0);

      for (const user of foundUsers) {
        const mailOptions = {
          to: user.email,
          subject: 'We are delighted to have you with us!',
          text: `${user.name} ${user.lastName} keep it up.`
        };

        sendEmail(mailOptions);
      }
    },
    null
  );
