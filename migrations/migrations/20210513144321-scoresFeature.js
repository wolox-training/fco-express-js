'use strict';

const { PositionsType } = require('../../app/fixtures/users');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'position', {
      allowNull: false,
      defaultValue: PositionsType.DEVELOPER,
      type: Sequelize.STRING
    });
    await queryInterface.createTable('raitings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      weet_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'weets',
          key: 'id'
        }
      },
      score: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  down: async queryInterface => {
    await queryInterface.removeColumn('users', 'position');
    await queryInterface.dropTable('raitings');
  }
};
