import React, { useCallback } from 'react';
import { useIntl } from 'react-intl';
import { Popconfirm, Button } from 'antd';

// Api
import { toggleCompleted } from 'network/api';

const ToggleCompletedRaw = ({ process, refetch }) => {
  const intl = useIntl();

  const updateComplete = useCallback(
    () => toggleCompleted(process.uuid, !process.isCompleted).then(refetch),
    [process, refetch]
  );

  return (
    <Popconfirm
      placement="topLeft"
      title={intl.formatMessage({ id: 'table.header.completedConfirm' })}
      onConfirm={updateComplete}
      cancelText={intl.formatMessage({ id: 'toggleComplete.cancel' })}
    >
      {process.isCompleted ? (
        <Button style={{ padding: '0 40px', backgroundColor: '#b8c0ca' }}>
          {intl.formatMessage({ id: 'processTable.toggleIncomplete' })}
        </Button>
      ) : (
        <Button style={{ padding: '0 40px', backgroundColor: '#b8c0ca' }}>
          {intl.formatMessage({ id: 'processTable.toggleComplete' })}
        </Button>
      )}
    </Popconfirm>
  );
};

export const ToggleCompleted = React.memo(ToggleCompletedRaw);
