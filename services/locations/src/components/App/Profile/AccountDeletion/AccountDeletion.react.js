import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Button, message, Popconfirm } from 'antd';
import { useMutation } from 'react-query';

import { requestAccountDeletion, undoAccountDeletion } from 'network/api';
import { useFormatMessage } from 'utils/language';
import { Heading, Text } from './AccountDeletion.styled';
import { ButtonWrapper, ProfileContent } from '../Profile.styled';
import {
  calculateDaysRemaining,
  waitingPeriodDays,
} from './AccountDeletion.helper';
import { buttonStyles } from '../../App.styled';

const AccountDeletionBody = ({ refetch }) => {
  const intl = useFormatMessage();

  const onSuccess = () => {
    refetch();
    message.success(intl('account.delete.deletion.success'));
  };
  const onError = () => {
    message.error(intl('error.headline'));
  };
  const { mutate, isLoading } = useMutation(
    'accountDeletion',
    () => requestAccountDeletion(),
    { onSuccess, onError }
  );

  return (
    <>
      <Text>
        <FormattedMessage
          id="account.delete.info"
          values={{ days: waitingPeriodDays }}
        />
      </Text>
      <ButtonWrapper>
        <Popconfirm
          placement="top"
          disabled={false}
          onConfirm={() => mutate()}
          title={intl('account.delete.confirm.prompt')}
          okText={intl('account.delete.confirm')}
          cancelText={intl('account.delete.cancel')}
        >
          <Button
            data-cy="deleteAccount"
            loading={isLoading}
            style={{ ...buttonStyles, borderColor: '#e16f2d' }}
          >
            <FormattedMessage id="account.delete.confirm" />
          </Button>
        </Popconfirm>
      </ButtonWrapper>
    </>
  );
};

const AccountRestorationBody = ({ operator, refetch }) => {
  const daysRemaining = calculateDaysRemaining(operator);

  const intl = useFormatMessage();

  const onSuccess = () => {
    refetch();
    message.success(intl('account.delete.reactivation.success'));
  };
  const onError = () => {
    message.error(intl('error.headline'));
  };

  const { mutate, isLoading } = useMutation(
    'accountRestoration',
    () => undoAccountDeletion(),
    { onSuccess, onError }
  );

  return (
    <>
      <Text data-cy="inProgress">
        <FormattedMessage
          id="account.delete.info.inProgress"
          values={{ days: daysRemaining }}
        />
      </Text>
      <ButtonWrapper>
        <Button
          loading={isLoading}
          onClick={() => mutate()}
          style={buttonStyles}
          data-cy="restoreAccount"
        >
          <FormattedMessage id="account.delete.reactivate" />
        </Button>
      </ButtonWrapper>
    </>
  );
};

export const AccountDeletion = ({ operator, refetch }) => {
  const deletionInProgress = !!operator.deletedAt;
  return (
    <ProfileContent data-cy="deleteAccountSection">
      <Heading deletionInProgress={deletionInProgress}>
        <FormattedMessage
          id={`account.delete.heading${
            deletionInProgress ? '.inProgress' : ''
          }`}
        />
      </Heading>
      {deletionInProgress ? (
        <AccountRestorationBody operator={operator} refetch={refetch} />
      ) : (
        <AccountDeletionBody refetch={refetch} />
      )}
    </ProfileContent>
  );
};
