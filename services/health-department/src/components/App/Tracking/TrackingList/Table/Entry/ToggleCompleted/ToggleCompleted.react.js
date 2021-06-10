import React, { useCallback } from 'react';
import { useIntl } from 'react-intl';
import { Popconfirm } from 'antd';

// Api
import { updateProcess } from 'network/api';

import { GrowingActionButton } from '../Entry.styled';

const ToggleCompletedRaw = ({ process, refetch }) => {
  const intl = useIntl();

  const updateComplete = useCallback(
    () =>
      updateProcess(process.uuid, { isCompleted: !process.isCompleted }).then(
        refetch
      ),
    [process, refetch]
  );

  const toggleMessage = process.isCompleted
    ? 'processTable.toggleIncomplete'
    : 'processTable.toggleComplete';

  return (
    <Popconfirm
      placement="topLeft"
      title={intl.formatMessage({ id: 'table.header.completedConfirm' })}
      onConfirm={updateComplete}
      cancelText={intl.formatMessage({ id: 'toggleComplete.cancel' })}
    >
      <GrowingActionButton>
        {intl.formatMessage({ id: toggleMessage })}
      </GrowingActionButton>
    </Popconfirm>
  );
};

export const ToggleCompleted = React.memo(ToggleCompletedRaw);
