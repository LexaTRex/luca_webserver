import React, { useState, useEffect } from 'react';
import FileSaver from 'file-saver';
import { useIntl } from 'react-intl';
import { Button, Tooltip } from 'antd';
import { useQuery, useQueryClient } from 'react-query';
import { FileProtectOutlined } from '@ant-design/icons';

import { generatePrivateKeyFile } from 'utils/privateKey';
import { getPrivateKeySecret, storePublicKey } from 'network/api';
import { hexToBase64, EC_KEYPAIR_GENERATE } from '@lucaapp/crypto';

import {
  Wrapper,
  Explain,
  ButtonRow,
  DownloadRow,
  DownloadTitle,
  Expand,
  ButtonWrapper,
  disabledStyle,
  downloadStyle,
  copyStyle,
  nextButtonStyles,
} from './RegisterOperatorModal.styled';

export const RegisterOperatorModal = ({ onClose, operator }) => {
  const intl = useIntl();
  const queryClient = useQueryClient();
  const [keyPair, setKeyPair] = useState(null);
  const [hasDownloadedKey, setHasDownloadedKey] = useState(false);

  useEffect(() => {
    const keys = EC_KEYPAIR_GENERATE();
    setKeyPair(keys);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    data: privateKeySecret,
    isLoading,
    isError,
  } = useQuery('privateKeySecret', () => getPrivateKeySecret());

  const onCopy = () => {
    navigator.clipboard.writeText(
      generatePrivateKeyFile(keyPair.privateKey, privateKeySecret)
    );
  };

  const downloadPrivateKey = () => {
    const fileData = new Blob(
      [generatePrivateKeyFile(keyPair.privateKey, privateKeySecret)],
      {
        type: 'text/plain;charset=utf-8',
      }
    );
    FileSaver.saveAs(
      fileData,
      intl.formatMessage(
        { id: 'downloadFile.groups.publicKey' },
        { name: `${operator.firstName}_${operator.lastName}` }
      )
    );
    setHasDownloadedKey(true);
  };

  const setOperatorKey = () => {
    storePublicKey({ publicKey: hexToBase64(keyPair.publicKey) })
      .then(() => {
        queryClient.invalidateQueries('me');
        onClose();
      })
      .catch(error => console.error(error));
  };

  if (isLoading || isError) {
    return null;
  }

  return (
    <Wrapper>
      <Explain>
        {intl.formatMessage({
          id: 'modal.registerOperator.explain',
        })}
      </Explain>
      <DownloadRow>
        <FileProtectOutlined style={{ fontSize: 40, marginBottom: 24 }} />
        <ButtonRow align="center" style={{ marginTop: 0 }}>
          <Button
            data-cy="downloadPrivateKey"
            onClick={() => downloadPrivateKey()}
            style={downloadStyle}
          >
            {intl.formatMessage({
              id: 'modal.registerOperator.downloadButton',
            })}
          </Button>
        </ButtonRow>
      </DownloadRow>
      <Expand open={hasDownloadedKey}>
        <DownloadTitle>
          {intl.formatMessage({
            id: 'modal.registerOperator.titleCopy',
          })}
        </DownloadTitle>
        <Explain style={{ marginTop: 16 }}>
          {intl.formatMessage({
            id: 'modal.registerOperator.explainCopy',
          })}
        </Explain>
        <ButtonRow align="center" style={{ marginTop: 0 }}>
          <Tooltip
            title={intl.formatMessage({
              id: 'tooltip.copy',
            })}
            color="#b8cad3"
            trigger={['click']}
          >
            <Button onClick={() => onCopy()} style={copyStyle}>
              {intl.formatMessage({
                id: 'modal.registerOperator.copyButton',
              })}
            </Button>
          </Tooltip>
        </ButtonRow>
      </Expand>
      <ButtonWrapper multipleButtons>
        <Button
          style={!hasDownloadedKey ? disabledStyle : nextButtonStyles}
          disabled={!hasDownloadedKey}
          onClick={setOperatorKey}
        >
          {intl.formatMessage({
            id: 'authentication.form.button.next',
          })}
        </Button>
      </ButtonWrapper>
    </Wrapper>
  );
};
