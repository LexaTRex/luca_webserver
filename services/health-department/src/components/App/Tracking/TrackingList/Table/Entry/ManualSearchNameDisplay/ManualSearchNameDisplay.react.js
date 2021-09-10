import React from 'react';
import moment from 'moment';

import { useLocationTransfers } from 'components/hooks/useLocationTransfers';

export const ManualSearchNameDisplay = ({ processId, onProcessName }) => {
  const locations = useLocationTransfers(processId);

  if (!locations.length) return null;
  const baseLocation = locations.find(location => !location.locationName);
  onProcessName(processId, baseLocation.name);

  return (
    <div>
      <div>{baseLocation.name}</div>
      <div>
        {`(${moment.unix(baseLocation.time[0]).format('DD.MM.YYYY HH:mm')} -`}
      </div>
      <div>{`${moment
        .unix(baseLocation.time[1])
        .format('DD.MM.YYYY HH:mm')})`}</div>
    </div>
  );
};
