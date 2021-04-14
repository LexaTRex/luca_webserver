import React, { useState } from 'react';
import FileSaver from 'file-saver';
import { useIntl } from 'react-intl';
import { Button } from 'antd';
import { FileProtectOutlined } from '@ant-design/icons';

import { bytesToHex } from '@lucaapp/crypto';
import { generatePrivateKeyFile } from 'utils/privateKey';

// Components
import {
  Explain,
  ButtonRow,
  DownloadRow,
} from '../RegisterHealthDepartmentModal.styled';

export const GenerateKeysStep = ({
  hdekp,
  hdskp,
  proceed,
  privateKeySecret,
}) => {
  const intl = useIntl();
  const [hasDownloaded, setHasDownLoaded] = useState(false);

  const onDownLoad = () => {
    const keyFile = {
      hdekp: hdekp.privateKey,
      hdskp: hdskp.privateKey,
    };
    const fileData = new Blob(
      [
        generatePrivateKeyFile(
          bytesToHex(JSON.stringify(keyFile)),
          privateKeySecret
        ),
      ],
      {
        type: 'text/plain;charset=utf-8',
      }
    );

    FileSaver.saveAs(
      fileData,
      intl.formatMessage({ id: 'downloadFile.healthDepartment.keyfile' })
    );
    setHasDownLoaded(true);
  };

  return (
    <>
      <Explain>
        {intl.formatMessage({
          id: 'modal.registerHealthDepartment.step0.explain',
        })}
      </Explain>
      <DownloadRow>
        <FileProtectOutlined style={{ fontSize: 40, marginBottom: 24 }} />
        <Button
          onClick={onDownLoad}
          style={{
            padding: '0 40px',
            color: 'black',
            backgroundColor: '#b8c0ca',
            width: '50%',
          }}
        >
          {intl.formatMessage({
            id: 'modal.registerHealthDepartment.step0.downloadButton',
          })}
        </Button>
      </DownloadRow>
      <ButtonRow
        numberOfButtons={1}
        style={{
          marginTop: 40,
        }}
      >
        <Button
          onClick={proceed}
          disabled={!hasDownloaded}
          style={{
            backgroundColor: '#4e6180',
            padding: '0 40px',
            color: 'white',
          }}
        >
          {intl.formatMessage({
            id: 'modal.registerHealthDepartment.step0.nextButton',
          })}
        </Button>
      </ButtonRow>
    </>
  );
};
