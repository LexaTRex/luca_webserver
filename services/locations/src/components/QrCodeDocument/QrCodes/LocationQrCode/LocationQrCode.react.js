import React from 'react';
import { useIntl } from 'react-intl';

import { QrCodeComponent } from '../QrCodeComponent';
import { Row, Item, Text } from '../../QrCodeDocument.styled';

export const LocationQrCode = ({ group, location, isCWAEventEnabled }) => {
  const intl = useIntl();

  return (
    <Row>
      <Item>
        <Text style={{ marginBottom: 20 }}>
          {group ? group.name : location.name}
        </Text>
        <QrCodeComponent
          location={location}
          isCWAEventEnabled={isCWAEventEnabled}
        />
        <Text style={{ marginTop: 15 }}>
          {intl.formatMessage({
            id: 'modal.qrCodeDocument.message',
          })}
        </Text>
      </Item>
    </Row>
  );
};
