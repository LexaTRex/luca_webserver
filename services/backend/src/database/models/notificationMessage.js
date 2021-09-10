module.exports = (Sequelize, DataTypes) => {
  const NotificationMessage = Sequelize.define('NotificationMessage', {
    departmentId: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    level: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    language: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    key: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    content: {
      allowNull: false,
      type: DataTypes.TEXT,
    },
  });

  NotificationMessage.associate = models => {
    NotificationMessage.belongsTo(models.HealthDepartment, {
      foreignKey: 'departmentId',
    });
  };

  return NotificationMessage;
};
