import React, { useState, useCallback, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { Table } from 'antd';
import { getWarningLevelsForLocationTransfer, getMe } from 'network/api';

import { useQuery } from 'react-query';

import { NOTIFIEABLE_DEVICE_TYPES } from 'constants/deviceTypes';
import { AdditionalData } from './AdditionalData';
import { Notified } from './Notified';
import { Name } from './Name';
import { Address } from './Address';
import { Phone } from './Phone';
import { Time } from './Time';
import { SelectionTitle } from './SelectionTitle';
import { Selection } from './Selection';

export const GuestListTable = ({
  traces,
  indexPersonData,
  setSelectedTraces,
  location,
}) => {
  const intl = useIntl();

  const { transferId } = location;
  const {
    data: riskLevels,
  } = useQuery(
    `getWarningLevelsForLocationTransfer${transferId}`,
    () => getWarningLevelsForLocationTransfer(transferId),
    { refetchOnWindowFocus: false }
  );

  const { data: healthDepartmentEmployee } = useQuery('me', getMe, {
    refetchOnWindowFocus: false,
  });

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

  const isTraceChecked = lookupTrace => {
    return (
      tracesChecked.find(trace => trace.traceId === lookupTrace.traceId)
        ?.checked || false
    );
  };

  const columns = [
    {
      key: 'Notified',
      render: function renderBell(notificationTrace) {
        if (
          !riskLevels ||
          !healthDepartmentEmployee ||
          !healthDepartmentEmployee.notificationsEnabled ||
          !(
            notificationTrace.deviceType === NOTIFIEABLE_DEVICE_TYPES.IOS ||
            notificationTrace.deviceType === NOTIFIEABLE_DEVICE_TYPES.ANDROID
          )
        )
          return null;

        const traceRiskLevels = riskLevels.find(
          riskLevelObject =>
            riskLevelObject.traceId === notificationTrace.traceId
        )?.riskLevels;

        if (!traceRiskLevels?.length) return null;

        return <Notified />;
      },
    },
    {
      title: intl.formatMessage({ id: 'contactPersonTable.name' }),
      key: 'name',
      render: function renderName(trace) {
        return <Name trace={trace} />;
      },
    },
    {
      title: intl.formatMessage({ id: 'contactPersonTable.address' }),
      key: 'address',
      render: function renderAddress(trace) {
        return <Address trace={trace} />;
      },
    },
    {
      title: intl.formatMessage({ id: 'contactPersonTable.phone' }),
      key: 'phone',
      render: function renderPhone(trace) {
        return <Phone trace={trace} />;
      },
    },
    {
      title: intl.formatMessage({ id: 'contactPersonTable.checkin' }),
      key: 'checkin',
      render: function renderCheckin(trace) {
        return <Time time={trace.checkin} />;
      },
    },
    {
      title: intl.formatMessage({ id: 'contactPersonTable.checkout' }),
      key: 'checkout',
      render: function renderCheckout(trace) {
        return <Time time={trace.checkout} />;
      },
    },
    {
      title: intl.formatMessage({ id: 'contactPersonTable.additionalData' }),
      key: 'additionalData',
      render: function renderAdditionalData(trace) {
        return <AdditionalData trace={trace} />;
      },
    },
    {
      title: function renderSelectionTitle() {
        return (
          <SelectionTitle
            traces={traces}
            onSelectAll={onSelectAll}
            selectAllChecked={selectAllChecked}
          />
        );
      },
      key: '',
      render: function renderSelection(trace) {
        return (
          <Selection
            trace={trace}
            onSelectionUpdate={onSelectionUpdate}
            checked={isTraceChecked(trace)}
          />
        );
      },
    },
  ];

  return (
    <Table
      id="contactPersonsTable"
      columns={columns}
      dataSource={traces}
      pagination={false}
      rowClassName={record =>
        indexPersonData !== null &&
        record.userData?.uuid === indexPersonData?.uuid
          ? 'indexPerson'
          : ''
      }
      rowKey={record => record.traceId}
      locale={{
        emptyText: intl.formatMessage({
          id: 'contactPersonTable.noData',
        }),
      }}
    />
  );
};
