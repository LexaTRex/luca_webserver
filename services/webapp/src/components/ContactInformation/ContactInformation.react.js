import React, { useCallback, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { notification } from 'antd';
import { Helmet } from 'react-helmet';
import { useHistory } from 'react-router-dom';
import parsePhoneNumber from 'libphonenumber-js/max';

import { indexDB } from 'db';
import { SETTINGS_PATH } from 'constants/routes';
import { checkPhoneNumber } from 'utils/parsePhoneNumber';
import { sendSMSTAN, verifySMSTAN } from 'network/api';
import { changeUserInformation } from 'helpers/crypto';
import { requiredFieldValidation } from 'form/validations';

import { TextInput } from 'components/TextInput';
import { AppHeadline, AppLayout } from 'components/AppLayout';

import {
  StyledForm,
  StyledContent,
  StyledSaveButton,
  StyledPlaceholder,
  StyledDescription,
  StyledLink,
  StyledFooter,
} from './ContactInformation.styled';

const ChallengeFormContent = (newPhoneNumber, setChallengeId) => {
  const { formatMessage } = useIntl();
  return (
    <StyledContent>
      <StyledDescription>
        {formatMessage({
          id: 'OnBoarding.PhoneNumberInputStep.TANDescription',
        })}
      </StyledDescription>
      <TextInput
        type="tel"
        name="tan"
        auto-complete="one-time-code"
        label={formatMessage({ id: 'Form.Tan.Label' })}
        placeholder={formatMessage({ id: 'Form.Tan.Placeholder' })}
        rules={[
          {
            required: true,
            message: formatMessage({ id: 'Form.Validation.isRequired' }),
          },
        ]}
      />
      <StyledFooter>
        <StyledPlaceholder />
        <StyledLink
          id="resendTAN"
          onClick={() => {
            sendSMSTAN(newPhoneNumber)
              .then(id => setChallengeId(id))
              .catch(() => setChallengeId(null));
          }}
        >
          {formatMessage({ id: 'Form.Resend' })}
        </StyledLink>
      </StyledFooter>
    </StyledContent>
  );
};

function UserInformationFormContent(user) {
  const { formatMessage } = useIntl();
  return (
    <>
      <StyledContent>
        <TextInput
          isRequired
          bgColor="#000"
          name="firstName"
          autocomplete="given-name"
          defaultValue={user?.firstName || ''}
          placeholder={formatMessage({ id: 'Form.FirstName.Placeholder' })}
          label={formatMessage({ id: 'Form.FirstName.Label' })}
          rules={requiredFieldValidation(formatMessage)}
        />
        <TextInput
          isRequired
          bgColor="#000"
          name="lastName"
          autocomplete="family-name"
          defaultValue={user?.lastName || ''}
          rules={requiredFieldValidation(formatMessage)}
          label={formatMessage({ id: 'Form.LastName.Label' })}
          placeholder={formatMessage({ id: 'Form.LastName.Placeholder' })}
        />
        <TextInput
          isRequired
          name="street"
          bgColor="#000"
          autocomplete="street-address1"
          defaultValue={user?.street || ''}
          rules={requiredFieldValidation(formatMessage)}
          label={formatMessage({ id: 'Form.Street.Label' })}
          placeholder={formatMessage({ id: 'Form.Street.Placeholder' })}
        />
        <TextInput
          isRequired
          bgColor="#000"
          name="houseNumber"
          autocomplete="street-address2"
          defaultValue={user?.houseNumber || ''}
          rules={requiredFieldValidation(formatMessage)}
          label={formatMessage({ id: 'Form.HouseNumber.Label' })}
          placeholder={formatMessage({ id: 'Form.HouseNumber.Placeholder' })}
        />
        <TextInput
          name="zip"
          isRequired
          bgColor="#000"
          autocomplete="postal-code"
          defaultValue={user?.zip || ''}
          rules={requiredFieldValidation(formatMessage)}
          label={formatMessage({ id: 'Form.Zip.Label' })}
          placeholder={formatMessage({ id: 'Form.Zip.Placeholder' })}
        />
        <TextInput
          isRequired
          name="city"
          bgColor="#000"
          autocomplete="country-name"
          defaultValue={user?.city || ''}
          rules={requiredFieldValidation(formatMessage)}
          label={formatMessage({ id: 'Form.City.Label' })}
          placeholder={formatMessage({ id: 'Form.City.Placeholder' })}
        />
        <TextInput
          isRequired
          name="email"
          bgColor="#000"
          autocomplete="email"
          defaultValue={user?.email || ''}
          label={formatMessage({ id: 'Form.Email.Label' })}
          placeholder={formatMessage({ id: 'Form.Email.Placeholder' })}
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
          isRequired
          bgColor="#000"
          name="phoneNumber"
          autocomplete="tel"
          defaultValue={user?.phoneNumber || ''}
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
          ]}
        />
      </StyledContent>
    </>
  );
}

