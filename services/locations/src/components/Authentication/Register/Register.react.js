import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { Helmet } from 'react-helmet-async';
import { useHistory } from 'react-router';
import { Steps, notification } from 'antd';

import { registerOperator } from 'network/api';

import { IS_MOBILE } from 'constants/environment';
import { LOGIN_ROUTE } from 'constants/routes';

import { Background } from '../Background';
import { Footer } from '../Footer';
import { EmailStep } from './steps/EmailStep';
import { ConfirmRegistrationStep } from './steps/ConfirmRegistrationStep';
import { NameInputStep } from './steps/NameInputStep';
import { SetPasswordStep } from './steps/SetPasswordStep';
import { LegalTermsStep } from './steps/LegalTermsStep';
import { FinishRegisterStep } from './steps/FinishRegisterStep';

import {
  Wrapper,
  AuthenticationWrapper,
  AuthenticationCard,
} from '../Authentication.styled';

const STEP_LENGTH = 5;

export const Register = () => {
  const intl = useIntl();
  const history = useHistory();
  const [currentStep, setCurrentStep] = useState(0);
  const [email, setEmail] = useState(null);
  const [name, setName] = useState(null);
  const [password, setPassword] = useState(null);

  const nextStep = () => setCurrentStep(currentStep + 1);
  const previousStep = () => setCurrentStep(currentStep - 1);

  const resetAuthentication = () => {
    setEmail(null);
    setName(null);
    setPassword(null);
    setCurrentStep(0);
    history.push(LOGIN_ROUTE);
  };

  const getNavigation = () => {
    return `${currentStep}/${STEP_LENGTH}`;
  };

  const register = () => {
    const registrationData = {
      email,
      firstName: name.firstName,
      lastName: name.lastName,
      password,
      agreement: true,
      avvAccepted: true,
      lang: intl.locale,
      lastVersionSeen: process.env.REACT_APP_VERSION,
    };

    registerOperator(registrationData)
      .then(response => {
        if (response.ok) {
          nextStep();
        } else {
          throw new Error('Unhandled server error');
        }
      })
      .catch(() =>
        notification.error({
          message: intl.formatMessage({
            id: 'registration.server.error.msg',
          }),
          description: intl.formatMessage({
            id: 'registration.server.error.desc',
          }),
        })
      );
  };

  const steps = [
    {
      id: '0',
      content: <EmailStep email={email} setEmail={setEmail} next={nextStep} />,
    },
    {
      id: '1',
      content: (
        <ConfirmRegistrationStep
          email={email}
          setEmail={setEmail}
          next={nextStep}
          back={() => {
            previousStep();
          }}
          navigation={getNavigation()}
        />
      ),
    },
    {
      id: '2',
      content: (
        <NameInputStep
          name={name}
          setName={setName}
          back={previousStep}
          next={nextStep}
          navigation={getNavigation()}
        />
      ),
    },
    {
      id: '3',
      content: (
        <SetPasswordStep
          setPassword={setPassword}
          previousSetPassword={password}
          back={previousStep}
          next={nextStep}
          navigation={getNavigation()}
        />
      ),
    },
    {
      id: '4',
      content: (
        <LegalTermsStep
          back={previousStep}
          next={register}
          navigation={getNavigation()}
        />
      ),
    },
    {
      id: '5',
      content: (
        <FinishRegisterStep
          next={resetAuthentication}
          navigation={getNavigation()}
        />
      ),
    },
  ];

  return (
    <>
      <Helmet>
        <title>{intl.formatMessage({ id: 'locations.site.title' })}</title>
        <meta
          name="description"
          content={intl.formatMessage({ id: 'locations.site.meta' })}
        />
      </Helmet>
      <Wrapper id={IS_MOBILE ? 'isMobile' : ''}>
        <Background isRegistration />
        <AuthenticationWrapper id="noSteps">
          <AuthenticationCard>
            <Steps
              progressDot={() => null}
              current={currentStep}
              style={{
                marginTop: 16,
                marginBottom: 48,
              }}
            >
              {steps.map(step => (
                <Steps.Step key={step.id} />
              ))}
            </Steps>
            {steps[currentStep].content}
          </AuthenticationCard>
          <Footer />
        </AuthenticationWrapper>
      </Wrapper>
    </>
  );
};
