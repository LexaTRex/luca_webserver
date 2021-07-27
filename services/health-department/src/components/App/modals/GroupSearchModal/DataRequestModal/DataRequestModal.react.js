import React from 'react';
import moment from 'moment';
import { useIntl } from 'react-intl';
import { useQueryClient } from 'react-query';
import { Form, DatePicker, TimePicker, notification } from 'antd';
import { createLocationTransfer } from 'network/api';
import { mergeTimeAndDateObject } from 'utils/moment';

import { useModal } from 'components/hooks/useModal';
import {
  ButtonRow,
  GroupText,
  InfoText,
  AddressText,
  DateText,
  OpenProcessButton,
  DateSelectorWrapper,
  BackButton,
  DatePickerRow,
} from './DataRequestModal.styled';

export const DataRequestModal = ({ group, back }) => {
  const intl = useIntl();
  const queryClient = useQueryClient();
  const [, closeModal] = useModal();
  const { streetName, streetNr, zipCode, city } = group.baseLocation;

  const requiredFieldMessage = intl.formatMessage({
    id: 'modal.dataRequest.form.error.required',
  });

  const onFinish = values => {
    const startTime = mergeTimeAndDateObject(
      moment(values.startDate),
      moment(values.startTime)
    );
    const endTime = mergeTimeAndDateObject(
      moment(values.endDate),
      moment(values.endTime)
    );

    if (startTime.isSameOrAfter(endTime)) {
      notification.error({
        message: intl.formatMessage({
          id: 'modal.dataRequest.error.timeframe',
        }),
      });
      return;
    }

    const time = [startTime.unix(), endTime.unix()];

    createLocationTransfer({
      locations: group.locations.map(locationId => ({
        time,
        locationId,
      })),
      lang: intl.locale,
    })
      .then(() => {
        queryClient.invalidateQueries('processes');
        notification.success({
          message: intl.formatMessage(
            { id: 'modal.dataRequest.success' },
            { group: <b>{group.name}</b> }
          ),
        });
        closeModal();
      })
      .catch(() => {
        notification.error({
          message: intl.formatMessage({
            id: 'modal.dataRequest.error',
          }),
        });
      });
  };

  return (
    <>
      <GroupText>{group.name}</GroupText>
      <AddressText>{`${streetName} ${streetNr}, ${zipCode} ${city}`}</AddressText>
      <InfoText>
        {intl.formatMessage({ id: 'modal.dataRequest.info.timeframe' })}
      </InfoText>
      <Form onFinish={onFinish}>
        <DateSelectorWrapper>
          <DateText>
            {intl.formatMessage({ id: 'modal.dataRequest.from' })}
          </DateText>
          <DatePickerRow>
            <Form.Item
              name="startDate"
              style={{ paddingRight: '24px' }}
              rules={[
                {
                  required: true,
                  message: requiredFieldMessage,
                },
              ]}
            >
              <DatePicker
                suffixIcon={null}
                format="DD.MM.YYYY"
                placeholder={intl.formatMessage({
                  id: 'modal.dataRequest.date.placeholder',
                })}
                showToday={false}
                id="startDate"
              />
            </Form.Item>
            <Form.Item
              name="startTime"
              rules={[
                {
                  required: true,
                  message: requiredFieldMessage,
                },
              ]}
            >
              <TimePicker
                format={`HH:mm [${intl.formatMessage({
                  id: 'modal.dataRequest.time.clock',
                })}]`}
                suffixIcon={null}
                placeholder={intl.formatMessage({
                  id: 'modal.dataRequest.time.placeholder',
                })}
                showNow={false}
                id="startTime"
              />
            </Form.Item>
          </DatePickerRow>
        </DateSelectorWrapper>
        <DateSelectorWrapper>
          <DateText>
            {intl.formatMessage({ id: 'modal.dataRequest.to' })}
          </DateText>
          <DatePickerRow>
            <Form.Item
              name="endDate"
              style={{ paddingRight: '24px' }}
              rules={[
                {
                  required: true,
                  message: requiredFieldMessage,
                },
              ]}
            >
              <DatePicker
                suffixIcon={null}
                format="DD.MM.YYYY"
                placeholder={intl.formatMessage({
                  id: 'modal.dataRequest.date.placeholder',
                })}
                showToday={false}
                id="endDate"
              />
            </Form.Item>
            <Form.Item
              name="endTime"
              rules={[
                {
                  required: true,
                  message: requiredFieldMessage,
                },
              ]}
            >
              <TimePicker
                format={`HH:mm [${intl.formatMessage({
                  id: 'modal.dataRequest.time.clock',
                })}]`}
                suffixIcon={null}
                placeholder={intl.formatMessage({
                  id: 'modal.dataRequest.time.placeholder',
                })}
                showNow={false}
                id="endTime"
              />
            </Form.Item>
          </DatePickerRow>
        </DateSelectorWrapper>

        <ButtonRow>
          <BackButton onClick={back}>
            {intl.formatMessage({ id: 'modal.dataRequest.back' })}
          </BackButton>
          <Form.Item>
            <OpenProcessButton htmlType="submit" data-cy="requestGroupData">
              {intl.formatMessage({ id: 'modal.dataRequest.button' })}
            </OpenProcessButton>
          </Form.Item>
        </ButtonRow>
      </Form>
    </>
  );
};
