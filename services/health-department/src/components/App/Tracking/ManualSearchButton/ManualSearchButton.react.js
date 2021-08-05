import React from 'react';
import { useIntl } from 'react-intl';

import { useModal } from 'components/hooks/useModal';
import { GroupSearchModal } from 'components/App/modals/GroupSearchModal';
import { PrimaryButton } from 'components/general';

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
    <PrimaryButton
      data-cy="searchGroup"
      isButtonWhite
      style={{ marginRight: 24 }}
      onClick={searchLocations}
    >
      {intl.formatMessage({ id: 'manualSearch.button' })}
    </PrimaryButton>
  );
};
