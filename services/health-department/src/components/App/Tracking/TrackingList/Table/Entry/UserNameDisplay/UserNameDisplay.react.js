import React from 'react';
import { useQuery } from 'react-query';
import { useIntl } from 'react-intl';

import { decryptUserTransfer } from 'utils/cryptoOperations';
import { IncompleteDataError } from 'errors/incompleteDataError';

export const UserNameDisplay = ({ userTransferId, onProcessName }) => {
  const intl = useIntl();
  const { isLoading, error, data } = useQuery(
    `userTransfer${userTransferId}`,
    () =>
      decryptUserTransfer(userTransferId).then(processData => {
        onProcessName(userTransferId, processData?.fn + processData?.ln);
        return processData;
      }),
    { retry: false }
  );

  if (error instanceof IncompleteDataError) {
    return (
      <div>
        {intl.formatMessage({ id: 'contactPersonTable.unregistredBadgeUser' })}
      </div>
    );
  }

  if (isLoading || error) return null;

  return (
    <div>
      {data?.fn} {data?.ln}
    </div>
  );
};
