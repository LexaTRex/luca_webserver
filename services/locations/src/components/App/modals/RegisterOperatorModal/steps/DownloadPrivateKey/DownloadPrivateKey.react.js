import React, { useState, useEffect } from 'react';
import FileSaver from 'file-saver';
import sanitize from 'sanitize-filename';
import { FileProtectOutlined } from '@ant-design/icons';
import { SuccessButton, PrimaryButton } from 'components/general';

import { useIntl } from 'react-intl';
import { EC_KEYPAIR_GENERATE, hexToBase64 } from '@lucaapp/crypto';
import { generatePrivateKeyFile } from 'utils/privateKey';

import { ConfirmPrivateKey } from './ConfirmPrivateKey';
import { Explain, DownloadRow, ButtonRow } from './DownloadPrivateKey.styled';

export const DownloadPrivateKey = ({
  operator,
  next,
  setPublicKey,
  privateKeySecret,
}) => {
  const intl = useIntl();
  const [keyPair, setKeyPair] = useState(null);
  const [hasDownloadedKey, setHasDownloadedKey] = useState(false);
  const [hasSavedKey, setHasSavedKey] = useState(false);

  useEffect(() => {
    const keys = EC_KEYPAIR_GENERATE();
    setKeyPair(keys);
    setPublicKey(hexToBase64(keys.publicKey));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const downloadPrivateKey = () => {
    const fileData = new Blob(
      [generatePrivateKeyFile(keyPair.privateKey, privateKeySecret)],
      {
        type: 'text/plain;charset=utf-8',
      }
    );
    FileSaver.saveAs(
      fileData,
      sanitize(
        intl.formatMessage(
          { id: 'downloadFile.groups.publicKey' },
          { name: `${operator.firstName}_${operator.lastName}` }
        )
      )
    );
    setHasDownloadedKey(true);
  };

  return (
    <>
      <Explain>
        {intl.formatMessage({
          id: 'modal.registerOperator.explain',
        })}
      </Explain>
      <DownloadRow>
        <FileProtectOutlined style={{ fontSize: 40, marginBottom: 24 }} />
        <ButtonRow align="center" style={{ marginTop: 0 }}>
          <SuccessButton
            data-cy="downloadPrivateKey"
            onClick={() => downloadPrivateKey()}
          >
            {intl.formatMessage({
              id: 'modal.registerOperator.downloadButton',
            })}
          </SuccessButton>
        </ButtonRow>
      </DownloadRow>
      <ConfirmPrivateKey
        setHasSavedKey={setHasSavedKey}
        hasDownloadedKey={hasDownloadedKey}
      />
      <ButtonRow align="flex-end">
        <PrimaryButton onClick={next} data-cy="next" disabled={!hasSavedKey}>
          {intl.formatMessage({
            id: 'authentication.form.button.next',
          })}
        </PrimaryButton>
      </ButtonRow>
    </>
  );
};
