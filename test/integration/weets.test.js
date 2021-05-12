const request = require('supertest');

const app = require('../../app');
const { UNAUTHORIZED_ERROR, BAD_REQUEST_ERROR } = require('../../app/errors');
const { userMock } = require('../mocks/users');

const server = request(app);

describe('weets endpoints', () => {
  let accessToken = '';

  beforeAll(async () => {
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
});
