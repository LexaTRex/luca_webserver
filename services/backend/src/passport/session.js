const database = require('../database');

const serializeUser = (user, done) => {
  done(null, { type: user.type, uuid: user.uuid });
};

const deserializeUser = async (info, done) => {
  try {
    let user;

    switch (info.type) {
      case 'Operator':
        user = await database.Operator.findByPk(info.uuid);
        if (!user) throw new Error('Operator does not exist');
        user.type = 'Operator';
        break;
      case 'HealthDepartmentEmployee':
        user = await database.HealthDepartmentEmployee.findByPk(info.uuid);
        if (!user) throw new Error('HealthDepartmentEmployee does not exist');
        user.type = 'HealthDepartmentEmployee';
        break;
      default:
        throw new Error(`Invalid Session Type ${info}`);
    }
    done(null, user);
  } catch (error) {
    done(error, null);
  }
};

module.exports = {
  serializeUser,
  deserializeUser,
};
