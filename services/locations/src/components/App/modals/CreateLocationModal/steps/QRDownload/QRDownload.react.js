import React, { useState } from 'react';
import { useQuery } from 'react-query';
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

// API
import { getGroup } from 'network/api';

import {
  Wrapper,
  Description,
  Header,
  ButtonWrapper,
} from '../../../generalOnboarding/Onboarding.styled';

export const QRDownload = ({ done, location }) => {
  const intl = useIntl();
  const [downloadTableQRCodes, setDownloadTableQrCodes] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const { isLoading, data: group } = useQuery(`group/${location.groupId}`, () =>
    getGroup(location.groupId)
  );

  const pdfWorkerApiReference = useWorker(getPDFWorker());

  const onNext = () => {
    if (location.tableCount) {
      setDownloadTableQrCodes(true);
    } else {
      done();
    }
  };

  const onBack = () => setDownloadTableQrCodes(false);

  const downloadOptions = {
    setIsDownloading,
    pdfWorkerApiReference,
    location: {
      ...location,
      groupName: group?.name,
    },
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
            <SuccessButton
              data-cy="qrCodeDownload"
              loading={isDownloading}
              onClick={triggerDownload}
              disabled={isLoading}
            >
              {intl.formatMessage({
                id: 'qrCodeDownload',
              })}
            </SuccessButton>
          </ButtonWrapper>

          <ButtonWrapper>
            <PrimaryButton
              onClick={onNext}
              data-cy={location.tableCount ? 'nextStep' : 'done'}
            >
              {intl.formatMessage({
                id: location.tableCount
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
            <SuccessButton
              onClick={triggerDownload}
              data-cy="qrCodeDownload"
              loading={isDownloading}
              disabled={isLoading}
            >
              {intl.formatMessage({
                id: 'qrCodesDownload',
              })}
            </SuccessButton>
          </ButtonWrapper>

          <ButtonWrapper multipleButtons>
            <SecondaryButton data-cy="back" onClick={onBack}>
              {intl.formatMessage({
                id: 'authentication.form.button.back',
              })}
            </SecondaryButton>
            <PrimaryButton data-cy="done" onClick={done}>
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
