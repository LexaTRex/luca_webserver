import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { message, Tooltip } from 'antd';
import { SecondaryButton } from 'components/general/Buttons.styled';

import { QuestionCircleOutlined } from '@ant-design/icons';

import { useWorker } from 'components/hooks/useWorker';
import { downloadPDF } from 'utils/downloadPDF';
import { getPDFWorker } from 'utils/workers';

import { LOADING_MESSAGE } from 'components/notifications';

import { LocationCard, CardSection, CardSectionTitle } from '../LocationCard';
import { Switch } from '../../Switch';

import { QRCodeCSVDownload } from './GenerateQRCodes.helper';
import { QrPrint } from './QrPrint';
import {
  StyledSwitchContainer,
  ButtonWrapper,
  CWASwitchLabel,
  CWASwitchWrapper,
  linkInfoButton,
  StyledCSVWrapper,
} from './GenerateQRCodes.styled';

const TABLE_QR_CODE = 'TABLE_QR_CODE';
const LOCATION_QR_CODE = 'LOCATION_QR_CODE';

export function GenerateQRCodes({ location }) {
  const intl = useIntl();
  const [isDownloading, setIsDownloading] = useState(false);
  const [isCWAEventEnabled, setIsCWAEventEnabled] = useState(true);
  const [isLocationQRCodeEnabled, setIsLocationQRCodeEnabled] = useState(
    !location.tableCount
  );
  const [isTableQRCodeEnabled, setIsTableQRCodeEnabled] = useState(
    !!location.tableCount
  );

  const worker = useRef(getPDFWorker());
  const cleanup = useCallback(() => {
    message.destroy(LOADING_MESSAGE);
  }, []);
  const pdfWorkerApiReference = useWorker(worker.current, cleanup);

  useEffect(() => {
    setIsLocationQRCodeEnabled(!location.tableCount);
    setIsTableQRCodeEnabled(!!location.tableCount);
  }, [location.tableCount]);

  const switchQRCodeSettings = useCallback(
    qrCodeType => {
      if (qrCodeType === TABLE_QR_CODE) {
        if (isTableQRCodeEnabled) {
          setIsTableQRCodeEnabled(false);
          setIsLocationQRCodeEnabled(false);
          return;
        }

        setIsTableQRCodeEnabled(true);
        setIsLocationQRCodeEnabled(false);
        return;
      }

      if (isLocationQRCodeEnabled) {
        setIsTableQRCodeEnabled(false);
        setIsLocationQRCodeEnabled(false);
        return;
      }

      setIsTableQRCodeEnabled(false);
      setIsLocationQRCodeEnabled(true);
    },
    [isLocationQRCodeEnabled, isTableQRCodeEnabled]
  );

  const downloadOptions = {
    setIsDownloading,
    pdfWorkerApiReference,
    location,
    intl,
    isTableQRCodeEnabled,
    isCWAEventEnabled,
  };
  const triggerDownload = () => downloadPDF(downloadOptions);

  return (
    <LocationCard
      isCollapse
      title={intl.formatMessage({ id: 'settings.location.qrcode.headline' })}
      testId="generateQRCodes"
    >
      <CardSection>
        <CardSectionTitle>
          {intl.formatMessage({
            id: 'settings.location.qrcode.location.headline',
          })}
          <StyledSwitchContainer>
            <Switch
              checked={isLocationQRCodeEnabled}
              onChange={() => switchQRCodeSettings(LOCATION_QR_CODE)}
              data-cy="toggleAreaQRCodes"
            />
          </StyledSwitchContainer>
        </CardSectionTitle>
      </CardSection>
      {location.tableCount && (
        <CardSection>
          <CardSectionTitle>
            {intl.formatMessage({
              id: 'settings.location.qrcode.tables.headline',
            })}
            <StyledSwitchContainer>
              <Switch
                checked={isTableQRCodeEnabled}
                disabled={!location.tableCount}
                onChange={() => switchQRCodeSettings(TABLE_QR_CODE)}
                data-cy="switchTables"
              />
            </StyledSwitchContainer>
          </CardSectionTitle>
        </CardSection>
      )}
      <CardSection direction="end" isLast>
        <ButtonWrapper>
          <CWASwitchWrapper>
            <CWASwitchLabel>
              {intl.formatMessage({ id: 'location.setting.qr.compatibility' })}
              <Tooltip
                placement="top"
                title={intl.formatMessage({
                  id: 'settings.location.qrcode.cwaInfoText',
                })}
              >
                <QuestionCircleOutlined style={linkInfoButton} />
              </Tooltip>
            </CWASwitchLabel>
            <Switch
              checked={isCWAEventEnabled}
              onChange={() => setIsCWAEventEnabled(!isCWAEventEnabled)}
            />
          </CWASwitchWrapper>
          <SecondaryButton
            style={{ marginBottom: '10px' }}
            loading={isDownloading}
            onClick={triggerDownload}
            disabled={!isLocationQRCodeEnabled && !isTableQRCodeEnabled}
            data-cy="qrCodeDownload"
          >
            {intl.formatMessage({ id: 'settings.location.qrcode.generate' })}
          </SecondaryButton>
          <StyledCSVWrapper>
            <QRCodeCSVDownload
              location={location}
              isCWAEventEnabled={isCWAEventEnabled}
              downloadTableQRCodes={isTableQRCodeEnabled}
            />
            <Tooltip
              placement="top"
              title={intl.formatMessage({
                id: 'settings.location.qrcode.infoText',
              })}
            >
              <QuestionCircleOutlined style={linkInfoButton} />
            </Tooltip>
          </StyledCSVWrapper>
        </ButtonWrapper>
      </CardSection>
      <QrPrint />
    </LocationCard>
  );
}
