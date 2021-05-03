import React, { useEffect, useState } from 'react';
import { Checkbox } from 'antd';

import { getFormattedTime, getFormattedDate } from 'utils/time';

import { Row, Column } from '../../ContactPersonView.styled';

export const Trace = ({ trace, checked, onSelectionUpdate }) => {
  const [isChecked, setIsChecked] = useState(checked);
  const onCheckedStateChange = () => {
    onSelectionUpdate(trace.traceId);
  };

  useEffect(() => {
    setIsChecked(checked);
  }, [checked]);

  return (
    <Row key={trace.checkin}>
      <Column flex="20%">
        <div>{`${trace.userData.fn} ${trace.userData.ln}`}</div>
      </Column>
      <Column flex="20%">
        <div>{trace.userData.pn}</div>
      </Column>
      <Column flex="14%">
        <div>{getFormattedDate(trace.checkin)}</div>
      </Column>
      <Column flex="14%">
        <div>{getFormattedTime(trace.checkin)}</div>
      </Column>
      <Column flex="12%">
        <div>{trace.checkout ? getFormattedDate(trace.checkout) : ''}</div>
      </Column>
      <Column flex="12%">
        <div>{trace.checkout ? getFormattedTime(trace.checkout) : ''}</div>
      </Column>
      <Column flex="8%" style={{ display: 'block' }}>
        <Checkbox
          checked={isChecked}
          onChange={onCheckedStateChange}
          style={{ float: 'right' }}
        />
      </Column>
    </Row>
  );
};
