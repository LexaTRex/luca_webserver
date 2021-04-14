import React, { useRef } from 'react';
import moment from 'moment';
import { useIntl } from 'react-intl';
import { useQueryClient } from 'react-query';
import { Form, DatePicker, Button, notification, Popconfirm } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';

import { createLocationTransfer } from 'network/api';

import { useModal } from 'components/hooks/useModal';
import { ButtonRow, Info } from './DataRequestModal.styled';

const { RangePicker } = DatePicker;

export const DataRequestModal = ({ group }) => {
  const intl = useIntl();
  const queryClient = useQueryClient();
  const formReference = useRef(null);
  const [, closeModal] = useModal();

  const onSubmit = () => {
    formReference.current.submit();
  };

  const onFinish = values => {
    const startTime = moment(values.date[0]);
    const endTime = moment(values.date[1]);

    if (startTime.isSame(endTime)) {
      endTime.add(5, 'minutes');
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
            id: 'modal.dataRequest.error.description',
          }),
        });
      });
  };

  return (
    <>
      <Info>
        {intl.formatMessage(
          { id: 'groupSearch.requestData.info' },
          { group: <b>{group.name}</b> }
        )}
      </Info>
      <Form onFinish={onFinish} ref={formReference}>
        <Form.Item
          style={{ color: 'white' }}
          label={intl.formatMessage({ id: 'modal.dataRequest.date' })}
          name="date"
        >
          <RangePicker
            showTime={{ format: 'HH:mm' }}
            format="DD.MM.YYYY HH:mm"
          />
        </Form.Item>
        <Form.Item>
          <ButtonRow>
            <Popconfirm
              placement="top"
              onConfirm={onSubmit}
              title={intl.formatMessage(
                {
                  id: 'modal.dataRequest.confirmation',
                },
                { venue: group.name }
              )}
              okText={intl.formatMessage({
                id: 'modal.dataRequest.confirmButton',
              })}
              cancelText={intl.formatMessage({
                id: 'modal.dataRequest.declineButton',
              })}
              icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
            >
              <Button>
                {intl.formatMessage({ id: 'modal.dataRequest.button' })}
              </Button>
            </Popconfirm>
          </ButtonRow>
        </Form.Item>
      </Form>
    </>
  );
};
