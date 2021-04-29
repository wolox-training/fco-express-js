module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
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
  });

  return User;
};
