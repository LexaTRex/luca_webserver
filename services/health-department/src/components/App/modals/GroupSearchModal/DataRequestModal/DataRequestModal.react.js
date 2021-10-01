import React from 'react';
import moment from 'moment';
import { useIntl } from 'react-intl';
import { useQueryClient } from 'react-query';
import { Form, DatePicker, TimePicker, notification } from 'antd';
import { PrimaryButton, SecondaryButton } from 'components/general';
import { createLocationTransfer, getMe } from 'network/api';
import { mergeTimeAndDateObject } from 'utils/moment';
import { signLocationTransfer } from 'utils/cryptoKeyOperations';

import { useModal } from 'components/hooks/useModal';
import {
  ButtonRow,
  GroupText,
  InfoText,
  AddressText,
  DateText,
  DateSelectorWrapper,
  DatePickerRow,
} from './DataRequestModal.styled';

const START_TIME = 'START_TIME';

export const DataRequestModal = ({ group, back }) => {
  const intl = useIntl();
  const queryClient = useQueryClient();
  const [, closeModal] = useModal();
  const { streetName, streetNr, zipCode, city } = group.baseLocation;
  const [form] = Form.useForm();
  const requiredFieldMessage = intl.formatMessage({
    id: 'modal.dataRequest.form.error.required',
  });

  const onFinish = async values => {
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

    const healthDepartmentUUID = await getMe().then(
      response => response.departmentId
    );

    createLocationTransfer({
      locations: group.locations.map(locationId => ({
        locationId,
        time,
        signedLocationTransfer: signLocationTransfer({
          locationId,
          time,
          iss: healthDepartmentUUID,
        }),
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

  const setTime = (time, field) => {
    form.setFieldsValue(
      field === START_TIME
        ? {
            startTime: time,
          }
        : {
            endTime: time,
          }
    );
  };

  return (
    <>
      <GroupText>{group.name}</GroupText>
      <AddressText>{`${streetName} ${streetNr}, ${zipCode} ${city}`}</AddressText>
      <InfoText>
        {intl.formatMessage({ id: 'modal.dataRequest.info.timeframe' })}
      </InfoText>
      <Form onFinish={onFinish} form={form}>
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
                onSelect={time => {
                  setTime(time, START_TIME);
                }}
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
              style={{ paddingRight: 24 }}
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
                onSelect={time => {
                  setTime(time);
                }}
                showNow={false}
                id="endTime"
              />
            </Form.Item>
          </DatePickerRow>
        </DateSelectorWrapper>

        <ButtonRow>
          <SecondaryButton onClick={back}>
            {intl.formatMessage({ id: 'modal.dataRequest.back' })}
          </SecondaryButton>
          <Form.Item>
            <PrimaryButton htmlType="submit" data-cy="requestGroupData">
              {intl.formatMessage({ id: 'modal.dataRequest.button' })}
            </PrimaryButton>
          </Form.Item>
        </ButtonRow>
      </Form>
    </>
  );
};
