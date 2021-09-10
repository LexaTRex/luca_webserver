module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.sequelize.transaction(async transaction => {
      await queryInterface.createTable(
        'NotificationMessages',
        {
          uuid: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
          },
          departmentId: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
              model: 'HealthDepartments',
              key: 'uuid',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
          },
          level: {
            type: DataTypes.INTEGER,
            allowNull: false,
          },
          language: {
            type: DataTypes.STRING,
            allowNull: false,
          },
          key: {
            type: DataTypes.STRING,
            allowNull: false,
          },
          content: {
            allowNull: false,
            type: DataTypes.TEXT,
          },
          createdAt: {
            allowNull: false,
            type: DataTypes.DATE,
            defaultValue: DataTypes.literal('CURRENT_TIMESTAMP'),
          },
          updatedAt: {
            allowNull: false,
            type: DataTypes.DATE,
            defaultValue: DataTypes.literal('CURRENT_TIMESTAMP'),
          },
        },
        { transaction }
      );

      await queryInterface.addConstraint('NotificationMessages', {
        fields: ['departmentId', 'level', 'language'],
        type: 'unique',
        name: 'departmentId_level_language_unique',
        transaction,
      });

      await queryInterface.addIndex('NotificationMessages', {
        fields: ['departmentId'],
        name: 'departmentId_index',
        transaction,
      });
    });
  },
  down: async queryInterface => {
    await queryInterface.dropTable('NotificationMessages');
  },
};
