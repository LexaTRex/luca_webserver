import React, { useMemo, useState } from 'react';
import moment from 'moment';
import { Spin, Popconfirm, notification } from 'antd';
import { PrimaryButton } from 'components/general';
import { useIntl } from 'react-intl';
import { useQuery, useQueryClient } from 'react-query';
import { QuestionCircleOutlined } from '@ant-design/icons';

// Api
import { getTraces, forceCheckoutByOperator } from 'network/api';

// Components
import { TableHeader } from './TableHeader';
import { Headline } from './Headline';
import {
  Entry,
  Loading,
  Wrapper,
  GuestTable,
  TableRow,
} from './TableAllocationModal.styled';
import { extractTableNumbers } from './TableAllocationModal.helper';

export const TableAllocationModal = ({ privateKey, location }) => {
  const intl = useIntl();
  const queryClient = useQueryClient();
  const [lastRefresh, setLastRefresh] = useState(moment());

  const {
    isLoading,
    error: fetchError,
    data: traces,
    refetch,
  } = useQuery(`traces/${location.uuid}`, () => getTraces(location.uuid));

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const activeTables = useMemo(() => extractTableNumbers(traces, privateKey), [
    traces,
    privateKey,
  ]);

  const refresh = () => {
    setLastRefresh(moment());
    refetch();
  };

  const onCheckoutTable = traceIds => {
    Promise.all(traceIds.map(traceId => forceCheckoutByOperator(traceId)))
      .then(responses => {
        if (responses.some(response => response.status !== 204)) {
          throw new Error('checkout failed');
        }

        queryClient.invalidateQueries(`traces/${location.uuid}`);
        queryClient.invalidateQueries(`current/${location.scannerId}`);
        refresh();
        notification.success({
          message: intl.formatMessage({
            id: 'notification.checkOut.success',
          }),
          className: 'successCheckout',
        });
      })
      .catch(() => {
        notification.error({
          message: intl.formatMessage({
            id: 'notification.checkOut.error',
          }),
        });
      });
  };

  if (isLoading)
    return (
      <Loading>
        <Spin size="large" />
      </Loading>
    );
  if (fetchError) return null;

  return (
    <Wrapper>
      <Headline
        activeTables={activeTables}
        callback={refresh}
        lastRefresh={lastRefresh}
      />
      <GuestTable>
        <TableHeader activeTables={activeTables} />
        <tbody>
          {Object.keys(activeTables).map(table => (
            <TableRow headline="true" key={`table_${table}`}>
              <Entry>
                {intl.formatMessage({ id: 'table' })} {table}
              </Entry>
              <Entry>{activeTables[table]?.length}</Entry>
              <Entry>
                {activeTables[table]?.length > 0 && (
                  <Popconfirm
                    placement="topLeft"
                    onConfirm={() => onCheckoutTable(activeTables[table])}
                    title={intl.formatMessage({
                      id: 'location.checkout.confirmTableCheckoutText',
                    })}
                    okText={intl.formatMessage({
                      id: 'location.checkout.confirmButton',
                    })}
                    cancelText={intl.formatMessage({
                      id: 'location.checkout.declineButton',
                    })}
                    icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                  >
                    <PrimaryButton>
                      {intl.formatMessage({
                        id: 'group.view.overview.tableAllocationCheckout',
                      })}
                    </PrimaryButton>
                  </Popconfirm>
                )}
              </Entry>
            </TableRow>
          ))}
        </tbody>
      </GuestTable>
    </Wrapper>
  );
};
