import React from 'react';
import { useIntl } from 'react-intl';

// Hooks
import { useModal } from 'components/hooks/useModal';

// Components
import { AddEmployeeModal } from 'components/App/modals/AddEmployeeModal';
import { PrimaryButton } from 'components/general';

export const AddEmployeeButton = () => {
  const intl = useIntl();

  const [openModal] = useModal();

  const addEmployee = event => {
    event.currentTarget.blur();
    openModal({
      title: intl.formatMessage({
        id: 'modal.addEmployee.title',
      }),
      content: <AddEmployeeModal />,
      closable: false,
    });
  };

  return (
    <PrimaryButton isButtonWhite data-cy="addEmployee" onClick={addEmployee}>
      {intl.formatMessage({
        id: 'modal.addEmployee.button',
      })}
    </PrimaryButton>
  );
};
