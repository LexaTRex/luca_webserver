const config = require('config');
const moment = require('moment');

module.exports = (Sequelize, DataTypes) => {
  return Sequelize.define('SMSChallenge', {
    uuid: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    tan: {
      type: DataTypes.STRING,
    },
    messageId: {
      type: DataTypes.STRING,
    },
    verified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    provider: {
      type: DataTypes.STRING,
      defaultValue: 'mm',
    },
    isExpired: {
      type: DataTypes.VIRTUAL,
      get() {
        return moment().isAfter(
          moment(this.createdAt).add(config.get('sms.expiry'), 'hour')
        );
      },
    },
  });
};
