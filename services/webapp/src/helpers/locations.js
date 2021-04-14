import { indexDB } from 'db';
import { API_PATH } from 'constants/environment';

export async function getLocation(locationId, override = {}) {
  if (!locationId) return null;

  const locationEntry = await indexDB.locations.where({ locationId }).first();

  if (!locationEntry) {
    const location = await fetch(
      `${API_PATH}/v3/locations/${locationId}`
    ).then(response => response.json());

    indexDB.locations.add({ ...location, isPrivate: false, ...override });
    return location;
  }

  return locationEntry;
}
