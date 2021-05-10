'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'role', {
      allowNull: false,
      type: Sequelize.DataTypes.STRING
    });
  },

  down: async queryInterface => {
    await queryInterface.removeColumn('users', 'role');
  }
};
