import React from 'react';
import { useIntl } from 'react-intl';
import { Button, Popconfirm } from 'antd';

import { useModal } from 'components/hooks/useModal';

import {
  Wrapper,
  ButtonRow,
  Info,
  Password,
  confirmStyle,
} from '../RenewEmployeePasswordModal.styled';

export const ConfirmNewPassword = ({ password }) => {
  const intl = useIntl();
  const [, closeModal] = useModal();

  const close = () => {
    closeModal();
  };

  return (
    <Wrapper>
      <Info>
        {intl.formatMessage({
          id: 'modal.renewEmployeePassword.createdInfo',
        })}
      </Info>
      <Password>{password}</Password>
      <ButtonRow>
        <Popconfirm
          placement="top"
          title={intl.formatMessage({
            id: 'userManagement.created.confirm',
          })}
          onConfirm={close}
          okText={intl.formatMessage({
            id: 'ok',
          })}
          cancelText={intl.formatMessage({
            id: 'cancel',
          })}
        >
          <Button style={confirmStyle}>
            {intl.formatMessage({
              id: 'modal.renewEmployeePassword.done',
            })}
          </Button>
        </Popconfirm>
      </ButtonRow>
    </Wrapper>
  );
};
