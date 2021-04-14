import React from 'react';
import { useIntl } from 'react-intl';
import { Button } from 'antd';

// Hooks
import { useModal } from 'components/hooks/useModal';

// Components
import { HistoryModal } from 'components/App/modals/HistoryModal';
import { Row, Column } from '../Table.styled';
import { CheckDone } from './CheckDone';
import { ToggleCompleted } from './ToggleCompleted';
import { ManualSearchNameDisplay } from './ManualSearchNameDisplay';
import { UserNameDisplay } from './UserNameDisplay';

export const Entry = ({ process, refetch }) => {
  const intl = useIntl();
  const [openModal] = useModal();

  const openHistory = entry => {
    openModal({
      title: null,
      content: <HistoryModal process={entry} />,
      closable: true,
      blueModal: true,
    });
  };

  return (
    <Row>
      <Column flex="10%">
        {process.userTransferId
          ? intl.formatMessage({ id: 'processTable.person' })
          : intl.formatMessage({ id: 'processTable.location' })}
      </Column>
      <Column flex="20%">
        {process.userTransferId ? (
          <UserNameDisplay userTransferId={process.userTransferId} />
        ) : (
          <ManualSearchNameDisplay processId={process.uuid} />
        )}
      </Column>
      <Column flex="10%">
        <CheckDone processId={process.uuid} />
      </Column>
      <Column flex="10%">
        <Button
          onClick={() => openHistory(process)}
          style={{ padding: '0 40px', backgroundColor: '#b8c0ca' }}
        >
          {intl.formatMessage({ id: 'table.history.button' })}
        </Button>
      </Column>
      <Column flex="10%" align="flex-end">
        <ToggleCompleted process={process} refetch={refetch} />
      </Column>
    </Row>
  );
};
