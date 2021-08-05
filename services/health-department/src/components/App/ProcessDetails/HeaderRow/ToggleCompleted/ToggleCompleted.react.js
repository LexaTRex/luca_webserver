import React, { useCallback } from 'react';
import { useIntl } from 'react-intl';
import { Popconfirm } from 'antd';
import { PrimaryButton } from 'components/general';
import { useHistory } from 'react-router-dom';

import { TRACKING_ROUTE } from 'constants/routes';

// Api
import { updateProcess } from 'network/api';

const ToggleCompletedRaw = ({ process }) => {
  const intl = useIntl();
  const history = useHistory();

  const navigate = useCallback(() => {
    history.push(TRACKING_ROUTE);
  }, [history]);

  const updateComplete = useCallback(
    () =>
      updateProcess(process.uuid, { isCompleted: !process.isCompleted }).then(
        () => {
          navigate();
        }
      ),
    [process, navigate]
  );

  return (
    <Popconfirm
      placement="topLeft"
      title={intl.formatMessage({ id: 'table.header.completedConfirm' })}
      onConfirm={updateComplete}
      cancelText={intl.formatMessage({ id: 'toggleComplete.cancel' })}
    >
      <PrimaryButton data-cy="complete">
        {process.isCompleted
          ? intl.formatMessage({ id: 'processTable.toggleIncomplete' })
          : intl.formatMessage({ id: 'processTable.toggleComplete' })}
      </PrimaryButton>
    </Popconfirm>
  );
};

export const ToggleCompleted = React.memo(ToggleCompletedRaw);
