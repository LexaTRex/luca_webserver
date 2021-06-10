import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { useIntl } from 'react-intl';
import Mark from 'mark.js';

import { pick, values } from 'lodash';
import { Form, notification } from 'antd';

// Api
import { getEmployees, updateEmployee } from 'network/api';

// Components
import { AddEmployeeButton } from '../AddEmployeeButton';
import { EmployeeSearch } from '../EmployeeSearch';
import { EmptyEmployeeList } from './EmptyEmployeeList';
import { SelectRole } from './SelectRole';
import { EmployeeActions } from './EmployeeActions';
import { EmployeeName } from './EmployeeName';
import { EmployeePhone } from './EmployeePhone';
import {
  TableWrapper,
  TableHeader,
  HeaderWrapper,
  Row,
  Column,
} from './EmployeeList.styled';

export const EmployeeList = ({ profileData }) => {
  const intl = useIntl();
  const [searchTerm, setSearchTerm] = useState('');
  const [editing, setEditing] = useState(null);
  const [filteredEmployees, setFilteredEmployees] = useState(null);

  const { isLoading, error, data: employees, refetch } = useQuery(
    'employees',
    () => getEmployees(),
    { refetchOnWindowFocus: false }
  );

  const filterEmployeesByValue = (employeeList, search) => {
    if (!search) {
      return employeeList;
    }

    return employeeList.filter(employee => {
      const employeeValues = values(
        pick(employee, ['firstName', 'lastName', 'email', 'phone'])
      );

      return employeeValues
        .join(' ')
        .toLowerCase()
        .includes(search.toString().toLowerCase());
    });
  };

  // mark search results
  useEffect(() => {
    if (!searchTerm) return () => {};
    const mark = new Mark(document.querySelector('#employeeTable'));
    mark.mark(searchTerm);

    return () => mark.unmark();
  }, [searchTerm]);

  useEffect(() => {
    if (!employees) return;
    setFilteredEmployees(
      filterEmployeesByValue(
        employees.filter(employee => employee.uuid !== profileData.employeeId),
        searchTerm
      )
    );
  }, [employees, searchTerm, profileData.employeeId]);

  const onEdit = ({ firstName, lastName, phone }) => {
    updateEmployee({
      employeeId: editing,
      data: { firstName, lastName, phone },
    })
      .then(() => {
        refetch();
        setEditing(null);
        notification.success({
          message: intl.formatMessage({
            id: 'userManagement.updateEmployee.success',
          }),
        });
      })
      .catch(() =>
        notification.error({
          message: intl.formatMessage({
            id: 'userManagement.updateEmployee.error',
          }),
        })
      );
  };

  if (isLoading || error || !filteredEmployees) {
    return null;
  }

  return (
    <>
      <HeaderWrapper>
        <EmployeeSearch
          onSearch={value => setSearchTerm(value.toLowerCase())}
        />
        <AddEmployeeButton />
      </HeaderWrapper>
      <TableWrapper>
        <TableHeader>
          <Column flex="25%">
            {intl.formatMessage({ id: 'employeeTable.name' })}
          </Column>
          <Column flex="25%">
            {intl.formatMessage({ id: 'employeeTable.email' })}
          </Column>
          <Column flex="20%">
            {intl.formatMessage({ id: 'employeeTable.phone' })}
          </Column>
          <Column flex="10%">
            {intl.formatMessage({ id: 'employeeTable.role' })}
          </Column>
          <Column flex="20%" />
        </TableHeader>
        <div id="employeeTable">
          {!searchTerm ? (
            <Row
              key={profileData.employeeId}
              style={{ backgroundColor: '#e8e7e5' }}
            >
              <Column flex="25%">{`${profileData.firstName} ${profileData.lastName}`}</Column>
              <Column flex="25%">{profileData.email}</Column>
              <Column flex="20%">{profileData.phone}</Column>
              <Column flex="10%">
                {intl.formatMessage({
                  id: `employeeTable.selectRole.${profileData.isAdmin}`,
                })}
              </Column>
              <Column flex="20%" align="flex-end" />
            </Row>
          ) : null}
          {filteredEmployees.map(employee => (
            <div key={employee.uuid}>
              <Form
                onFinish={onEdit}
                initialValues={{
                  firstName: employee.firstName,
                  lastName: employee.lastName,
                  phone: employee.phone,
                }}
              >
                <Row>
                  <Column flex="25%">
                    <EmployeeName
                      editing={employee.uuid === editing}
                      employee={employee}
                    />
                  </Column>
                  <Column flex="25%">{employee.email}</Column>
                  <Column flex="20%">
                    <EmployeePhone
                      editing={employee.uuid === editing}
                      employee={employee}
                    />
                  </Column>
                  <Column flex="15%">
                    <SelectRole employee={employee} />
                  </Column>
                  <Column flex="15%" align="flex-end">
                    {!employee.isAdmin && (
                      <EmployeeActions
                        employee={employee}
                        refetch={refetch}
                        setEditing={setEditing}
                        editing={employee.uuid === editing}
                      />
                    )}
                  </Column>
                </Row>
              </Form>
            </div>
          )) || <EmptyEmployeeList />}
        </div>
      </TableWrapper>
    </>
  );
};
