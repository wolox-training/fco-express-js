const { RolesType } = require('../fixtures/roles');
const { hashText } = require('../utils/crypto');
const { convertValuesToArray } = require('../utils/objects');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'user',
    {
      name: {
        allowNull: false,
        type: DataTypes.STRING
      },
      lastName: {
        allowNull: false,
        type: DataTypes.STRING
      },
      email: {
        allowNull: false,
        type: DataTypes.TEXT,
        unique: true
      },
      password: {
        allowNull: false,
        type: DataTypes.TEXT
      },
      role: {
        allowNull: false,
        defaultValue: RolesType.REGULAR,
        type: DataTypes.STRING,
        values: [...convertValuesToArray(RolesType)]
      }
    },
    { underscored: true }
  );

  User.beforeSave(async user => {
    // eslint-disable-next-line require-atomic-updates
    user.password = await hashText(user.password);
  });

  return User;
};
