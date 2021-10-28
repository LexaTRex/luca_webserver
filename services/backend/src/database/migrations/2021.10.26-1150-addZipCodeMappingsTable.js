module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('ZipCodeMappings', {
      zipCode: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
      },
      state: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
      },
      community: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
      },
    });

    await queryInterface.addIndex('ZipCodeMappings', {
      fields: ['zipCode'],
      concurrently: true,
    });

    await queryInterface.addIndex('ZipCodeMappings', {
      fields: ['state'],
      concurrently: true,
    });
  },
  down: async queryInterface => {
    await queryInterface.dropTable('ZipCodeMappings');
  },
};
