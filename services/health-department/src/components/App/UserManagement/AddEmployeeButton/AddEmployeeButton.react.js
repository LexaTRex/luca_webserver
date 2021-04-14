import React from 'react';
import { useIntl } from 'react-intl';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

// Hooks
import { useModal } from 'components/hooks/useModal';

// Components
import { AddEmployeeModal } from 'components/App/modals/AddEmployeeModal';

const buttonStyles = {
  position: 'absolute',
  right: 32,
  top: 16,
  backgroundColor: '#4e6180',
  color: 'white',
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
      blueModal: true,
    });
  };

  return (
    <Button
      onClick={addEmployee}
      icon={<PlusOutlined />}
      shape="circle"
      size="large"
      style={buttonStyles}
    />
  );
};
