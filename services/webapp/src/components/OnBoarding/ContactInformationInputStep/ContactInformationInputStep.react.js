import { notification, Spin } from 'antd';
import { useIntl } from 'react-intl';
import React, { useState } from 'react';
import parsePhoneNumber from 'libphonenumber-js/max';

import { checkPhoneNumber } from 'utils/parsePhoneNumber';

import { sendSMSTAN, verifySMSTAN } from 'network/api';

import { TextInput } from '../../TextInput';
import {
  StyledForm,
  StyledLink,
  SpinWrapper,
  StyledFooter,
  StyledContent,
  StyledInfoText,
  StyledHeadline,
  StyledSecondaryButton,
  StyledDescription,
} from './ContactInformationInputStep.styled';

export function ContactInformationInputStep({ onSubmit }) {
  const { formatMessage } = useIntl();
  const [phone, setPhone] = useState(null);
  const [email, setEmail] = useState(null);
  const [challengeId, setChallengeId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <StyledForm
      data-cy="contactInfo"
      defaultValues={{ email, phoneNumber: phone }}
      onFinish={({ phoneNumber, email: formEmail, tan }) => {
        if (challengeId) {
          setIsLoading(true);
          verifySMSTAN(challengeId, tan)
            .then(() => {
              setIsLoading(false);
              onSubmit({ phoneNumber: phone, email });
            })
            .catch(() => {
              setIsLoading(false);
              notification.error({
                message: formatMessage({
                  id: 'OnBoarding.PhoneNumberInputStep.VerifyFailed',
                }),
              });
            });
        } else {
          const formattedPhoneNumber = parsePhoneNumber(
            phoneNumber,
            'DE'
          ).formatInternational();
          setEmail(formEmail);
          setPhone(formattedPhoneNumber);
          sendSMSTAN(formattedPhoneNumber)
            .then(id => setChallengeId(id))
            .catch(() => setChallengeId(null));
        }
      }}
    >
      <StyledContent>
        <StyledHeadline>
          {formatMessage({
            id: challengeId
              ? 'OnBoarding.PhoneNumberInputStep.TANHeadline'
              : 'OnBoarding.PhoneNumberInputStep.Headline',
          })}
        </StyledHeadline>
        {!challengeId && (
          <StyledInfoText>
            {formatMessage({
              id: 'OnBoarding.PhoneNumberInputStep.SMSTANInfo',
            })}
          </StyledInfoText>
        )}
        {challengeId ? (
          <>
            {isLoading ? (
              <SpinWrapper>
                <Spin size="large" />
              </SpinWrapper>
            ) : (
              <>
                <StyledDescription>
                  {formatMessage({
                    id: 'OnBoarding.PhoneNumberInputStep.TANDescription',
                  })}
                </StyledDescription>
                <TextInput
                  type="tel"
                  name="tan"
                  auto-complete="one-time-code"
                  placeholder={formatMessage({ id: 'Form.Tan' })}
                  rules={[
                    {
                      required: true,
                      message: formatMessage({
                        id: 'Form.Validation.isRequired',
                      }),
                    },
                  ]}
                />
                <StyledLink
                  onClick={() => {
                    sendSMSTAN(phone)
                      .then(id => setChallengeId(id))
                      .catch(() => setChallengeId(null));
                  }}
                >
                  {formatMessage({ id: 'Form.Resend' })}
                </StyledLink>
              </>
            )}
          </>
        ) : (
          <>
            <TextInput
              type="text"
              name="email"
              defaultValue={email}
              autocomplete="email"
              placeholder={formatMessage({ id: 'Form.Email' })}
              rules={[
                {
                  type: 'email',
                  message: formatMessage({
                    id: 'Form.Validation.email',
                  }),
                },
              ]}
            />
            <TextInput
              type="tel"
              autocomplete="tel"
              name="phoneNumber"
              defaultValue={phone}
              placeholder={formatMessage({ id: 'Form.Phone' })}
              rules={[
                {
                  validator: (_, value) => {
                    return checkPhoneNumber(value)
                      ? Promise.resolve()
                      : Promise.reject(
                          formatMessage({
                            id: 'Form.Validation.unsupportedFormat',
                          })
                        );
                  },
                },
              ]}
            />
          </>
        )}
      </StyledContent>
      <StyledFooter showCancel={challengeId}>
        <StyledSecondaryButton htmlType="submit" data-cy="contactInfoSubmit">
          {formatMessage({ id: 'Form.Submit' })}
        </StyledSecondaryButton>
        {challengeId && (
          <StyledLink
            isCentered
            onClick={() => {
              setChallengeId(null);
            }}
          >
            {formatMessage({ id: 'Form.Cancel' })}
          </StyledLink>
        )}
      </StyledFooter>
    </StyledForm>
  );
}
