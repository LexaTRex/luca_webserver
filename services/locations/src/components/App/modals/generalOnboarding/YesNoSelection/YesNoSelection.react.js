import React from 'react';
import { useIntl } from 'react-intl';
import { Button } from 'antd';

import {
  nextButtonStyles,
  noButtonStyles,
  backButtonStyles,
  ButtonWrapper,
} from '../Onboarding.styled';

export const YesNoSelection = ({ onYes, onNo, onBack }) => {
  const intl = useIntl();

  return (
    <ButtonWrapper multipleButtons>
      <Button style={backButtonStyles} onClick={onBack}>
        {intl.formatMessage({
          id: 'authentication.form.button.back',
        })}
      </Button>
      <div>
        <Button
          data-cy="no"
          style={{ ...noButtonStyles, marginRight: 24 }}
          onClick={onNo}
        >
          {intl.formatMessage({
            id: 'no',
          })}
        </Button>
        <Button data-cy="yes" style={nextButtonStyles} onClick={onYes}>
          {intl.formatMessage({
            id: 'yes',
          })}
        </Button>
      </div>
    </ButtonWrapper>
  );
};
