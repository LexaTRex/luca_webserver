import React, { useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { Form, Steps, notification } from 'antd';

import { updateBadgeUser } from 'network/api';

import {
  hexToBase64,
  bytesToHex,
  encodeUtf8,
  HMAC_SHA256,
  ENCRYPT_AES_CTR,
  SIGN_EC_SHA256_DER,
  GET_RANDOM_BYTES,
} from '@lucaapp/crypto';
import { SerialCode } from './SerialCode';
import { NameInfo } from './NameInfo';
import { AddressInfo } from './AddressInfo';
import { ContactInfo } from './ContactInfo';
import { TanVerification } from './TanVerification';
import { Finish } from './Finish';

import { Wrapper, Title } from './RegisterForm.styled';

export const RegisterForm = ({ requiresVerification }) => {
  const intl = useIntl();
  const [currentStep, setCurrentStep] = useState(0);
  const [done, setDone] = useState(false);

  const [userSecrets, setUserSecrets] = useState(null);
  const [formValues, setFormValues] = useState({});
  const formReference = useRef(null);

  const reset = () => {
    setCurrentStep(0);
    setDone(false);
    setFormValues({});
  };

  const setNewValues = values => {
    const newFormValues = { ...formValues, ...values };
    setFormValues(newFormValues);
  };

  const onSubmit = values => {
    const submitFormValues = { ...formValues, ...values };

    const userData = {
      v: 2,
      fn: submitFormValues.firstName,
      ln: submitFormValues.lastName,
      pn: submitFormValues.phone,
      e: submitFormValues.email,
      st: submitFormValues.street,
      hn: submitFormValues.streetNumber,
      pc: submitFormValues.zip,
      c: submitFormValues.city,
      vs: hexToBase64(userSecrets.userVerificationSecret),
    };

    const buffer = bytesToHex(encodeUtf8(JSON.stringify(userData)));
    const iv = GET_RANDOM_BYTES(16);
    const encryptedUserData = ENCRYPT_AES_CTR(
      buffer,
      userSecrets.userDataKey,
      iv
    );

    const mac = HMAC_SHA256(
      encryptedUserData,
      userSecrets.userVerificationSecret
    );
    const signature = SIGN_EC_SHA256_DER(
      userSecrets.privateKey,
      encryptedUserData + mac + iv
    );

    const serverPayload = {
      data: hexToBase64(encryptedUserData),
      iv: hexToBase64(iv),
      mac: hexToBase64(mac),
      signature: hexToBase64(signature),
    };

    updateBadgeUser(userSecrets.userId, serverPayload)
      .then(() => {
        setDone(true);
      })
      .catch(() =>
        notification.error({
          message: intl.formatMessage({
            id: 'error.registerBadge.serverError',
          }),
        })
      );
  };

  const basicSteps = [
    {
      step: 0,
      content: (
        <SerialCode
          next={() => setCurrentStep(currentStep + 1)}
          title={intl.formatMessage({
            id: 'registerBadge.step0.title',
          })}
          setUserSecrets={secrets => setUserSecrets(secrets)}
        />
      ),
    },
    {
      step: 1,
      content: (
        <NameInfo
          next={() => setCurrentStep(currentStep + 1)}
          setValues={values => setNewValues(values)}
          form={formReference}
          title={intl.formatMessage({
            id: 'registerBadge.step1.title',
          })}
        />
      ),
    },
    {
      step: 2,
      content: (
        <AddressInfo
          next={() => setCurrentStep(currentStep + 1)}
          back={() => setCurrentStep(currentStep - 1)}
          setValues={values => setNewValues(values)}
          form={formReference}
          title={intl.formatMessage({
            id: 'registerBadge.step2.title',
          })}
        />
      ),
    },
    {
      step: 3,
      content: (
        <ContactInfo
          back={() => setCurrentStep(currentStep - 1)}
          next={() => setCurrentStep(currentStep + 1)}
          setValues={values => setNewValues(values)}
          form={formReference}
          title={intl.formatMessage({
            id: 'registerBadge.step3.title',
          })}
          requiresPhoneVerification={requiresVerification}
        />
      ),
    },
  ];

  const withVerificationSteps = [
    ...basicSteps,
    {
      step: 4,
      content: (
        <TanVerification
          back={() => setCurrentStep(currentStep - 1)}
          title={intl.formatMessage({
            id: 'registerBadge.step4.title',
          })}
          form={formReference}
          challengeId={formValues.challengeId}
          next={() => onSubmit()}
        />
      ),
    },
  ];

  const renderedSteps = requiresVerification
    ? withVerificationSteps
    : basicSteps;

  return (
    <Wrapper>
      <Title>
        {intl.formatMessage({
          id: 'registerBadge.title',
        })}
      </Title>
      {!done ? (
        <Form ref={formReference} onFinish={onSubmit}>
          <Steps
            size="small"
            current={currentStep}
            style={{
              marginTop: 48,
              marginBottom: 48,
            }}
          >
            {renderedSteps.map(step => (
              <Steps.Step key={step.step} title={step.title} />
            ))}
          </Steps>
          {renderedSteps[currentStep].content}
        </Form>
      ) : (
        <Finish onFinish={reset} />
      )}
    </Wrapper>
  );
};
