module.exports = (sequelize, DataTypes) => {
  const Weet = sequelize.define(
    'weet',
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

  Weet.associate = models => {
    Weet.belongsTo(models.user);
  };

  return Weet;
};
