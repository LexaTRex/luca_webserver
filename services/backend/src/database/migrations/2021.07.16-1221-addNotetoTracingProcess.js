module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.addColumn('TracingProcesses', 'note', {
      type: DataTypes.STRING(1000),
    });
    await queryInterface.addColumn('TracingProcesses', 'noteIV', {
      type: DataTypes.STRING(24),
    });
    await queryInterface.addColumn('TracingProcesses', 'noteMAC', {
      type: DataTypes.STRING(44),
    });
    await queryInterface.addColumn('TracingProcesses', 'noteSignature', {
      type: DataTypes.STRING,
    });
    await queryInterface.addColumn('TracingProcesses', 'notePublicKey', {
      type: DataTypes.STRING(88),
    });
  },

  down: async queryInterface => {
    await queryInterface.removeColumn('TracingProcesses', 'note');
    await queryInterface.removeColumn('TracingProcesses', 'noteIV');
    await queryInterface.removeColumn('TracingProcesses', 'noteMAC');
    await queryInterface.removeColumn('TracingProcesses', 'noteSignature');
    await queryInterface.removeColumn('TracingProcesses', 'notePublicKey');
  },
};
