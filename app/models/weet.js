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

  Weet.associate = ({ User, Rating }) => {
    Weet.belongsTo(User);
    Weet.hasMany(Rating, { foreignKey: 'weetId' });
  };

  return Weet;
};
