import React from 'react';
import { useIntl } from 'react-intl';
import { Button } from 'antd';

// Components
import { Explain, ButtonRow } from '../RegisterHealthDepartmentModal.styled';

export const CompleteStep = ({ closeModal }) => {
  const intl = useIntl();

  return (
    <>
      <Explain>
        {intl.formatMessage({
          id: 'modal.registerHealthDepartment.step1.explain',
        })}
      </Explain>
      <ButtonRow
        numberOfButtons={1}
        style={{
          marginTop: 200,
        }}
      >
        <Button
          data-cy="finish"
          onClick={closeModal}
          style={{
            backgroundColor: '#4e6180',
            padding: '0 40px',
            color: 'white',
          }}
        >
          {intl.formatMessage({
            id: 'modal.registerHealthDepartment.step1.button',
          })}
        </Button>
      </ButtonRow>
    </>
  );
};
