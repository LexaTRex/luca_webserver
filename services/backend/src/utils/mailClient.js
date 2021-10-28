const config = require('config');
const axios = require('axios');
const HttpsProxyAgent = require('https-proxy-agent');
const escape = require('escape-html');

const httpsProxy = config.get('proxy.https');

const mailClient = axios.create({
  httpsAgent: httpsProxy ? new HttpsProxyAgent(httpsProxy) : undefined,
  baseURL: config.get('mailer.apiUrl'),
  headers: {
    'Content-Type': 'application/json',
  },
  proxy: false,
  keepAlive: true,
  timeout: 60000,
  maxSockets: 1,
  auth: {
    username: config.get('mailer.apiKey'),
    password: config.get('mailer.apiSecret'),
  },
});

const { getMailId, getMailTitle } = require('./mailClient.helper');
const logger = require('./logger').default;
const { z } = require('./validation');

const FROM_HELLO_LUCA = {
  Email: 'hello@luca-app.de',
  Name: 'luca',
};

const escapeVariables = variables => {
  const escapedVariables = {};
  Object.keys(variables).forEach(key => {
    // eslint-disable-next-line security/detect-object-injection
    escapedVariables[key] = escape(variables[key]);
  });

  return escapedVariables;
};

const send = payload => {
  if (!config.get('mailer.apiKey' || !config.get('mailer.apiSecret'))) {
    logger.warn('email not configured');
    return Promise.resolve();
  }

  return mailClient.post('/v3.1/send', payload);
};

const sendTemplate = (templateId, subject, toEmail, toName, variables) => {
  try {
    return send({
      Messages: [
        {
          From: FROM_HELLO_LUCA,
          To: [
            {
              Email: toEmail,
              Name: escape(toName),
            },
          ],
          TemplateID: templateId,
          TemplateLanguage: true,
          Subject: subject,
          Variables: escapeVariables(variables),
        },
      ],
    });
  } catch (error) {
    logger.warn(
      {
        error,
        templateId,
        subject,
        variables,
      },
      'email not sent'
    );
    throw error;
  }
};

const sendPlain = (content, subject, toEmail, toName) => {
  try {
    const safeContent = z.safeString().parse(content);

    return send({
      Messages: [
        {
          From: FROM_HELLO_LUCA,
          To: [
            {
              Email: toEmail,
              Name: escape(toName || toEmail),
            },
          ],
          TextPart: safeContent,
          Subject: subject,
        },
      ],
    });
  } catch (error) {
    logger.warn(
      {
        error,
        subject,
        toEmail,
      },
      'email not sent'
    );
    throw error;
  }
};

const sendShareDataRequestNotification = (toEmail, toName, lang, variables) => {
  return sendTemplate(
    getMailId('shareData', lang),
    getMailTitle('shareData', lang),
    toEmail,
    toName,
    variables
  );
};

const sendRegistrationConfirmation = (toEmail, toName, lang, variables) => {
  return sendTemplate(
    getMailId('register', lang),
    getMailTitle('register', lang),
    toEmail,
    toName,
    variables
  );
};

const sendForgotPasswordMail = (toEmail, toName, lang, variables) => {
  return sendTemplate(
    getMailId('forgotPassword', lang),
    getMailTitle('forgotPassword', lang),
    toEmail,
    toName,
    variables
  );
};

const sendLocationsSupportMail = (toEmail, toName, lang = 'de', variables) => {
  return sendTemplate(
    getMailId('locationsSupport', lang),
    getMailTitle('locationsSupport', lang),
    toEmail,
    toName,
    variables
  );
};

const sendHdSupportMail = (toEmail, toName, lang = 'de', variables) => {
  return sendTemplate(
    getMailId('hdSupport', lang),
    getMailTitle('hdSupport', lang),
    toEmail,
    toName,
    variables
  );
};

const sendActivationMail = (toEmail, toName, lang, variables) => {
  return sendTemplate(
    getMailId('activateAccount', lang),
    getMailTitle('activateAccount', lang),
    toEmail,
    toName,
    variables
  );
};

const updateEmail = (toEmail, toName, lang, variables) => {
  return sendTemplate(
    getMailId('updateMail', lang),
    getMailTitle('updateMail', lang),
    toEmail,
    toName,
    variables
  );
};

const updateEmailNotification = (toEmail, toName, lang, variables) => {
  return sendTemplate(
    getMailId('updateMailNotification', lang),
    getMailTitle('updateMailNotification', lang),
    toEmail,
    toName,
    variables
  );
};

const operatorUpdatePasswordNotification = (
  toEmail,
  toName,
  lang,
  variables
) => {
  return sendTemplate(
    getMailId('operatorUpdatePasswordNotification', lang),
    getMailTitle('operatorUpdatePasswordNotification', lang),
    toEmail,
    toName,
    variables
  );
};

const hdUpdatePasswordNotification = (toEmail, toName, lang, variables) => {
  return sendTemplate(
    getMailId('hdUpdatePasswordNotification', lang),
    getMailTitle('hdUpdatePasswordNotification', lang),
    toEmail,
    toName,
    variables
  );
};

const locationTransferApprovalNotification = (
  toEmail,
  toName,
  lang,
  variables
) => {
  const { departmentName } = variables;
  return sendTemplate(
    getMailId('locationTransferApprovalNotification', lang),
    getMailTitle('locationTransferApprovalNotification', lang, {
      departmentName,
    }),
    toEmail,
    toName,
    variables
  );
};

module.exports = {
  sendShareDataRequestNotification,
  sendRegistrationConfirmation,
  sendForgotPasswordMail,
  sendActivationMail,
  sendLocationsSupportMail,
  sendHdSupportMail,
  updateEmail,
  updateEmailNotification,
  operatorUpdatePasswordNotification,
  hdUpdatePasswordNotification,
  locationTransferApprovalNotification,
  sendPlain,
};
