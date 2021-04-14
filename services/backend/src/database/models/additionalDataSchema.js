module.exports = (Sequelize, DataTypes) => {
  const AdditionalDataSchema = Sequelize.define('AdditionalDataSchema', {
    uuid: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    locationId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    key: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '',
    },
    label: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '',
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'string',
    },
    isRequired: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  });

  AdditionalDataSchema.associate = models => {
    AdditionalDataSchema.belongsTo(models.Location, {
      onDelete: 'CASCADE',
      foreignKey: 'locationId',
    });
  };

  return AdditionalDataSchema;
};
