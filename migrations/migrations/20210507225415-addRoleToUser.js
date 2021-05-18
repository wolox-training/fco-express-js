'use strict';

const { RolesType } = require('../../app/fixtures/users');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'role', {
      allowNull: false,
      defaultValue: RolesType.REGULAR,
      type: Sequelize.STRING
    });
  },

  down: async queryInterface => {
    await queryInterface.removeColumn('users', 'role');
  }
};
