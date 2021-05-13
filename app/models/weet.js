module.exports = (sequelize, DataTypes) => {
  const Weet = sequelize.define(
    'Weet',
    {
      content: {
        allowNull: false,
        type: DataTypes.TEXT
      },
      userId: {
        allowNull: false,
        type: DataTypes.INTEGER
      }
    },
    { underscored: true }
  );

  Weet.associate = ({ User, Raiting }) => {
    Weet.belongsTo(User);

    Weet.belongsToMany(User, { through: Raiting });
  };

  return Weet;
};
