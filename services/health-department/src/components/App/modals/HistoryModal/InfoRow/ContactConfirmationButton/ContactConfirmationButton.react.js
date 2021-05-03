import React from 'react';
import { useIntl } from 'react-intl';
import { Button, Popconfirm } from 'antd';
import moment from 'moment';

import {
  ContactedLabel,
  contactStyle,
  CompletedLabel,
  CompletedWrapper,
  ButtonWrapper,
} from './ContactConfirmationButton.styled';

export const ContactConfirmationButton = ({ location, callback }) => {
  const intl = useIntl();
  const { contactedAt, isCompleted, time } = location;

  if (!isCompleted && !!contactedAt) {
    return (
      <ContactedLabel>
        {intl.formatMessage({ id: 'history.contacted' })}
      </ContactedLabel>
    );
  }

  if (isCompleted) {
    return (
      <CompletedWrapper>
        <CompletedLabel>
          {intl.formatMessage({ id: 'history.confirmed' })}
        </CompletedLabel>
        <Button onClick={() => callback(location)}>
          {intl.formatMessage({ id: 'history.viewDetails' })}
        </Button>
      </CompletedWrapper>
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
        <Button
          disabled={!isCompleted && !!contactedAt}
          onClick={() => {
            if (contactedAt) callback(location);
          }}
          style={contactStyle}
        >
          {intl.formatMessage({ id: 'history.contact' })}
        </Button>
        <span>{`${intl.formatMessage({
          id: 'history.expiry',
        })}: ${moment
          .unix(time[0])
          .add(28, 'days')
          .format('DD.MM.YYYY')}`}</span>
      </ButtonWrapper>
    </Popconfirm>
  );
};
