import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { Form, Input, Button } from 'antd';
import { useQuery } from 'react-query';

import { getGroup } from 'network/api';
import { requiresLocationName } from 'constants/errorMessages';
import {
  getRequiredRule,
  getDefaultNameRule,
  checkExistingLocation,
} from 'utils/validatorRules';

import {
  nextButtonStyles,
  backButtonStyles,
  Wrapper,
  Header,
  ButtonWrapper,
} from '../../../generalOnboarding/Onboarding.styled';

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
    getRequiredRule(intl, requiresLocationName),
    getDefaultNameRule(intl),
    {
      required: isLocationNameTaken,
      validator: checkExistingLocation(isLocationNameTaken, intl),
    },
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
          <Button
            onClick={back}
            data-cy="previousStep"
            style={backButtonStyles}
          >
            {intl.formatMessage({
              id: 'authentication.form.button.back',
            })}
          </Button>
          <Button data-cy="nextStep" style={nextButtonStyles} htmlType="submit">
            {intl.formatMessage({
              id: 'authentication.form.button.next',
            })}
          </Button>
        </ButtonWrapper>
      </Form>
    </Wrapper>
  );
};
