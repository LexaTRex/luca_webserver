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

export const Tracking = ({ isHealthDepartmentSigned }) => {
  const { isLoading, error } = useKeyLoader();

  if (error || isLoading) return null;

  return (
    <TrackingWrapper>
      {isHealthDepartmentSigned && (
        <ButtonWrapper>
          <ManualSearchButton />
          <NewTrackingButton />
        </ButtonWrapper>
      )}
      <TrackingList isHealthDepartmentSigned={isHealthDepartmentSigned} />
      <VersionFooterWrapper>
        <VersionFooter />
      </VersionFooterWrapper>
    </TrackingWrapper>
  );
};
