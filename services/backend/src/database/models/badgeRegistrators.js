module.exports = (Sequelize, DataTypes) => {
  const BadgeRegistrator = Sequelize.define('BadgeRegistrator', {
    uuid: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING,
    },
  });

  BadgeRegistrator.associate = () => {};

  return BadgeRegistrator;
};
