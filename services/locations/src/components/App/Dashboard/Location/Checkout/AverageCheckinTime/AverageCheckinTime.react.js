import React, { useState, useCallback } from 'react';
import { useIntl } from 'react-intl';
import { useQueryClient } from 'react-query';
import { TimePicker, notification } from 'antd';

import { updateLocation } from 'network/api';

import {
  DEFAULT_AVERAGE_CHECKIN_TIME,
  MAX_AVERAGE_CHECKIN_TIME,
  MIN_AVERAGE_CHECKIN_TIME,
} from 'constants/checkout';
import { getMinutesFromTimeString } from 'utils/time';

import { Wrapper, PickerWrapper } from './AverageCheckinTime.styled';
import { getTimeStringFromMinutes } from './AverageCheckinTime.helper';

import { CardSectionDescription, CardSectionTitle } from '../../LocationCard';
import { Switch } from '../../../Switch';

import { StyledSwitchContainer } from '../../GenerateQRCodes/GenerateQRCodes.styled';

export const AverageCheckinTime = ({ location }) => {
  const intl = useIntl();
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

  const onChangeAverageCheckinTime = (_, timeString) => {
    const averageCheckinTimeMinutes = getMinutesFromTimeString(timeString);

    if (
      averageCheckinTimeMinutes >= MAX_AVERAGE_CHECKIN_TIME ||
      averageCheckinTimeMinutes <= MIN_AVERAGE_CHECKIN_TIME
    ) {
      notification.error({
        message: intl.formatMessage({
          id: 'notification.updateAverageCheckinTime.constraint.error',
        }),
      });
      return;
    }
    updateAverageCheckinTime(getMinutesFromTimeString(timeString));
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
        {intl.formatMessage({
          id: 'settings.location.checkout.average.description',
        })}
      </CardSectionDescription>
      {isAverageTimeActive && (
        <PickerWrapper>
          <TimePicker
            style={{ width: 150 }}
            onChange={onChangeAverageCheckinTime}
            showNow={false}
            format="HH:mm"
            minuteStep={15}
            value={getTimeStringFromMinutes(location)}
            placeholder={intl.formatMessage({
              id: 'settings.location.checkout.average.placeholder',
            })}
          />
        </PickerWrapper>
      )}
    </Wrapper>
  );
};
