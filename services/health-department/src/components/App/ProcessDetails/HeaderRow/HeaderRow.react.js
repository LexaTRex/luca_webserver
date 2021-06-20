import React from 'react';
import { useQuery } from 'react-query';
import { useIntl } from 'react-intl';

import { getLocationTransfers } from 'network/api';
import { decryptUserTransfer } from 'utils/cryptoOperations';
import { IncompleteDataError } from 'errors/incompleteDataError';

import { ToggleCompleted } from './ToggleCompleted';
import { Wrapper, ProcessName, ButtonRow } from './HeaderRow.styled';

export const HeaderRow = ({ process }) => {
  const intl = useIntl();
  const { isLoading, error, data: locations } = useQuery(
    'locationTransfer',
    () => getLocationTransfers(process.uuid),
    { refetchOnWindowFocus: false }
  );

  const {
    isLoading: isUserLoading,
    error: userError,
    data: userData,
  } = useQuery(`userTransfer${process.userTransferId}`, () =>
    process.userTransferId ? decryptUserTransfer(process.userTransferId) : {}
  );

  if (isLoading || error || isUserLoading) return null;
  if (userError && !(userError instanceof IncompleteDataError)) return null;

  const processName = (() => {
    if (!process.userTransferId) {
      return locations?.[0]?.name || '–';
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
