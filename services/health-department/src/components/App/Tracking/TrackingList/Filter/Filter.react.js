import React from 'react';
import { useIntl } from 'react-intl';
import { Select } from 'antd';

import { COMPLETED, INCOMPLETED } from 'constants/filter';

const SelectStyles = {
  marginBottom: 24,
};

const { Option } = Select;

export const Filter = ({ changeFilter }) => {
  const intl = useIntl();

  const filterOptions = [
    {
      value: COMPLETED,
      intl: intl.formatMessage({ id: 'sort.completed' }),
    },
    {
      value: INCOMPLETED,
      intl: intl.formatMessage({ id: 'sort.incompleted' }),
    },
  ];

  return (
    <Select
      defaultValue={INCOMPLETED}
      style={SelectStyles}
      onChange={changeFilter}
    >
      {filterOptions.map(filterOption => (
        <Option value={filterOption.value} key={filterOption.value}>
          {filterOption.intl}
        </Option>
      ))}
    </Select>
  );
};
