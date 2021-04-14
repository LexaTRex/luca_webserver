import React from 'react';
import { useQuery } from 'react-query';

import { decryptUserTransfer } from 'utils/cryptoOperations';

export const UserNameDisplay = ({ userTransferId }) => {
  const { isLoading, error, data } = useQuery(
    `userTransfer${userTransferId}`,
    () => decryptUserTransfer(userTransferId)
  );

  if (isLoading || error) return null;

  return (
    <div>
      {data.fn} {data.ln}
    </div>
  );
};
