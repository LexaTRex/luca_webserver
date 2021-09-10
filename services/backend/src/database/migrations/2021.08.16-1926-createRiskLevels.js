module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('RiskLevels', {
      locationTransferTraceId: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
      },
      level: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
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
    });
    await queryInterface.addConstraint('RiskLevels', {
      fields: ['locationTransferTraceId'],
      type: 'foreign key',
      references: {
        table: 'LocationTransferTraces',
        field: 'uuid',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });
  },
  down: queryInterface => queryInterface.dropTable('RiskLevels'),
};
