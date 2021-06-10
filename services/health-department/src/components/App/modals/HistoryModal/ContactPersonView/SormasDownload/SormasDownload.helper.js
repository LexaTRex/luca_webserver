import moment from 'moment';
import { useIntl } from 'react-intl';
import { CSVLink } from 'react-csv';
import React from 'react';
import sanitize from 'sanitize-filename';
import { sanitizeObject } from 'utils/sanitizer';
import { formatAdditionalDataKey } from '../ContactPersonView.helper';

const formatAdditionalData = (additionalData, intl) => {
  if (!additionalData) {
    return '';
  }
  return Object.keys(additionalData)
    .map(key => `${formatAdditionalDataKey(key, intl)}: ${additionalData[key]}`)
    .join(' / ');
};

export const formatTraceForSormas = (trace, locationUserProvided, intl) => {
  const location = sanitizeObject(locationUserProvided);
  const userData = sanitizeObject(trace.userData);
  const additionalData = sanitizeObject(trace.additionalData);

  return {
    disease: 'CORONAVIRUS',
    diseaseDetails: 'COVID-19',
    reportDateTime: moment().format('DD.MM.YYYY'),
    multiDayContact: 'Nein',
    lastContactDate: moment.unix(trace.checkin).format('DD.MM.YYYY'),
    contactIdentificationSource: 'TRACING_APP',
    tracingApp: 'OTHER',
    tracingAppDetails: 'luca',
    contactClassification: 'UNCONFIRMED',
    contactStatus: 'ACTIVE',
    followUpStatus: 'FOLLOW_UP',
    description: `${location.name} / ${location.streetName} ${
      location.streetNr
    } / ${location.zipCode} ${location.state} / ${formatAdditionalData(
      additionalData,
      intl
    )}`.trim(),
    'person.firstName': userData?.fn?.trim() ?? '',
    'person.lastName': userData
      ? userData.ln?.trim()
      : intl.formatMessage({
          id: 'contactPersonTable.unregistredBadgeUser',
        }),
    'person.sex': 'UNKNOWN',
    'person.phone': userData?.pn?.trim() ?? '',
    'person.address.city': userData?.c?.trim() ?? '',
    'person.address.postalCode': userData?.pc?.trim() ?? '',
    'person.address.street': userData?.st?.trim() ?? '',
    'person.address.houseNumber': userData?.hn?.trim() ?? '',
    'person.address.addressType': 'HOME',
    'person.emailAddress': userData?.e?.trim() ?? '',
  };
};

export const SormasDownloadLink = ({ traces, location, style }) => {
  const intl = useIntl();
  const data = traces.map(trace => formatTraceForSormas(trace, location, intl));
  return (
    <CSVLink
      data={data}
      separator=";"
      filename={sanitize(`${location.groupName} - ${location.name}_sormas.csv`)}
      uFEFF={false}
      target="_blank"
      style={style}
    >
      {intl.formatMessage({ id: 'download.sormas' })}
    </CSVLink>
  );
};
