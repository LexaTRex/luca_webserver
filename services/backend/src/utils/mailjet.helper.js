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
};

const getMailId = (id, lang) => {
  if (!(id in MAIL_TEMPLATE_IDS)) {
    throw new Error('Invalid email template id');
  }
  return MAIL_TEMPLATE_IDS[`${id}`][`${lang}`];
};

const getMailTitle = (id, lang) => {
  if (!(id in MAIL_TEMPLATE_TITLES)) {
    throw new Error('Invalid email temaplte title');
  }
  return MAIL_TEMPLATE_TITLES[`${id}`][`${lang}`];
};

module.exports = {
  getMailId,
  getMailTitle,
};
