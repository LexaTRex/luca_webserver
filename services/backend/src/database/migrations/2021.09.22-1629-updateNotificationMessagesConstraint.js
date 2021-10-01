module.exports = {
  up: async queryInterface => {
    await queryInterface.sequelize.transaction(async transaction => {
      await queryInterface.removeConstraint(
        'NotificationMessages',
        'departmentId_level_language_unique',
        { transaction }
      );

      await queryInterface.addConstraint('NotificationMessages', {
        fields: ['departmentId', 'level', 'language', 'key'],
        type: 'unique',
        name: 'departmentId_level_language_unique',
        transaction,
      });
    });
  },
  down: async queryInterface => {
    await queryInterface.sequelize.transaction(async transaction => {
      await queryInterface.removeConstraint(
        'NotificationMessages',
        'departmentId_level_language_unique',
        { transaction }
      );
      await queryInterface.addConstraint('NotificationMessages', {
        fields: ['departmentId', 'level', 'language'],
        type: 'unique',
        name: 'departmentId_level_language_unique',
        transaction,
      });
    });
  },
};
