module.exports = {
  up: async (queryInterface, DataTypes) => {
    return queryInterface.sequelize.transaction(transaction => {
      return Promise.all([
        queryInterface.addColumn(
          'FeatureFlags',
          'locationFrontend',
          {
            allowNull: false,
            defaultValue: false,
            type: DataTypes.BOOLEAN,
          },
          { transaction }
        ),
        queryInterface.addColumn(
          'FeatureFlags',
          'healthDepartmentFrontend',
          {
            allowNull: false,
            defaultValue: false,
            type: DataTypes.BOOLEAN,
          },
          { transaction }
        ),
        queryInterface.addColumn(
          'FeatureFlags',
          'webapp',
          {
            allowNull: false,
            defaultValue: false,
            type: DataTypes.BOOLEAN,
          },
          { transaction }
        ),
        queryInterface.addColumn(
          'FeatureFlags',
          'ios',
          {
            allowNull: false,
            defaultValue: false,
            type: DataTypes.BOOLEAN,
          },
          { transaction }
        ),
        queryInterface.addColumn(
          'FeatureFlags',
          'android',
          {
            allowNull: false,
            defaultValue: false,
            type: DataTypes.BOOLEAN,
          },
          { transaction }
        ),
        queryInterface.addColumn(
          'FeatureFlags',
          'operatorApp',
          {
            allowNull: false,
            defaultValue: false,
            type: DataTypes.BOOLEAN,
          },
          { transaction }
        ),
      ]);
    });
  },
  down: async queryInterface => {
    return queryInterface.sequelize.transaction(transaction => {
      return Promise.all([
        queryInterface.removeColumn('FeatureFlags', 'locationFrontend', {
          transaction,
        }),
        queryInterface.removeColumn(
          'FeatureFlags',
          'healthDepartmentFrontend',
          { transaction }
        ),
        queryInterface.removeColumn('FeatureFlags', 'webapp', { transaction }),
        queryInterface.removeColumn('FeatureFlags', 'ios', { transaction }),
        queryInterface.removeColumn('FeatureFlags', 'android', { transaction }),
        queryInterface.removeColumn('FeatureFlags', 'operatorApp', {
          transaction,
        }),
      ]);
    });
  },
};
