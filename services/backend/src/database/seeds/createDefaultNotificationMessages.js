const { v4: uuid } = require('uuid');

const MESSAGE_KEY_TITLE = 'title';
const MESSAGE_KEY_BANNER = 'banner';
const MESSAGE_KEY_SHORT_MESSAGE = 'shortMessage';
const MESSAGE_KEY_MESSAGE = 'message';
const LANG_EN = 'en';
const LANG_DE = 'de';

const defaultMessages = [
  // WARNING LEVEL 1
  {
    key: MESSAGE_KEY_TITLE,
    language: LANG_DE,
    content: 'Hinweis: Mögliches Infektionsrisiko',
    level: 1,
  },
  {
    key: MESSAGE_KEY_BANNER,
    language: LANG_DE,
    content: 'Du hast eine neue Datenanfrage.',
    level: 1,
  },
  {
    key: MESSAGE_KEY_SHORT_MESSAGE,
    language: LANG_DE,
    content:
      'Ein oder mehrere Gesundheitsämter haben im Rahmen einer Datenanfrage deine Kontaktdaten erhalten.',
    level: 1,
  },
  {
    key: MESSAGE_KEY_MESSAGE,
    language: LANG_DE,
    content: `Im Rahmen einer Kontaktnachverfolgung wurden deine Kontaktdaten von einem oder mehreren Gesundheitsämtern entschlüsselt. Diese werten gerade aus, ob ein Risiko besteht und werden sich möglicherweise bei dir melden.

Bitte handle verantwortungsvoll.`,
    level: 1,
  },
  {
    key: MESSAGE_KEY_TITLE,
    language: LANG_EN,
    content: 'New data request',
    level: 1,
  },
  {
    key: MESSAGE_KEY_BANNER,
    language: LANG_EN,
    content: 'You have a new data request.',
    level: 1,
  },
  {
    key: MESSAGE_KEY_SHORT_MESSAGE,
    language: LANG_EN,
    content: 'One or more health departments have requested your contact data.',
    level: 1,
  },
  {
    key: MESSAGE_KEY_MESSAGE,
    language: LANG_EN,
    content: `While contact tracing, one or more health departments decrypted your contact data. They are currently evaluating whether there is a risk and will contact you if necessary.

Please act responsibly.`,
    level: 1,
  },
  // WARNING LEVEL 2
  {
    key: MESSAGE_KEY_TITLE,
    language: LANG_DE,
    content: 'Mögliches Infektionsrisiko',
    level: 2,
  },
  {
    key: MESSAGE_KEY_BANNER,
    language: LANG_DE,
    content: 'Achtung! Es besteht ein mögliches Infektionsrisiko.',
    level: 2,
  },
  {
    key: MESSAGE_KEY_SHORT_MESSAGE,
    language: LANG_DE,
    content:
      'Du warst zeitgleich mit einer Person in einem luca-Standort eingecheckt, die später positiv auf das Coronavirus (SARS-CoV-2) getestet wurde.',
    level: 2,
  },
  {
    key: MESSAGE_KEY_MESSAGE,
    language: LANG_DE,
    content: `Bitte handle verantwortungsvoll, reduziere deine Kontakte und melde dich gegebenenfalls beim Gesundheitsamt – vor allem, wenn bei dir Symptome auftreten. Das Gesundheitsamt empfiehlt dir, einen Schnelltest zu machen.

Dieser Hinweis wurde vom ((name)) ausgelöst.

E-Mail-Adresse: ((email))
Telefonnummer: ((phone))`,
    level: 2,
  },
  {
    key: MESSAGE_KEY_TITLE,
    language: LANG_EN,
    content: 'Potential infection risk',
    level: 2,
  },
  {
    key: MESSAGE_KEY_BANNER,
    language: LANG_EN,
    content: 'Attention! There is a potential risk of infection.',
    level: 2,
  },
  {
    key: MESSAGE_KEY_SHORT_MESSAGE,
    language: LANG_EN,
    content:
      'You were checked into a luca place at the same time as a person who tested positive for coronavirus (SARS-CoV-2).',
    level: 2,
  },
  {
    key: MESSAGE_KEY_MESSAGE,
    language: LANG_EN,
    content: `Please act responsibly, reduce your contacts and contact your local health department – especially, if you experience any symptoms. The health department also advises doing a rapid test.

This notification has been triggered by the health department ((name)).

Email: ((email))
Phone: ((phone))`,
    level: 2,
  },
  // WARNING LEVEL 3
  {
    key: MESSAGE_KEY_TITLE,
    language: LANG_DE,
    content: 'Erhöhtes Infektionsrisiko',
    level: 3,
  },
  {
    key: MESSAGE_KEY_BANNER,
    language: LANG_DE,
    content: 'Achtung! Es besteht ein erhöhtes Infektionsrisiko.',
    level: 3,
  },
  {
    key: MESSAGE_KEY_SHORT_MESSAGE,
    language: LANG_DE,
    content:
      'Du warst zeitgleich mit einer Person in einem luca-Standort eingecheckt, die später positiv auf das Coronavirus (SARS-CoV-2) getestet wurde. Ein Gesundheitsamt hat die Situation vor Ort ausgewertet und geht von einem erhöhten Infektionsrisiko für dich aus.',
    level: 3,
  },
  {
    key: MESSAGE_KEY_MESSAGE,
    language: LANG_DE,
    content: `Bitte handle verantwortungsvoll, reduziere deine Kontakte und melde dich gegebenenfalls beim Gesundheitsamt – vor allem, wenn bei dir Symptome auftreten. Das Gesundheitsamt empfiehlt dir, einen Schnelltest zu machen.

Dieser Hinweis wurde vom ((name)) ausgelöst.

E-Mail-Adresse: ((email))
Telefonnummer: ((phone))`,
    level: 3,
  },
  {
    key: MESSAGE_KEY_TITLE,
    language: LANG_EN,
    content: 'Elevated infection risk',
    level: 3,
  },
  {
    key: MESSAGE_KEY_BANNER,
    language: LANG_EN,
    content: 'Attention! There is an elevated risk of infection.',
    level: 3,
  },
  {
    key: MESSAGE_KEY_SHORT_MESSAGE,
    language: LANG_EN,
    content:
      'You were checked into a luca place at the same time as a person who tested positive for coronavirus (SARS-CoV-2). A health department has assessed the situation at this location and deems you at an elevated risk of infection.',
    level: 3,
  },
  {
    key: MESSAGE_KEY_MESSAGE,
    language: LANG_EN,
    content: `Please act responsibly, reduce your contacts and contact your local health department – especially, if you experience any symptoms. The health department also advises doing a rapid test.

This notification has been triggered by the health department ((name)).

Email: ((email))
Phone: ((phone))`,
    level: 3,
  },
  // WARNING LEVEL 4
  {
    key: MESSAGE_KEY_TITLE,
    language: LANG_DE,
    content: 'Mehrfache Datenanfrage',
    level: 4,
  },
  {
    key: MESSAGE_KEY_BANNER,
    language: LANG_DE,
    content:
      'Achtung! Du warst in einen luca-Standort eingecheckt, in dem mehr als ein Gesundheitsamt Daten entschlüsselt hat.',
    level: 4,
  },
  {
    key: MESSAGE_KEY_SHORT_MESSAGE,
    language: LANG_DE,
    content:
      'Du warst in einem luca-Standort eingecheckt, in dem mehr als ein Gesundheitsamt Daten entschlüsselt hat. Das bedeutet möglicherweise, dass sich dort mehrere Personen aufgehalten haben, die später positiv auf das Coronavirus (SARS-CoV-2) getestet wurden. Es besteht das Risiko, dass es sich um ein erhöhtes Infektionsgeschehen handelt.',
    level: 4,
  },
  {
    key: MESSAGE_KEY_MESSAGE,
    language: LANG_DE,
    content: `Bitte handle verantwortungsvoll, reduziere deine Kontakte und melde dich gegebenenfalls beim für dich zuständigen Gesundheitsamt – vor allem, wenn bei dir Symptome auftreten. Vielleicht hast du auch die Möglichkeit, einen Test zu machen.

Dieser Hinweis wurde automatisiert von luca ausgelöst.`,
    level: 4,
  },
  {
    key: MESSAGE_KEY_TITLE,
    language: LANG_EN,
    content: 'Multiple data accesses',
    level: 4,
  },
  {
    key: MESSAGE_KEY_BANNER,
    language: LANG_EN,
    content:
      'Attention! You were checked into a luca location for which multiple health departments have decrypted data.',
    level: 4,
  },
  {
    key: MESSAGE_KEY_SHORT_MESSAGE,
    language: LANG_EN,
    content:
      'You were checked into a luca place for which multiple health departments have decrypted data. This could potentially mean that there were multiple people present who tested positive for coronavirus (SARS-CoV-2). Therefore there is a risk that this is an aggregation of infections.',
    level: 4,
  },
  {
    key: MESSAGE_KEY_MESSAGE,
    language: LANG_EN,
    content: `Please act responsibly, reduce your contacts and contact your local health department – especially, if you experience any symptoms. You should also get tested, if possible.

This notification has been triggered automatically by luca.`,
    level: 4,
  },
];

module.exports = {
  up: async queryInterface => {
    try {
      await queryInterface.bulkInsert(
        'NotificationMessages',
        defaultMessages.map(message => ({ uuid: uuid(), ...message }))
      );
    } catch (error) {
      console.log(error, error.stack);
      throw error;
    }
  },
  down: () => {
    console.warn('Not implemented.');
  },
};
