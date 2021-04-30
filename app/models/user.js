const { hashText } = require('../utils/crypto');
const { convertKeysFromCamelToSnake } = require('../utils/objects');

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
      }
    },
    { underscored: true }
  );

  User.beforeSave(async user => {
    // eslint-disable-next-line require-atomic-updates
    user.password = await hashText(user.password);
  });

  User.prototype.toJSON = function toJSON() {
    let user = { ...this.get() };
    delete user.password;
    user = convertKeysFromCamelToSnake(user);

    return user;
  };

  return User;
};
