import React, { useCallback, useEffect, useState } from 'react';

import { useIntl } from 'react-intl';
import { notification } from 'antd';
import { Helmet } from 'react-helmet';
import { useHistory } from 'react-router-dom';
import parsePhoneNumber from 'libphonenumber-js/max';

import { indexDB } from 'db';
import { SETTINGS_PATH } from 'constants/routes';
import { changeUserInformation } from 'helpers/crypto';
import { sendSMSTAN, verifySMSTAN } from 'network/api';

import {
  useCityValidator,
  useNameValidator,
  useEmailValidator,
  useStreetValidator,
  useZipCodeValidator,
  useHouseNumberValidator,
  usePhoneNumberValidator,
} from 'hooks/useValidators';

import { TextInput } from 'components/TextInput';
import { AppHeadline, AppLayout } from 'components/AppLayout';

import {
  StyledForm,
  StyledLink,
  StyledFooter,
  StyledContent,
  StyledSaveButton,
  StyledPlaceholder,
  StyledDescription,
} from './ContactInformation.styled';

const ChallengeFormContent = ({ newPhoneNumber, setChallengeId }) => {
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

function UserInformationFormContent({ user }) {
  const intl = useIntl();
  const nameValidator = useNameValidator();
  const cityValidator = useCityValidator();
  const emailValidator = useEmailValidator();
  const streetValidator = useStreetValidator();
  const postalCodeValidator = useZipCodeValidator();
  const phoneNumberValidator = usePhoneNumberValidator();
  const houseNumberValidator = useHouseNumberValidator();

  return (
    <>
      <StyledContent>
        <TextInput
          isRequired
          bgColor="#000"
          name="firstName"
          rules={nameValidator}
          autocomplete="given-name"
          defaultValue={user?.firstName || ''}
          label={intl.formatMessage({ id: 'Form.FirstName.Label' })}
          placeholder={intl.formatMessage({ id: 'Form.FirstName.Placeholder' })}
        />
        <TextInput
          isRequired
          bgColor="#000"
          name="lastName"
          rules={nameValidator}
          autocomplete="family-name"
          defaultValue={user?.lastName || ''}
          label={intl.formatMessage({ id: 'Form.LastName.Label' })}
          placeholder={intl.formatMessage({ id: 'Form.LastName.Placeholder' })}
        />
        <TextInput
          isRequired
          name="street"
          bgColor="#000"
          rules={streetValidator}
          autocomplete="street-address1"
          defaultValue={user?.street || ''}
          label={intl.formatMessage({ id: 'Form.Street.Label' })}
          placeholder={intl.formatMessage({ id: 'Form.Street.Placeholder' })}
        />
        <TextInput
          isRequired
          bgColor="#000"
          name="houseNumber"
          rules={houseNumberValidator}
          autocomplete="street-address2"
          defaultValue={user?.houseNumber || ''}
          label={intl.formatMessage({ id: 'Form.HouseNumber.Label' })}
          placeholder={intl.formatMessage({
            id: 'Form.HouseNumber.Placeholder',
          })}
        />
        <TextInput
          name="zip"
          isRequired
          bgColor="#000"
          rules={postalCodeValidator}
          autocomplete="postal-code"
          defaultValue={user?.zip || ''}
          label={intl.formatMessage({ id: 'Form.Zip.Label' })}
          placeholder={intl.formatMessage({ id: 'Form.Zip.Placeholder' })}
        />
        <TextInput
          isRequired
          name="city"
          bgColor="#000"
          rules={cityValidator}
          autocomplete="country-name"
          defaultValue={user?.city || ''}
          label={intl.formatMessage({ id: 'Form.City.Label' })}
          placeholder={intl.formatMessage({ id: 'Form.City.Placeholder' })}
        />
        <TextInput
          name="email"
          bgColor="#000"
          autocomplete="email"
          rules={emailValidator}
          defaultValue={user?.email || ''}
          label={intl.formatMessage({ id: 'Form.Email.Label' })}
          placeholder={intl.formatMessage({ id: 'Form.Email.Placeholder' })}
        />
        <TextInput
          type="tel"
          isRequired
          bgColor="#000"
          name="phoneNumber"
          autocomplete="tel"
          rules={phoneNumberValidator}
          defaultValue={user?.phoneNumber || ''}
          label={intl.formatMessage({ id: 'Form.Phone.Label' })}
          placeholder={intl.formatMessage({ id: 'Form.Phone.Placeholder' })}
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

  const onSubmit = async values => {
    if (challengeId) {
      try {
        await verifySMSTAN(challengeId, values.tan);
        changeUser(user.userId, temporaryUser);
      } catch {
        verificationFailedError();
      }
    } else if (values.phoneNumber !== user.phoneNumber) {
      try {
        const formattedPhoneNumber = parsePhoneNumber(
          values.phoneNumber,
          'DE'
        ).formatInternational();
        const id = await sendSMSTAN(formattedPhoneNumber);
        setChallengeId(id);
        setTemporaryUser(values);
        setNewPhoneNumber(values.phoneNumber);
      } catch {
        setChallengeId(null);
      }
    } else {
      try {
        await changeUserInformation(user.userId, values);
        history.push(SETTINGS_PATH);
      } catch {
        changeUserInfoError();
      }
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
          {challengeId ? (
            <ChallengeFormContent
              newPhoneNumber={newPhoneNumber}
              setChallengeId={setChallengeId}
            />
          ) : (
            <UserInformationFormContent user={user} />
          )}
        </AppLayout>
      </StyledForm>
    </>
  );
}
