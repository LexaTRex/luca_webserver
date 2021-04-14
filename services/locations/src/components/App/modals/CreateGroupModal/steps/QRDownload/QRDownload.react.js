import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { Button } from 'antd';

import { QrCodeDocument } from 'components/QrCodeDocument';

import {
  nextButtonStyles,
  backButtonStyles,
  downloadButtonStyles,
  Wrapper,
  Description,
  Header,
  ButtonWrapper,
} from '../../../generalOnboarding/Onboarding.styled';

export const QRDownload = ({ done, group }) => {
  const intl = useIntl();
  const [downloadTableQRCodes, setDownloadTableQrCodes] = useState(false);
  const [isDownload, setIsDownload] = useState(false);

  const onNext = () => {
    if (group.location.tableCount) {
      setDownloadTableQrCodes(true);
    } else {
      done();
    }
  };

  const onBack = () => {
    setDownloadTableQrCodes(false);
  };

  const onDownLoad = () => {
    setIsDownload(true);
  };

  return (
    <>
      {!downloadTableQRCodes ? (
        <Wrapper>
          <Header>
            {intl.formatMessage({
              id: 'modal.createGroup.singleQRDownload.title',
            })}
          </Header>
          <Description>
            {intl.formatMessage({
              id: 'modal.createGroup.singleQRDownload.description',
            })}
          </Description>
          <ButtonWrapper
            style={{ justifyContent: 'center', margin: '40px 0 80px 0' }}
          >
            <Button
              style={downloadButtonStyles}
              loading={isDownload}
              onClick={onDownLoad}
            >
              {intl.formatMessage({
                id: 'qrCodeDownload',
              })}
            </Button>
          </ButtonWrapper>

          <ButtonWrapper>
            <Button style={nextButtonStyles} onClick={onNext}>
              {intl.formatMessage({
                id: group.location.tableCount
                  ? 'authentication.form.button.next'
                  : 'done',
              })}
            </Button>
          </ButtonWrapper>
        </Wrapper>
      ) : (
        <Wrapper>
          <Header>
            {intl.formatMessage({
              id: 'modal.createGroup.tableQRDownload.title',
            })}
          </Header>
          <Description>
            {intl.formatMessage({
              id: 'modal.createGroup.tableQRDownload.description',
            })}
          </Description>
          <ButtonWrapper
            style={{ justifyContent: 'center', margin: '40px 0 80px 0' }}
          >
            <Button
              style={downloadButtonStyles}
              loading={isDownload}
              onClick={onDownLoad}
            >
              {intl.formatMessage({
                id: 'qrCodesDownload',
              })}
            </Button>
          </ButtonWrapper>

          <ButtonWrapper multipleButtons>
            <Button style={backButtonStyles} onClick={onBack}>
              {intl.formatMessage({
                id: 'authentication.form.button.back',
              })}
            </Button>
            <Button style={nextButtonStyles} onClick={done}>
              {intl.formatMessage({
                id: 'done',
              })}
            </Button>
          </ButtonWrapper>
        </Wrapper>
      )}
      <QrCodeDocument
        isDownload={isDownload}
        setIsDownload={setIsDownload}
        group={group}
        downloadTableQRCodes={downloadTableQRCodes}
      />
    </>
  );
};
