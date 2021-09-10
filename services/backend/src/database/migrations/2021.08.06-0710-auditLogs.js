module.exports = {
  up: async (queryInterface, DataTypes) => {
    return queryInterface.sequelize.transaction(async transaction => {
      await queryInterface.createTable('HealthDepartmentAuditLogs', {
        uuid: {
          type: DataTypes.UUID,
          allowNull: false,
          primaryKey: true,
          defaultValue: DataTypes.UUIDV4,
        },
        departmentId: {
          type: DataTypes.UUID,
          allowNull: false,
        },
        employeeId: {
          type: DataTypes.UUID,
          allowNull: false,
        },
        type: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        status: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        meta: {
          type: DataTypes.JSONB,
          allowNull: true,
          defaultValue: null,
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

      await queryInterface.addConstraint(
        'HealthDepartmentAuditLogs',
        {
          fields: ['departmentId'],
          type: 'FOREIGN KEY',
          references: {
            table: 'HealthDepartments',
            field: 'uuid',
          },
        },
        { transaction }
      );

      await queryInterface.addConstraint(
        'HealthDepartmentAuditLogs',
        {
          fields: ['employeeId'],
          type: 'FOREIGN KEY',
          references: {
            table: 'HealthDepartmentEmployees',
            field: 'uuid',
          },
        },
        { transaction }
      );
    });
  },
  down: async queryInterface => {
    return queryInterface.dropTable('HealthDepartmentAuditLogs');
  },
};
