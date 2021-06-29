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

export const QRDownload = ({ done, location, group }) => {
  const intl = useIntl();
  const [downloadTableQRCodes, setDownloadTableQrCodes] = useState(false);
  const [isDownload, setIsDownload] = useState(false);

  const onNext = () => {
    if (location.tableCount) {
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
              id: 'modal.createLocation.singleQRDownload.title',
            })}
          </Header>
          <Description>
            {intl.formatMessage({
              id: 'modal.createLocation.singleQRDownload.description',
            })}
          </Description>
          <ButtonWrapper
            style={{ justifyContent: 'center', margin: '40px 0 80px 0' }}
          >
            <Button
              data-cy="qrCodeDownload"
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
            <Button
              onClick={onNext}
              style={nextButtonStyles}
              data-cy={location.tableCount ? 'nextStep' : 'done'}
            >
              {intl.formatMessage({
                id: location.tableCount
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
              id: 'modal.createLocation.tableQRDownload.title',
            })}
          </Header>
          <Description>
            {intl.formatMessage({
              id: 'modal.createLocation.tableQRDownload.description',
            })}
          </Description>
          <ButtonWrapper
            style={{ justifyContent: 'center', margin: '40px 0 80px 0' }}
          >
            <Button
              onClick={onDownLoad}
              data-cy="qrCodeDownload"
              style={downloadButtonStyles}
              loading={isDownload}
            >
              {intl.formatMessage({
                id: 'qrCodesDownload',
              })}
            </Button>
          </ButtonWrapper>

          <ButtonWrapper multipleButtons>
            <Button data-cy="back" style={backButtonStyles} onClick={onBack}>
              {intl.formatMessage({
                id: 'authentication.form.button.back',
              })}
            </Button>
            <Button data-cy="done" style={nextButtonStyles} onClick={done}>
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
        location={location}
        group={group}
        downloadTableQRCodes={downloadTableQRCodes}
      />
    </>
  );
};
