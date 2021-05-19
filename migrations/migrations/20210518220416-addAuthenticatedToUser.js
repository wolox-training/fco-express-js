'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'authenticated', {
      allowNull: false,
      defaultValue: false,
      type: Sequelize.BOOLEAN
    });
  },

  down: async queryInterface => {
    await queryInterface.removeColumn('users', 'authenticated');
  }
};
