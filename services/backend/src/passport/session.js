const database = require('../database');

class SessionError extends Error {}

const serializeUser = (user, done) => {
  done(null, { type: user.type, uuid: user.uuid });
};

const deserializeUser = async (info, done) => {
  try {
    let user;

    switch (info.type) {
      case 'Operator':
        user = await database.Operator.findByPk(info.uuid);
        if (!user) throw new SessionError('Operator does not exist');
        user.type = 'Operator';
        break;
      case 'HealthDepartmentEmployee':
        user = await database.HealthDepartmentEmployee.findByPk(info.uuid);
        if (!user)
          throw new SessionError('HealthDepartmentEmployee does not exist');
        user.type = 'HealthDepartmentEmployee';
        break;
      default:
        throw new SessionError(`Invalid Session Type ${info}`);
    }
    done(null, user);
  } catch (error) {
    done(error, null);
  }
};

module.exports = {
  serializeUser,
  deserializeUser,
  SessionError,
};
