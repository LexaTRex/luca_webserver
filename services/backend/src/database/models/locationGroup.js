module.exports = (Sequelize, DataTypes) => {
  const LocationGroup = Sequelize.define(
    'LocationGroup',
    {
      uuid: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      operatorId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
      },
      type: {
        type: DataTypes.STRING,
      },
    },
    {
      paranoid: true,
    }
  );

  LocationGroup.associate = models => {
    LocationGroup.belongsTo(models.Operator, {
      foreignKey: 'operatorId',
      onDelete: 'CASCADE',
    });

    LocationGroup.hasMany(models.Location, {
      foreignKey: 'groupId',
    });
  };
  return LocationGroup;
};
