import React from 'react';
import FileSaver from 'file-saver';
import sanitize from 'sanitize-filename';
import { useIntl } from 'react-intl';
import { FileProtectOutlined } from '@ant-design/icons';
import { generatePrivateKeyFile } from 'utils/privateKey';
import { Button } from 'antd';
import {
  Explain,
  DownloadRow,
  ButtonRow,
  downloadStyle,
} from './DownloadPrivateKey.styled';

export const DownloadPrivateKey = ({
  setHasDownloadedKey,
  operator,
  keyPair,
  privateKeySecret,
}) => {
  const intl = useIntl();

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
    </>
  );
};
