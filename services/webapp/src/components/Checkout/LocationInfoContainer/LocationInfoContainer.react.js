import React from 'react';
import moment from 'moment';
import { useIntl } from 'react-intl';
import {
  StyledLocationInfoContainer,
  StyledLocationInfoText,
  StyledLocationInfoTextContainer,
  StyledNumberOfAccountsOnThisLocation,
} from './LocationInfoContainer.styled';

export const LocationInfoContainer = ({ children, session }) => {
  const intl = useIntl();

  return (
    <StyledLocationInfoContainer>
      <StyledLocationInfoTextContainer>
        <StyledLocationInfoText>
          {intl.formatMessage({ id: 'Checkout.YouAreCheckIn' })}
        </StyledLocationInfoText>
        <StyledLocationInfoText>
          {intl.formatMessage({ id: 'Checkout.CheckIn' })}
          {session?.checkin &&
            `${moment.unix(session?.checkin).format('DD.MM.YYYY HH:mm')} Uhr`}
        </StyledLocationInfoText>
        {children}
      </StyledLocationInfoTextContainer>
      <StyledNumberOfAccountsOnThisLocation />
    </StyledLocationInfoContainer>
  );
};
