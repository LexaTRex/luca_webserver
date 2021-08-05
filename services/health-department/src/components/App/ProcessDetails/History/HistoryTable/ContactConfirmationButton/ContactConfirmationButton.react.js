import React from 'react';
import { useIntl } from 'react-intl';
import { Popconfirm } from 'antd';
import moment from 'moment';

import { PrimaryButton, SuccessButton } from 'components/general';
import { Expiry, ButtonWrapper } from './ContactConfirmationButton.styled';

export const ContactConfirmationButton = ({ location, callback }) => {
  const intl = useIntl();
  const { contactedAt, isCompleted, time } = location;

  const renderExpiration = () => (
    <Expiry>{`${intl.formatMessage({
      id: 'history.expiry',
    })}: ${moment.unix(time[0]).add(28, 'days').format('DD.MM.YYYY')}`}</Expiry>
  );

  if (!isCompleted && !!contactedAt) {
    return (
      <ButtonWrapper>
        <PrimaryButton disabled>
          {intl.formatMessage({ id: 'history.contacted' })}
        </PrimaryButton>
        {renderExpiration()}
      </ButtonWrapper>
    );
  }

  if (isCompleted) {
    return (
      <ButtonWrapper>
        <SuccessButton
          data-cy={`confirmedLocation_${location.name}`}
          onClick={() => callback(location)}
        >
          {intl.formatMessage({ id: 'history.confirmed' })}
        </SuccessButton>
        {renderExpiration()}
      </ButtonWrapper>
    );
  }

  return (
    <Popconfirm
      placement="top"
      disabled={isCompleted}
      onConfirm={() => callback(location)}
      title={intl.formatMessage(
        {
          id: 'modal.dataRequest.confirmation',
        },
        { venue: location.name }
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
          data-cy={`contactLocation_${location.name}`}
          onClick={() => {
            if (contactedAt) callback(location);
          }}
        >
          {intl.formatMessage({ id: 'history.contact' })}
        </PrimaryButton>
        {renderExpiration()}
      </ButtonWrapper>
    </Popconfirm>
  );
};
