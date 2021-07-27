import React from 'react';
import { useQuery } from 'react-query';
import { decryptUserTransfer } from 'utils/cryptoOperations';

import { IncompleteDataError } from 'errors/incompleteDataError';

// Components
import { ModalWrapper } from './ContactPersonsModal.styled';

import { ContactPersons } from './ContactPersons';

export const ContactPersonsModal = ({ process, location }) => {
  const {
    isLoading,
    error,
    data: userData,
  } = useQuery(
    `userTransfer${process.userTransferId}`,
    () =>
      process.userTransferId ? decryptUserTransfer(process.userTransferId) : {},
    { retry: false, staleTime: Number.POSITIVE_INFINITY }
  );

  if (isLoading || (error && !(error instanceof IncompleteDataError))) {
    return null;
  }

  return (
    <ModalWrapper>
      <ContactPersons
        location={location}
        indexPersonData={
          Object.keys(userData || {}).length > 0 && !error ? userData : null
        }
      />
    </ModalWrapper>
  );
};
