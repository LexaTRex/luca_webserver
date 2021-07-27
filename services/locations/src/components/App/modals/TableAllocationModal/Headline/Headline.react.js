import React from 'react';
import moment from 'moment';
import { useIntl } from 'react-intl';
import { SecondaryButton } from 'components/general/Buttons.styled';

// Components
import {
  ActiveTableCount,
  HeaderRow,
  RefreshTime,
  AlignSelfEnd,
} from '../TableAllocationModal.styled';

export const Headline = ({ activeTables, callback, lastRefresh }) => {
  const intl = useIntl();

  return (
    <>
      <HeaderRow>
        <ActiveTableCount>{`${intl.formatMessage({
          id: 'modal.tableAllocation.activeTableCount',
        })}: ${Object.keys(activeTables).length}`}</ActiveTableCount>
        <SecondaryButton onClick={callback}>
          {intl.formatMessage({
            id: 'refresh',
          })}
        </SecondaryButton>
      </HeaderRow>
      <AlignSelfEnd>
        <RefreshTime>
          {`${intl.formatMessage({
            id: 'modal.tableAllocation.lastRefresh',
          })}: ${moment(lastRefresh).format('DD.MM.YYYY - HH:mm:ss')}`}
        </RefreshTime>
      </AlignSelfEnd>
    </>
  );
};
