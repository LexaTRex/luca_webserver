import React from 'react';

import { TableQrCodes } from './TableQrCodes';
import { LocationQrCode } from './LocationQrCode';

export const QrCodes = ({ group, location, downloadTableQRCodes, qrData }) => {
  return (
    <>
      {downloadTableQRCodes ? (
        <TableQrCodes qrData={qrData} location={location} />
      ) : (
        <LocationQrCode location={location} group={group} />
      )}
    </>
  );
};
