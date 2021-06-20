import React from 'react';
import { useIntl } from 'react-intl';
import { Button } from 'antd';

// Hooks
import { useModal } from 'components/hooks/useModal';

// Components
import { TrackInfectionModal } from 'components/App/modals/TrackInfectionModal';
import { buttonStyle } from '../Tracking.styled';

export const NewTrackingButton = () => {
  const intl = useIntl();
  const [openModal] = useModal();

  const trackInfection = () => {
    openModal({
      title: intl.formatMessage({
        id: 'modal.trackInfection.title',
      }),
      content: <TrackInfectionModal />,
    });
  };

  return (
    <Button style={buttonStyle} onClick={trackInfection}>
      {intl.formatMessage({ id: 'startTracking.button' })}
    </Button>
  );
};
