import React from 'react';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';

import { PROCESS_DETAILS_BASE_ROUTE } from 'constants/routes';

// Components
import { Row, Column } from '../Table.styled';
import { CheckDone } from './CheckDone';
import { ManualSearchNameDisplay } from './ManualSearchNameDisplay';
import { UserNameDisplay } from './UserNameDisplay';
import { CreationDate } from './CreationDate';
import { SelectAssignee } from './SelectAssignee';

export const Entry = ({ process, onProcessName }) => {
  const intl = useIntl();
  const history = useHistory();

  const openDetails = () => {
    history.push(`${PROCESS_DETAILS_BASE_ROUTE}${process.uuid}`);
  };

  return (
    <Row data-cy="processEntry" onClick={openDetails}>
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
    </Row>
  );
};
