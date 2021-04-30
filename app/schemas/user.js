const { name, lastName } = {
  name: {
    minLength: 3,
    maxLength: 30
  },
  lastName: {
    minLength: 3,
    maxLength: 30
  }
};

exports.userSchema = {
  name: {
    isLength: {
      errorMessage: `name must be at least ${name.minLength} characters long and a maximum of ${name.maxLength}`,
      options: { min: name.minLength, max: name.maxLength }
    }
  },
  last_name: {
    isLength: {
      errorMessage: `last name must be at least ${lastName.minLength} characters long and a maximun of ${lastName.maxLength}`,
      options: { min: lastName.minLength, max: lastName.maxLength }
    }
  }
};
