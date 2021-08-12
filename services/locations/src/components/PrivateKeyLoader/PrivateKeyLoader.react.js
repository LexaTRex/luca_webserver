import React, { useEffect, useState } from 'react';

import { useIntl } from 'react-intl';
import { useQuery } from 'react-query';
import { notification, Progress, Spin, Upload } from 'antd';
import { PrimaryButton } from 'components/general/Buttons.styled';
import { base64ToHex, EC_KEYPAIR_FROM_PRIVATE_KEY } from '@lucaapp/crypto';

import { getPrivateKeySecret } from 'network/api';
import { MAX_PRIVATE_KEY_FILE_SIZE } from 'constants/valueLength';
import { parsePrivateKeyFile, usePrivateKey } from 'utils/privateKey';

import {
  FinishButtonWrapper,
  InfoBlock,
  RequestContent,
  UploadMessage,
  UploadProgress,
} from './PrivateKeyLoader.styled';
import { uploadMessages, statusProgress } from './PrivateKeyLoader.helper';

export const PrivateKeyLoader = ({
  publicKey,
  onSuccess = () => {},
  onError = () => {},
  infoTextId = 'privateKey.modal.info',
  footerItem = null,
}) => {
  const intl = useIntl();
  const [progressPercent, setProgressPercent] = useState(0);
  const [uploadStatus, setUploadStatus] = useState(statusProgress.initial);
  const [uploadMessageId, setUploadMessageId] = useState(
    uploadMessages.initial
  );

  const setStatus = (percent, exception, messageId) => {
    setProgressPercent(percent);
    setUploadStatus(exception);
    setUploadMessageId(messageId);
  };

  const { data: privateKeySecret, isLoading } = useQuery(
    'privateKeySecret',
    getPrivateKeySecret,
    {
      retry: false,
      onError: error => {
        notification.error(
          intl.formatMessage({ id: 'privateKey.modal.secret.error' })
        );
        onError(error);
      },
    }
  );
  const [existingPrivateKey, setPrivateKey] = usePrivateKey(privateKeySecret);

  const processPrivateKey = (privateKey, fileData) => {
    try {
      const keyPair = EC_KEYPAIR_FROM_PRIVATE_KEY(privateKey);
      if (keyPair?.publicKey !== base64ToHex(publicKey)) {
        setStatus(100, statusProgress.exception, uploadMessages.error);

        notification.error({
          message: intl.formatMessage({
            id: 'shareData.privkey.error.description',
          }),
        });
        return;
      }
      setStatus(100, statusProgress.success, uploadMessages.done);
      setPrivateKey(fileData);
      onSuccess(privateKey);
    } catch {
      setStatus(100, statusProgress.exception, uploadMessages.error);

      notification.error({
        message: intl.formatMessage({
          id: 'shareData.privkey.error.description',
        }),
      });
    }
  };

  const onFile = ({ file }) => {
    if (!file) return;

    if (file.size > MAX_PRIVATE_KEY_FILE_SIZE) {
      setStatus(100, statusProgress.exception, uploadMessages.size);
      notification.error({
        message: intl.formatMessage({
          id: 'notification.shareData.keySize.error',
        }),
      });
      return;
    }

    const reader = new FileReader();
    reader.addEventListener('load', event => {
      const stringValue = event.target.result;
      const privateKey = parsePrivateKeyFile(stringValue, privateKeySecret);
      processPrivateKey(privateKey, stringValue);
    });

    reader.readAsText(file);
  };

  const reset = () => {
    setStatus(0, statusProgress.initial, uploadMessages.initial);
  };

  useEffect(() => {
    if (existingPrivateKey) {
      onSuccess(existingPrivateKey);
    }
  }, [existingPrivateKey, onSuccess]);

  if (isLoading) {
    return <Spin />;
  }

  return (
    <>
      <RequestContent>
        <InfoBlock>
          {intl.formatMessage({ id: infoTextId }, { br: <br /> })}
        </InfoBlock>
        <Upload
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
      </RequestContent>
      <FinishButtonWrapper
        align={
          uploadStatus !== statusProgress.exception
            ? 'flex-start'
            : 'space-between'
        }
      >
        {footerItem}
        <PrimaryButton
          onClick={reset}
          hidden={uploadStatus !== statusProgress.exception}
        >
          {intl.formatMessage({ id: 'shareData.tryAgain' })}
        </PrimaryButton>
      </FinishButtonWrapper>
    </>
  );
};
