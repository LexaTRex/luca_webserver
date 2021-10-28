import React from 'react';
import { useIntl } from 'react-intl';
import { Input, Alert } from 'antd';
import { PrimaryButton } from 'components/general/Buttons.styled';

import {
  useEmailValidator,
  usePersonNameValidator,
} from 'components/hooks/useValidators';

import {
  onFinishHandler,
  useMailChangeRequest,
} from './ProfileOverview.helper';

import {
  ProfileContent,
  Overview,
  Heading,
  ButtonWrapper,
  StyledForm,
} from './ProfileOverview.styled';

export const ProfileOverview = ({ operator, refetch: refetchOperator }) => {
  const intl = useIntl();
  const [form] = StyledForm.useForm();

  const firstNameValidator = usePersonNameValidator('firstName');
  const lastNameValidator = usePersonNameValidator('lastName');
  const emailValidator = useEmailValidator();

  const {
    data: emailChangeIsActive,
    refetch: refetchEmailPending,
  } = useMailChangeRequest();

  const onFinish = values => {
    onFinishHandler({
      values,
      operator,
      refetchOperator,
      refetchEmailPending,
      intl,
    });
  };

  return (
    <ProfileContent>
      <Overview data-cy="profileOverview">
        <Heading>{intl.formatMessage({ id: 'profile.overview' })}</Heading>
        <StyledForm
          onFinish={onFinish}
          form={form}
          initialValues={{
            firstName: operator.firstName,
            lastName: operator.lastName,
            email: operator.email,
          }}
        >
          <StyledForm.Item
            colon={false}
            label={intl.formatMessage({
              id: 'generic.firstName',
            })}
            name="firstName"
            rules={firstNameValidator}
          >
            <Input />
          </StyledForm.Item>
          <StyledForm.Item
            colon={false}
            label={intl.formatMessage({
              id: 'generic.lastName',
            })}
            name="lastName"
            rules={lastNameValidator}
          >
            <Input />
          </StyledForm.Item>
          <StyledForm.Item
            colon={false}
            label={intl.formatMessage({
              id: 'registration.form.email',
            })}
            name="email"
            rules={emailValidator}
          >
            <Input />
          </StyledForm.Item>
          {emailChangeIsActive && (
            <Alert
              data-cy="activeEmailChange"
              type="info"
              message={intl.formatMessage({
                id: 'profile.changeEmailProgress',
              })}
            />
          )}
        </StyledForm>
        <ButtonWrapper>
          <PrimaryButton
            data-cy="changeOperatorName"
            onClick={() => form.submit()}
          >
            {intl.formatMessage({ id: 'profile.overview.submit' })}
          </PrimaryButton>
        </ButtonWrapper>
      </Overview>
    </ProfileContent>
  );
};
