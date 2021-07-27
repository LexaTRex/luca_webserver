import React from 'react';
import { useIntl } from 'react-intl';
import { useQueryClient } from 'react-query';
import { useHistory } from 'react-router';
import { notification, Popconfirm } from 'antd';
import { DangerButton } from 'components/general';
import { QuestionCircleOutlined } from '@ant-design/icons';

import { BASE_GROUP_ROUTE } from 'constants/routes';
import { deleteGroup } from 'network/api';

import { Wrapper, Heading, ButtonWrapper, Info } from './DeleteGroup.styled';

export const DeleteGroup = ({ group }) => {
  const intl = useIntl();
  const history = useHistory();
  const queryClient = useQueryClient();

  const onDelete = () => {
    deleteGroup(group.groupId)
      .then(async () => {
        notification.success({
          message: intl.formatMessage({
            id: 'notification.deleteGroup.success',
          }),
        });
        await queryClient.invalidateQueries('groups');
        history.push(BASE_GROUP_ROUTE);
      })
      .catch(() => {
        notification.error({
          message: intl.formatMessage({
            id: 'notification.deleteGroup.error',
          }),
        });
      });
  };

  return (
    <Wrapper>
      <Heading>{intl.formatMessage({ id: 'settings.group.delete' })}</Heading>
      <Info>{intl.formatMessage({ id: 'settings.group.delete.info' })}</Info>
      <ButtonWrapper>
        <Popconfirm
          placement="topLeft"
          onConfirm={onDelete}
          title={intl.formatMessage({ id: 'group.delete.confirmText' })}
          okText={intl.formatMessage({ id: 'location.delete.confirmButton' })}
          cancelText={intl.formatMessage({
            id: 'location.delete.declineButton',
          })}
          icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
        >
          <DangerButton data-cy="deleteGroup">
            {intl.formatMessage({ id: 'settings.group.delete.submit' })}
          </DangerButton>
        </Popconfirm>
      </ButtonWrapper>
    </Wrapper>
  );
};
