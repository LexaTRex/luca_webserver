import React, { useState } from 'react';
import { useIntl } from 'react-intl';

import lucaLogo from 'assets/LucaLogoWhite.svg';
import { hasMobileCamAccess } from 'utils/environment';

import { TERMS_CONDITIONS_LINK, PRIVACY_LINK } from 'constants/links';

import { CheckBoxWithText } from 'components/CheckBoxWithText';
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

export function WelcomeStep({ onSubmit = () => {} }) {
  const { formatMessage } = useIntl();
  const [
    isTermsAndConditionsChecked,
    setIsTermsAndConditionsChecked,
  ] = useState(false);
  const [canAccessCam] = useState(hasMobileCamAccess);

  return (
    <StyledContainer>
      <StyledContent data-cy="welcomeStep">
        <StyledLucaLogo alt="luca" src={lucaLogo} />
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
        <StyledInfoText>
          {formatMessage(
            { id: 'OnBoarding.acceptPrivacy' },
            {
              // eslint-disable-next-line react/display-name
              a: (...chunks) => (
                <StyledLink
                  tabIndex="4"
                  href={PRIVACY_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {chunks}
                </StyledLink>
              ),
            }
          )}
        </StyledInfoText>
        <CheckBoxWithText
          tabIndex="1"
          id="termsConsCheckbox"
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
                  tabIndex="2"
                  href={TERMS_CONDITIONS_LINK}
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
          id="next"
          tabIndex="5"
          data-cy="welcomeSubmit"
          disabled={!isTermsAndConditionsChecked}
          onClick={() => {
            if (isTermsAndConditionsChecked) {
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
