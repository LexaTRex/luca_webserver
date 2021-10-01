import { useState, useEffect } from 'react';
import { useQuery, useQueries } from 'react-query';
import { getLocation, getLocationTransfers } from 'network/api';

/**
 * Enriches location transfers with location data
 * @param transfers to be enriched
 * @param locations to search from
 * @returns array of enriched location transfers
 */
const enrichTransfersWithLocations = (transfers, locations) => {
  return transfers?.map(transfer => {
    // get matching location for current location transfer
    const matchingLocation = locations.find(
      locationQuery => locationQuery.data.locationId === transfer.locationId
    );
    return {
      ...matchingLocation.data,
      time: transfer.time,
      transferId: transfer.uuid,
      isCompleted: transfer.isCompleted,
      contactedAt: transfer.contactedAt,
    };
  });
};

/**
 * Queries backend to retrieve all locationTransfers for the given process id
 * and enriches the location transfers with the location information.
 * @param processUuid
 * @returns array of location transfers (incl. location data)
 */
export const useLocationTransfers = processUuid => {
  const [locationTransfers, setLocationTransfers] = useState([]);

  const { data: transfers } = useQuery(`transfers${processUuid}`, () =>
    getLocationTransfers(processUuid)
  );

  // enrich locationTransfers with location data
  const locationIds = transfers?.map(transfer => transfer.locationId);
  const locationQueries = locationIds?.map(locationId => ({
    queryKey: `location${locationId}`,
    queryFn: () => getLocation(locationId),
    staleTime: Number.POSITIVE_INFINITY,
  }));

  const locations = useQueries(locationQueries || []);
  const locationsLoaded = locations.every(query => !!query?.isSuccess);

  useEffect(() => {
    if (locationsLoaded) {
      setLocationTransfers(enrichTransfersWithLocations(transfers, locations));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transfers, locationsLoaded]);

  return locationTransfers || [];
};
