import React from 'react';
import { useIntl } from 'react-intl';
import { Button } from 'antd';

// Hooks
import { useModal } from 'components/hooks/useModal';

// Components
import { TrackInfectionModal } from 'components/App/modals/TrackInfectionModal';

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
    <Button
      style={{ padding: '0 40px', marginLeft: 24 }}
      onClick={trackInfection}
    >
      {intl.formatMessage({ id: 'startTracking.button' })}
    </Button>
  );
};
