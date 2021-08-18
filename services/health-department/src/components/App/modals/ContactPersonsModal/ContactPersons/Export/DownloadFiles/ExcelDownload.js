import React from 'react';
import { useIntl } from 'react-intl';
import ReactExport from 'react-data-export';
import { sanitizeForCSV } from 'utils/sanitizer';
import { getFormattedDate, getFormattedTime } from 'utils/time';

import {
  showErrorNotification,
  formatAdditionalDataKey,
  getSanitizedFilename,
} from './helpers';

import { DownloadButton } from '../Export.styled';

const {
  ExcelFile,
  ExcelFile: { ExcelSheet, ExcelColumn },
} = ReactExport;

const getExcelDownloadDataFromTraces = (traces, intl) =>
  traces
    // eslint-disable-next-line complexity
    .map(({ userData, additionalData, checkin, checkout }) => {
      try {
        return {
          firstName: userData ? userData.fn : '',
          lastName: userData
            ? userData.ln
            : intl.formatMessage({
                id: 'contactPersonTable.unregistredBadgeUser',
              }),
          phone: userData ? userData.pn : '',
          email: userData ? userData.e : '',
          street: userData ? userData.st : '',
          houseNumber: userData ? userData.hn : '',
          city: userData ? userData.c : '',
          postalCode: userData ? userData.pc : '',
          checkinDate: checkin ? getFormattedDate(checkin) : '',
          checkinTime: checkin ? getFormattedTime(checkin) : '',
          checkoutDate: checkout ? getFormattedDate(checkout) : '',
          checkoutTime: checkout ? getFormattedTime(checkout) : '',
          additionalData,
        };
      } catch {
        showErrorNotification(intl);
        return null;
      }
    })
    .filter(entry => entry !== null);

const columnKeys = [
  'firstName',
  'lastName',
  'phone',
  'email',
  'street',
  'houseNumber',
  'city',
  'postalCode',
  'checkinDate',
  'checkinTime',
  'checkoutDate',
  'checkoutTime',
];

const locationKeys = {
  streetName: 'location.street',
  streetNr: 'location.streetNumber',
  zipCode: 'location.postalCode',
  city: 'location.city',
  firstName: 'locationOwner.firstName',
  lastName: 'locationOwner.lastName',
  phone: 'locationOwner.phone',
};

export const ExcelDownload = ({ traces, location }) => {
  const intl = useIntl();

  return (
    <ExcelFile
      filename={getSanitizedFilename(location.name, 'luca')}
      element={
        <DownloadButton>
          {intl.formatMessage({ id: 'download.excel' })}
        </DownloadButton>
      }
    >
      <ExcelSheet
        data={getExcelDownloadDataFromTraces(traces, intl)}
        name={sanitizeForCSV(`${location.name}`)}
      >
        <ExcelColumn
          label={intl.formatMessage({ id: 'contactPersonTable.locationName' })}
          value={() => sanitizeForCSV(location.name)}
        />
        <ExcelColumn
          label={intl.formatMessage({ id: 'history.label.locationCategory' })}
          value={() =>
            intl.formatMessage({
              id: `history.location.category.${location.type}`,
            })
          }
        />
        <ExcelColumn
          label={intl.formatMessage({ id: 'history.label.areaDetails' })}
          value={() =>
            location.isIndoor
              ? intl.formatMessage({ id: 'history.label.indoor' })
              : intl.formatMessage({ id: 'history.label.outdoor' })
          }
        />
        {Object.entries(locationKeys).map(([key, value]) => (
          <ExcelColumn
            label={intl.formatMessage({
              id: `contactPersonTable.${value}`,
            })}
            value={() => sanitizeForCSV(location[key])}
            key={key}
          />
        ))}
        {columnKeys.map(name => (
          <ExcelColumn
            label={intl.formatMessage({ id: `contactPersonTable.${name}` })}
            value={col => sanitizeForCSV(col[name])}
            key={name}
          />
        ))}
        <ExcelColumn
          label={intl.formatMessage({
            id: 'contactPersonTable.additionalData',
          })}
          value={col => {
            if (!col.additionalData) return '';
            const data = Object.keys(col.additionalData).map(
              key =>
                `${sanitizeForCSV(
                  formatAdditionalDataKey(key, intl)
                )}: ${sanitizeForCSV(col.additionalData[key])}`
            );
            return data.join();
          }}
        />
      </ExcelSheet>
    </ExcelFile>
  );
};
