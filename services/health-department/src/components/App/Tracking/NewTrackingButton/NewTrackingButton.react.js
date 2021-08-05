import React from 'react';
import { useIntl } from 'react-intl';

// Hooks
import { useModal } from 'components/hooks/useModal';

// Components
import { TrackInfectionModal } from 'components/App/modals/TrackInfectionModal';
import { PrimaryButton } from 'components/general';

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
    <PrimaryButton isButtonWhite onClick={trackInfection}>
      {intl.formatMessage({ id: 'startTracking.button' })}
    </PrimaryButton>
  );
};
