const config = require('config');
const escape = require('escape-html');
const mailjet = require('node-mailjet').connect(
  config.get('mailjet.apiKey'),
  config.get('mailjet.secretKey'),
  { proxyUrl: config.get('proxy.https') }
);

const mailjetSMS = require('node-mailjet').connect(
  config.get('mailjet.token'),
  { proxyUrl: config.get('proxy.https') }
);
const { getMailId, getMailTitle } = require('./mailjet.helper');
const logger = require('./logger');

const FROM_HELLO_LUCA = {
  Email: 'hello@luca-app.de',
  Name: 'luca',
};

const FROM_LUCA_SMS = 'luca';

const escapeVariables = variables => {
  const escapedVariables = {};
  Object.keys(variables).forEach(key => {
    // eslint-disable-next-line security/detect-object-injection
    escapedVariables[key] = escape(variables[key]);
  });

  return escapedVariables;
};

const sendTemplate = (templateId, subject, toEmail, toName, variables) => {
  if (!config.get('mailjet.token')) {
    logger.warn('email not sent', {
      templateId,
      subject,
      toEmail,
      toName,
      variables,
    });
    return Promise.resolve();
  }
  return mailjet.post('send', { version: 'v3.1' }).request({
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

const sendSMSTan = (phone, tan) => {
  return mailjetSMS.post('sms-send', { version: 'v4' }).request({
    Text: `Your TAN: ${tan}`,
    To: phone,
    From: FROM_LUCA_SMS,
  });
};

module.exports = {
  sendShareDataRequestNotification,
  sendRegistrationConfirmation,
  sendForgotPasswordMail,
  sendActivationMail,
  sendSMSTan,
  updateEmail,
};
