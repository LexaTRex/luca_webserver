module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('RetentionPolicies', {
      state: {
        allowNull: false,
        type: DataTypes.STRING,
        primaryKey: true,
      },
      retentionPeriod: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
    });

    await queryInterface.addIndex('RetentionPolicies', {
      fields: ['state'],
      concurrently: true,
    });
  },
  down: queryInterface => {
    return queryInterface.dropTable('RetentionPolicies');
  },
};
