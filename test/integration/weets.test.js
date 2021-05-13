const request = require('supertest');

const app = require('../../app');
const { UNAUTHORIZED_ERROR } = require('../../app/errors');
const { userMock } = require('../mocks/users');

const server = request(app);

describe('weets endpoints', () => {
  describe('postWeet endpoint', () => {
    let accessToken = '';

    beforeEach(async () => {
      const { email, password } = userMock;
      await server.post('/users').send(userMock);

      const res = await server.post('/users/sessions').send({ email, password });
      accessToken = res.body.access_token;
    });

    test("should fail when accessToken isn't passed", async () => {
      const res = await server.post('/weets');

      expect(res.statusCode).toBe(401);
      expect(res.body).toEqual({
        message: expect.any(String),
        internal_code: UNAUTHORIZED_ERROR
      });
    });

    test('should create a weet successfully', async done => {
      const res = await server.post('/weets').set({ Authorization: accessToken });

      expect(res.statusCode).toBe(201);
      expect(res.body).toEqual({
        id: expect.any(Number),
        content: expect.any(String),
        user_id: expect.any(Number),
        created_at: expect.any(String)
      });

      done();
    });
  });
});
