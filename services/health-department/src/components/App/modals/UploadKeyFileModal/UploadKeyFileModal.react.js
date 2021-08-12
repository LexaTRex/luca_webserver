import React, { useRef } from 'react';
import { useIntl } from 'react-intl';
import { useQuery } from 'react-query';
import { notification } from 'antd';
import { PrimaryButton } from 'components/general';

import { base64ToHex, EC_KEYPAIR_FROM_PRIVATE_KEY } from '@lucaapp/crypto';

import { useModal } from 'components/hooks/useModal';

import { getPrivateKeySecret } from 'network/api';
import { parsePrivateKeyFile } from 'utils/privateKey';

import { MAX_PRIVATE_KEY_FILE_SIZE } from 'constants/valueLength';
import { storeHealthDepartmentPrivateKeys } from 'utils/cryptoKeyOperations';
import { HiddenUpload, Info, ButtonRow } from './UploadKeyFileModal.styled';

export const UploadKeyFileModal = ({ keysData, onFinish }) => {
  const intl = useIntl();
  const reader = useRef(new FileReader());
  const uploadReference = useRef(null);
  const [, closeModal] = useModal();
  const { isLoading, data: privateKeySecret } = useQuery(
    'privateKeySecret',
    () => getPrivateKeySecret()
  );

  const loadKeyFile = string => {
    try {
      const keys = JSON.parse(string);

      if (
        base64ToHex(keysData.publicHDEKP) !==
        EC_KEYPAIR_FROM_PRIVATE_KEY(keys.hdekp).publicKey
      ) {
        throw new Error('invalid key');
      }
      storeHealthDepartmentPrivateKeys(keys.hdekp, keys.hdskp);
      closeModal();
      onFinish();
    } catch {
      notification.error({
        message: intl.formatMessage({ id: 'login.keyFile.error.title' }),
        description: intl.formatMessage({
          id: 'login.keyFile.error.description',
        }),
      });
    }
  };

  const onFile = onFileUploadEvent => {
    const keyFile = onFileUploadEvent.target.files[0];

    if (!keyFile) {
      return;
    }

    if (keyFile.size > MAX_PRIVATE_KEY_FILE_SIZE) {
      notification.error({
        message: intl.formatMessage({
          id: 'login.keyFileSize.error.description',
        }),
      });
      return;
    }

    reader.current.addEventListener('load', addEventListenerEvent => {
      loadKeyFile(
        parsePrivateKeyFile(
          addEventListenerEvent.target.result,
          privateKeySecret
        )
      );
    });

    reader.current.readAsText(keyFile);
  };

  const triggerInput = () => {
    if (uploadReference?.current) {
      uploadReference.current.click();
    }
  };

  if (isLoading) {
    return null;
  }

  return (
    <>
      <Info>
        {intl.formatMessage({
          id: 'modal.uploadKeyModal.info',
        })}
      </Info>
      <HiddenUpload
        ref={uploadReference}
        type="file"
        accept=".luca"
        onChange={onFile}
        data-cy="fileUpload"
      />
      <ButtonRow>
        <PrimaryButton onClick={triggerInput} style={{ zIndex: 3 }}>
          {intl.formatMessage({
            id: 'modal.uploadKeyModal.button',
          })}
        </PrimaryButton>
      </ButtonRow>
    </>
  );
};
