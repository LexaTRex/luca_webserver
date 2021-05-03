import React, { useState } from 'react';
import { useIntl } from 'react-intl';

import lucaLogo from 'assets/LucaLogoWhite.svg';
import { hasMobileCamAccess } from 'utils/environment';

import {
  StyledLink,
  StyledFooter,
  StyledContent,
  StyledHeadline,
  StyledInfoText,
  StyledLucaLogo,
  StyledContainer,
  StyledPrimaryButton,
  StyledWarning,
} from './WelcomeStep.styled';
import { CheckBoxWithText } from '../../CheckBoxWithText';

export function WelcomeStep({ onSubmit = () => {} }) {
  const { formatMessage } = useIntl();
  const [
    isTermsAndConditionsChecked,
    setIsTermsAndConditionsChecked,
  ] = useState(false);
  const [isPrivacyChecked, setIsPrivacyChecked] = useState(false);
  const [canAccessCam] = useState(hasMobileCamAccess);

  return (
    <StyledContainer>
      <StyledContent data-cy="welcomeStep">
        <StyledLucaLogo src={lucaLogo} />
        <StyledHeadline>
          {formatMessage({ id: 'OnBoarding.WelcomeStep.Headline' })}
        </StyledHeadline>
        <StyledInfoText>
          {formatMessage({ id: 'OnBoarding.WelcomeStep.Description' })}
        </StyledInfoText>
        {!canAccessCam ? (
          <StyledWarning>
            {formatMessage({ id: 'OnBoarding.WelcomeStep.Warning' })}
          </StyledWarning>
        ) : null}
        <CheckBoxWithText
          testId="termsConsCheckbox"
          checked={isTermsAndConditionsChecked}
          onChange={() =>
            setIsTermsAndConditionsChecked(!isTermsAndConditionsChecked)
          }
          description={formatMessage(
            { id: 'OnBoarding.acceptTermsAndConditions' },
            {
              // eslint-disable-next-line react/display-name
              a: (...chunks) => (
                <StyledLink
                  href={formatMessage({
                    id: 'OnBoarding.termsAndConditionsLink',
                  })}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {chunks}
                </StyledLink>
              ),
            }
          )}
        />
        <CheckBoxWithText
          testId="privacyCheckbox"
          checked={isPrivacyChecked}
          onChange={() => setIsPrivacyChecked(!isPrivacyChecked)}
          description={formatMessage(
            { id: 'OnBoarding.acceptPrivacy' },
            {
              // eslint-disable-next-line react/display-name
              a: (...chunks) => (
                <StyledLink
                  href={formatMessage({
                    id: 'OnBoarding.privacyLink',
                  })}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {chunks}
                </StyledLink>
              ),
            }
          )}
        />
      </StyledContent>
      <StyledFooter>
        <StyledPrimaryButton
          data-cy="welcomeSubmit"
          disabled={!(isPrivacyChecked && isTermsAndConditionsChecked)}
          onClick={() => {
            if (isPrivacyChecked && isTermsAndConditionsChecked) {
              onSubmit();
            }
          }}
        >
          {formatMessage({ id: 'OnBoarding.WelcomeStep.Submit' })}
        </StyledPrimaryButton>
      </StyledFooter>
    </StyledContainer>
  );
}
