import { useState, useEffect } from 'react';
import { useQuery, useQueries } from 'react-query';

import { getLocation, getLocationTransfers } from 'network/api';

export const useLocationWithTransfers = processUuid => {
  const [locations, setLocations] = useState([]);

  const { data: transfers } = useQuery(
    `transfers${processUuid}`,
    () => getLocationTransfers(processUuid),
    {
      staleTime: 60000,
      refetchInterval: 60000,
    }
  );

  const queries =
    transfers?.map(transfer => ({
      queryKey: `location${transfer.locationId}`,
      queryFn: () => getLocation(transfer.locationId),
      staleTime: Number.POSITIVE_INFINITY,
    })) || [];

  const locationTransferQueries = useQueries(queries);
  const locationTransferQueriesLoaded = locationTransferQueries.every(
    query => !!query?.isSuccess
  );

  useEffect(() => {
    if (locationTransferQueriesLoaded) {
      setLocations(
        locationTransferQueries.map(query => {
          const matchingTransfer = transfers.find(
            transfer => transfer.locationId === query.data.locationId
          );
          return {
            ...query.data,
            time: matchingTransfer.time,
            transferId: matchingTransfer.uuid,
            isCompleted: matchingTransfer.isCompleted,
            contactedAt: matchingTransfer.contactedAt,
          };
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transfers, locationTransferQueriesLoaded]);

  if (!transfers) return [];
  return locations;
};
