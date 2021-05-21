const request = require('supertest');

const app = require('../../app');
const { UNAUTHORIZED_ERROR, BAD_REQUEST_ERROR } = require('../../app/errors');
const { PositionsType } = require('../../app/fixtures/users');
const { sendEmail } = require('../../app/services/emails');
const { findUserByEmail } = require('../../app/services/users');
const { userMock } = require('../mocks/users');

const server = request(app);

jest.mock('../../app/services/emails', () => ({
  sendEmail: jest.fn()
}));

describe('weets endpoints', () => {
  let accessToken = '';

  beforeEach(async () => {
    jest.clearAllMocks();

    const { email, password } = userMock;
    await server.post('/users').send(userMock);

    const res = await server.post('/users/sessions').send({ email, password });
    accessToken = res.body.access_token;
  });

  describe('postWeet endpoint', () => {
    beforeEach(async () => {
      await server.post('/users').send(userMock);
    });

    test("should fail when accessToken isn't passed", async () => {
      const res = await server.post('/weets');

      expect(res.statusCode).toBe(401);
      expect(res.body).toEqual({
        message: expect.any(String),
        internal_code: UNAUTHORIZED_ERROR
      });
    });

    test('should create a weet successfully', async () => {
      const res = await server.post('/weets').set({ Authorization: accessToken });

      expect(res.statusCode).toBe(201);
      expect(res.body).toEqual({
        id: expect.any(Number),
        content: expect.any(String),
        user_id: expect.any(Number),
        created_at: expect.any(String)
      });
    });
  });

  describe('getWeets endpoint', () => {
    test("should fail when authorization header isn't passed", async () => {
      const res = await server.get('/weets');

      expect(res.statusCode).toBe(401);
      expect(res.body).toEqual({
        message: expect.any(String),
        internal_code: UNAUTHORIZED_ERROR
      });
    });

    test("should return weets successfully if page and limit queries aren't passed", async () => {
      const res = await server.get('/weets').set({ Authorization: accessToken });

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({
        weets: expect.any(Object)
      });
    });

    test("should fail when page or limit aren't integer", async () => {
      const limit = '2a';
      const res = await server
        .get('/weets')
        .set({ Authorization: accessToken })
        .query({ limit });

      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({
        message: expect.any(Object),
        internal_code: BAD_REQUEST_ERROR
      });
    });
  });

  describe('rateWeet endpoint', () => {
    test("should fail when authorization header isn't passed", async () => {
      const res = await server.post('/weets/1/ratings');

      expect(res.statusCode).toBe(401);
      expect(res.body).toEqual({
        message: expect.any(String),
        internal_code: UNAUTHORIZED_ERROR
      });
    });

    test('should fail when score is an illegal value', async () => {
      const score = 0;
      const res = await server
        .post('/weets/1/ratings')
        .set({ Authorization: accessToken })
        .send({ score });

      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({
        message: {
          score: expect.any(Object)
        },
        internal_code: BAD_REQUEST_ERROR
      });
    });

    test('should create rating successfully', async () => {
      await server.post('/users').send(userMock);

      expect(sendEmail).toBeCalledTimes(1);

      const {
        body: { id: weetId }
      } = await server.post('/weets').set({ Authorization: accessToken });
      const score = 1;

      const res = await server
        .post(`/weets/${weetId}/ratings`)
        .set({ Authorization: accessToken })
        .send({ score });

      expect(res.statusCode).toBe(201);
      expect(res.body).toEqual({
        id: expect.any(Number),
        user_id: expect.any(Number),
        weet_id: expect.any(Number),
        score: expect.any(Number),
        updated_at: expect.any(String)
      });
    });

    test('should change user position to Lead when get 5 of score for your weets', async done => {
      await server.post('/users').send(userMock);

      expect(sendEmail).toBeCalledTimes(1);

      for (let i = 0; i < 5; i++) {
        await server.post('/weets').set({ Authorization: accessToken });
      }

      const score = 1;

      for (let weetId = 1; weetId <= 4; weetId++) {
        await server
          .post(`/weets/${weetId}/ratings`)
          .set({ Authorization: accessToken })
          .send({ score });
      }

      let foundUser = await findUserByEmail(userMock.email);

      expect(foundUser.position).toBe(PositionsType.DEVELOPER);

      await server
        .post('/weets/5/ratings')
        .set({ Authorization: accessToken })
        .send({ score });

      foundUser = await findUserByEmail(userMock.email);

      expect(foundUser.position).toBe(PositionsType.LEAD);

      done();
    });
  });
});
