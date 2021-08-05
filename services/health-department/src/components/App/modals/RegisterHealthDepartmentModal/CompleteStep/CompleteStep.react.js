import React from 'react';
import { useIntl } from 'react-intl';
import { PrimaryButton } from 'components/general';

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
        <PrimaryButton data-cy="finish" onClick={closeModal}>
          {intl.formatMessage({
            id: 'modal.registerHealthDepartment.step1.button',
          })}
        </PrimaryButton>
      </ButtonRow>
    </>
  );
};
