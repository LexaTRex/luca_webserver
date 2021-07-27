import React from 'react';
import { useIntl } from 'react-intl';

import { useModal } from 'components/hooks/useModal';
import { SormasModal } from 'components/App/modals/SormasModal';

import { ExportButton } from '../Export.styled';

export const SormasAPI = ({ traces, location }) => {
  const intl = useIntl();

  const [openModal] = useModal();

  const openSormasModal = () => {
    openModal({
      title: null,
      closable: true,
      content: <SormasModal traces={traces} location={location} />,
    });
  };

  return (
    <ExportButton onClick={openSormasModal}>
      {intl.formatMessage({ id: 'export.sormas.label' })}
    </ExportButton>
  );
};
