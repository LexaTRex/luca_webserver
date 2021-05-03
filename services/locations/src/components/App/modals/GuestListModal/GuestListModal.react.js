import React from 'react';
import moment from 'moment';
import { useIntl } from 'react-intl';
import { useQuery } from 'react-query';
import { Spin } from 'antd';

// Utils
import { sortTraces } from 'utils/sort';
import { base64ToHex } from '@lucaapp/crypto';

// Api
import { getTraces } from 'network/api';

// Components
import {
  Wrapper,
  Row,
  Time,
  Date,
  Guest,
  Count,
  Loading,
} from './GuestListModal.styled';

export const GuestListModal = ({ location }) => {
  const intl = useIntl();

  const { isLoading, error, data: traces } = useQuery(
    `traces/${location.uuid}`,
    () => getTraces(location.accessId).then(response => response.json())
  );

  if (isLoading)
    return (
      <Loading>
        <Spin size="large" tip={intl.formatMessage({ id: 'loading' })} />
      </Loading>
    );
  if (error) return null;

  return (
    <Wrapper>
      <Count data-cy="totalCheckinCount">
        {intl.formatMessage(
          { id: 'modal.guestList.count' },
          { count: traces.length }
        )}
      </Count>
      {traces.length > 0 && (
        <>
          <Row headline>
            <Date headline>
              {intl.formatMessage({ id: 'modal.guestList.date' })}
            </Date>
            <Time headline>
              {intl.formatMessage({ id: 'modal.guestList.time' })}
            </Time>
            <Guest headline>
              {intl.formatMessage({ id: 'modal.guestList.guest' })}
            </Guest>
          </Row>
          {sortTraces(traces).map(trace => (
            <Row key={trace.traceId}>
              <Date>{moment.unix(trace.checkin).format('DD.MM.YYYY')}</Date>
              <Time data-cy="trackingTime">
                {`${moment.unix(trace.checkin).format('LT')} - ${
                  trace.checkout ? moment.unix(trace.checkout).format('LT') : ''
                }`}
              </Time>
              <Guest>{base64ToHex(trace.traceId)}</Guest>
            </Row>
          ))}
        </>
      )}
    </Wrapper>
  );
};
