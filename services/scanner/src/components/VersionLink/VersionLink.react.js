import React from 'react';
import { useIntl } from 'react-intl';

import { useModal } from 'components/hooks/useModal';
import { VersionModal } from 'components/modals/VersionModal';

import { LinkVersion } from './VersionLink.styled';

export const VersionLink = () => {
  const intl = useIntl();
  const [openModal] = useModal();

  const openModalVersion = () => {
    openModal({
      title: 'Version',
      content: <VersionModal />,
    });
  };

  return (
    <>
      <LinkVersion onClick={openModalVersion}>
        {intl.formatMessage({
          id: 'license.version',
        })}
      </LinkVersion>
    </>
  );
};
