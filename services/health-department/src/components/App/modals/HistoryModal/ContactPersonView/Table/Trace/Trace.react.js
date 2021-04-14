import React from 'react';

import { getFormattedTime, getFormattedDate } from 'utils/time';

import { Row, Column } from '../../ContactPersonView.styled';

export const Trace = ({ trace }) => {
  return (
    <Row key={trace.checkin}>
      <Column flex="20%">
        <div>{`${trace.userData.fn} ${trace.userData.ln}`}</div>
      </Column>
      <Column flex="20%">
        <div>{trace.userData.pn}</div>
      </Column>
      <Column flex="15%">
        <div>{getFormattedDate(trace.checkin)}</div>
      </Column>
      <Column flex="15%">
        <div>{getFormattedTime(trace.checkin)}</div>
      </Column>
      <Column flex="15%">
        <div>{trace.checkout ? getFormattedDate(trace.checkout) : ''}</div>
      </Column>
      <Column flex="15%">
        <div>{trace.checkout ? getFormattedTime(trace.checkout) : ''}</div>
      </Column>
    </Row>
  );
};
