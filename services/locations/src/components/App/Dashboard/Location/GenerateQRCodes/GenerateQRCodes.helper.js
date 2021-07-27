import React from 'react';
import { CSVLink } from 'react-csv';
import { useIntl } from 'react-intl';
import sanitize from 'sanitize-filename';

import { sanitizeForCSV } from 'utils/sanitizer';
import { bytesToBase64Url } from 'utils/encodings';
import { getCWAFragment, getLocationName } from 'utils/qrCodeData';
import { WEB_APP_BASE_PATH } from 'constants/links';

import { linkButtonStyle } from './GenerateQRCodes.styled';

const generateLocationQrCode = (
  location,
  sharedContentPart,
  isCWAEventEnabled
) => {
  const qrCodeContent = `${sharedContentPart}#${bytesToBase64Url(
    JSON.stringify({})
  )}${getCWAFragment(location, isCWAEventEnabled)}`;
  const row = [sanitizeForCSV(getLocationName(location)), qrCodeContent];
  return [row];
};

const generateTableQrCodes = (
  location,
  sharedContentPart,
  isCWAEventEnabled,
  intl
) => {
  const contentList = [];
  for (let index = 0; index < location.tableCount; index += 1) {
    const additionalData = bytesToBase64Url(
      JSON.stringify({
        [`${intl.formatMessage({
          id: 'modal.qrCodeDocument.table',
        })}`]: index + 1,
      })
    );
    const qrCodeContent = `${sharedContentPart}#${additionalData}${getCWAFragment(
      location,
      isCWAEventEnabled
    )}`;
    const row = [
      `${intl.formatMessage({
        id: 'modal.qrCodeDocument.table',
      })} ${index + 1}`,
      qrCodeContent,
    ];
    contentList.push(row);
  }
  return contentList;
};

const getCSVFileContentFromLocation = (
  location,
  downloadTableQRCodes,
  isCWAEventEnabled,
  intl
) => {
  const sharedContentPart = `${WEB_APP_BASE_PATH}${location.scannerId}`;
  const contentRows = !downloadTableQRCodes
    ? generateLocationQrCode(location, sharedContentPart, isCWAEventEnabled)
    : generateTableQrCodes(
        location,
        sharedContentPart,
        isCWAEventEnabled,
        intl
      );

  return [
    [
      intl.formatMessage({ id: 'location.csv.name' }),
      intl.formatMessage({ id: 'location.csv.content' }),
    ],
    ...contentRows,
  ];
};

const getQRCodeCSVFileName = location =>
  location.name === null
    ? sanitize(`QR_Codes_${location.LocationGroup?.name}_luca.csv`)
    : sanitize(
        `QR_Codes_${location.LocationGroup?.name}_${location.name}_luca.csv`
      );

export const QRCodeCSVDownload = ({
  location,
  isCWAEventEnabled,
  downloadTableQRCodes,
}) => {
  const intl = useIntl();
  const filename = getQRCodeCSVFileName(location);
  return (
    <CSVLink
      style={linkButtonStyle}
      data={getCSVFileContentFromLocation(
        location,
        downloadTableQRCodes,
        isCWAEventEnabled,
        intl
      )}
      filename={filename}
    >
      {intl.formatMessage({
        id: 'settings.location.qrcode.generateCsv',
      })}
    </CSVLink>
  );
};
