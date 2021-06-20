import React from 'react';
import { useQuery } from 'react-query';
import { decryptUserTransfer } from 'utils/cryptoOperations';

import { useModal } from 'components/hooks/useModal';

// Components
import { ModalWrapper } from './ContactPersonViewModal.styled';

import { ContactPersonView } from './ContactPersonView';

export const ContactPersonViewModal = ({ process, location }) => {
  const [, closeModal] = useModal();
  const {
    isLoading,
    error,
    data: userData,
  } = useQuery(`userTransfer${process.userTransferId}`, () =>
    process.userTransferId ? decryptUserTransfer(process.userTransferId) : {}
  );

  if (isLoading || error) return null;

  return (
    <ModalWrapper>
      <ContactPersonView
        location={location}
        onClose={closeModal}
        contactFromIndexPerson={!!process.userTransferId}
        indexPersonData={userData || {}}
      />
    </ModalWrapper>
  );
};
