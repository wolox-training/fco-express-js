module.exports = (sequelize, DataTypes) => {
  const Raiting = sequelize.define(
    'Raiting',
    {
      userId: {
        allowNull: false,
        type: DataTypes.INTEGER
      },
      weetId: {
        allowNull: false,
        type: DataTypes.INTEGER
      },
      score: {
        allowNull: false,
        type: DataTypes.INTEGER,
        values: [-1, 1]
      }
    },
    { underscored: true }
  );

  return Raiting;
};
