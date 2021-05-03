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
import { CreationDate } from './CreationDate';

export const Entry = ({ process, refetch }) => {
  const intl = useIntl();
  const [openModal] = useModal();

  const openHistory = entry => {
    openModal({
      title: null,
      content: <HistoryModal process={entry} />,
      closable: true,
      blueModal: true,
      wide: true,
    });
  };

  return (
    <Row>
      <Column flex="15%">
        {process.userTransferId
          ? intl.formatMessage({ id: 'processTable.person' })
          : intl.formatMessage({ id: 'processTable.location' })}
      </Column>
      <Column flex="25%">
        {process.userTransferId ? (
          <UserNameDisplay userTransferId={process.userTransferId} />
        ) : (
          <ManualSearchNameDisplay processId={process.uuid} />
        )}
      </Column>
      <Column flex="15%">
        <CreationDate createdAt={process.createdAt} />
      </Column>
      <Column flex="10%">
        <CheckDone status={process.status} />
      </Column>
      <Column flex="15%">
        <Button
          onClick={() => openHistory(process)}
          style={{ padding: '0 40px', backgroundColor: '#b8c0ca' }}
        >
          {intl.formatMessage({ id: 'table.details.button' })}
        </Button>
      </Column>
      <Column flex="20%" align="flex-end">
        <ToggleCompleted process={process} refetch={refetch} />
      </Column>
    </Row>
  );
};
