import React from 'react';
import { useIntl } from 'react-intl';

import lucaLogo from 'assets/LucaLogoWhite.svg';

import {
  StyledContainer,
  StyledContent,
  StyledFooter,
  StyledHeadline,
  StyledInfoText,
  StyledLucaLogo,
  StyledSecondaryButton,
} from './FinishStep.styled';

export function FinishStep({ onSubmit = () => {} }) {
  const { formatMessage } = useIntl();

  return (
    <StyledContainer>
      <StyledContent>
        <StyledLucaLogo src={lucaLogo} />
        <StyledHeadline>
          {formatMessage({ id: 'OnBoarding.FinishStep.Headline' })}
        </StyledHeadline>
        <StyledInfoText>
          {formatMessage({ id: 'OnBoarding.FinishStep.Description1' })}
        </StyledInfoText>
        <StyledInfoText>
          {formatMessage({ id: 'OnBoarding.FinishStep.Description2' })}
        </StyledInfoText>
        <StyledInfoText>
          {formatMessage({ id: 'OnBoarding.FinishStep.Description3' })}
        </StyledInfoText>
      </StyledContent>
      <StyledFooter>
        <StyledSecondaryButton onClick={onSubmit}>
          {formatMessage({ id: 'OnBoarding.FinishStep.Submit' })}
        </StyledSecondaryButton>
      </StyledFooter>
    </StyledContainer>
  );
}
