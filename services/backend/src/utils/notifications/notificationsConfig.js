const database = require('../../database');

const getConfig = messages => {
  const config = {};

  messages.forEach(message => {
    if (!config[message.level]) {
      config[message.level] = {};
    }

    if (!config[message.level].messages) {
      config[message.level].messages = {};
    }

    if (!config[message.level].messages[message.language]) {
      config[message.level].messages[message.language] = {};
    }

    config[message.level].messages[message.language][message.key] =
      message.content;
  });

  return config;
};

const getNotificationConfig = async () => {
  const healthDepartments = await database.HealthDepartment.findAll({
    attributes: ['uuid', 'name', 'email', 'phone'],
    include: { model: database.NotificationMessage },
  });

  const defaultMessages = await database.NotificationMessage.findAll({
    where: {
      departmentId: null,
    },
  });

  return {
    default: getConfig(defaultMessages),
    departments: healthDepartments.map(department => ({
      uuid: department.uuid,
      name: department.name,
      phone: department.phone,
      email: department.email,
      config: getConfig(department.NotificationMessages),
    })),
  };
};

module.exports = { getNotificationConfig };
