import React from 'react';
import QRCode from 'qrcode.react';
import { useIntl } from 'react-intl';

import LucaLogo from 'assets/luca_logo_padding.svg';

import { Wrapper, Description, QrCodeWrapper } from './CheckinQrModal.styled';

const imageSettings = {
  src: LucaLogo,
  x: null,
  y: null,
  height: 40,
  width: 80,
  excavate: true,
};

export const CheckinQrModal = ({ service }) => {
  const intl = useIntl();

  return (
    <Wrapper id="test">
      <Description>
        {intl.formatMessage(
          { id: 'modal.checkInQrModal.description' },
          { divider: <br /> }
        )}
      </Description>
      <QrCodeWrapper>
        <QRCode
          value={service.url}
          size={200}
          imageSettings={imageSettings}
          level="M"
        />
      </QrCodeWrapper>
    </Wrapper>
  );
};
