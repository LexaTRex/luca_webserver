import React from 'react';
import { useIntl } from 'react-intl';

import { Row, Column } from '../../ContactPersonView.styled';

export const NonRegistredBadgeTrace = () => {
  const intl = useIntl();

  return (
    <Row>
      <Column flex="15%">
        <div>
          {intl.formatMessage({
            id: 'contactPersonTable.unregistredBadgeUser',
          })}
        </div>
      </Column>
      <Column flex="20%" style={{ flexDirection: 'column' }} />
      <Column flex="15%" style={{ flexDirection: 'column' }} />
      <Column flex="5%" style={{ flexDirection: 'column' }} />
      <Column flex="5%" style={{ flexDirection: 'column' }} />
    </Row>
  );
};
