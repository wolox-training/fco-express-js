const { sendEmailToEveryUserJob } = require('../../../app/cron-jobs/users');
const { setupServer } = require('../../../server');
const { dailyCongratsEmailsTime } = require('../../../config').common.crons;

const mockCron = { start: jest.fn() };
jest.mock('../../../app/cron-jobs/users', () => ({
  sendEmailToEveryUserJob: jest.fn(() => mockCron)
}));

describe('sendEmailToEveryUserJob function', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Cron Job should be created and schedule it with specific cron time', done => {
    setupServer();

    expect(sendEmailToEveryUserJob).toBeCalledTimes(1);
    expect(sendEmailToEveryUserJob).toBeCalledWith(dailyCongratsEmailsTime);
    expect(mockCron.start).toBeCalledTimes(1);

    done();
  });
});
