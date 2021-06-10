import { notification } from 'antd';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';
import { decodeUtf8 } from '@lucaapp/crypto';
import React, { useCallback, useState } from 'react';

import { HOME_PATH } from 'constants/routes';
import { getCheckOutPath } from 'helpers/routes';
import { base64UrlToBytes } from 'utils/encodings';
import { checkin, registerDevice } from 'helpers/crypto';
import { checkinToPrivateMeeting } from 'helpers/privateMeeting';

import { Helmet } from 'react-helmet';
import { StyledContainer } from './OnBoarding.styled';

import { FinishStep } from './FinishStep';
import { WelcomeStep } from './WelcomeStep';
import { NameInputStep } from './NameInputStep';
import { WebAppWarningStep } from './WebAppWarningStep';
import { LocationInputStep } from './LocationInputStep';
import { PrivacyInformationStep } from './PrivacyInformationStep';
import { ContactInformationInputStep } from './ContactInformationInputStep';

const FINISH_STEP = 'FINISH_STEP';
const WELCOME_STEP = 'WELCOME_STEP';
const PRIVACY_STEP = 'PRIVACY_STEP';
const NAME_INPUT_STEP = 'NAME_INPUT_STEP';
const LOCATION_INPUT_STEP = 'LOCATION_INPUT_STEP';
const GETTING_STARTED_STEP = 'GETTING_STARTED_STEP';
const CONTACT_INFORMATION_STEP = 'CONTACT_INFORMATION_STEP';

export function OnBoarding({
  location: { hash, search },
  match: { params: parameters },
}) {
  const intl = useIntl();
  const history = useHistory();
  const [account, setAccount] = useState({});
  const [activeStep, setActiveStep] = useState(GETTING_STARTED_STEP);

  const registrationHandling = useCallback(async () => {
    try {
      await registerDevice(account);
      const searchParameters = new URLSearchParams(search);

      if (parameters.scannerId) {
        if (JSON.parse(searchParameters.get('isPrivateMeeting'))) {
          checkinToPrivateMeeting(
            parameters.scannerId,
            (hash || '').replace('#', '')
          )
            .then(traceId => {
              history.push(getCheckOutPath(traceId));
            })
            .catch(() => {
              history.push(HOME_PATH);
            });
        } else {
          let decodedData;
          try {
            decodedData = JSON.parse(
              decodeUtf8(base64UrlToBytes((hash || '').replace('#', '')))
            );
          } catch {
            decodedData = null;
          }

          checkin(parameters.scannerId, decodedData)
            .then(traceId => {
              history.push(getCheckOutPath(traceId));
            })
            .catch(() => {
              history.push(HOME_PATH);
            });
        }
      } else {
        history.push(HOME_PATH);
      }
    } catch {
      history.push(HOME_PATH);
      notification.error({
        message: intl.formatMessage({
          id: 'error.headline',
        }),
        description: intl.formatMessage({
          id: 'error.description',
        }),
      });
    }
  }, [intl, account, history, hash, parameters.scannerId, search]);

  return (
    <StyledContainer>
      <Helmet>
        <title>{intl.formatMessage({ id: 'OnBoarding.PageTitle' })}</title>
      </Helmet>
      {activeStep === GETTING_STARTED_STEP && (
        <WebAppWarningStep onSubmit={() => setActiveStep(WELCOME_STEP)} />
      )}
      {activeStep === WELCOME_STEP && (
        <WelcomeStep onSubmit={() => setActiveStep(PRIVACY_STEP)} />
      )}
      {activeStep === PRIVACY_STEP && (
        <PrivacyInformationStep
          onSubmit={() => setActiveStep(NAME_INPUT_STEP)}
        />
      )}
      {activeStep === NAME_INPUT_STEP && (
        <NameInputStep
          onSubmit={values => {
            setActiveStep(CONTACT_INFORMATION_STEP);
            setAccount({ ...account, ...values });
          }}
        />
      )}
      {activeStep === CONTACT_INFORMATION_STEP && (
        <ContactInformationInputStep
          onSubmit={values => {
            setActiveStep(LOCATION_INPUT_STEP);
            setAccount({ ...account, ...values });
          }}
        />
      )}
      {activeStep === LOCATION_INPUT_STEP && (
        <LocationInputStep
          onSubmit={values => {
            setActiveStep(FINISH_STEP);
            setAccount({ ...account, ...values });
          }}
        />
      )}
      {activeStep === FINISH_STEP && (
        <FinishStep
          onSubmit={() => {
            registrationHandling();
          }}
        />
      )}
    </StyledContainer>
  );
}
