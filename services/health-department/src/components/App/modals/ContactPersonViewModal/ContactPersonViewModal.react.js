import React from 'react';
import { useQuery } from 'react-query';
import { decryptUserTransfer } from 'utils/cryptoOperations';

import { useModal } from 'components/hooks/useModal';
import { IncompleteDataError } from 'errors/incompleteDataError';

// Components
import { ModalWrapper } from './ContactPersonViewModal.styled';

import { ContactPersonView } from './ContactPersonView';

export const ContactPersonViewModal = ({ process, location }) => {
  const [, closeModal] = useModal();
  const {
    isLoading,
    error,
    data: userData,
  } = useQuery(
    `userTransfer${process.userTransferId}`,
    () =>
      process.userTransferId ? decryptUserTransfer(process.userTransferId) : {},
    { retry: false }
  );

  if (isLoading || (error && !(error instanceof IncompleteDataError))) {
    return null;
  }

  return (
    <ModalWrapper>
      <ContactPersonView
        location={location}
        onClose={closeModal}
        indexPersonData={userData || {}}
        contactFromIndexPerson={!!process.userTransferId && !error}
      />
    </ModalWrapper>
  );
};
