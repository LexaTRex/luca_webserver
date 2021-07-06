import React from 'react';
import { useHistory, useLocation } from 'react-router';
import { useQuery } from 'react-query';
import { Badge } from 'antd';

import Icon from '@ant-design/icons';

import { ReactComponent as DataRequestsDefaultSvg } from 'assets/DataRequestsDefault.svg';
import { ReactComponent as DataRequestsActiveSvg } from 'assets/DataRequestsActive.svg';

import { getAllTransfers } from 'network/api';

// Constants
import { getIncompletedTransfers } from 'utils/shareData';
import { BASE_DATA_TRANSFER_ROUTE } from 'constants/routes';

import { DataRequestsComp, badgeStyle } from './DataRequests.styled';

const DataRequestsIcon = isActive => (
  <Icon
    component={isActive ? DataRequestsActiveSvg : DataRequestsDefaultSvg}
    style={{ fontSize: 32 }}
  />
);

export const DataRequests = () => {
  const history = useHistory();
  const currentRoute = useLocation();

  const isDataRequestsRoute =
    currentRoute.pathname === BASE_DATA_TRANSFER_ROUTE;

  const { isLoading, error, data: transfers } = useQuery(`transfers`, () =>
    getAllTransfers()
  );

  const navigate = () => {
    history.push(BASE_DATA_TRANSFER_ROUTE);
  };

  if (error || isLoading) return null;

  return (
    <Badge style={badgeStyle} count={getIncompletedTransfers(transfers).length}>
      <DataRequestsComp data-cy="dataRequests" onClick={navigate}>
        {DataRequestsIcon(isDataRequestsRoute)}
      </DataRequestsComp>
    </Badge>
  );
};
