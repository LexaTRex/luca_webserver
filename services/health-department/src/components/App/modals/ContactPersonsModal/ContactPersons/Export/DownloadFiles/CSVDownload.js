import React from 'react';
import FileSaver from 'file-saver';
import { useIntl } from 'react-intl';
import { logDownload } from 'network/api';
import { getFormattedDate, getFormattedTime } from 'utils/time';
import { createCSV } from 'utils/exports/csv';

import {
  showErrorNotification,
  formatAdditionalData,
  getSanitizedFilename,
} from './helpers';

import { DownloadButton } from '../Export.styled';

const getCSVDownloadDataFromTraces = (traces, location, intl) => [
  [
    intl.formatMessage({ id: 'contactPersonTable.locationName' }),
    intl.formatMessage({ id: 'history.label.locationCategory' }),
    intl.formatMessage({ id: 'history.label.areaDetails' }),
    intl.formatMessage({ id: 'contactPersonTable.location.street' }),
    intl.formatMessage({ id: 'contactPersonTable.location.streetNumber' }),
    intl.formatMessage({ id: 'contactPersonTable.location.postalCode' }),
    intl.formatMessage({ id: 'contactPersonTable.location.city' }),
    intl.formatMessage({ id: 'contactPersonTable.locationOwner.firstName' }),
    intl.formatMessage({ id: 'contactPersonTable.locationOwner.lastName' }),
    intl.formatMessage({ id: 'contactPersonTable.locationOwner.phone' }),
    intl.formatMessage({ id: 'contactPersonTable.firstName' }),
    intl.formatMessage({ id: 'contactPersonTable.lastName' }),
    intl.formatMessage({ id: 'contactPersonTable.phone' }),
    intl.formatMessage({ id: 'contactPersonTable.email' }),
    intl.formatMessage({ id: 'contactPersonTable.street' }),
    intl.formatMessage({ id: 'contactPersonTable.houseNumber' }),
    intl.formatMessage({ id: 'contactPersonTable.city' }),
    intl.formatMessage({ id: 'contactPersonTable.postalCode' }),
    intl.formatMessage({ id: 'contactPersonTable.checkinDate' }),
    intl.formatMessage({ id: 'contactPersonTable.checkinTime' }),
    intl.formatMessage({ id: 'contactPersonTable.checkoutDate' }),
    intl.formatMessage({ id: 'contactPersonTable.checkoutTime' }),
    intl.formatMessage({ id: 'contactPersonTable.additionalData' }),
  ],
  ...traces
    // eslint-disable-next-line complexity
    .map(({ userData, additionalData, checkin, checkout }) => {
      try {
        return [
          location.name,
          location.type
            ? intl.formatMessage({
                id: `history.location.category.${location.type}`,
              })
            : '',
          location.isIndoor
            ? intl.formatMessage({ id: 'history.label.indoor' })
            : intl.formatMessage({ id: 'history.label.outdoor' }),
          location.streetName,
          location.streetNr,
          location.zipCode,
          location.city,
          location.firstName,
          location.lastName,
          location.phone,
          userData?.fn,
          userData?.ln ??
            intl.formatMessage({
              id: 'contactPersonTable.unregistredBadgeUser',
            }),
          userData?.pn,
          userData?.e,
          userData?.st,
          userData?.hn,
          userData?.c,
          userData?.pc,
          checkin ? getFormattedDate(checkin) : '',
          checkin ? getFormattedTime(checkin) : '',
          checkout ? getFormattedDate(checkout) : '',
          checkout ? getFormattedTime(checkout) : '',
          formatAdditionalData(additionalData, intl),
        ];
      } catch {
        showErrorNotification(intl);
        return null;
      }
    })
    .filter(entry => entry !== null),
];

export const CSVDownload = ({ traces, location }) => {
  const intl = useIntl();

  const download = () => {
    try {
      const data = createCSV(
        getCSVDownloadDataFromTraces(traces, location, intl)
      );
      const filename = getSanitizedFilename(location.name, 'luca.csv');
      const blob = new Blob(
        [
          new Uint8Array([0xef, 0xbb, 0xbf]), // UTF-8 BOM
          data,
        ],
        { type: 'text/csv;charset=utf-8' }
      );
      FileSaver.saveAs(blob, filename);

      logDownload({
        type: 'csv',
        transferId: location.transferId,
        amount: traces.length,
      });
    } catch (error) {
      console.error(error);
      showErrorNotification(intl);
    }
  };

  return (
    <DownloadButton onClick={download}>
      {intl.formatMessage({ id: 'download.csv' })}
    </DownloadButton>
  );
};
