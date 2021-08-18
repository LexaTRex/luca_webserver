import React from 'react';
import { useIntl } from 'react-intl';
import { Popconfirm, notification } from 'antd';
import { PrimaryButton, SecondaryButton } from 'components/general';

import { ReactComponent as CrossSvg } from 'assets/cross.svg';
import { ReactComponent as LockSvg } from 'assets/lock.svg';
import { ReactComponent as EditSvg } from 'assets/edit.svg';

// Hooks
import { useModal } from 'components/hooks/useModal';

// Api
import { deleteEmployee } from 'network/api';

// Components
import { RenewEmployeePasswordModal } from 'components/App/modals/RenewEmployeePasswordModal';
import { IconWrapper, Icon } from './EmployeeActions.styled';

const CrossIcon = ({ title }) => <Icon title={title} component={CrossSvg} />;

const LockIcon = ({ title }) => <Icon title={title} component={LockSvg} />;

const EditIcon = ({ title }) => <Icon title={title} component={EditSvg} />;

export const EmployeeActions = ({ employee, refetch, setEditing, editing }) => {
  const intl = useIntl();
  const [openModal] = useModal();

  const showSuccess = () => {
    notification.success({
      message: intl.formatMessage({
        id: 'userManagement.delete.success',
      }),
    });
  };

  const showError = () => {
    notification.error({
      message: intl.formatMessage({
        id: 'userManagement.delete.error',
      }),
    });
  };

  const onRenewPassword = () => {
    openModal({
      title: intl.formatMessage({
        id: 'modal.renewEmployeePassword.title',
      }),
      content: <RenewEmployeePasswordModal employee={employee} />,
      closable: false,
    });
  };

  const onDelete = async () => {
    try {
      const response = await deleteEmployee(employee.uuid);
      if (response.ok) {
        showSuccess();
      } else {
        showError();
      }
    } catch {
      showError();
    } finally {
      await refetch();
    }
  };

  const onEdit = () => {
    setEditing(employee.uuid);
  };

  return (
    <>
      {!editing ? (
        <>
          <IconWrapper onClick={onRenewPassword}>
            <LockIcon
              title={intl.formatMessage({
                id: 'modal.renewEmployeePassword.title',
              })}
            />
          </IconWrapper>
          <IconWrapper onClick={onEdit}>
            <EditIcon
              title={intl.formatMessage({
                id: 'processDetails.updateProcessNote',
              })}
            />
          </IconWrapper>
          <Popconfirm
            placement="topLeft"
            title={intl.formatMessage({
              id: 'userManagement.confirm.text',
            })}
            onConfirm={onDelete}
            okText={intl.formatMessage({
              id: 'userManagement.confirm.ok',
            })}
            cancelText={intl.formatMessage({
              id: 'userManagement.confirm.cancel',
            })}
          >
            <IconWrapper>
              <CrossIcon
                title={intl.formatMessage({
                  id: 'userManagement.deleteUser',
                })}
              />
            </IconWrapper>
          </Popconfirm>
        </>
      ) : (
        <>
          <SecondaryButton
            style={{ marginRight: 24 }}
            onClick={() => setEditing(null)}
          >
            {intl.formatMessage({ id: 'cancel' })}
          </SecondaryButton>
          <PrimaryButton htmlType="submit">
            {intl.formatMessage({ id: 'save' })}
          </PrimaryButton>
        </>
      )}
    </>
  );
};
