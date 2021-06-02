import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { Checkbox } from 'antd';

import { getFormattedTime, getFormattedDate } from 'utils/time';

import {
  Row,
  Column,
  DataName,
  AdditionalDataWrapper,
} from '../../ContactPersonView.styled';

export const Trace = ({ trace, checked, onSelectionUpdate }) => {
  const intl = useIntl();
  const [isChecked, setIsChecked] = useState(checked);
  const onCheckedStateChange = () => {
    onSelectionUpdate(trace.traceId);
  };

  useEffect(() => {
    setIsChecked(checked);
  }, [checked]);

  const getAdditionalDataName = key => {
    if (key !== 'table') return key;
    // localize special additional data attributes
    return intl.formatMessage({
      id: 'contactPersonTable.additionalData.table',
    });
  };

  let additionalDataSource;
  if (trace.additionalData) {
    additionalDataSource = Object.entries(trace.additionalData).map(
      (dataPair, index) => ({
        index,
        name: getAdditionalDataName(dataPair[0]),
        content: dataPair[1],
      })
    );
  }

  return (
    <Row key={trace.checkin}>
      <Column flex="10%">
        <div>{trace.userData.fn}</div>
        <div>{trace.userData.ln}</div>
      </Column>
      <Column flex="15%">
        <div>{`${trace.userData.st} ${trace.userData.hn}`}</div>
        <div>{`${trace.userData.pc} ${trace.userData.c}`}</div>
      </Column>
      <Column flex="10%">
        <div>{trace.userData.pn}</div>
      </Column>
      <Column flex="10%">
        <div>{getFormattedDate(trace.checkin)}</div>
      </Column>
      <Column flex="10%">
        <div>{getFormattedTime(trace.checkin)}</div>
      </Column>
      <Column flex="10%">
        <div>{trace.checkout ? getFormattedDate(trace.checkout) : ''}</div>
      </Column>
      <Column flex="10%">
        <div>{trace.checkout ? getFormattedTime(trace.checkout) : ''}</div>
      </Column>
      <Column flex="16%">
        <AdditionalDataWrapper>
          {additionalDataSource ? (
            additionalDataSource.map(data => (
              <div style={{ marginBottom: 8 }} key={data.index}>
                <DataName>{data.name}</DataName>
                <div>{data.content}</div>
              </div>
            ))
          ) : (
            <div>
              {intl.formatMessage({ id: 'traceTable.noAdditionalData' })}
            </div>
          )}
        </AdditionalDataWrapper>
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
