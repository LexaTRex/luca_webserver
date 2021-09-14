import React, { useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { message } from 'antd';
import { useQuery } from 'react-query';

import { decryptTrace } from 'utils/cryptoOperations';
import { INITIAL_OVERLAP_VALUE } from 'constants/timeOverlap';
import { IncompleteDataError } from 'errors/incompleteDataError';

import { GuestListTable } from './GuestListTable';
import { OverlappingTime } from './OverlappingTime';
import { filterForTimeOverlap } from './GuestList.helper';

export const GuestList = ({
  encryptedTraces,
  indexPersonData,
  setSelectedTraces,
  setDecryptedTraces,
  location,
}) => {
  const intl = useIntl();
  const [filteredTraces, setFilteredTraces] = useState(null);
  const [minTimeOverlap, setMinTimeOverlap] = useState(INITIAL_OVERLAP_VALUE);

  const { data: traces } = useQuery(
    `decryptedTraces${location.transferId}`,
    async () => {
      const hideMessage = message.loading(
        intl.formatMessage({ id: 'message.decryptingData' }),
        0
      );
      const decryptedTraces = await Promise.all(
        encryptedTraces.map(trace =>
          decryptTrace(trace).catch(decryptionError => {
            if (decryptionError instanceof IncompleteDataError) {
              return { isUnregistered: true };
            }
            return { isInvalid: true };
          })
        )
      );
      hideMessage();
      return decryptedTraces.filter(
        user => !(user.isInvalid || user.isUnregistered)
      );
    },
    { staleTime: Number.POSITIVE_INFINITY }
  );

  useEffect(() => {
    if (traces) setDecryptedTraces(traces);
  }, [traces, setDecryptedTraces]);

  useEffect(() => {
    if (!traces) return;
    if (!indexPersonData) {
      setFilteredTraces(traces);
      return;
    }
    setFilteredTraces(
      filterForTimeOverlap(traces, minTimeOverlap, indexPersonData)
    );
  }, [minTimeOverlap, indexPersonData, traces]);

  if (!filteredTraces) return null;

  return (
    <>
      {indexPersonData !== null && (
        <OverlappingTime setMinTimeOverlap={setMinTimeOverlap} />
      )}
      <GuestListTable
        location={location}
        traces={filteredTraces}
        indexPersonData={indexPersonData}
        setSelectedTraces={setSelectedTraces}
      />
    </>
  );
};
