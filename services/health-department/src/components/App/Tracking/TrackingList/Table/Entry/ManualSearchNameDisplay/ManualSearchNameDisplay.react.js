import React from 'react';
import moment from 'moment';
import { useQuery } from 'react-query';

import { getLocationTransfers } from 'network/api';

export const ManualSearchNameDisplay = ({ processId }) => {
  const { isLoading, error, data } = useQuery(
    `locationTransfer${processId}`,
    () => getLocationTransfers(processId)
  );

  if (isLoading || error) return null;

  return (
    <div>
      {data.length && (
        <>
          <div>{data[0].name}</div>
          <div>
            {`(${moment.unix(data[0].time[0]).format('DD.MM.YYYY HH:mm')} -`}
          </div>
          <div>
            {`${moment.unix(data[0].time[1]).format('DD.MM.YYYY HH:mm')})`}
          </div>
        </>
      )}
    </div>
  );
};
