import React from 'react';
import { useIntl } from 'react-intl';
import ReactExport from 'react-data-export';
import {
  LOCATION_TYPE_INDOOR,
  LOCATION_TYPE_OUTDOOR,
  MAX_LENGTH_ADDITIONAL_INFORMATION,
  MAX_LENGTH_ENVIRONMENT,
  PLATFORM_NAME_LUCA,
  TN_LOCATION_CATEGORY,
  TN_LOCATION_INFO_COLUMNS,
  TN_PERSON_INFO_COLUMNS,
} from 'constants/octowareTNFields';
import { getFormattedDate, getFormattedTime } from 'utils/time';
import { sanitizeForCSV } from 'utils/sanitizer';
import { DownloadButton } from '../Export.styled';
import {
  formatAdditionalDataKey,
  getSanitizedFilename,
  showErrorNotification,
} from './helpers';

const {
  ExcelFile,
  ExcelFile: { ExcelSheet, ExcelColumn },
} = ReactExport;

const matchLucaGroupTypeWithOctowareTN = groupType => {
  switch (groupType) {
    case 'base':
      return TN_LOCATION_CATEGORY.base;
    case 'restaurant':
      return TN_LOCATION_CATEGORY.restaurant;
    case 'nursing_home':
      return TN_LOCATION_CATEGORY.nursing_home;
    case 'hotel':
      return TN_LOCATION_CATEGORY.hotel;
    case 'store':
      return TN_LOCATION_CATEGORY.store;
    default:
      return TN_LOCATION_CATEGORY.base;
  }
};

const getLocationType = isIndoor =>
  isIndoor ? LOCATION_TYPE_INDOOR : LOCATION_TYPE_OUTDOOR;

const getOctoWareTNDataFromTraces = (traces, location, intl) =>
  traces
    // eslint-disable-next-line complexity
    .map(({ userData, additionalData, checkin, checkout }) => {
      try {
        return {
          additionalData,
          lastName: userData
            ? userData.ln
            : intl.formatMessage({
                id: 'contactPersonTable.octoWareTN.unregisteredBadgeUser',
              }),
          firstName: userData
            ? userData.fn
            : intl.formatMessage({
                id: 'contactPersonTable.octoWareTN.unregisteredBadgeUser',
              }),
          firstContactDateTime: checkin
            ? `${getFormattedDate(checkin)} ${getFormattedTime(checkin)}`
            : '',
          lastContactDateTime: checkout
            ? `${getFormattedDate(checkout)} ${getFormattedTime(checkout)}`
            : '',
          street: userData ? userData.st : '',
          houseNumber: userData ? userData.hn : '',
          postalCode: userData ? userData.pc : '',
          city: userData ? userData.c : '',
          phone: userData ? userData.pn : '',
          email: userData ? userData.e : '',
        };
      } catch {
        showErrorNotification(intl);
        return null;
      }
    })
    .filter(entry => entry !== null);

export const OctoWareTNDownload = ({ traces, location }) => {
  const intl = useIntl();

  return (
    <ExcelFile
      filename={getSanitizedFilename(location.name, 'octoware')}
      element={
        <DownloadButton>
          {intl.formatMessage({ id: 'download.octoWareTN' })}
        </DownloadButton>
      }
    >
      <ExcelSheet
        data={getOctoWareTNDataFromTraces(traces, intl)}
        name={sanitizeForCSV(`${location.name}`)}
      >
        <ExcelColumn
          label={TN_LOCATION_INFO_COLUMNS.platform}
          value={() => PLATFORM_NAME_LUCA}
        />
        <ExcelColumn
          label={TN_LOCATION_INFO_COLUMNS.environmentType}
          value={() => matchLucaGroupTypeWithOctowareTN(location.groupType)}
        />
        <ExcelColumn
          label={TN_LOCATION_INFO_COLUMNS.environment}
          value={() =>
            `${sanitizeForCSV(`${location.name}`).slice(
              0,
              MAX_LENGTH_ENVIRONMENT
            )} | ${getLocationType(location.isIndoor)}`
          }
        />
        <ExcelColumn
          label={TN_LOCATION_INFO_COLUMNS.additionalInformation}
          value={col => {
            if (!col.additionalData) return '';
            const data = Object.keys(col.additionalData).map(
              key =>
                `${sanitizeForCSV(
                  formatAdditionalDataKey(key, intl)
                )}: ${sanitizeForCSV(col.additionalData[key])}`
            );
            return data.join().slice(0, MAX_LENGTH_ADDITIONAL_INFORMATION);
          }}
        />
        <ExcelColumn
          label={TN_LOCATION_INFO_COLUMNS.sharedDataDate}
          value={() =>
            getFormattedDate(Date.parse(location.contactedAt) / 1000)
          }
        />
        {Object.entries(TN_PERSON_INFO_COLUMNS).map(([key, value]) => (
          <ExcelColumn
            label={value}
            value={col => sanitizeForCSV(col[key])}
            key={key}
          />
        ))}
      </ExcelSheet>
    </ExcelFile>
  );
};
