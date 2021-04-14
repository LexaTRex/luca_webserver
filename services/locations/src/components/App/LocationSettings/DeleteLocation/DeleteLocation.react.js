import React from 'react';
import { useIntl } from 'react-intl';
import { Button, notification, Popconfirm } from 'antd';
import { useQueryClient, useQuery } from 'react-query';
import { useHistory } from 'react-router';
import { QuestionCircleOutlined } from '@ant-design/icons';

import { deleteLocation, getGroup } from 'network/api';

import { BASE_GROUP_ROUTE, BASE_LOCATION_ROUTE } from 'constants/routes';

import {
  Wrapper,
  Heading,
  ButtonWrapper,
  buttonStyles,
  Info,
} from './DeleteLocation.styled';

export const DeleteLocation = ({ location }) => {
  const intl = useIntl();
  const history = useHistory();
  const queryClient = useQueryClient();

  const {
    isLoading,
    error,
    data: group,
  } = useQuery(`group/${location.groupId}`, () => getGroup(location.groupId));

  const onDelete = () => {
    deleteLocation(location.uuid)
      .then(() => {
        notification.success({
          message: intl.formatMessage({
            id: 'notification.deleteLocation.success',
          }),
          className: 'successDeletedNotification',
        });
        queryClient.invalidateQueries(`${location.groupId}`);
        history.push(
          `${BASE_GROUP_ROUTE}${location.groupId}${BASE_LOCATION_ROUTE}${
            group.locations.find(entry => !entry.name).uuid
          }`
        );
      })
      .catch(() => {
        notification.error({
          message: intl.formatMessage({
            id: 'notification.deleteLocation.error',
          }),
        });
      });
  };

  if (error || isLoading) return null;

  return (
    <Wrapper>
      <Heading>
        {intl.formatMessage({ id: 'settings.location.delete' })}
      </Heading>
      <Info>{intl.formatMessage({ id: 'settings.location.delete.info' })}</Info>
      <ButtonWrapper>
        <Popconfirm
          placement="topLeft"
          onConfirm={onDelete}
          title={intl.formatMessage({ id: 'location.delete.confirmText' })}
          okText={intl.formatMessage({
            id: 'location.delete.confirmButton',
          })}
          cancelText={intl.formatMessage({
            id: 'location.delete.declineButton',
          })}
          icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
        >
          <Button data-cy="deleteLocation" style={buttonStyles}>
            {intl.formatMessage({ id: 'settings.location.delete.submit' })}
          </Button>
        </Popconfirm>
      </ButtonWrapper>
    </Wrapper>
  );
};
