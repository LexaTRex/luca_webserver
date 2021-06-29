module.exports = {
  up: async queryInterface => {
    await queryInterface.dropTable('LocationTransferGroupMappings');
    await queryInterface.dropTable('LocationTransferGroups');
  },

  down: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('LocationTransferGroups', {
      uuid: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
      },
      tracingProcessId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'TracingProcesses',
          key: 'uuid',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
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

    await queryInterface.createTable('LocationTransferGroupMappings', {
      groupId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'LocationTransferGroups',
          key: 'uuid',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      transferId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'LocationTransfers',
          key: 'uuid',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
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
};
