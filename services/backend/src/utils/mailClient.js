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
const logger = require('./logger');

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

const sendTemplate = (templateId, subject, toEmail, toName, variables) => {
  if (!config.get('mailer.apiKey' || !config.get('mailer.apiSecret'))) {
    logger.warn('email not sent', {
      templateId,
      subject,
      variables,
    });
    return Promise.resolve();
  }

  try {
    return mailClient.post('/v3.1/send', {
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
    logger.warn('email not sent', {
      error,
      templateId,
      subject,
      variables,
    });
    return Promise.resolve();
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

module.exports = {
  sendShareDataRequestNotification,
  sendRegistrationConfirmation,
  sendForgotPasswordMail,
  sendActivationMail,
  updateEmail,
  updateEmailNotification,
  operatorUpdatePasswordNotification,
  hdUpdatePasswordNotification,
};
