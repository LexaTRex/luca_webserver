import { FormattedMessage } from 'react-intl';
import React from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { Button, Layout, message } from 'antd';

import { calculateDaysRemaining } from '../../Profile/AccountDeletion/AccountDeletion.helper';
import { contentStyles, Heading, sliderStyles } from '../Dashboard.styled';
import { buttonStyles } from '../../App.styled';
import { undoAccountDeletion } from '../../../../network/api';
import { ContentWrapper } from './DeletionMessage.styled';
import { useFormatMessage } from '../../../../utils/language';

const { Sider, Content } = Layout;

export const DeletionMessage = ({ operator }) => {
  const daysRemaining = calculateDaysRemaining(operator);

  const intl = useFormatMessage();
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation(
    'accountDeletion',
    () => undoAccountDeletion(),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('me');
        message.success(intl('account.delete.reactivation.success'));
      },
      onError: () => message.error(intl('error.headline')),
    }
  );

  return (
    <>
      <ContentWrapper data-cy="deletionRequested">
        <Heading>
          <FormattedMessage id="account.delete.heading.inProgress2" />
        </Heading>
        <p>
          <FormattedMessage
            id="account.delete.info.inProgress"
            values={{ days: <strong>{daysRemaining}</strong> }}
          />
        </p>
        <Button
          style={buttonStyles}
          onClick={mutate}
          loading={isLoading}
          data-cy="restoreAccount"
        >
          <FormattedMessage id="account.delete.reactivate" />
        </Button>
      </ContentWrapper>
    </>
  );
};

export const DeletionMessageLayout = ({ operator }) => {
  return (
    <Layout>
      <Sider style={sliderStyles} width={300} />
      <Content style={contentStyles}>
        <DeletionMessage operator={operator} />
      </Content>
    </Layout>
  );
};
