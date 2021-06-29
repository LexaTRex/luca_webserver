import React from 'react';
import { useIntl } from 'react-intl';
import { Button } from 'antd';
import { useModal } from 'components/hooks/useModal';

import { CheckInOptions } from 'components/App/modals/CheckInOptions';
import { buttonStyles } from './StartScanner.styled';

export const StartScanner = ({ location }) => {
  const intl = useIntl();
  const [openModal] = useModal();

  const openCheckInOptions = () => {
    openModal({
      title: intl.formatMessage({ id: 'modal.checkInOptions.title' }),
      content: <CheckInOptions location={location} />,
    });
  };
  return (
    <Button
      style={buttonStyles}
      onClick={openCheckInOptions}
      data-cy="startScanner"
    >
      {intl.formatMessage({ id: 'scanner.startScanner' })}
    </Button>
  );
};
