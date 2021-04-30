const { existsUserEmail } = require('../services/users');

const { email, password } = {
  email: {
    woloxDomainRegex: /@wolox.co(m.(ar|mx))?/i
  },
  password: {
    minLength: 8,
    maxLength: 15
  }
};

exports.credentialSchema = {
  email: {
    isEmail: { errorMessage: 'invalid email format' },
    matches: { errorMessage: "email doesn't belong to wolox domain", options: email.woloxDomainRegex },
    custom: {
      options: async newEmail => {
        const foundEmail = await existsUserEmail(newEmail);

        if (foundEmail) throw new Error('email already exist');
      }
    }
  },
  password: {
    isAlphanumeric: { errorMessage: 'password must be alphanumeric' },
    isLength: {
      errorMessage: `password must be at least ${password.minLength} characters long and a maximun of ${password.maxLength}`,
      options: { min: password.minLength, max: password.maxLength }
    }
  }
};
