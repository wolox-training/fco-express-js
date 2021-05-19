module.exports = (sequelize, DataTypes) => {
  const Rating = sequelize.define(
    'Rating',
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

  return Rating;
};
