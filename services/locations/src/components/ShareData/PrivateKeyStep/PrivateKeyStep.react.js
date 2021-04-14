import React, { useCallback, useRef, useState, useEffect } from 'react';

import { useIntl } from 'react-intl';
import { useQuery } from 'react-query';
import { Input, Button, notification } from 'antd';
import { useLocation, useHistory } from 'react-router-dom';
import { EC_KEYPAIR_FROM_PRIVATE_KEY, base64ToHex } from '@lucaapp/crypto';

import { IS_MOBILE } from 'constants/environment';
import { getPrivateKeySecret } from 'network/api';
import { parsePrivateKeyFile } from 'utils/privateKey';
import { AUTHENTICATION_ROUTE } from 'constants/routes';

import {
  SubHeader,
  UploadButton,
  HiddenUpload,
  RequestContent,
  UploadButtonWrapper,
  FinishButtonWrapper,
} from '../ShareData.styled';

export const PrivateKeyStep = ({ next, title, setPrivateKey, publicKey }) => {
  const intl = useIntl();
  const history = useHistory();
  const location = useLocation();
  const reader = useRef(new FileReader());
  const [done, setDone] = useState(false);
  const [textInput, setTextInput] = useState('');

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

      reader.current.addEventListener('load', addEventListenerEvent => {
        const privateKey = parsePrivateKeyFile(
          addEventListenerEvent.target.result,
          privateKeySecret
        );

        setTextInput(privateKey);
        setPrivateKey(privateKey);
      });

      reader.current.readAsText(keyFile);
    },
    [setPrivateKey, privateKeySecret]
  );

  const onInput = useCallback(
    onInputevent => {
      setDone(false);
      setPrivateKey(onInputevent.target.value);
      setTextInput(onInputevent.target.value);
    },
    [setPrivateKey]
  );

  useEffect(() => {
    try {
      if (textInput.length !== 64) return;

      const result = EC_KEYPAIR_FROM_PRIVATE_KEY(textInput);
      const isKeyCorrect = result?.publicKey === base64ToHex(publicKey);

      setDone(isKeyCorrect);

      if (!isKeyCorrect) {
        notification.error({
          message: intl.formatMessage({
            id: 'shareData.privkey.error.description',
          }),
        });
      }
    } catch {
      notification.error({
        message: intl.formatMessage({ id: 'shareData.privkey.error.title' }),
        description: intl.formatMessage({
          id: 'shareData.privkey.error.description',
        }),
      });
    }
  }, [textInput, publicKey, intl]);

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
      <div>
        <SubHeader>
          {intl.formatMessage({
            id: 'shareData.privateKey',
          })}
        </SubHeader>

        <Input.Password
          style={{
            borderColor: 'rgb(105, 105, 105)',
            marginBottom: 40,
          }}
          type="text"
          onChange={onInput}
          value={textInput}
          visibilityToggle={false}
        />
      </div>

      <UploadButtonWrapper>
        <HiddenUpload type="file" onChange={onFile} accept=".luca" />
        <UploadButton href="#">
          {intl.formatMessage({
            id: 'shareData.upload',
          })}
        </UploadButton>
      </UploadButtonWrapper>
      <FinishButtonWrapper>
        <Button
          disabled={!done}
          onClick={next}
          style={{
            height: 40,
            width: IS_MOBILE ? '100%' : 200,
          }}
        >
          {intl.formatMessage({
            id: 'shareData.next',
          })}
        </Button>
      </FinishButtonWrapper>
    </>
  );
};
