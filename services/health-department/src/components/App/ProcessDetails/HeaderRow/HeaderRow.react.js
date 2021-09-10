import React from 'react';
import { useQuery } from 'react-query';
import { useIntl } from 'react-intl';

import { decryptUserTransfer } from 'utils/cryptoOperations';
import { IncompleteDataError } from 'errors/incompleteDataError';
import { useLocationTransfers } from 'components/hooks/useLocationTransfers';

import { ToggleCompleted } from './ToggleCompleted';
import { Wrapper, ProcessName, ButtonRow } from './HeaderRow.styled';

export const HeaderRow = ({ process }) => {
  const intl = useIntl();
  const locations = useLocationTransfers(process.uuid);

  const {
    isLoading: isUserLoading,
    error: userError,
    data: userData,
  } = useQuery(
    `userTransfer${process.userTransferId}`,
    () =>
      process.userTransferId ? decryptUserTransfer(process.userTransferId) : {},
    { retry: false, staleTime: Number.POSITIVE_INFINITY }
  );

  if (isUserLoading || !locations) return null;
  if (userError && !(userError instanceof IncompleteDataError)) return null;

  const processName = (() => {
    if (!process.userTransferId) {
      return locations?.[0]?.groupName || '–';
    }
    if (userData) {
      return `${userData.fn} ${userData.ln}`;
    }
    if (userError instanceof IncompleteDataError) {
      return intl.formatMessage({
        id: 'contactPersonTable.unregistredBadgeUser',
      });
    }
    return '–';
  })();

  return (
    <Wrapper>
      <ProcessName>{processName}</ProcessName>
      <ButtonRow>
        <ToggleCompleted process={process} />
      </ButtonRow>
    </Wrapper>
  );
};
