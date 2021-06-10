import React from 'react';
import { notification } from 'antd';

import { useIntl } from 'react-intl';
import { hasMobileCamAccess } from 'utils/environment';

import { SecondaryButton } from '../Buttons';

import {
  StyledContent,
  StyledQRReader,
  StyledFooter,
  StyledDescription,
} from './QRCodeScanner.styled';

export function QRCodeScanner({
  onScan,
  description,
  onClose = () => {},
  onError = () => {},
}) {
  const intl = useIntl();

  const handleError = () => {
    if (!hasMobileCamAccess()) {
      notification.error({
        message: intl.formatMessage({
          id: 'QRCodeScanner.NotSupported',
        }),
      });
    }

    onError();
  };

  return (
    <>
      <StyledDescription>{description}</StyledDescription>
      <StyledContent>
        <StyledQRReader delay={700} onScan={onScan} onError={handleError} />
      </StyledContent>
      <StyledFooter>
        <SecondaryButton tabIndex="1" id="cancelScanning" onClick={onClose}>
          {intl.formatMessage({ id: 'Form.Cancel' })}
        </SecondaryButton>
      </StyledFooter>
    </>
  );
}
