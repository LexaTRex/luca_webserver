import React from 'react';
import { useIntl } from 'react-intl';

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
import { SelectAssignee } from './SelectAssignee';
import { GrowingActionButton } from './Entry.styled';

export const Entry = ({ process, refetch, onProcessName }) => {
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
      <Column flex="10%">
        {process.userTransferId
          ? intl.formatMessage({ id: 'processTable.person' })
          : intl.formatMessage({ id: 'processTable.location' })}
      </Column>
      <Column flex="20%">
        {process.userTransferId ? (
          <UserNameDisplay
            userTransferId={process.userTransferId}
            onProcessName={onProcessName}
          />
        ) : (
          <ManualSearchNameDisplay
            processId={process.uuid}
            onProcessName={onProcessName}
          />
        )}
      </Column>
      <Column flex="15%">
        <CreationDate createdAt={process.createdAt} />
      </Column>
      <Column flex="20%">
        <SelectAssignee process={process} />
      </Column>
      <Column flex="10%">
        <CheckDone status={process.status} />
      </Column>
      <Column flex="10%">
        <GrowingActionButton
          onClick={() => openHistory(process)}
          style={{ backgroundColor: '#b8c0ca' }}
        >
          {intl.formatMessage({ id: 'table.details.button' })}
        </GrowingActionButton>
      </Column>
      <Column flex="15%" align="flex-end">
        <ToggleCompleted process={process} refetch={refetch} />
      </Column>
    </Row>
  );
};
