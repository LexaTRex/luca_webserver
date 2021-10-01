import React, { useState } from 'react';

import { Radio, Form } from 'antd';
import { useIntl } from 'react-intl';

import { PrimaryButton, SecondaryButton } from 'components/general';

import {
  StepHeadline,
  StepDescription,
  StepFooter,
  StepFooterLeft,
  StepFooterRight,
} from '../CreateDeviceModal.styled';

import {
  FormItem,
  RoleName,
  RadioWrapper,
  RoleDescription,
  DeviceAuthenticationWrapper,
  DeviceAuthenticationContent,
} from './SelectDeviceRole.styled';

export function SelectDeviceRole({ onCancel, onCreate }) {
  const intl = useIntl();
  const [isLoading, setIsLoading] = useState(false);
  const [isRoleSelected, setIsRoleSelected] = useState(false);

  const onSubmit = ({ role }) => {
    setIsLoading(true);
    onCreate(role).catch(() => setIsLoading(false));
  };

  return (
    <Form
      onFinish={onSubmit}
      onValuesChange={({ role }) => role && setIsRoleSelected(true)}
    >
      <DeviceAuthenticationWrapper>
        <StepHeadline>
          {intl.formatMessage({ id: 'modal.createDevice.selectRole' })}
        </StepHeadline>
        <StepDescription>
          {intl.formatMessage({
            id: 'modal.createDevice.selectRole.description',
          })}
        </StepDescription>
        <DeviceAuthenticationContent>
          <FormItem name="role">
            <Radio.Group>
              <RadioWrapper>
                <Radio value="manager">
                  <RoleName>
                    {intl.formatMessage({
                      id: 'device.role.manager',
                    })}
                  </RoleName>
                  <RoleDescription>
                    {intl.formatMessage({
                      id: 'modal.createDevice.selectRole.manager',
                    })}
                  </RoleDescription>
                </Radio>
                <Radio value="employee">
                  <RoleName>
                    {intl.formatMessage({
                      id: 'device.role.employee',
                    })}
                  </RoleName>
                  <RoleDescription>
                    {intl.formatMessage({
                      id: 'modal.createDevice.selectRole.employee',
                    })}
                  </RoleDescription>
                </Radio>
                <Radio value="scanner">
                  <RoleName>
                    {intl.formatMessage({
                      id: 'device.role.scanner',
                    })}
                  </RoleName>
                  <RoleDescription>
                    {intl.formatMessage({
                      id: 'modal.createDevice.selectRole.scanner',
                    })}
                  </RoleDescription>
                </Radio>
              </RadioWrapper>
            </Radio.Group>
          </FormItem>
        </DeviceAuthenticationContent>
        <StepFooter>
          <StepFooterLeft>
            <SecondaryButton onClick={onCancel}>
              {intl.formatMessage({
                id: 'modal.createDevice.cancel',
              })}
            </SecondaryButton>
          </StepFooterLeft>
          <StepFooterRight>
            <PrimaryButton
              htmlType="submit"
              loading={isLoading}
              disabled={!isRoleSelected}
            >
              {intl.formatMessage({
                id: 'modal.createDevice.selectRole.create',
              })}
            </PrimaryButton>
          </StepFooterRight>
        </StepFooter>
      </DeviceAuthenticationWrapper>
    </Form>
  );
}
