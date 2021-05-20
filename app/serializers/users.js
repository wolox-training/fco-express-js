exports.signUpSerializer = ['id', 'name', 'lastName', 'email', 'createdAt'];

exports.signInSerializer = ['accessToken'];

exports.getUsersSerializer = [{ users: [this.signUpSerializer] }];

exports.signOutSerializer = ['authenticated'];
