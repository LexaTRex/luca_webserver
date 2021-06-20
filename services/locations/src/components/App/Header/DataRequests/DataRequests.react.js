import React from 'react';
import { useHistory } from 'react-router';
import { useQuery } from 'react-query';
import { ExclamationOutlined } from '@ant-design/icons';
import { Badge } from 'antd';

import { getAllTransfers } from 'network/api';

// Constants
import { getIncompletedTransfers } from 'utils/shareData';
import { BASE_DATA_TRANSFER_ROUTE } from 'constants/routes';

import { iconStyles, badgeStyle } from './DataRequests.styled';

export const DataRequests = () => {
  const history = useHistory();

  const { isLoading, error, data: transfers } = useQuery(`transfers`, () =>
    getAllTransfers()
  );

  const navigate = () => {
    history.push(BASE_DATA_TRANSFER_ROUTE);
  };

  if (error || isLoading) return null;

  return (
    <Badge style={badgeStyle} count={getIncompletedTransfers(transfers).length}>
      <ExclamationOutlined
        data-cy="dataRequests"
        style={iconStyles}
        onClick={navigate}
      />
    </Badge>
  );
};
