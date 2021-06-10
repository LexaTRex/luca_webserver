import React from 'react';
import { useIntl } from 'react-intl';
import { Button } from 'antd';

// Hooks
import { useModal } from 'components/hooks/useModal';

// Components
import { AddEmployeeModal } from 'components/App/modals/AddEmployeeModal';

const buttonStyles = {
  padding: '0 40px',
  backgroundColor: 'white',
  color: 'black',
  fontFamily: 'Montserrat-Bold, sans-serif',
  fontSize: 14,
  fontWeight: 'bold',
};

export const AddEmployeeButton = () => {
  const intl = useIntl();

  const [openModal] = useModal();

  const addEmployee = () => {
    openModal({
      title: intl.formatMessage({
        id: 'modal.addEmployee.title',
      }),
      content: <AddEmployeeModal />,
      closable: false,
    });
  };

  return (
    <Button onClick={addEmployee} style={buttonStyles}>
      {intl.formatMessage({
        id: 'modal.addEmployee.button',
      })}
    </Button>
  );
};
