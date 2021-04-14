import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { useIntl } from 'react-intl';
import Mark from 'mark.js';
import { Popconfirm, notification } from 'antd';
import { CloseOutlined } from '@ant-design/icons';

// Api
import { getEmployees, deleteEmployee } from 'network/api';

// Components
import { AddEmployeeButton } from '../AddEmployeeButton';
import { EmployeeSearch } from '../EmployeeSearch';
import { EmptyEmployeeList } from './EmptyEmployeeList';
import { TableWrapper, TableHeader, Row, Column } from './EmployeeList.styled';

export const EmployeeList = () => {
  const intl = useIntl();
  const [searchTerm, setSearchTerm] = useState('');

  const { isLoading, error, data: employees, refetch } = useQuery(
    'employees',
    () => getEmployees(),
    { refetchOnWindowFocus: false }
  );

  // mark search results
  useEffect(() => {
    if (!searchTerm) return () => {};
    const mark = new Mark(document.querySelector('#employeeTable'));
    mark.mark(searchTerm);

    return () => mark.unmark();
  }, [searchTerm]);

  const confirm = uuid =>
    deleteEmployee(uuid)
      .then(() =>
        notification.success({
          message: intl.formatMessage({
            id: 'userManagement.delete.success',
          }),
        })
      )
      .catch(() =>
        notification.error({
          message: intl.formatMessage({
            id: 'userManagement.delete.error',
          }),
        })
      )
      .finally(refetch);

  const filterEmployeesByValue = employeeList => {
    if (!searchTerm) {
      return employeeList;
    }

    return employeeList.filter(employee =>
      Object.keys(employee).some(key =>
        employee[key]?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  };

  if (error || isLoading) {
    return null;
  }

  return (
    <>
      <AddEmployeeButton />
      <EmployeeSearch onSearch={value => setSearchTerm(value)} />
      <TableWrapper id="employeeTable">
        <TableHeader>
          <Column flex="50%">
            {intl.formatMessage({ id: 'employeeTable.name' })}
          </Column>
          <Column flex="20%">
            {intl.formatMessage({ id: 'employeeTable.email' })}
          </Column>
          <Column flex="20%">
            {intl.formatMessage({ id: 'employeeTable.phone' })}
          </Column>
          <Column flex="10%" />
        </TableHeader>
        {filterEmployeesByValue(employees).length > 0 ? (
          filterEmployeesByValue(employees).map(employee => (
            <Row key={employee.uuid}>
              <Column flex="50%">{`${employee.firstName} ${employee.lastName}`}</Column>
              <Column flex="20%">{employee.email}</Column>
              <Column flex="20%">{employee.phone}</Column>
              <Column flex="10%" align="flex-end">
                <Popconfirm
                  placement="topLeft"
                  title={intl.formatMessage({
                    id: 'userManagement.confirm.text',
                  })}
                  onConfirm={() => confirm(employee.uuid)}
                  okText={intl.formatMessage({
                    id: 'userManagement.confirm.ok',
                  })}
                  cancelText={intl.formatMessage({
                    id: 'userManagement.confirm.cancel',
                  })}
                >
                  <CloseOutlined style={{ margin: '0 16px', fontSize: 16 }} />
                </Popconfirm>
              </Column>
            </Row>
          ))
        ) : (
          <EmptyEmployeeList />
        )}
      </TableWrapper>
    </>
  );
};
