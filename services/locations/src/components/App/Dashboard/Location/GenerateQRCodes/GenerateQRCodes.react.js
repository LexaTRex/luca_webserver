import { useIntl } from 'react-intl';
import { useQuery } from 'react-query';
import React, { useCallback, useEffect, useState } from 'react';
import { Button, Tooltip } from 'antd';

import { QuestionCircleOutlined } from '@ant-design/icons';

import { getGroup } from 'network/api';

import { QrCodeDocument } from 'components/QrCodeDocument';
import { Switch } from '../../Switch';

import { LocationCard, CardSection, CardSectionTitle } from '../LocationCard';

import { QRCodeCSVDownload } from './GenerateQRCodes.helper';
import { QrPrint } from './QrPrint';
import {
  StyledSwitchContainer,
  buttonStyle,
  ButtonWrapper,
  CWASwitchLabel,
  linkInfoButton,
  StyledCSVWrapper,
  CWASwitchWrapper,
} from './GenerateQRCodes.styled';

const TABLE_QR_CODE = 'TABLE_QR_CODE';
const LOCATION_QR_CODE = 'LOCATION_QR_CODE';

export function GenerateQRCodes({ location }) {
  const intl = useIntl();
  const [isDownload, setIsDownload] = useState(false);
  const [isCWAEventEnabled, setIsCWAEventEnabled] = useState(true);
  const [isLocationQRCodeEnabled, setIsLocationQRCodeEnabled] = useState(
    !location.tableCount
  );
  const [isTableQRCodeEnabled, setIsTableQRCodeEnabled] = useState(
    !!location.tableCount
  );

  const { isLoading, error, data: group } = useQuery('group', () =>
    getGroup(location.groupId)
  );

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

  if (isLoading || error) return null;

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
          <Button
            style={buttonStyle}
            loading={isDownload}
            onClick={() => setIsDownload(true)}
            disabled={!isLocationQRCodeEnabled && !isTableQRCodeEnabled}
          >
            {intl.formatMessage({ id: 'settings.location.qrcode.generate' })}
          </Button>
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
      <QrCodeDocument
        location={location}
        group={group}
        isDownload={isDownload}
        setIsDownload={setIsDownload}
        isCWAEventEnabled={isCWAEventEnabled}
        downloadTableQRCodes={isTableQRCodeEnabled}
      />
    </LocationCard>
  );
}
