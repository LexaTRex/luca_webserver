import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { notification, Progress, Spin } from 'antd';
import { PrimaryButton } from 'components/general';
import { useModal } from 'components/hooks/useModal';
import { getPrivateKeySecret } from 'network/api';
import { useQuery } from 'react-query';
import { fileHandler } from 'utils/keyHandler';
import { FinishButton } from './FinishButton';

import { uploadMessages, statusProgress } from './UploadKeyFileModal.helper';
import {
  InfoBlock,
  RequestContent,
  UploadMessage,
  UploadProgress,
  FileUpload,
} from './UploadKeyFileModal.styled';

export const UploadKeyFileModal = ({ keysData, onFinish }) => {
  const intl = useIntl();
  const [, closeModal] = useModal();
  const [progressPercent, setProgressPercent] = useState(0);
  const [uploadStatus, setUploadStatus] = useState(statusProgress.initial);
  const [uploadMessageId, setUploadMessageId] = useState(
    uploadMessages.initial
  );
  const { isLoading, data: privateKeySecret } = useQuery(
    'privateKeySecret',
    getPrivateKeySecret
  );
  const setStatus = (percent, exception, messageId) => {
    setProgressPercent(percent);
    setUploadStatus(exception);
    setUploadMessageId(messageId);
  };

  const onFile = ({ file }) =>
    fileHandler(file, privateKeySecret, keysData)
      .then(() => {
        setStatus(100, statusProgress.success, uploadMessages.done);
        onFinish();
        closeModal();
      })
      .catch(error => {
        if (error === 'FILE_TO_BIG') {
          setStatus(100, statusProgress.exception, uploadMessages.size);
          notification.error({
            message: intl.formatMessage({
              id: 'login.keyFileSize.error.description',
            }),
          });
        } else {
          setStatus(100, statusProgress.exception, uploadMessages.error);
          notification.error({
            message: intl.formatMessage({ id: 'login.keyFile.error.title' }),
            description: intl.formatMessage({
              id: 'login.keyFile.error.description',
            }),
          });
        }
      });

  const reset = () =>
    setStatus(0, statusProgress.initial, uploadMessages.initial);

  if (isLoading) {
    return <Spin />;
  }

  return (
    <>
      <RequestContent>
        <InfoBlock>
          {intl.formatMessage({
            id: 'modal.uploadKeyModal.info',
          })}
        </InfoBlock>
        <InfoBlock>
          {intl.formatMessage({
            id: 'modal.uploadKeyModal.uploadInfo',
          })}
        </InfoBlock>
        <FileUpload
          type="file"
          accept=".luca"
          customRequest={onFile}
          showUploadList={false}
        >
          <UploadMessage>
            {intl.formatMessage({ id: uploadMessageId })}
          </UploadMessage>
          {progressPercent <= 0 && (
            <PrimaryButton>
              {intl.formatMessage({
                id: 'modal.uploadKeyModal.button',
              })}
            </PrimaryButton>
          )}
          {progressPercent > 0 && (
            <UploadProgress>
              <Progress
                percent={progressPercent}
                status={uploadStatus}
                trailColor="#fff"
              />
            </UploadProgress>
          )}
        </FileUpload>
      </RequestContent>
      <FinishButton
        uploadStatus={uploadStatus}
        exception={statusProgress.exception}
        reset={reset}
      />
    </>
  );
};
