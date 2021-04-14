module.exports = (Sequelize, DataTypes) => {
  const SMSChallenge = Sequelize.define('SMSChallenge', {
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
  });

  SMSChallenge.associate = () => {};

  return SMSChallenge;
};
