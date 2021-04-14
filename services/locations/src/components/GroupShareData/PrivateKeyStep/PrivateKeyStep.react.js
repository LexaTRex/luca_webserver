import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Button, notification } from 'antd';
import { useIntl } from 'react-intl';
import { useQuery } from 'react-query';
import { useHistory, useLocation } from 'react-router-dom';

import { getPrivateKeySecret } from 'network/api';
import { IS_MOBILE } from 'constants/environment';
import { parsePrivateKeyFile } from 'utils/privateKey';
import { AUTHENTICATION_ROUTE } from 'constants/routes';

import { EC_KEYPAIR_FROM_PRIVATE_KEY, base64ToHex } from '@lucaapp/crypto';
import {
  SubHeader,
  RequestContent,
  UploadButton,
  UploadButtonWrapper,
  HiddenUpload,
  FinishButtonWrapper,
} from '../GroupShareData.styled';

export const PrivateKeyStep = ({ onFinish, publicKey, title }) => {
  const intl = useIntl();
  const history = useHistory();
  const location = useLocation();
  const reader = useRef(new FileReader());
  const [privateKey, setPrivateKey] = useState(null);

  const { data: privateKeySecret, isLoading, isError } = useQuery(
    'privateKeySecret',
    () => getPrivateKeySecret(),
    {
      retry: false,
    }
  );

  const onFile = useCallback(
    onFileUploadEvent => {
      const keyFile = onFileUploadEvent.target.files[0];

      if (!keyFile) {
        return;
      }

      const handleInputLoad = addEventListenerEvent => {
        reader.current.removeEventListener('load', handleInputLoad);
        const parsedPrivateKey = parsePrivateKeyFile(
          addEventListenerEvent.target.result,
          privateKeySecret
        );

        try {
          const result = EC_KEYPAIR_FROM_PRIVATE_KEY(parsedPrivateKey);
          const isKeyCorrect = result?.publicKey === base64ToHex(publicKey);

          if (!isKeyCorrect) {
            notification.error({
              message: intl.formatMessage({
                id: 'shareData.privkey.error.description',
              }),
            });
            return;
          }

          setPrivateKey(result.privKey);
        } catch {
          notification.error({
            message: intl.formatMessage({
              id: 'shareData.privkey.error.description',
            }),
          });
        }
      };

      reader.current.addEventListener('load', handleInputLoad);

      reader.current.readAsText(keyFile);
    },
    [intl, privateKeySecret, publicKey]
  );

  useEffect(() => {
    if (isError) {
      history.push(`${AUTHENTICATION_ROUTE}?redirect=${location.pathname}`);
    }
  }, [isError, history, location.pathname]);

  if (isLoading || isError) {
    return null;
  }

  return (
    <>
      <RequestContent>
        <SubHeader>{title}</SubHeader>
        <p>
          {intl.formatMessage({
            id: 'shareData.privateKeyStep.info',
          })}
        </p>
      </RequestContent>
      {privateKey ? (
        <div className="success-checkmark">
          <div className="check-icon">
            <span className="icon-line line-tip"> </span>
            <span className="icon-line line-long"> </span>
            <div className="icon-circle"> </div>
            <div className="icon-fix"> </div>
          </div>
        </div>
      ) : (
        <UploadButtonWrapper>
          <HiddenUpload
            type="file"
            accept=".luca"
            onChange={event => onFile(event)}
          />
          <UploadButton href="#">
            {intl.formatMessage({
              id: 'shareData.upload',
            })}
          </UploadButton>
        </UploadButtonWrapper>
      )}
      <FinishButtonWrapper>
        <Button
          style={{
            height: 40,
            width: IS_MOBILE ? '100%' : 200,
          }}
          disabled={!privateKey}
          onClick={() => onFinish(privateKey)}
        >
          {intl.formatMessage({
            id: 'shareData.next',
          })}
        </Button>
      </FinishButtonWrapper>
    </>
  );
};
