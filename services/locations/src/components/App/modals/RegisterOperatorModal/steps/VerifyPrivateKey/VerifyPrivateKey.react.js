import React, { useState } from 'react';

import { useIntl } from 'react-intl';
import { notification, Progress, Upload } from 'antd';
import { PrimaryButton } from 'components/general/Buttons.styled';
import { fileHandler } from 'utils/keyHandler';
import { usePrivateKey } from 'utils/privateKey';

import { FinishButton } from './FinishButton';
import {
  InfoBlock,
  RequestContent,
  UploadMessage,
  UploadProgress,
} from './VerifyPrivateKey.styled';
import { uploadMessages, statusProgress } from './VerifyPrivateKey.helper';

export const VerifyPrivateKey = ({
  publicKey,
  back,
  confirmKey,
  privateKeySecret,
}) => {
  const intl = useIntl();
  const [progressPercent, setProgressPercent] = useState(0);
  const [uploadStatus, setUploadStatus] = useState(statusProgress.initial);
  const [uploadMessageId, setUploadMessageId] = useState(
    uploadMessages.initial
  );
  const [correctKeyInserted, setCorrectKeyInserted] = useState(false);
  const [, setPrivateKey] = usePrivateKey(privateKeySecret);

  const setStatus = (percent, exception, messageId) => {
    setProgressPercent(percent);
    setUploadStatus(exception);
    setUploadMessageId(messageId);
  };

  const onFile = ({ file }) => {
    fileHandler(file, privateKeySecret, publicKey, setPrivateKey)
      .then(() => {
        setStatus(100, statusProgress.success, uploadMessages.done);
        setCorrectKeyInserted(true);
      })
      .catch(error => {
        if (error === 'FILE_TO_BIG') {
          setStatus(100, statusProgress.exception, uploadMessages.size);
          notification.error({
            message: intl.formatMessage({
              id: 'notification.shareData.keySize.error',
            }),
          });
        } else {
          setStatus(100, statusProgress.exception, uploadMessages.error);
          notification.error({
            message: intl.formatMessage({
              id: 'shareData.privkey.error.description',
            }),
          });
        }
      });
  };

  const reset = () => {
    setStatus(0, statusProgress.initial, uploadMessages.initial);
    setCorrectKeyInserted(false);
    back();
  };

  return (
    <>
      <RequestContent>
        <InfoBlock>
          {intl.formatMessage({ id: 'modal.registerOperator.keyTestInfo' })}
        </InfoBlock>
        <Upload
          data-cy="upload"
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
              {intl.formatMessage({ id: 'shareData.privateKey.btnLabel' })}
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
        </Upload>
        <FinishButton
          uploadStatus={uploadStatus}
          uploadException={statusProgress.exception}
          correctKeyInserted={correctKeyInserted}
          confirmKey={confirmKey}
          reset={reset}
        />
      </RequestContent>
    </>
  );
};
