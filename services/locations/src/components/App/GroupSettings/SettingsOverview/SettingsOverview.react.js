import React, { useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { Form, Input, notification } from 'antd';
import { PrimaryButton } from 'components/general/Buttons.styled';

import { updateGroup } from 'network/api';

// hooks
import {
  useLocationNameValidator,
  usePhoneValidator,
} from 'components/hooks/useValidators';

import { getFormattedPhoneNumber } from 'utils/parsePhoneNumber';

import { Address } from 'components/general/Address';
import { Overview, Heading, ButtonWrapper } from './SettingsOverview.styled';

export const SettingsOverview = ({ group, refetch }) => {
  const intl = useIntl();
  const formReference = useRef(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const groupNameValidator = useLocationNameValidator('groupName');
  const phoneValidator = usePhoneValidator('phone');

  const baseLocation = group.locations.find(location => !location.name);

  const handleServerError = () => {
    notification.error({
      message: intl.formatMessage({
        id: 'notification.updateGroup.error',
      }),
    });
  };

  const handleSuccessNotification = () => {
    notification.success({
      message: intl.formatMessage({
        id: 'notification.updateGroup.success',
      }),
    });
  };

  const onFinish = values => {
    const { phone, name } = values;
    const formattedPhoneNumber = getFormattedPhoneNumber(phone);
    const formattedGroupName = name.trim();
    updateGroup({
      groupId: group.groupId,
      data: { name: formattedGroupName, phone: formattedPhoneNumber },
    })
      .then(response => {
        if (response.status !== 204) {
          handleServerError();
        }
        refetch();
        formReference.current?.setFieldsValue({
          phone: formattedPhoneNumber,
          name: formattedGroupName,
        });
        handleSuccessNotification();
        setIsButtonDisabled(true);
      })
      .catch(() => {
        handleServerError();
      });
  };

  const submitForm = () => {
    formReference.current.submit();
  };

  const onValueUpdate = (_, values) => {
    if (!values.name) {
      setIsButtonDisabled(true);
      return;
    }

    if (values.name !== group.name || values.phone !== baseLocation.phone) {
      setIsButtonDisabled(false);
      return;
    }
    setIsButtonDisabled(true);
  };

  return (
    <Overview>
      <Heading>{intl.formatMessage({ id: 'profile.overview' })}</Heading>
      <Form
        onFinish={onFinish}
        style={{ maxWidth: 350 }}
        ref={formReference}
        initialValues={{
          name: group.name,
          phone: baseLocation.phone,
        }}
        onValuesChange={onValueUpdate}
      >
        <Form.Item
          name="name"
          colon={false}
          label={intl.formatMessage({
            id: 'settings.group.name',
          })}
          rules={groupNameValidator}
        >
          <Input />
        </Form.Item>
        <Form.Item
          colon={false}
          label={intl.formatMessage({
            id: 'settings.location.phone',
          })}
          name="phone"
          rules={phoneValidator}
        >
          <Input />
        </Form.Item>
      </Form>
      <Address
        isGroup
        location={baseLocation}
        refetch={refetch}
        streetName={baseLocation.streetName}
        streetNr={baseLocation.streetNr}
        city={baseLocation.city}
        zipCode={baseLocation.zipCode}
      />
      <ButtonWrapper>
        <PrimaryButton
          data-cy="editGroupName"
          onClick={submitForm}
          disabled={isButtonDisabled}
        >
          {intl.formatMessage({ id: 'profile.overview.submit' })}
        </PrimaryButton>
      </ButtonWrapper>
    </Overview>
  );
};
