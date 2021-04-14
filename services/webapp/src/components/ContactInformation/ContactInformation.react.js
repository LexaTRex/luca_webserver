import React, { useCallback, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { notification } from 'antd';
import phoneValidator from 'phone';
import parsePhoneNumber from 'libphonenumber-js';

import { useHistory } from 'react-router-dom';

import { indexDB } from 'db';
import { SETTINGS_PATH } from 'constants/routes';
import { sendSMSTAN, verifySMSTAN } from 'network/api';
import { changeUserInformation } from 'helpers/crypto';
import { requiredFieldValidation } from 'form/validations';

import { TextInput } from '../TextInput';
import { AppHeadline, AppLayout } from '../AppLayout';

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
            message: formatMessage({ id: 'Form.Validation.isRequired' }),
          },
        ]}
      />
      <StyledFooter>
        <StyledPlaceholder />
        <StyledLink
          onClick={() => {
            sendSMSTAN(newPhoneNumber)
              .then(id => setChallengeId(id))
              .catch(() => setChallengeId(null));
          }}
        >
          {formatMessage({ id: 'Form.Resend' })}
        </StyledLink>
      </StyledFooter>
    </>
  );
};

function UserInformationFormContent(user) {
  const { formatMessage } = useIntl();
  return (
    <>
      <StyledContent>
        <TextInput
          bgColor="#000"
          name="firstName"
          autocomplete="given-name"
          defaultValue={user?.firstName || ''}
          placeholder={formatMessage({ id: 'Form.FirstName' })}
          rules={requiredFieldValidation(formatMessage)}
        />
        <TextInput
          bgColor="#000"
          name="lastName"
          autocomplete="family-name"
          defaultValue={user?.lastName || ''}
          placeholder={formatMessage({ id: 'Form.LastName' })}
          rules={requiredFieldValidation(formatMessage)}
        />
        <TextInput
          name="street"
          bgColor="#000"
          autocomplete="street-address1"
          defaultValue={user?.street || ''}
          placeholder={formatMessage({ id: 'Form.Street' })}
          rules={requiredFieldValidation(formatMessage)}
        />
        <TextInput
          bgColor="#000"
          name="houseNumber"
          autocomplete="street-address2"
          defaultValue={user?.houseNumber || ''}
          placeholder={formatMessage({ id: 'Form.HouseNumber' })}
          rules={requiredFieldValidation(formatMessage)}
        />
        <TextInput
          name="zip"
          bgColor="#000"
          autocomplete="postal-code"
          defaultValue={user?.zip || ''}
          placeholder={formatMessage({ id: 'Form.Zip' })}
          rules={requiredFieldValidation(formatMessage)}
        />
        <TextInput
          name="city"
          bgColor="#000"
          autocomplete="country-name"
          defaultValue={user?.city || ''}
          placeholder={formatMessage({ id: 'Form.City' })}
          rules={requiredFieldValidation(formatMessage)}
        />
        <TextInput
          name="email"
          bgColor="#000"
          autocomplete="email"
          defaultValue={user?.email || ''}
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
          name="phoneNumber"
          bgColor="#000"
          autocomplete="tel"
          defaultValue={user?.phoneNumber || ''}
          placeholder={formatMessage({ id: 'Form.Phone' })}
          rules={[
            {
              validator: (_, value) => {
                return phoneValidator(value, 'DE').length > 0
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
    <AppLayout
      header={
        <AppHeadline>
          {formatMessage({ id: 'ContactInformation.Headline' })}
        </AppHeadline>
      }
    >
      <StyledForm initialValues={user} onFinish={onSubmit}>
        {challengeId
          ? ChallengeFormContent(newPhoneNumber, setChallengeId)
          : UserInformationFormContent(user)}
        <StyledSaveButton htmlType="submit">
          {formatMessage({ id: 'ContactInformation.Submit' })}
        </StyledSaveButton>
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
      </StyledForm>
    </AppLayout>
  );
}
