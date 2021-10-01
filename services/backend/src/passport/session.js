const database = require('../database');

class SessionError extends Error {}

const serializeUser = (user, done) => {
  done(null, {
    type: user.type,
    uuid: user.uuid,
    deviceId: user.deviceId || null,
  });
};

const deserializeUser = async (info, done) => {
  try {
    let user;

    switch (info.type) {
      case 'Operator':
        user = await database.Operator.findByPk(info.uuid, { paranoid: false });
        if (!user) throw new SessionError('Operator does not exist');
        user.deviceId = null;
        user.type = 'Operator';
        break;
      case 'OperatorDevice': {
        const device = await database.OperatorDevice.findOne({
          where: {
            activated: true,
            uuid: info.deviceId,
          },
          include: {
            model: database.Operator,
          },
        });

        if (!device) {
          throw new SessionError('Operator device does not exist');
        }

        user = device.Operator;
        if (!user) throw new SessionError('Operator does not exist');

        user.device = device;
        user.type = 'OperatorDevice';
        break;
      }
      case 'HealthDepartmentEmployee':
        user = await database.HealthDepartmentEmployee.findByPk(info.uuid, {
          include: database.HealthDepartment,
        });
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
