import React, { useState, useEffect, useMemo } from 'react';
import { useQuery } from 'react-query';
import { useIntl } from 'react-intl';
import Mark from 'mark.js';
import { Popconfirm, notification } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { pick, values } from 'lodash';

// Api
import { getEmployees, deleteEmployee } from 'network/api';

// Components
import { AddEmployeeButton } from '../AddEmployeeButton';
import { EmployeeSearch } from '../EmployeeSearch';
import { EmptyEmployeeList } from './EmptyEmployeeList';
import { SelectRole } from './SelectRole';
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

  const confirm = async uuid => {
    try {
      const response = await deleteEmployee(uuid);
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

  const filterEmployeesByValue = (employeeList, search) => {
    if (!search) {
      return employeeList;
    }

    return employeeList.filter(employee => {
      const employeeValues = values(
        pick(employee, ['firstName', 'lastName', 'email', 'phone'])
      );
      return employeeValues.join('').toLowerCase().includes(search.toString());
    });
  };

  const filteredEmployees = useMemo(
    () => filterEmployeesByValue(employees, searchTerm),
    [employees, searchTerm]
  );

  if (error || isLoading) {
    return null;
  }

  return (
    <>
      <AddEmployeeButton />
      <EmployeeSearch onSearch={value => setSearchTerm(value.toLowerCase())} />
      <TableWrapper id="employeeTable">
        <TableHeader>
          <Column flex="30%">
            {intl.formatMessage({ id: 'employeeTable.name' })}
          </Column>
          <Column flex="20%">
            {intl.formatMessage({ id: 'employeeTable.email' })}
          </Column>
          <Column flex="20%">
            {intl.formatMessage({ id: 'employeeTable.phone' })}
          </Column>
          <Column flex="20%">
            {intl.formatMessage({ id: 'employeeTable.role' })}
          </Column>
          <Column flex="10%" />
        </TableHeader>
        {filteredEmployees.map(employee => (
          <Row key={employee.uuid}>
            <Column flex="30%">{`${employee.firstName} ${employee.lastName}`}</Column>
            <Column flex="20%">{employee.email}</Column>
            <Column flex="20%">{employee.phone}</Column>
            <Column flex="20%">
              <SelectRole employee={employee} />
            </Column>
            <Column flex="10%" align="flex-end">
              {!employee.isAdmin && (
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
              )}
            </Column>
          </Row>
        )) || <EmptyEmployeeList />}
      </TableWrapper>
    </>
  );
};
