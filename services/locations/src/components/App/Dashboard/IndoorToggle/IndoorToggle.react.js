import React from 'react';
import { Select } from 'antd';
import { useIntl } from 'react-intl';

export const IndoorToggle = ({ value, callback }) => {
  const intl = useIntl();

  return (
    <Select
      defaultValue={value}
      style={{ flexGrow: 1 }}
      onSelect={callback}
      data-cy="indoorSelection"
    >
      <Select.Option value data-cy="selectIndoor">
        {intl.formatMessage({
          id: 'settings.location.indoorToggle.indoor',
        })}
      </Select.Option>
      <Select.Option value={false}>
        {intl.formatMessage({
          id: 'settings.location.indoorToggle.outdoor',
        })}
      </Select.Option>
    </Select>
  );
};
