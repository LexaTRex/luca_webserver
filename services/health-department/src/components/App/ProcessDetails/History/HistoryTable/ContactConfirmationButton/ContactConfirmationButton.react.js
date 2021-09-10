import React from 'react';
import { useIntl } from 'react-intl';
import { Popconfirm } from 'antd';
import moment from 'moment';

import { PrimaryButton, SuccessButton } from 'components/general';
import { FlexWrapper } from 'components/App/modals/ContactPersonsModal/ContactPersons/ContactPersons.styled';
import { NotificationTrigger } from './NotificationTrigger';
import {
  Expiry,
  ButtonWrapper,
  Wrapper,
} from './ContactConfirmationButton.styled';

export const ContactConfirmationButton = ({ location, callback }) => {
  const intl = useIntl();
  const { contactedAt, isCompleted, time, name: locationName } = location;

  const renderExpiration = () => (
    <Expiry>{`${intl.formatMessage({
      id: 'history.expiry',
    })}: ${moment.unix(time[0]).add(28, 'days').format('DD.MM.YYYY')}`}</Expiry>
  );

  if (!isCompleted && !!contactedAt) {
    return (
      <FlexWrapper>
        <ButtonWrapper>
          <PrimaryButton disabled>
            {intl.formatMessage({ id: 'history.contacted' })}
          </PrimaryButton>
          {renderExpiration()}
        </ButtonWrapper>
        <NotificationTrigger location={location} />
      </FlexWrapper>
    );
  }

  if (isCompleted) {
    return (
      <FlexWrapper>
        <ButtonWrapper>
          <SuccessButton
            data-cy={`confirmedLocation_${locationName}`}
            onClick={() => callback(location)}
          >
            {intl.formatMessage({ id: 'history.confirmed' })}
          </SuccessButton>
          {renderExpiration()}
        </ButtonWrapper>
        <NotificationTrigger location={location} />
      </FlexWrapper>
    );
  }

  return (
    <Wrapper>
      <Popconfirm
        placement="top"
        disabled={isCompleted}
        onConfirm={() => callback(location)}
        title={intl.formatMessage(
          {
            id: 'modal.dataRequest.confirmation',
          },
          { venue: locationName }
        )}
        okText={intl.formatMessage({
          id: 'modal.dataRequest.confirmButton',
        })}
        cancelText={intl.formatMessage({
          id: 'modal.dataRequest.declineButton',
        })}
      >
        <ButtonWrapper>
          <PrimaryButton
            disabled={!isCompleted && !!contactedAt}
            data-cy={`contactLocation_${locationName}`}
            onClick={() => {
              if (contactedAt) callback(location);
            }}
          >
            {intl.formatMessage({ id: 'history.contact' })}
          </PrimaryButton>
          {renderExpiration()}
        </ButtonWrapper>
      </Popconfirm>
      <NotificationTrigger location={location} />
    </Wrapper>
  );
};