export function ContactInformation() {
  const history = useHistory();
  const { formatMessage } = useIntl();
  const [user, setUser] = useState({});
  const [temporaryUser, setTemporaryUser] = useState({});
  const [newPhoneNumber, setNewPhoneNumber] = useState(null);
  const [challengeId, setChallengeId] = useState(null);

  const internalIndexedDBError = useCallback(() => {
    notification.error({
      message: formatMessage({
        id: 'IndexedDB.error.transaction',
      }),
    });
  }, [formatMessage]);

  useEffect(() => {
    indexDB.users
      .toCollection()
      .first()
      .then(apiUser => setUser(apiUser))
      .catch(() => internalIndexedDBError());
  }, [internalIndexedDBError]);

  const changeUserInfoError = () => {
    notification.error({
      message: formatMessage({
        id: 'ContactInformation.error.changeUserInfo',
      }),
    });
  };

  const verificationFailedError = () => {
    notification.error({
      message: formatMessage({
        id: 'OnBoarding.PhoneNumberInputStep.VerifyFailed',
      }),
    });
  };

  const changeUser = (userId, temporaryUserInformation) =>
    changeUserInformation(userId, temporaryUserInformation)
      .then(() => history.push(SETTINGS_PATH))
      .catch(() => changeUserInfoError());

  const onSubmit = values => {
    if (challengeId) {
      verifySMSTAN(challengeId, values.tan)
        .then(() => changeUser(user.userId, temporaryUser))
        .catch(() => verificationFailedError());
    } else if (values.phoneNumber !== user.phoneNumber) {
      const formattedPhoneNumber = parsePhoneNumber(
        values.phoneNumber,
        'DE'
      ).formatInternational();
      sendSMSTAN(formattedPhoneNumber)
        .then(id => {
          setChallengeId(id);
          setTemporaryUser(values);
          setNewPhoneNumber(values.phoneNumber);
        })
        .catch(() => setChallengeId(null));
    } else {
      changeUserInformation(user.userId, values)
        .then(() => history.push(SETTINGS_PATH))
        .catch(() => changeUserInfoError());
    }
  };

  return (
    <>
      <Helmet>
        <title>{formatMessage({ id: 'ContactInformation.PageTitle' })}</title>
      </Helmet>
      <StyledForm initialValues={user} onFinish={onSubmit}>
        <AppLayout
          footerHeight={challengeId ? '92px' : '64px'}
          header={
            <AppHeadline>
              {formatMessage({ id: 'ContactInformation.Headline' })}
            </AppHeadline>
          }
          footer={
            <StyledFooter>
              <StyledSaveButton
                htmlType="submit"
                id={challengeId ? 'verifyTAN' : 'save'}
              >
                {formatMessage({ id: 'ContactInformation.Submit' })}
              </StyledSaveButton>
              {challengeId && (
                <StyledLink
                  isCentered
                  id="cancelTAN"
                  onClick={() => {
                    setChallengeId(null);
                  }}
                >
                  {formatMessage({ id: 'Form.Cancel' })}
                </StyledLink>
              )}
            </StyledFooter>
          }
        >
          {challengeId
            ? ChallengeFormContent(newPhoneNumber, setChallengeId)
            : UserInformationFormContent(user)}
        </AppLayout>
      </StyledForm>
    </>
  );
}
