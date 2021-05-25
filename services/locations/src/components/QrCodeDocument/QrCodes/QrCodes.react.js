import React from 'react';

import { TableQrCodes } from './TableQrCodes';
import { LocationQrCode } from './LocationQrCode';

export const QrCodes = ({
  group,
  location,
  downloadTableQRCodes,
  qrData,
  isCWAEventEnabled,
}) => {
  return (
    <>
      {downloadTableQRCodes ? (
        <TableQrCodes
          qrData={qrData}
          location={location}
          isCWAEventEnabled={isCWAEventEnabled}
        />
      ) : (
        <LocationQrCode
          location={location}
          group={group}
          isCWAEventEnabled={isCWAEventEnabled}
        />
      )}
    </>
  );
};
