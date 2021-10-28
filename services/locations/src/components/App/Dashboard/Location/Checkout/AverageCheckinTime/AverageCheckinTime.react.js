import React, { useState, useCallback } from 'react';
import { useIntl } from 'react-intl';
import { useQueryClient } from 'react-query';
import { Form, notification } from 'antd';

import { updateLocation } from 'network/api';

import { DEFAULT_AVERAGE_CHECKIN_TIME } from 'constants/checkout';
import { setAverageCheckoutTime } from 'utils/time';

import {
  Wrapper,
  PickerWrapper,
  StyledTimePicker,
} from './AverageCheckinTime.styled';
import {
  getTimeStringFromMinutes,
  onChangeAverageCheckinTime,
} from './AverageCheckinTime.helper';

import { CardSectionDescription, CardSectionTitle } from '../../LocationCard';
import { Switch } from '../../../Switch';

import { StyledSwitchContainer } from '../../GenerateQRCodes/GenerateQRCodes.styled';

export const AverageCheckinTime = ({ location }) => {
  const intl = useIntl();
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const [isAverageTimeActive, setIsAverageTimeActive] = useState(
    !!location.averageCheckinTime
  );

  const refetch = useCallback(() => {
    queryClient.invalidateQueries(`location/${location.uuid}`);
  }, [location, queryClient]);

  const updateAverageCheckinTime = averageCheckinTime => {
    updateLocation({
      locationId: location.uuid,
      data: { averageCheckinTime },
    })
      .then(refetch)
      .catch(() => {
        notification.error({
          message: intl.formatMessage({
            id: 'notification.updateAverageCheckinTime.error',
          }),
        });
        refetch();
      });
  };

  const toggleAverageTime = () => {
    setIsAverageTimeActive(!isAverageTimeActive);
    if (isAverageTimeActive) {
      updateAverageCheckinTime(null);
    } else {
      updateAverageCheckinTime(DEFAULT_AVERAGE_CHECKIN_TIME);
    }
  };

  const changeAverageTime = time => {
    setAverageCheckoutTime(time, form);
    onChangeAverageCheckinTime(time, intl, updateAverageCheckinTime);
  };

  return (
    <Wrapper>
      <CardSectionTitle>
        {intl.formatMessage({ id: 'settings.location.checkout.average.title' })}
        <StyledSwitchContainer>
          <Switch checked={isAverageTimeActive} onChange={toggleAverageTime} />
        </StyledSwitchContainer>
      </CardSectionTitle>
      <CardSectionDescription>
        {intl.formatMessage(
          {
            id: 'settings.location.checkout.average.description',
          },
          { br: <br /> }
        )}
      </CardSectionDescription>
      {isAverageTimeActive && (
        <PickerWrapper>
          <Form
            form={form}
            initialValues={{
              averageCheckinTime: getTimeStringFromMinutes(location) || null,
            }}
          >
            <Form.Item name="averageCheckinTime">
              <StyledTimePicker
                showNow={false}
                format="HH:mm"
                minuteStep={15}
                onSelect={changeAverageTime}
                placeholder={intl.formatMessage({
                  id: 'settings.location.checkout.average.placeholder',
                })}
              />
            </Form.Item>
          </Form>
        </PickerWrapper>
      )}
    </Wrapper>
  );
};
