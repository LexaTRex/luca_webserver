module.exports = {
  up: async queryInterface => {
    await queryInterface.bulkInsert('InternalAccessUsers', [
      {
        name: 'luca',
        salt: 'v+UqbWboNn0B6HRVLrwzrA==',
        password:
          'xvxC3jwyzoqsmhsM23GyhN8xVqmVhNn55J0czvObPEoiTLAGEAMWDX2C1F6VV9vAm9wzSwjoG2D51PQLrlaChQ==', // A93kpM5zmCtvvtHN
      },
    ]);
  },
  down: () => {
    console.warn('Not implemented.');
  },
};
