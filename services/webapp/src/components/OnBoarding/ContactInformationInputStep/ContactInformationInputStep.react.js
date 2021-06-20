import React, { useState, useCallback } from 'react';
import { notification, Spin } from 'antd';
import { useIntl } from 'react-intl';
import parsePhoneNumber from 'libphonenumber-js/max';

import { checkPhoneNumber } from 'utils/parsePhoneNumber';

import { sendSMSTAN, verifySMSTAN } from 'network/api';

import { TextInput } from 'components/TextInput';
import { MAX_EMAIL_LENGTH, MAX_PHONE_LENGTH } from 'constants/valueLength';

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

/**
 * This step performs a client-side verification of the phone number.
 *
 * @see https://www.luca-app.de/securityoverview/processes/guest_registration.html#verifying-the-contact-data
 *      https://www.luca-app.de/securityoverview/processes/guest_registration.html#verification-of-the-guest-s-contact-data
 */
export function ContactInformationInputStep({ onSubmit }) {
  const { formatMessage } = useIntl();
  const [phone, setPhone] = useState(null);
  const [email, setEmail] = useState(null);
  const [challengeId, setChallengeId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const onValuesChange = useCallback(
    (_, { phoneNumber, tan }) => setIsReady(challengeId ? tan : phoneNumber),
    [challengeId, setIsReady]
  );

  return (
    <StyledForm
      data-cy="contactInfo"
      onValuesChange={onValuesChange}
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
            .then(id => {
              setChallengeId(id);
              setIsReady(false);
            })
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
        <StyledInfoText>
          {formatMessage({ id: 'Form.RequiredField.Explanation' })}
        </StyledInfoText>
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
                  autoFocus
                  type="tel"
                  name="tan"
                  tabIndex="1"
                  auto-complete="one-time-code"
                  label={formatMessage({ id: 'Form.Tan.Label' })}
                  placeholder={formatMessage({ id: 'Form.Tan.Placeholder' })}
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
                  tabIndex="2"
                  id="resendTAN"
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
              autoFocus
              type="email"
              name="email"
              tabIndex="1"
              defaultValue={email}
              autocomplete="email"
              label={formatMessage({ id: 'Form.Email.Label' })}
              placeholder={formatMessage({ id: 'Form.Email.Placeholder' })}
              rules={[
                {
                  type: 'email',
                  message: formatMessage({
                    id: 'Form.Validation.email',
                  }),
                },
                {
                  max: MAX_EMAIL_LENGTH,
                  message: formatMessage({ id: 'Form.Validation.toLong' }),
                },
              ]}
            />
            <TextInput
              type="tel"
              tabIndex="2"
              autocomplete="tel"
              name="phoneNumber"
              defaultValue={phone}
              label={formatMessage({ id: 'Form.Phone.Label' })}
              placeholder={formatMessage({ id: 'Form.Phone.Placeholder' })}
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
                {
                  max: MAX_PHONE_LENGTH,
                  message: formatMessage({ id: 'Form.Validation.toLong' }),
                },
              ]}
            />
          </>
        )}
      </StyledContent>
      <StyledFooter showCancel={challengeId}>
        <StyledSecondaryButton
          id="next"
          tabIndex="3"
          htmlType="submit"
          disabled={!isReady}
          data-cy="contactInfoSubmit"
        >
          {formatMessage({ id: 'Form.Submit' })}
        </StyledSecondaryButton>
        {challengeId && (
          <StyledLink
            isCentered
            tabIndex="3"
            id="cancelTAN"
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
