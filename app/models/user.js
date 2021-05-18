const { RolesType, PositionsType } = require('../fixtures/users');
const { hashText } = require('../utils/crypto');
const { convertValuesToArray } = require('../utils/objects');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
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
      },
      position: {
        allowNull: false,
        defaultValue: PositionsType.DEVELOPER,
        type: DataTypes.STRING,
        values: [...convertValuesToArray(PositionsType)]
      },
      authenticated: {
        allowNull: false,
        defaultValue: false,
        type: DataTypes.BOOLEAN
      }
    },
    { underscored: true }
  );

  User.associate = ({ Weet, Rating }) => {
    User.hasMany(Weet, { foreignKey: 'userId' });
    User.hasMany(Rating, { foreignKey: 'userId' });
  };

  User.beforeSave(async user => {
    // eslint-disable-next-line require-atomic-updates
    user.password = await hashText(user.password);
  });

  User.prototype.getPositionWith = score => {
    if (score >= 50) return PositionsType.CEO;
    else if (score >= 30) return PositionsType.HEAD;
    else if (score >= 20) return PositionsType.EM;
    else if (score >= 10) return PositionsType.TL;
    else if (score >= 5) return PositionsType.LEAD;
    return PositionsType.DEVELOPER;
  };

  return User;
};
