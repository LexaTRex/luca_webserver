const localizationStrings = {
  en: {
    title: 'Luca - Under maintenance',
    header: 'Under maintenance',
    text1: 'Back soon',
    text2:
      "luca Locations is currently being maintained. This shouldn't take long, you'll be able to use luca Locations again soon.",
    terms: 'Terms And Conditions',
    dataPrivacy: 'Data Privacy',
  },
  de: {
    title: 'Luca - Wartungsarbeiten',
    header: 'Wartungsarbeiten',
    text1: 'Gleich wieder da',
    text2:
      'luca Locations wird gerade gewartet. Das sollte nicht lange dauern, du kannst alle Funktionen bald wieder wie gewohnt nutzen.',
    terms: 'AGB',
    dataPrivacy: 'Datenschutz',
  },
};

const preferredLang = navigator.language;
let useLocal = 'de';

if (!preferredLang.includes('de')) {
  useLocal = 'en';
}

const { title, header, text1, text2, terms, dataPrivacy } = localizationStrings[
  useLocal
];

document.getElementById('title').innerHTML = title;
document.getElementById('header').innerHTML = header;
document.getElementById('text').innerHTML = text1 + '<br /> <br />' + text2;
document.getElementById('terms').innerHTML = terms;
document.getElementById('dataPrivacy').innerHTML = dataPrivacy;
