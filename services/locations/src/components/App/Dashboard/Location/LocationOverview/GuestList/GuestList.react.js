import React from 'react';
import { useIntl } from 'react-intl';

import { useModal } from 'components/hooks/useModal';
import { GuestListModal } from 'components/App/modals/GuestListModal';
import { GuestListComp } from './GuestList.styled';

export const GuestList = ({ location }) => {
  const intl = useIntl();
  const [openModal] = useModal();

  const openGuestList = () => {
    openModal({
      title: intl.formatMessage({
        id: 'modal.guestList.title',
      }),
      content: <GuestListModal location={location} />,
    });
  };

  return (
    <GuestListComp data-cy="showGuestList" onClick={openGuestList}>
      {intl.formatMessage({ id: 'group.view.overview.guestList' })}
    </GuestListComp>
  );
};
