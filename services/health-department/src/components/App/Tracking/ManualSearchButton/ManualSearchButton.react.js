import React from 'react';
import { useIntl } from 'react-intl';
import { Button } from 'antd';

import { useModal } from 'components/hooks/useModal';
import { GroupSearchModal } from 'components/App/modals/GroupSearchModal';
import { buttonStyle } from '../Tracking.styled';

export const ManualSearchButton = () => {
  const intl = useIntl();
  const [openModal] = useModal();

  const searchLocations = () => {
    openModal({
      title: intl.formatMessage({
        id: 'modal.searchGroup.title',
      }),
      content: <GroupSearchModal />,
    });
  };

  return (
    <Button
      data-cy="searchGroup"
      style={{ ...buttonStyle, marginRight: 24 }}
      onClick={searchLocations}
    >
      {intl.formatMessage({ id: 'manualSearch.button' })}
    </Button>
  );
};
