'use strict';

const { PositionsType } = require('../../app/fixtures/users');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'position', {
      allowNull: false,
      defaultValue: PositionsType.DEVELOPER,
      type: Sequelize.STRING
    });
  },

  down: async queryInterface => {
    await queryInterface.removeColumn('users', 'position');
  }
};
