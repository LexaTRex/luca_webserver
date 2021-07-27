import React from 'react';
import { useIntl } from 'react-intl';

import { Heading, Count } from './GuestCount.styled';

export const GuestCount = ({ guestCount }) => {
  const intl = useIntl();
  return (
    <>
      <Heading>
        {intl.formatMessage({ id: 'contactPersons.guestList' })}
      </Heading>
      <Count>
        {intl.formatMessage(
          {
            id: 'contactPersons.guests',
          },
          { count: guestCount }
        )}
      </Count>
    </>
  );
};
