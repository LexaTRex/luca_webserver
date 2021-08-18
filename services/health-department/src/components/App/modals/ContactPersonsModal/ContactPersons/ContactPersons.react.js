import React, { useState } from 'react';
import { useQuery } from 'react-query';

import { getContactPersons } from 'network/api';

import { Header } from './Header';
import { Overview } from './Overview';
import { GuestCount } from './GuestCount';
import { GuestList } from './GuestList';
import { Export } from './Export';
import { ContactPersonsWrapper, FlexWrapper } from './ContactPersons.styled';

export const ContactPersons = ({ location, indexPersonData }) => {
  const [selectedTraces, setSelectedTraces] = useState(null);
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
      <FlexWrapper>
        <Header location={location} indexPersonData={indexPersonData} />
        <Export traces={selectedTraces} location={location} />
      </FlexWrapper>
      <Overview location={location} />
      <GuestCount guestCount={contactPersons.traces.length} />
      <GuestList
        encryptedTraces={contactPersons.traces}
        location={location}
        indexPersonData={indexPersonData}
        setSelectedTraces={setSelectedTraces}
      />
    </ContactPersonsWrapper>
  );
};
