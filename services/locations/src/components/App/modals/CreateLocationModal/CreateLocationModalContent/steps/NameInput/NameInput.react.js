import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { Form, Input } from 'antd';
import { useQuery } from 'react-query';

import { useLocationNameValidator } from 'components/hooks/useValidators';

import {
  PrimaryButton,
  SecondaryButton,
} from 'components/general/Buttons.styled';

import { getGroup } from 'network/api';

import { getDefaultNameRule, getUniqueNameRule } from 'utils/validatorRules';

import {
  Wrapper,
  Header,
  ButtonWrapper,
} from 'components/App/modals/generalOnboarding/Onboarding.styled';

export const NameInput = ({
  locationName: currentLocationName,
  setLocationName,
  locationType,
  back,
  next,
  groupId,
}) => {
  const intl = useIntl();
  const [form] = Form.useForm();
  const [isLocationNameTaken, setIsLocationNameTaken] = useState(false);
  const locationNameValidator = useLocationNameValidator('locationName');

  const { isLoading, error, data: group } = useQuery(`group/${groupId}`, () =>
    getGroup(groupId)
  );

  const onFinish = ({ locationName }) => {
    const isExistingLocationName = group.locations.some(
      location => location.name === locationName.trim()
    );
    if (isExistingLocationName) {
      setIsLocationNameTaken(true);
      form.validateFields(['locationName']);
    } else {
      setIsLocationNameTaken(false);
      setLocationName(locationName);
      next();
    }
  };

  const onValueUpdate = () => setIsLocationNameTaken(false);

  const locationNameRules = [
    getDefaultNameRule(intl),
    getUniqueNameRule(intl, isLocationNameTaken),
    ...locationNameValidator,
  ];

  if (isLoading || error) return null;

  return (
    <Wrapper>
      <Header>
        {intl.formatMessage({
          id: `modal.createLocation.nameInput.${locationType}.title`,
        })}
      </Header>
      <Form
        onFinish={onFinish}
        form={form}
        initialValues={
          currentLocationName ? { locationName: currentLocationName } : {}
        }
        onValuesChange={onValueUpdate}
      >
        <Form.Item
          colon={false}
          label={intl.formatMessage({
            id: `createLocation.${locationType}.locationName`,
          })}
          name="locationName"
          rules={locationNameRules}
        >
          <Input autoFocus />
        </Form.Item>
        <ButtonWrapper multipleButtons>
          <SecondaryButton onClick={back} data-cy="previousStep">
            {intl.formatMessage({
              id: 'authentication.form.button.back',
            })}
          </SecondaryButton>
          <PrimaryButton data-cy="nextStep" htmlType="submit">
            {intl.formatMessage({
              id: 'authentication.form.button.next',
            })}
          </PrimaryButton>
        </ButtonWrapper>
      </Form>
    </Wrapper>
  );
};
