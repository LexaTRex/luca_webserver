import React from 'react';
import QRCode from 'qrcode.react';

import { WEB_APP_BASE_PATH } from 'constants/links';
import { imageSettings } from 'constants/qrGeneration';

import { bytesToBase64Url } from 'utils/encodings';
import { getCWAFragment } from 'components/App/Dashboard/Location/GenerateQRCodes/GenerateQRCodes.helper';

export const QrCodeComponent = ({
  location,
  valueKey,
  value,
  isCWAEventEnabled,
}) => {
  const { scannerId } = location;
  const sharedContentPart = `${WEB_APP_BASE_PATH}${scannerId}`;

  const additionalData =
    valueKey && value
      ? bytesToBase64Url(JSON.stringify({ [valueKey]: value }))
      : bytesToBase64Url(JSON.stringify({}));
  const qrCodeContent = `${sharedContentPart}#${additionalData}${getCWAFragment(
    location,
    isCWAEventEnabled
  )}`;
  return (
    <QRCode
      value={qrCodeContent}
      size={800}
      imageSettings={imageSettings}
      level="M"
    />
  );
};
