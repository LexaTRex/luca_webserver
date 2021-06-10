import React, { useCallback } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { Select, notification } from 'antd';
import { useIntl } from 'react-intl';

import { getEmployees, updateProcess } from 'network/api';
import { selectStyle } from './SelectAssignee.styled';

const { Option } = Select;

export const SelectAssignee = ({ process }) => {
  const intl = useIntl();
  const queryClient = useQueryClient();

  const currentAssignee = process.assignee
    ? `${process.assignee.firstName} ${process.assignee.lastName}`
    : intl.formatMessage({
        id: 'processTable.selectAssignee.unassigned',
      });

  const { isLoading, error, data: employees } = useQuery(
    'employees',
    getEmployees
  );

  const handleSelectAssignee = useCallback(
    async assignee => {
      const response = await updateProcess(process.uuid, {
        assigneeId: assignee.value,
      });
      if (!response.ok) {
        return assignee.value
          ? notification.error({
              message: intl.formatMessage(
                { id: 'processTable.selectAssignee.error' },
                { assignee: <b>{assignee.label}</b> }
              ),
            })
          : notification.error({
              message: intl.formatMessage({
                id: 'processTable.selectAssignee.unassigned.error',
              }),
            });
      }

      queryClient.invalidateQueries('processes');
      return assignee.value
        ? notification.success({
            message: intl.formatMessage(
              { id: 'processTable.selectAssignee.success' },
              { assignee: <b>{assignee.label}</b> }
            ),
          })
        : notification.success({
            message: intl.formatMessage({
              id: 'processTable.selectAssignee.unassigned.success',
            }),
          });
    },
    [process, intl, queryClient]
  );

  const handleFilterOption = (input, option) =>
    option.children.toLowerCase().includes(input.toLowerCase());

  if (error || isLoading) {
    return null;
  }

  return (
    <Select
      showSearch
      labelInValue
      defaultValue={{ value: currentAssignee }}
      style={selectStyle}
      optionFilterProp="children"
      onSelect={handleSelectAssignee}
      filterOption={handleFilterOption}
      notFoundContent={intl.formatMessage({
        id: 'processTable.selectAssignee.notFound',
      })}
    >
      <Option value={null}>
        {intl.formatMessage({ id: 'processTable.selectAssignee.unassigned' })}
      </Option>
      {employees.map(employee => (
        <Option key={employee.uuid} value={employee.uuid}>
          {`${employee.firstName} ${employee.lastName}`}
        </Option>
      ))}
    </Select>
  );
};
