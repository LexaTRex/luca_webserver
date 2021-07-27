import React from 'react';
import { useIntl } from 'react-intl';
import { Checkbox } from 'antd';

import { CheckboxWrapper } from './SelectionTitle.styled';

export const SelectionTitle = ({ traces, onSelectAll, selectAllChecked }) => {
  const intl = useIntl();

  const renderCheckbox = () =>
    !traces || traces.length === 0 ? null : (
      <Checkbox
        onChange={onSelectAll}
        checked={selectAllChecked}
        style={{ marginLeft: 16 }}
      />
    );

  return (
    <CheckboxWrapper>
      {intl.formatMessage({ id: 'contactPersonTable.selectAll' })}
      {renderCheckbox()}
    </CheckboxWrapper>
  );
};
