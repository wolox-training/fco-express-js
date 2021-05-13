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
      }
    },
    { underscored: true }
  );

  User.associate = ({ Weet, Raiting }) => {
    User.hasMany(Weet, { foreignKey: 'userId' });

    User.belongsToMany(Weet, { through: Raiting });
  };

  User.beforeSave(async user => {
    // eslint-disable-next-line require-atomic-updates
    user.password = await hashText(user.password);
  });

  User.prototype.getPositionWith = puntaje => {
    if (puntaje >= 50) return PositionsType.CEO;
    else if (puntaje >= 30) return PositionsType.HEAD;
    else if (puntaje >= 20) return PositionsType.EM;
    else if (puntaje >= 10) return PositionsType.TL;
    else if (puntaje >= 5) return PositionsType.LEAD;
    return PositionsType.DEVELOPER;
  };

  return User;
};
