import React from 'react';
import { useIntl } from 'react-intl';
import { Popconfirm } from 'antd';
import moment from 'moment';

import {
  Expiry,
  ButtonWrapper,
  ContactedButton,
  CompletedButton,
  ContactButton,
} from './ContactConfirmationButton.styled';

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
        <ContactedButton>
          {intl.formatMessage({ id: 'history.contacted' })}
        </ContactedButton>
        {renderExpiration()}
      </ButtonWrapper>
    );
  }

  if (isCompleted) {
    return (
      <ButtonWrapper>
        <CompletedButton
          data-cy={`confirmedLocation_${location.name}`}
          onClick={() => callback(location)}
        >
          {intl.formatMessage({ id: 'history.confirmed' })}
        </CompletedButton>
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
        <ContactButton
          disabled={!isCompleted && !!contactedAt}
          data-cy={`contactLocation_${location.name}`}
          onClick={() => {
            if (contactedAt) callback(location);
          }}
        >
          {intl.formatMessage({ id: 'history.contact' })}
        </ContactButton>
        {renderExpiration()}
      </ButtonWrapper>
    </Popconfirm>
  );
};
