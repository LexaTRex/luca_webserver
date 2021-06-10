import React from 'react';
import { useIntl } from 'react-intl';
import { useQueryClient } from 'react-query';
import { Button, Popconfirm } from 'antd';

import { useModal } from 'components/hooks/useModal';

import {
  Wrapper,
  ButtonRow,
  Info,
  Password,
  buttonStyle,
} from '../AddEmployeeModal.styled';

export const ConfirmPassword = ({ password }) => {
  const intl = useIntl();
  const queryClient = useQueryClient();
  const [, closeModal] = useModal();

  const close = () => {
    closeModal();
    queryClient.invalidateQueries('employees');
  };

  return (
    <Wrapper>
      <Info>
        {intl.formatMessage({
          id: 'userManagement.created.info',
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
            id: 'userManagement.created.confirm.ok',
          })}
          cancelText={intl.formatMessage({
            id: 'userManagement.created.confirm.cancel',
          })}
        >
          <Button style={buttonStyle}>
            {intl.formatMessage({
              id: 'userManagement.created.button',
            })}
          </Button>
        </Popconfirm>
      </ButtonRow>
    </Wrapper>
  );
};
