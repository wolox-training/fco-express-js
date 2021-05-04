const request = require('supertest');

const app = require('../../app');
const { BAD_REQUEST_ERROR } = require('../../app/errors');
const { userMock } = require('../mocks/users');

const server = request(app);

describe('users endpoints', () => {
  describe('signUp endpoint', () => {
    test('should create an user successfully', async done => {
      const res = await server.post('/users').send(userMock);

      expect(res.statusCode).toBe(201);
      expect(res.body).toEqual({
        id: expect.any(Number),
        name: expect.any(String),
        last_name: expect.any(String),
        email: expect.any(String),
        created_at: expect.any(String)
      });

      done();
    });

    test('should fail when mail is wrong', async done => {
      const res = await server.post('/users').send({ ...userMock, email: 'test@mock.com' });

      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({
        internal_code: BAD_REQUEST_ERROR,
        message: { email: expect.any(Object) }
      });

      done();
    });

    test("should fail when password doesn't meet the restrictions", async () => {
      const res = await server.post('/users').send({ ...userMock, password: 'simple' });

      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({
        internal_code: BAD_REQUEST_ERROR,
        message: { password: expect.any(Object) }
      });
    });

    test("should fail when the required fields aren't passed", async done => {
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

      done();
    });
  });
});
