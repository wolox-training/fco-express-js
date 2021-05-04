module.exports = {
  userId: {
    type: 'integer',
    example: 7
  },
  userName: {
    type: 'string',
    example: 'John'
  },
  userLastName: {
    type: 'string',
    example: 'Doe'
  },
  userEmail: {
    type: 'string',
    example: 'john.doe@wolox.com.ar'
  },
  userPassword: {
    type: 'string',
    example: '5up3r53cr37'
  },
  userCreatedAt: {
    type: 'string',
    example: '2021-05-03T23:42:42.024Z'
  },
  User: {
    type: 'object',
    properties: {
      name: {
        $ref: '#/components/schemas/userName'
      },
      last_name: {
        $ref: '#/components/schemas/userLastName'
      },
      email: {
        $ref: '#/components/schemas/userEmail'
      },
      password: {
        $ref: '#/components/schemas/userPassword'
      }
    }
  },
  Users: {
    type: 'object',
    properties: {
      users: {
        type: 'array',
        items: {
          $ref: '#/components/schemas/User'
        }
      }
    }
  },
  SignUp: {
    type: 'object',
    properties: {
      id: {
        $ref: '#/components/schemas/userId'
      },
      name: {
        $ref: '#/components/schemas/userName'
      },
      last_name: {
        $ref: '#/components/schemas/userLastName'
      },
      email: {
        $ref: '#/components/schemas/userEmail'
      },
      password: {
        $ref: '#/components/schemas/userPassword'
      },
      created_at: {
        $ref: '#/components/schemas/userCreatedAt'
      }
    }
  }
};
