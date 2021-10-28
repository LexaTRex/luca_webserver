module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.addColumn('Traces', 'expiresAt', {
      type: DataTypes.DATE,
      allowNull: true,
    });

    await queryInterface.addIndex('Traces', {
      fields: ['expiresAt'],
      concurrently: true,
    });
  },
  down: queryInterface => {
    return queryInterface.removeColumn('Traces', 'expiresAt');
  },
};
