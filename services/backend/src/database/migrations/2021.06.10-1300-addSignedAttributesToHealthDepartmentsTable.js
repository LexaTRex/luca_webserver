module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async transaction => {
      await queryInterface.addColumn(
        'HealthDepartments',
        'commonName',
        {
          type: Sequelize.STRING(255),
        },
        { transaction }
      );
      await queryInterface.addColumn(
        'HealthDepartments',
        'publicCertificate',
        {
          type: Sequelize.STRING(8192),
        },
        { transaction }
      );
      await queryInterface.addColumn(
        'HealthDepartments',
        'signedPublicHDSKP',
        {
          type: Sequelize.STRING(2048),
        },
        { transaction }
      );
      await queryInterface.addColumn(
        'HealthDepartments',
        'signedPublicHDEKP',
        {
          type: Sequelize.STRING(2048),
        },
        { transaction }
      );
    });
  },

  down: async queryInterface => {
    await queryInterface.sequelize.transaction(async transaction => {
      await queryInterface.removeColumn('HealthDepartments', 'commonName', {
        transaction,
      });
      await queryInterface.removeColumn(
        'HealthDepartments',
        'publicCertificate',
        {
          transaction,
        }
      );
      await queryInterface.removeColumn(
        'HealthDepartments',
        'signedPublicHDSKP',
        {
          transaction,
        }
      );
      await queryInterface.removeColumn(
        'HealthDepartments',
        'signedPublicHDEKP',
        {
          transaction,
        }
      );
    });
  },
};
