import React from 'react';
import { useIntl } from 'react-intl';
import { notification, Popconfirm } from 'antd';
import { PrimaryButton, SecondaryButton } from 'components/general';

import { renewEmployeePassword } from 'network/api';

import { useModal } from 'components/hooks/useModal';

import { Wrapper, ButtonRow, Info } from '../RenewEmployeePasswordModal.styled';

export const CreateNewPassword = ({ employee, setNewUserPassword }) => {
  const intl = useIntl();
  const [, closeModal] = useModal();

  const onRenewPassword = async () => {
    try {
      const response = await renewEmployeePassword({
        employeeId: employee.uuid,
      });
      notification.success({
        message: intl.formatMessage({
          id: 'modal.renewEmployeePassword.success',
        }),
      });
      setNewUserPassword(response.password);
    } catch {
      notification.error({
        message: intl.formatMessage({
          id: 'modal.renewEmployeePassword.error',
        }),
      });
    }
  };

  const close = () => {
    closeModal();
  };

  return (
    <Wrapper>
      <Info>
        {intl.formatMessage(
          {
            id: 'modal.renewEmployeePassword.info',
          },
          {
            name: (
              <b>
                {employee.firstName} {employee.lastName}
              </b>
            ),
          }
        )}
      </Info>
      <ButtonRow>
        <SecondaryButton style={{ marginRight: 24 }} onClick={close}>
          {intl.formatMessage({
            id: 'cancel',
          })}
        </SecondaryButton>
        <Popconfirm
          placement="top"
          title={intl.formatMessage({
            id: 'modal.renewEmployeePassword.confirm',
          })}
          onConfirm={onRenewPassword}
          okText={intl.formatMessage({
            id: 'ok',
          })}
          cancelText={intl.formatMessage({
            id: 'cancel',
          })}
        >
          <PrimaryButton>
            {intl.formatMessage({
              id: 'modal.renewEmployeePassword.create',
            })}
          </PrimaryButton>
        </Popconfirm>
      </ButtonRow>
    </Wrapper>
  );
};
