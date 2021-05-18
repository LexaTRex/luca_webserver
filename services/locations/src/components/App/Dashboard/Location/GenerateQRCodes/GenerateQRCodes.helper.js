import React from 'react';
import { CSVLink } from 'react-csv';
import { useIntl } from 'react-intl';
import sanitize from 'sanitize-filename';
import { WEB_APP_BASE_PATH } from 'constants/links';
import { bytesToBase64Url } from 'utils/encodings';
import { sanitizeForCSV } from 'utils/sanitizer';
import { linkButtonStyle } from './GenerateQRCodes.styled';

const generateLocationQrCode = (location, sharedContentPart) => {
  const qrCodeContent = `${sharedContentPart}#${bytesToBase64Url(
    JSON.stringify({})
  )}`;
  const row = [
    sanitizeForCSV(
      location.name === null
        ? `${location.LocationGroup.name}`
        : `${location.LocationGroup.name} ${location.name}`
    ),
    qrCodeContent,
  ];
  return [row];
};

const generateTableQrCodes = (location, sharedContentPart, intl) => {
  const contentList = [];
  for (let index = 0; index < location.tableCount; index += 1) {
    const additionalData = bytesToBase64Url(
      JSON.stringify({
        [`${intl.formatMessage({
          id: 'modal.qrCodeDocument.table',
        })}`]: index + 1,
      })
    );

    const qrCodeContent = `${sharedContentPart}#${additionalData}`;
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
  intl
) => {
  const sharedContentPart = `${WEB_APP_BASE_PATH}${location.scannerId}`;
  const contentRows = !downloadTableQRCodes
    ? generateLocationQrCode(location, sharedContentPart)
    : generateTableQrCodes(location, sharedContentPart, intl);

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
    ? sanitize(`QR_Codes_${location.LocationGroup.name}_luca.csv`)
    : sanitize(
        `QR_Codes_${location.LocationGroup.name}_${location.name}_luca.csv`
      );

export const QRCodeCSVDownload = ({ location, downloadTableQRCodes }) => {
  const intl = useIntl();
  const filename = getQRCodeCSVFileName(location);
  return (
    <CSVLink
      style={linkButtonStyle}
      data={getCSVFileContentFromLocation(location, downloadTableQRCodes, intl)}
      filename={filename}
    >
      {intl.formatMessage({
        id: 'settings.location.qrcode.generateCsv',
      })}
    </CSVLink>
  );
};
