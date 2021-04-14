const fs = require('fs');
const path = require('path');

module.exports = {
  up: async queryInterface => {
    /* eslint-disable-next-line security/detect-non-literal-fs-filename */
    let queries = fs.readFileSync(
      path.resolve(__dirname, '..', 'schema', 'initial.sql')
    );
    queries = queries.toString().split(';');

    await queryInterface.sequelize.transaction(async transaction => {
      for (const query of queries) {
        await queryInterface.sequelize.query(query, { transaction });
      }
    });
    console.log('done');
  },
  down: () => {},
};
