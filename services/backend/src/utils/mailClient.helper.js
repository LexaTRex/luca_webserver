const MAIL_TEMPLATE_IDS = {
  shareData: {
    de: 2451243,
    en: 2451311,
  },
  register: {
    de: 1736250,
    en: 2423428,
  },
  activateAccount: {
    de: 1829395,
    en: 2419120,
  },
  forgotPassword: {
    de: 1838153,
    en: 2419804,
  },
  updateMail: {
    de: 1836795,
    en: 2420030,
  },
  updateMailNotification: {
    de: 3008025,
    en: 3023632,
  },
  operatorUpdatePasswordNotification: {
    de: 3008037,
    en: 3023667,
  },
  hdUpdatePasswordNotification: {
    de: 3008045,
    en: 3023695,
  },
  locationTransferApprovalNotification: {
    de: 3040874,
    en: 3041093,
  },
  locationsSupport: {
    de: 3148836,
    en: 3148836,
  },
  hdSupport: {
    de: 3245338,
    en: 3245338,
  },
};

const MAIL_TEMPLATE_TITLES = {
  shareData: {
    de: 'Datenanfrage',
    en: 'Share data request',
  },
  register: {
    de: 'Willkommen bei luca!',
    en: 'Welcome to luca!',
  },
  activateAccount: {
    de: 'E-Mail bestätigen',
    en: 'Confirm email',
  },
  forgotPassword: {
    de: 'Passwort zurücksetzen',
    en: 'Reset password',
  },
  updateMail: {
    de: 'E-Mail aktualisieren',
    en: 'Update email',
  },
  updateMailNotification: {
    de: 'E-Mail erfolgreich geändert',
    en: 'Email successfully changed',
  },
  operatorUpdatePasswordNotification: {
    de: 'Passwort erfolgreich geändert',
    en: 'Password successfully changed',
  },
  locationsSupport: {
    de: 'Neue Support Anfrage eines Betreibers',
    en: 'Neue Support Anfrage eines Betreibers',
  },
  hdSupport: {
    de: 'Neue Support Anfrage eines Gesundheitsamts',
    en: 'Neue Support Anfrage eines Gesundheitsamts',
  },
  hdUpdatePasswordNotification: {
    de: 'Passwort erfolgreich geändert',
    en: 'Password successfully changed',
  },
  locationTransferApprovalNotification: {
    de: ({ departmentName }) =>
      `Bestätigung der Datenfreigabe an das ${departmentName}`,
    en: ({ departmentName }) =>
      `Data Sharing for Health Department ${departmentName} Completed`,
  },
};

const getMailId = (id, lang) => {
  if (!(id in MAIL_TEMPLATE_IDS)) {
    throw new Error('Invalid email template id');
  }
  return MAIL_TEMPLATE_IDS[`${id}`][`${lang || 'de'}`];
};

const getMailTitle = (id, lang, parameters = {}) => {
  if (!(id in MAIL_TEMPLATE_TITLES)) {
    throw new Error('Invalid email template title');
  }
  const title = MAIL_TEMPLATE_TITLES[`${id}`][`${lang || 'de'}`];

  if (typeof title === 'function') {
    return title(parameters);
  }

  return title;
};

module.exports = {
  getMailId,
  getMailTitle,
};
