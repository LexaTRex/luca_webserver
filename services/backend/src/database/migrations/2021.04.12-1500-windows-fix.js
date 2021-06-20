/**
 * Due to Windows file name restrictions we needed to rename the migrations. To not break
 * with previous migrations executed on the machines this migration needs to migrate
 * the migrations and perform the file name change here
 */
module.exports = {
  up: async queryInterface => {
    const [rows] = await queryInterface.sequelize.query(
      `SELECT * FROM "_Migrations"`
    );

    for (const row of rows) {
      const { name } = row;
      // Remove reserved character from previously migrated tasks
      // https://docs.microsoft.com/en-us/windows/win32/fileio/naming-a-file
      const formattedName = name.split(':').join('');

      await queryInterface.sequelize.query(`
        UPDATE "_Migrations" SET name='${formattedName}' WHERE name='${name}'
      `);
    }
  },

  down: async () => {
    // do nothing
  },
};
