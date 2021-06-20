import React, { useCallback, useEffect, useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { useParams } from 'react-router-dom';
import { Select, notification } from 'antd';
import { useIntl } from 'react-intl';

import { getEmployees, updateProcess } from 'network/api';
import { selectStyle } from './SelectAssignee.styled';

const { Option } = Select;

export const SelectAssignee = ({ process }) => {
  const intl = useIntl();
  const { processId } = useParams();
  const queryClient = useQueryClient();
  const [currentAssignee, setCurrentAssignee] = useState(null);

  useEffect(() => {
    setCurrentAssignee(process?.assignee?.uuid || null);
  }, [process, setCurrentAssignee]);

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

      setCurrentAssignee(assignee.value);

      queryClient.invalidateQueries('processes');
      if (processId) {
        queryClient.invalidateQueries(`process${processId}`);
      }
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
    [process, intl, queryClient, processId]
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
      value={{ value: currentAssignee }}
      style={selectStyle}
      optionFilterProp="children"
      onSelect={handleSelectAssignee}
      onClick={event => event.stopPropagation()}
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
