const { RolesType } = require('../fixtures/users');

exports.usersSeeds = [
  {
    name: 'Santiago',
    lastName: 'Hernandez',
    email: 'santiago.hernandez@wolox.co',
    password: '5up3r53cr37',
    role: RolesType.ADMIN
  }
];
