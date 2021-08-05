import React from 'react';
import { useIntl } from 'react-intl';
import { Popconfirm } from 'antd';
import { PrimaryButton } from 'components/general';

import { useModal } from 'components/hooks/useModal';

import {
  Wrapper,
  ButtonRow,
  Info,
  Password,
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
          <PrimaryButton>
            {intl.formatMessage({
              id: 'modal.renewEmployeePassword.done',
            })}
          </PrimaryButton>
        </Popconfirm>
      </ButtonRow>
    </Wrapper>
  );
};
