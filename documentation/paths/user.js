const { BAD_REQUEST_ERROR } = require('../../app/errors');

module.exports = {
  '/users': {
    post: {
      tags: ['CRUD operations'],
      description: 'Create user',
      operationId: 'createUser',
      parameters: [],
      requestBody: {
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/User'
            }
          }
        },
        required: true
      },
      responses: {
        201: {
          description: 'New user was created',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/SignUp'
              },
              example: {
                id: 1,
                name: 'John',
                last_name: 'Doe',
                email: 'john.doe@wolox.com.ar',
                password: '5up3r53cr37',
                created_at: '2021-05-03T23:42:42.024Z'
              }
            }
          }
        },
        400: {
          description: 'Bad request',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              },
              example: {
                message: {
                  email: {
                    location: 'body',
                    msg: 'invalid email format',
                    value: 'john.doe/wolox.com.ar',
                    param: 'email'
                  }
                },
                internal_code: BAD_REQUEST_ERROR
              }
            }
          }
        }
      }
    }
  }
};
