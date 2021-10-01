module.exports = (Sequelize, DataTypes) => {
  return Sequelize.define('Challenge', {
    uuid: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    type: {
      allowNull: false,
      type: DataTypes.STRING(32),
    },
    state: {
      allowNull: false,
      type: DataTypes.STRING(32),
    },
  });
};
