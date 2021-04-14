import React from 'react';
import { useIntl } from 'react-intl';
import { Button } from 'antd';

import { useModal } from 'components/hooks/useModal';

import { CheckInOptions } from 'components/App/modals/CheckInOptions';
import { Wrapper, buttonStyles } from './StartScanner.styled';

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
    <Wrapper>
      <Button
        onClick={openCheckInOptions}
        style={buttonStyles}
        data-cy="startScanner"
      >
        {intl.formatMessage({ id: 'scanner.startScanner' })}
      </Button>
    </Wrapper>
  );
};
