import { notification } from 'antd';
import { updateOperator, updateEmail, isEmailUpdatePending } from 'network/api';
import { useQuery } from 'react-query';

export const nameChanged = (oldValues, newValues) =>
  oldValues.firstName !== newValues.firstName ||
  oldValues.lastName !== newValues.lastName;

export const mailChanged = (oldValues, newValues) =>
  oldValues.email !== newValues.email;

export const notify = (messageId, intl) =>
  notification.error({
    message: intl.formatMessage({
      id: messageId,
    }),
  });

export const useMailChangeRequest = () => {
  const { data, refetch } = useQuery(
    'isMailChangeInProgress',
    () =>
      isEmailUpdatePending()
        .then(() => true)
        .catch(() => false),
    { cacheTime: 0 }
  );

  return { data, refetch };
};

export const onUpdateEmailHandler = (email, intl, refetchEmailPending) => {
  updateEmail({ email, lang: intl.locale })
    .then(refetchEmailPending)
    .catch(() => {
      notify('notification.profile.updateEmail.error', intl);
    });
};

export const onFinishHandler = ({
  values,
  operator,
  refetchOperator,
  refetchEmailPending,
  intl,
}) => {
  if (nameChanged(operator, values)) {
    updateOperator({
      firstName: values.firstName,
      lastName: values.lastName,
    })
      .finally(refetchOperator)
      .catch(() => {
        notify('notification.profile.updateUser.error', intl);
      });
  }

  if (mailChanged(operator, values))
    onUpdateEmailHandler(values.email, intl, refetchEmailPending);
};
