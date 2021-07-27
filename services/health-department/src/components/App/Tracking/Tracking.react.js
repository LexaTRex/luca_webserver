import React from 'react';

import { VersionFooter } from 'components/App/VersionFooter';
import { NewTrackingButton } from './NewTrackingButton';
import { ManualSearchButton } from './ManualSearchButton';
import { TrackingList } from './TrackingList';
import {
  ButtonWrapper,
  TrackingWrapper,
  VersionFooterWrapper,
} from './Tracking.styled';
import { useKeyLoader } from '../../hooks/useKeyLoader';

export const Tracking = () => {
  const { isLoading, error } = useKeyLoader();

  if (error || isLoading) return null;

  return (
    <TrackingWrapper>
      <ButtonWrapper>
        <ManualSearchButton />
        <NewTrackingButton />
      </ButtonWrapper>
      <TrackingList />
      <VersionFooterWrapper>
        <VersionFooter />
      </VersionFooterWrapper>
    </TrackingWrapper>
  );
};
