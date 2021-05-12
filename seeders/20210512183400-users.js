'use strict';

const { usersSeeds } = require('../app/seeds/users');
const { hashText } = require('../app/utils/crypto');
const { convertKeysFromCamelToSnake } = require('../app/utils/objects');

module.exports = {
  up: async queryInterface => {
    const users = [];
    for (const user of usersSeeds) {
      const password = await hashText(user.password);
      users.push(
        convertKeysFromCamelToSnake({ ...user, password, createdAt: new Date(), updatedAt: new Date() })
      );
    }

    await queryInterface.bulkInsert('users', users);
  },

  down: queryInterface => queryInterface.bulkDelete('users', null, {})
};
