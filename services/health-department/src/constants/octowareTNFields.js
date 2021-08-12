export const TN_LOCATION_INFO_COLUMNS = {
  platform: 'ART_ERFASSUNG',
  environmentType: 'TN_R_UMGEBUNGART',
  environment: 'UMGEBUNG',
  additionalInformation: 'BEMERKUNG',
  sharedDataDate: 'DAT_MELDE',
};

export const TN_PERSON_INFO_COLUMNS = {
  contactCategory: 'TN_R_KONTAKT_KAT',
  contactWithIndexPerson: 'TN_R_KONT_INDXPERS',
  lastName: 'NAME',
  firstName: 'VORNAME',
  sex: 'GESCHLECHT',
  birthday: 'DAT_GEBURT',
  birthPlace: 'GEB_ORT',
  birthCountryISOCode: 'GebLand_ISO_KENNZ',
  firstContactDateTime: 'DAT_ERST_KONTAKT',
  lastContactDateTime: 'DAT_LETZT_KONTAKT',
  street: 'Wohn_STRASSE',
  houseNumber: 'Wohn_HAUSNR_OD_PF_NR',
  postalCode: 'Wohn_PLZ',
  city: 'Wohn_ORT',
  residentialStateISOCode: 'Wohn_Staat_ISO_KENNZ',
  phone: 'Telefon',
  email: 'E-Mail',
  travelReturn: 'REISERUECKKEHRER',
  occupation: 'TN_R_SYS_REL_BERUF',
};

export const TN_LOCATION_CATEGORY = {
  base: 'sonstiges Umfeld',
  restaurant: 'Restaurant, Gaststätte',
  nursing_home: 'Alten/Pflegeheim',
  hotel: 'Hotel, Pension, Herberge',
  store: '-nicht erhoben-',
};

export const PLATFORM_NAME_LUCA = 'Luca-App';

export const LOCATION_TYPE_INDOOR = 'Innenbereich';
export const LOCATION_TYPE_OUTDOOR = 'Außenbereich';

export const MAX_LENGTH_ENVIRONMENT =
  100 - LOCATION_TYPE_INDOOR.length - ` | `.length;
export const MAX_LENGTH_ADDITIONAL_INFORMATION = 248;
