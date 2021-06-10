const DELETE_DANGLING_EMAIL_ACTIVATIONS = `DELETE FROM "EmailActivations"
WHERE uuid IN(
    SELECT
      "EmailActivations".uuid FROM "EmailActivations"
    LEFT JOIN "Operators" ON "Operators".uuid = "EmailActivations"."operatorId"
  WHERE
    "Operators".uuid IS NULL)`;

const DELETE_DANGLING_PASSWORD_RESETS = `DELETE FROM "PasswordResets"
WHERE uuid IN(
    SELECT
      "PasswordResets".uuid FROM "PasswordResets"
    LEFT JOIN "Operators" ON "Operators".uuid = "PasswordResets"."operatorId"
  WHERE
    "Operators".uuid IS NULL)`;

module.exports = {
  up: queryInterface => {
    return queryInterface.sequelize.transaction(async transaction => {
      await queryInterface.sequelize.query(DELETE_DANGLING_EMAIL_ACTIVATIONS);

      await queryInterface.addConstraint(
        'EmailActivations',
        {
          fields: ['operatorId'],
          type: 'FOREIGN KEY',
          references: {
            table: 'Operators',
            field: 'uuid',
          },
          onDelete: 'CASCADE',
        },
        { transaction }
      );

      await queryInterface.sequelize.query(DELETE_DANGLING_PASSWORD_RESETS);
      await queryInterface.addConstraint(
        'PasswordResets',
        {
          fields: ['operatorId'],
          type: 'FOREIGN KEY',
          references: {
            table: 'Operators',
            field: 'uuid',
          },
          onDelete: 'CASCADE',
        },
        { transaction }
      );
    });
  },

  down: queryInterface => {
    return queryInterface.sequelize.transaction(async transaction => {
      await queryInterface.removeConstraint(
        'EmailActivations',
        'EmailActivations_operatorId_Operators_fk',
        { transaction }
      );

      await queryInterface.removeConstraint(
        'PasswordResets',
        'PasswordResets_operatorId_Operators_fk',
        { transaction }
      );
    });
  },
};
