const request = require('supertest');

const app = require('../../app');
const { BAD_REQUEST_ERROR } = require('../../app/errors');
const { userMock } = require('../mocks/users');

const server = request(app);

describe('users endpoints', () => {
  describe('signUp endpoint', () => {
    test('should create an user successfully', async () => {
      const res = await server.post('/users').send(userMock);

      expect(res.statusCode).toBe(201);
      expect(res.body).toEqual({
        id: expect.any(Number),
        name: expect.any(String),
        last_name: expect.any(String),
        email: expect.any(String),
        created_at: expect.any(String)
      });
    });

    test('should fail when mail is wrong', async () => {
      const res = await server.post('/users').send({ ...userMock, email: 'test@mock.com' });

      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({
        internal_code: BAD_REQUEST_ERROR,
        message: { email: expect.any(Object) }
      });
    });

    test("should fail when password doesn't meet the restrictions", async () => {
      const res = await server.post('/users').send({ ...userMock, password: 'simple' });

      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({
        internal_code: BAD_REQUEST_ERROR,
        message: { password: expect.any(Object) }
      });
    });

    test("should fail when the required fields aren't passed", async () => {
      const res = await server.post('/users');

      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({
        internal_code: BAD_REQUEST_ERROR,
        message: {
          name: expect.any(Object),
          last_name: expect.any(Object),
          email: expect.any(Object),
          password: expect.any(Object)
        }
      });
    });
  });

  describe('signIn endpoint', () => {
    beforeEach(async () => {
      await server.post('/users').send(userMock);
    });

    test('should return acess token when credentials are valid', async () => {
      const { email, password } = userMock;

      const res = await server.post('/users/sessions').send({ email, password });

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({
        access_token: expect.any(String)
      });
    });

    test("should fail when email doesn't exist", async () => {
      const { password } = userMock;

      const res = await server.post('/users/sessions').send({ email: 'mock@wolox.co', password });

      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({
        internal_code: expect.any(String),
        message: expect.any(String)
      });
    });

    test("should fail when password isn't correct", async () => {
      const { email } = userMock;

      const res = await server.post('/users/sessions').send({ email, password: '00000000' });

      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({
        internal_code: expect.any(String),
        message: expect.any(String)
      });
    });
  });

  describe('getUsers endpoint', () => {
    let accessToken = '';

    beforeAll(async () => {
      const { email, password } = userMock;
      await server.post('/users').send(userMock);

      const res = await server.post('/users/sessions').send({ email, password });

      accessToken = res.body.access_token;
    });

    test("should fail when Authorization header isn't passed", async () => {
      const res = await server.get('/users');

      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({
        message: {
          authorization: expect.any(Object)
        },
        internal_code: expect.any(String)
      });
    });

    test('should return users succesfully without query params', async () => {
      const res = await server.get('/users').set({ Authorization: accessToken });

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({
        users: expect.any(Array)
      });
    });

    test('should return users succesfully with one query param', async () => {
      const limit = 2;
      const res = await server
        .get('/users')
        .query({ limit })
        .set({ Authorization: accessToken });

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({
        users: expect.any(Array)
      });
      expect(res.body.users.length).toBeLessThanOrEqual(limit);
    });

    test("should fail when page or limit query params aren't integers", async done => {
      const res = await server
        .get('/users')
        .query({ page: 'a', limit: 'b' })
        .set({ Authorization: accessToken });

      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({
        message: {
          page: expect.any(Object),
          limit: expect.any(Object)
        },
        internal_code: expect.any(String)
      });

      done();
    });
  });
});
