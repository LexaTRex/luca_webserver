import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import {
  PrimaryButton,
  SecondaryButton,
  SuccessButton,
} from 'components/general/Buttons.styled';

// Worker
import { useWorker } from 'components/hooks/useWorker';
import { downloadPDF } from 'utils/downloadPDF';
import { getPDFWorker } from 'utils/workers';

import {
  Wrapper,
  Description,
  Header,
  ButtonWrapper,
} from 'components/App/modals/generalOnboarding/Onboarding.styled';

export const QRDownload = ({ done, group }) => {
  const intl = useIntl();
  const [downloadTableQRCodes, setDownloadTableQrCodes] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const pdfWorkerApiReference = useWorker(getPDFWorker());

  const onNext = () => {
    if (group.location.tableCount) {
      setDownloadTableQrCodes(true);
    } else {
      done();
    }
  };

  const onBack = () => setDownloadTableQrCodes(false);

  const downloadOptions = {
    setIsDownloading,
    pdfWorkerApiReference,
    location: { ...group.location, groupName: group.name },
    intl,
    isTableQRCodeEnabled: downloadTableQRCodes,
    isCWAEventEnabled: true,
  };
  const triggerDownload = () => downloadPDF(downloadOptions);

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
            <SuccessButton
              loading={isDownloading}
              onClick={triggerDownload}
              data-cy="download"
            >
              {intl.formatMessage({
                id: 'qrCodeDownload',
              })}
            </SuccessButton>
          </ButtonWrapper>

          <ButtonWrapper>
            <PrimaryButton onClick={onNext}>
              {intl.formatMessage({
                id: group.location.tableCount
                  ? 'authentication.form.button.next'
                  : 'done',
              })}
            </PrimaryButton>
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
            <SuccessButton loading={isDownloading} onClick={triggerDownload}>
              {intl.formatMessage({
                id: 'qrCodesDownload',
              })}
            </SuccessButton>
          </ButtonWrapper>

          <ButtonWrapper multipleButtons>
            <SecondaryButton onClick={onBack}>
              {intl.formatMessage({
                id: 'authentication.form.button.back',
              })}
            </SecondaryButton>
            <PrimaryButton onClick={done}>
              {intl.formatMessage({
                id: 'done',
              })}
            </PrimaryButton>
          </ButtonWrapper>
        </Wrapper>
      )}
    </>
  );
};
