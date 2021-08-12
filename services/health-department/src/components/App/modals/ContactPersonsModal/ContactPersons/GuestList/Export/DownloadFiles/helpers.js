import { notification } from 'antd';
import sanitize from 'sanitize-filename';

const TABLE_KEY = 'table';

export const showErrorNotification = intl =>
  notification.error({
    message: intl.formatMessage({
      id: 'modal.contactPersonView.download.error',
    }),
  });

export const formatAdditionalDataKey = (key, intl) =>
  key === TABLE_KEY
    ? intl.formatMessage({
        id: 'contactPersonTable.additionalData.table',
      })
    : key;

export const formatAdditionalData = (additionalData, intl) => {
  if (!additionalData) {
    return '';
  }
  return Object.keys(additionalData)
    .map(key => `${formatAdditionalDataKey(key, intl)}: ${additionalData[key]}`)
    .join(' / ');
};

const MAX_FILE_LENGTH = 100;

export const getSanitizedFilename = (name, suffix) =>
  `${sanitize(`${name}`).slice(0, MAX_FILE_LENGTH)}_${suffix}`;
