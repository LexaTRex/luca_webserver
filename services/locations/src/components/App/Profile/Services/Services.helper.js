import { TERMS_CONDITIONS_LINK } from 'constants/links';
import AVV from 'assets/documents/AVV_Luca.pdf';
import TOMS from 'assets/documents/TOMS_Luca.pdf';
import PRIVACY_MANDATORY from 'assets/documents/DSE_Luca_mandatory.pdf';
import PRIVACY_OPTIONAL from 'assets/documents/DSE_Luca_optional.pdf';

export const getDownloadLinks = intl => [
  {
    dataCy: 'privacyLinkMandatory',
    download: intl.formatMessage({
      id: 'downloadFile.profile.privacy',
    }),
    href: PRIVACY_MANDATORY,
    intlId: intl.formatMessage({
      id: 'profile.services.download.dataPrivacyMandatory',
    }),
  },
  {
    dataCy: 'privacyLinkOptional',
    download: intl.formatMessage({
      id: 'downloadFile.profile.privacy',
    }),
    href: PRIVACY_OPTIONAL,
    intlId: intl.formatMessage({
      id: 'profile.services.download.dataPrivacyOptional',
    }),
  },
  {
    dataCy: 'dpaLink',
    download: intl.formatMessage({ id: 'downloadFile.profile.avv' }),
    href: AVV,
    intlId: intl.formatMessage({ id: 'profile.services.download.avv' }),
  },
  {
    dataCy: 'tomsLink',
    download: intl.formatMessage({ id: 'downloadFile.profile.toms' }),
    href: TOMS,
    intlId: intl.formatMessage({ id: 'profile.services.download.toms' }),
  },
];

export const getExternalLinks = intl => [
  {
    dataCy: 'termsLink',
    href: TERMS_CONDITIONS_LINK,
    intlId: intl.formatMessage({ id: 'profile.services.agb' }),
  },
];
