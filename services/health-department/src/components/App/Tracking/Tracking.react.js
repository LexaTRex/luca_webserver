import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useQuery } from 'react-query';

import {
  rotateDailyKeypair,
  rotateBadgeKeypairs,
  rekeyDailyKeypairs,
  rekeyBadgeKeypairs,
  isHdekpSet,
} from 'utils/cryptoKeyOperations';

// Api
import { getKeys } from 'network/api';

// Hooks
import { useModal } from 'components/hooks/useModal';

// Components
import { UploadKeyFileModal } from 'components/App/modals/UploadKeyFileModal';
import { RegisterHealthDepartmentModal } from 'components/App/modals/RegisterHealthDepartmentModal';
import { NewTrackingButton } from './NewTrackingButton';
import { ManualSearchButton } from './ManualSearchButton';
import { TrackingList } from './TrackingList';
import { TrackingWrapper, ButtonWrapper } from './Tracking.styled';

const useForceUpdate = () => {
  const [, setValue] = useState(0);
  return () => setValue(oldValue => oldValue + 1);
};

export const Tracking = () => {
  const intl = useIntl();
  const [openModal] = useModal();
  const hasHdekp = isHdekpSet();
  const forceUpdate = useForceUpdate();

  const { data: keysData, isLoading, error } = useQuery(
    'keys',
    () => getKeys(),
    { refetchOnWindowFocus: false }
  );

  useLayoutEffect(() => {
    if (hasHdekp || isLoading || keysData.publicHDEKP) return;
    openModal({
      title: intl.formatMessage({
        id: 'modal.registerHealthDepartment.title',
      }),
      content: <RegisterHealthDepartmentModal onFinish={forceUpdate} />,
      closable: false,
    });
  }, [hasHdekp, isLoading, keysData, intl, openModal, forceUpdate]);

  useEffect(() => {
    if (hasHdekp || isLoading || !keysData.publicHDEKP) return;

    openModal({
      title: intl.formatMessage({
        id: 'modal.uploadKeyModal.title',
      }),
      content: (
        <UploadKeyFileModal keysData={keysData} onFinish={forceUpdate} />
      ),
      closable: false,
    });
  }, [hasHdekp, isLoading, keysData, intl, openModal, forceUpdate]);

  useEffect(() => {
    if (!hasHdekp) return;
    rotateDailyKeypair();
    rotateBadgeKeypairs();
    rekeyBadgeKeypairs();
    rekeyDailyKeypairs();
  }, [hasHdekp]);

  if (error || isLoading || !hasHdekp) return null;

  return (
    <TrackingWrapper>
      <ButtonWrapper>
        <ManualSearchButton />
        <NewTrackingButton />
      </ButtonWrapper>
      <TrackingList />
    </TrackingWrapper>
  );
};
