import React from 'react';
import { useIntl } from 'react-intl';
import { useQueryClient } from 'react-query';

import { Menu, Dropdown, notification } from 'antd';
import { DownOutlined } from '@ant-design/icons';

import { updateEmployee } from 'network/api';

import { Role } from './SelectRole.styled';

export const SelectRole = ({ employee }) => {
  const intl = useIntl();
  const queryClient = useQueryClient();

  const handleChangeRole = () => {
    updateEmployee({
      employeeId: employee.uuid,
      data: { isAdmin: !employee.isAdmin },
    })
      .then(() => {
        queryClient.invalidateQueries('employees');
        notification.success({
          message: intl.formatMessage(
            { id: 'employeeTable.selectRole.success' },
            { employee: <b>{`${employee.firstName} ${employee.lastName}`}</b> }
          ),
        });
      })
      .catch(() => {
        notification.error({
          message: intl.formatMessage(
            { id: 'employeeTable.selectRole.error' },
            { employee: <b>{`${employee.firstName} ${employee.lastName}`}</b> }
          ),
        });
      });
  };
  const menu = (
    <Menu>
      <Menu.Item>
        <Role onClick={handleChangeRole}>
          {intl.formatMessage({ id: 'employeeTable.selectRole.false' })}
        </Role>
      </Menu.Item>
      <Menu.Item>
        <Role onClick={handleChangeRole}>
          {intl.formatMessage({ id: 'employeeTable.selectRole.true' })}
        </Role>
      </Menu.Item>
    </Menu>
  );

  return (
    <Dropdown overlay={menu}>
      <Role>
        {intl.formatMessage({
          id: `employeeTable.selectRole.${employee.isAdmin}`,
        })}
        <DownOutlined style={{ marginLeft: 8 }} />
      </Role>
    </Dropdown>
  );
};
