import React from 'react';
import { useQuery } from 'react-query';

import { getContactPersons } from 'network/api';

import { Header } from './Header';
import { Overview } from './Overview';
import { GuestCount } from './GuestCount';
import { GuestList } from './GuestList';
import { ContactPersonsWrapper } from './ContactPersons.styled';

export const ContactPersons = ({ location, indexPersonData }) => {
  const {
    isLoading,
    error,
    data: contactPersons,
  } = useQuery(
    `contactPersons${location.transferId}`,
    () => getContactPersons(location.transferId),
    { refetchOnWindowFocus: false }
  );

  if (isLoading || error) return null;

  return (
    <ContactPersonsWrapper>
      <Header location={location} indexPersonData={indexPersonData} />
      <Overview location={location} />
      <GuestCount guestCount={contactPersons.traces.length} />
      <GuestList
        encryptedTraces={contactPersons.traces}
        location={location}
        indexPersonData={indexPersonData}
      />
    </ContactPersonsWrapper>
  );
};
