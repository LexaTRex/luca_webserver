const name = 'LocationTransferTraces_traceId_Traces_fk';
module.exports = {
  up: (queryInterface, DataTypes) => {
    return queryInterface.sequelize.transaction(() => {
      return Promise.all([
        queryInterface.changeColumn('LocationTransferTraces', 'traceId', {
          allowNull: true,
          type: DataTypes.STRING(24),
        }),
        queryInterface.addConstraint('LocationTransferTraces', {
          fields: ['traceId'],
          type: 'FOREIGN KEY',
          name,
          references: {
            table: 'Traces',
            field: 'traceId',
          },
          onDelete: 'set null',
          onUpdate: 'no action',
        }),
      ]);
    });
  },

  down: (queryInterface, DataTypes) => {
    return queryInterface.sequelize.transaction(() => {
      return Promise.all([
        queryInterface.removeConstraint('LocationTransferTraces', name),
        queryInterface.changeColumn('LocationTransferTraces', 'traceId', {
          allowNull: false,
          type: DataTypes.STRING(24),
        }),
      ]);
    });
  },
};
