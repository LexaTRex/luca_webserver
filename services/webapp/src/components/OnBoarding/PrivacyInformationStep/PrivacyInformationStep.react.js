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
} from './PrivacyInformationStep.styled';

export function PrivacyInformationStep({ onSubmit = () => {} }) {
  const { formatMessage } = useIntl();

  return (
    <StyledContainer>
      <StyledContent>
        <StyledLucaLogo src={lucaLogo} />
        <StyledHeadline>
          {formatMessage({ id: 'OnBoarding.DataInformationStep.Headline' })}
        </StyledHeadline>
        <StyledInfoText>
          {formatMessage({ id: 'OnBoarding.DataInformationStep.Description1' })}{' '}
          {formatMessage({ id: 'OnBoarding.DataInformationStep.Description2' })}
        </StyledInfoText>
        <StyledInfoText>
          {formatMessage({ id: 'OnBoarding.DataInformationStep.Description3' })}
        </StyledInfoText>
      </StyledContent>
      <StyledFooter>
        <StyledSecondaryButton onClick={onSubmit}>
          {formatMessage({ id: 'OnBoarding.DataInformationStep.Submit' })}
        </StyledSecondaryButton>
      </StyledFooter>
    </StyledContainer>
  );
}
