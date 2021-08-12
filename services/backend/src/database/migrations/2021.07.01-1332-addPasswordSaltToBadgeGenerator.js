const { promisify } = require('util');
const crypto = require('crypto');
const config = require('config');

const scrypt = promisify(crypto.scrypt);

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const badgeGenerators = await queryInterface.sequelize.query(
      `SELECT token FROM "BadgeGenerators"`,
      { type: Sequelize.QueryTypes.SELECT }
    );
    await queryInterface.sequelize.transaction(async transaction => {
      await queryInterface.addColumn(
        'BadgeGenerators',
        'password',
        Sequelize.STRING(255),
        { transaction }
      );
      await queryInterface.addColumn(
        'BadgeGenerators',
        'salt',
        Sequelize.STRING(255),
        {
          transaction,
        }
      );
      for (const { token } of badgeGenerators) {
        const salt = crypto.randomBytes(16).toString('base64');
        const hash = await scrypt(
          token,
          salt,
          config.get('keys.badge.keyLength')
        );
        const password = hash.toString('base64');
        await queryInterface.sequelize.query(
          `UPDATE "BadgeGenerators" SET password = ?, salt = ? WHERE token = ?`,
          { replacements: [password, salt, token], transaction }
        );
      }
      await queryInterface.removeColumn('BadgeGenerators', 'token', {
        transaction,
      });
      await queryInterface.addConstraint('BadgeGenerators', {
        type: 'primary key',
        name: 'BadgeGenerators_pkey',
        fields: ['name'],
        transaction,
      });
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async transaction => {
      await queryInterface.removeColumn('BadgeGenerators', 'password', {
        transaction,
      });
      await queryInterface.removeColumn('BadgeGenerators', 'salt', {
        transaction,
      });
      await queryInterface.removeConstraint(
        'BadgeGenerators',
        'BadgeGenerators_pkey',
        { transaction }
      );
      // we don't want empty token values in the database, so delete all
      await queryInterface.sequelize.query(`TRUNCATE "BadgeGenerators"`, {
        transaction,
      });

      await queryInterface.addColumn(
        'BadgeGenerators',
        'token',
        {
          type: Sequelize.STRING(44),
          primaryKey: true,
        },
        { transaction }
      );
      await queryInterface.addConstraint('BadgeGenerators', {
        type: 'primary key',
        name: 'BadgeGenerators_pkey',
        fields: ['token'],
        transaction,
      });
    });
  },
};
