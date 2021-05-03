import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useQuery } from 'react-query';
import { Spin, message } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { getContactPersons } from 'network/api';

import { decryptTrace } from 'utils/cryptoOperations';

import { INITIAL_OVERLAP_VALUE } from 'constants/timeOverlap';

import { Header } from './Header';
import { Table } from './Table';
import { OverlapTimeSelector } from './Selectors';
import { filterForTimeOverlap } from './ContactPersonView.helper';
import {
  ContactViewWrapper,
  CloseButtonStyles,
  FilterSettingsContainer,
} from './ContactPersonView.styled';

const ContactPersonViewRaw = ({
  location,
  onClose,
  contactFromIndexPerson,
  indexPersonData,
}) => {
  const intl = useIntl();
  const [traces, setTraces] = useState(null);
  const [filteredTraces, setFilteredTraces] = useState(null);
  const [selectedTraces, setSelectedTraces] = useState(null);
  const [minTimeOverlap, setMinTimeOverlap] = useState(INITIAL_OVERLAP_VALUE);

  const {
    isLoading,
    error,
    data: contactPersons,
  } = useQuery(
    `contactPersons${location.transferId}`,
    () => getContactPersons(location.transferId),
    { refetchOnWindowFocus: false }
  );

  useEffect(() => {
    if (isLoading) {
      return;
    }

    async function decryptTraces() {
      const hideMessage = message.loading(
        intl.formatMessage({ id: 'message.decryptingData' }),
        0
      );

      const decryptedTraces = await Promise.all(
        contactPersons.traces.map(trace =>
          decryptTrace(trace).catch(() => ({ isInvalid: true }))
        )
      );

      const validDecrypedTraces = decryptedTraces.filter(
        user => !user.isInvalid
      );

      setTraces(validDecrypedTraces);
      hideMessage();
    }

    decryptTraces();
  }, [isLoading, contactPersons, intl]);

  useEffect(() => {
    if (!traces) return;
    if (!contactFromIndexPerson) {
      setFilteredTraces(traces);
      return;
    }
    setFilteredTraces(
      filterForTimeOverlap(traces, minTimeOverlap, indexPersonData)
    );
  }, [minTimeOverlap, contactFromIndexPerson, indexPersonData, traces]);

  if (error || !filteredTraces) return null;

  return (
    <ContactViewWrapper>
      <CloseOutlined onClick={onClose} style={CloseButtonStyles} />
      {isLoading ? (
        <Spin />
      ) : (
        <>
          <Header traces={selectedTraces} location={location} />
          {contactFromIndexPerson ? (
            <FilterSettingsContainer>
              <OverlapTimeSelector setMinTimeOverlap={setMinTimeOverlap} />
            </FilterSettingsContainer>
          ) : null}
          <Table
            traces={filteredTraces}
            setSelectedTraces={setSelectedTraces}
          />
        </>
      )}
    </ContactViewWrapper>
  );
};

export const ContactPersonView = React.memo(ContactPersonViewRaw);
