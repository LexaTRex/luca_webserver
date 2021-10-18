import React from 'react';
import { useIntl } from 'react-intl';

import { useModal } from 'components/hooks/useModal';
import { EditAddressModal } from 'components/App/modals/EditAddressModal';
import {
  AddressWrapper,
  AddressRow,
  AddressHeader,
  EditAddress,
} from './Address.styled';

export const Address = ({
  location,
  refetch,
  streetName,
  streetNr,
  city,
  zipCode,
  isGroup,
}) => {
  const intl = useIntl();
  const [openModal] = useModal();

  const openEditAddressModal = () => {
    openModal({
      content: (
        <EditAddressModal
          locationId={location.uuid}
          refetch={refetch}
          isGroup={isGroup}
        />
      ),
      closable: true,
      emphasis: 'noHeader',
    });
  };

  return (
    <AddressWrapper>
      <AddressHeader>
        {intl.formatMessage({ id: 'settings.location.address' })}
        <EditAddress data-cy="editAddress" onClick={openEditAddressModal}>
          {intl.formatMessage({ id: 'settings.location.editAddressLink' })}
        </EditAddress>
      </AddressHeader>
      <AddressRow>{`${streetName} ${streetNr}`}</AddressRow>
      <AddressRow>{`${zipCode} ${city}`}</AddressRow>
    </AddressWrapper>
  );
};
