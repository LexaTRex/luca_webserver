import React, { useState, useEffect, useCallback } from 'react';
import { useIntl } from 'react-intl';
import { Checkbox } from 'antd';

import { EmptyContactPerson } from './EmptyContactPerson';
import { Trace } from './Trace';
import { NonRegistredBadgeTrace } from './NonRegistredBadgeTrace';

import {
  TableWrapper,
  TableHeader,
  Column,
  CheckboxWrapper,
} from '../ContactPersonView.styled';

const TableRaw = ({ traces, setSelectedTraces }) => {
  const intl = useIntl();

  const updateAllCheckboxes = useCallback(
    checked =>
      traces.map(trace => {
        return {
          traceId: trace.traceId,
          checked,
        };
      }),
    [traces]
  );

  const [tracesChecked, updateTracesChecked] = useState(
    updateAllCheckboxes(true)
  );

  const [selectAllChecked, updateSelectAllChecked] = useState(false);

  useEffect(() => {
    updateTracesChecked(updateAllCheckboxes(true));
    updateSelectAllChecked(true);
  }, [traces, updateAllCheckboxes]);

  useEffect(() => {
    const checkedTracesData = traces.filter(trace =>
      tracesChecked.some(
        ({ traceId, checked }) => trace.traceId === traceId && checked
      )
    );
    setSelectedTraces(checkedTracesData);
  }, [traces, tracesChecked, setSelectedTraces]);

  const onSelectAll = event => {
    updateSelectAllChecked(event.target.checked);
    updateTracesChecked(updateAllCheckboxes(event.target.checked));
  };

  const isTraceChecked = lookupTrace => {
    return (
      tracesChecked.find(trace => trace.traceId === lookupTrace.traceId)
        ?.checked || false
    );
  };

  const onSelectionUpdate = traceId => {
    const index = tracesChecked.findIndex(trace => trace.traceId === traceId);
    const newTracesChecked = [...tracesChecked];
    newTracesChecked[index] = {
      traceId,
      checked: !newTracesChecked[index].checked,
    };
    updateSelectAllChecked(false);
    updateTracesChecked(newTracesChecked);
  };

  return (
    <TableWrapper>
      <TableHeader>
        <Column flex="10%">
          {intl.formatMessage({ id: 'contactPersonTable.name' })}
        </Column>
        <Column flex="15%">
          {intl.formatMessage({ id: 'contactPersonTable.address' })}
        </Column>
        <Column flex="10%">
          {intl.formatMessage({ id: 'contactPersonTable.phone' })}
        </Column>
        <Column flex="10%">
          {intl.formatMessage({ id: 'contactPersonTable.checkinDate' })}
        </Column>
        <Column flex="10%">
          {intl.formatMessage({ id: 'contactPersonTable.checkinTime' })}
        </Column>
        <Column flex="10%">
          {intl.formatMessage({ id: 'contactPersonTable.checkoutDate' })}
        </Column>
        <Column flex="10%">
          {intl.formatMessage({ id: 'contactPersonTable.checkoutTime' })}
        </Column>
        <Column flex="16%">
          {intl.formatMessage({ id: 'contactPersonTable.additionalData' })}
        </Column>
        <Column flex="8%" style={{ display: 'block' }}>
          <CheckboxWrapper>
            {intl.formatMessage({ id: 'contactPersonTable.selectAll' })}
            <Checkbox
              onChange={onSelectAll}
              checked={selectAllChecked}
              style={{ marginTop: 16 }}
            />
          </CheckboxWrapper>
        </Column>
      </TableHeader>
      {traces.length > 0 ? (
        traces.map(trace =>
          trace.userData ? (
            <Trace
              key={trace.traceId}
              trace={trace}
              checked={isTraceChecked(trace)}
              onSelectionUpdate={onSelectionUpdate}
            />
          ) : (
            <NonRegistredBadgeTrace />
          )
        )
      ) : (
        <EmptyContactPerson />
      )}
    </TableWrapper>
  );
};

export const Table = React.memo(TableRaw);
