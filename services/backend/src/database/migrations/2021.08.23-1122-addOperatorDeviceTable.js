module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('OperatorDevices', {
      uuid: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      activated: {
        allowNull: false,
        defaultValue: false,
        type: DataTypes.BOOLEAN,
      },
      name: {
        type: DataTypes.STRING(64),
      },
      os: {
        defaultValue: 'unknown',
        type: DataTypes.STRING(8),
      },
      role: {
        allowNull: false,
        type: DataTypes.ENUM(['scanner', 'employee', 'manager']),
      },
      operatorId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Operators',
          key: 'uuid',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      refreshedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      reactivatedAt: {
        allowNull: true,
        type: DataTypes.DATE,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  down: queryInterface => {
    return queryInterface.dropTable('OperatorDevices');
  },
};
