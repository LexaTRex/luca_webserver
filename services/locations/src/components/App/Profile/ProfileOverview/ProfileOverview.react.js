import React, { useState, useRef } from 'react';
import { useIntl } from 'react-intl';
import { useQuery } from 'react-query';
import { Form, Input, Alert, notification } from 'antd';
import { PrimaryButton } from 'components/general/Buttons.styled';

import { updateOperator, isEmailUpdatePending, updateEmail } from 'network/api';

import {
  useEmailValidator,
  usePersonNameValidator,
} from 'components/hooks/useValidators';

import { nameChanged, mailChanged } from './ProfileOverview.helper';

import {
  ProfileContent,
  Overview,
  Heading,
  ButtonWrapper,
} from './ProfileOverview.styled';

export const ProfileOverview = ({ operator, refetch }) => {
  const intl = useIntl();
  const formReference = useRef(null);
  const [status, setStatus] = useState(null);

  const firstNameValidator = usePersonNameValidator('firstName');
  const lastNameValidator = usePersonNameValidator('lastName');
  const emailValidator = useEmailValidator();

  const { data: emailChangeIsActive, refetch: refetchEmailPending } = useQuery(
    'isMailChangeInProgress',
    () =>
      isEmailUpdatePending()
        .then(() => true)
        .catch(() => false),
    { cacheTime: 0 }
  );

  const onUpdateEmail = email => {
    setStatus(null);

    updateEmail({ email, lang: intl.locale })
      .then(response => setStatus(response.status))
      .finally(refetchEmailPending)
      .catch(() => {
        notification.error({
          message: intl.formatMessage({
            id: 'notification.profile.updateEmail.error',
          }),
        });
      });
  };

  const onFinish = values => {
    if (nameChanged(operator, values)) {
      updateOperator({
        firstName: values.firstName,
        lastName: values.lastName,
      })
        .finally(refetch)
        .catch(() => {
          notification.error({
            message: intl.formatMessage({
              id: 'notification.profile.updateUser.error',
            }),
          });
        });
    }

    if (mailChanged(operator, values)) {
      onUpdateEmail(values.email);
    }
  };

  const submitForm = () => {
    formReference.current.submit();
  };

  return (
    <ProfileContent>
      <Overview data-cy="profileOverview">
        <Heading>{intl.formatMessage({ id: 'profile.overview' })}</Heading>
        <Form
          onFinish={onFinish}
          style={{ maxWidth: 350 }}
          ref={formReference}
          initialValues={{
            firstName: operator.firstName,
            lastName: operator.lastName,
            email: operator.email,
          }}
        >
          <Form.Item
            colon={false}
            label={intl.formatMessage({
              id: 'generic.firstName',
            })}
            name="firstName"
            rules={firstNameValidator}
          >
            <Input />
          </Form.Item>
          <Form.Item
            colon={false}
            label={intl.formatMessage({
              id: 'generic.lastName',
            })}
            name="lastName"
            rules={lastNameValidator}
          >
            <Input />
          </Form.Item>
          <Form.Item
            colon={false}
            label={intl.formatMessage({
              id: 'registration.form.email',
            })}
            name="email"
            rules={emailValidator}
          >
            <Input disabled={emailChangeIsActive} />
          </Form.Item>
          {emailChangeIsActive && (
            <Alert
              data-cy="activeEmailChange"
              type="info"
              message={intl.formatMessage({
                id: 'profile.changeEmailProgress',
              })}
            />
          )}
          {status === 409 && (
            <Alert
              type="error"
              message={intl.formatMessage({
                id: 'profile.emailTaken',
              })}
            />
          )}
        </Form>
        <ButtonWrapper>
          <PrimaryButton data-cy="changeOperatorName" onClick={submitForm}>
            {intl.formatMessage({ id: 'profile.overview.submit' })}
          </PrimaryButton>
        </ButtonWrapper>
      </Overview>
    </ProfileContent>
  );
};
