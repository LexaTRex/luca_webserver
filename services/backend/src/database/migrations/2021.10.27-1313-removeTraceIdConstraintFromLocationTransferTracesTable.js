module.exports = {
  up: async queryInterface => {
    await queryInterface.removeConstraint(
      'LocationTransferTraces',
      'LocationTransferTraces_traceId_Traces_fk'
    );
  },
  down: async queryInterface => {
    await queryInterface.addConstraint('LocationTransferTraces', {
      fields: ['traceId'],
      type: 'FOREIGN KEY',
      name: 'LocationTransferTraces_traceId_Traces_fk',
      references: {
        table: 'Traces',
        field: 'traceId',
      },
      onDelete: 'set null',
      onUpdate: 'no action',
    });
  },
};
