import React, { useState } from 'react';
import FileSaver from 'file-saver';
import { useIntl } from 'react-intl';
import { FileProtectOutlined } from '@ant-design/icons';
import { PrimaryButton } from 'components/general';

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
        <PrimaryButton
          data-cy="downloadPrivateKey"
          onClick={onDownLoad}
          style={{
            width: '50%',
          }}
        >
          {intl.formatMessage({
            id: 'modal.registerHealthDepartment.step0.downloadButton',
          })}
        </PrimaryButton>
      </DownloadRow>
      <ButtonRow
        numberOfButtons={1}
        style={{
          marginTop: 40,
        }}
      >
        <PrimaryButton
          data-cy="next"
          onClick={proceed}
          disabled={!hasDownloaded}
        >
          {intl.formatMessage({
            id: 'modal.registerHealthDepartment.step0.nextButton',
          })}
        </PrimaryButton>
      </ButtonRow>
    </>
  );
};
