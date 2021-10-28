import React, { useEffect, useState } from 'react';

import { Alert } from 'antd';
import { useIntl } from 'react-intl';
import { Helmet } from 'react-helmet-async';
import { useQuery } from 'react-query';
import { useParams, useHistory } from 'react-router-dom';

import { usePrivateKey } from 'utils/privateKey';
import {
  getAllUncompletedTransfers,
  getLocationTransfer,
  getPrivateKeySecret,
} from 'network/api';

import { Header } from 'components/Header';

import { LOGIN_ROUTE, BASE_DATA_TRANSFER_ROUTE } from 'constants/routes';
import {
  Content,
  Main,
  RequestWrapper,
  StyledSecondaryButton,
} from './ShareData.styled';
import { PrivateKeyStep } from './PrivateKeyStep';
import { ShareDataStep } from './ShareDataStep';
import { FinishStep } from './FinishStep';
import { LocationFooter } from '../App/LocationFooter';

export const ShareData = () => {
  const intl = useIntl();
  const history = useHistory();
  const { transferId } = useParams();
  const [currentStep, setCurrentStep] = useState(0);
  const [privateKey, setPrivateKey] = useState();
  const [isPrivateKeyPreloaded, setIsPrivateKeyPreloaded] = useState(false);
  const { error: privateKeyError, data: privateKeySecret } = useQuery(
    'privateKeySecret',
    getPrivateKeySecret,
    {
      retry: false,
    }
  );
  if (privateKeyError) {
    history.push(LOGIN_ROUTE);
  }
  const [existingPrivateKey] = usePrivateKey(privateKeySecret);
  const { isLoading, error, data: transfers } = useQuery(
    `uncompletedTransfers/${transferId}`,
    () => {
      if (transferId) {
        return getLocationTransfer(transferId).then(response => {
          return [response];
        });
      }

      return getAllUncompletedTransfers().then(response => {
        return response;
      });
    }
  );

  useEffect(() => {
    if (existingPrivateKey) {
      if (!privateKey) {
        setCurrentStep(1);
        setIsPrivateKeyPreloaded(true);
      }
      setPrivateKey(existingPrivateKey);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [existingPrivateKey]);

  const progressStep = () => setCurrentStep(currentStep + 1);

  const setKey = key => setPrivateKey(key);

  if (isLoading || error) return null;

  const steps = [
    {
      id: '0',
      content: (
        <PrivateKeyStep
          next={progressStep}
          title={intl.formatMessage({ id: 'shareData.privateKeyStep.title' })}
          setPrivateKey={setKey}
          publicKey={transfers[0]?.location?.publicKey}
        />
      ),
    },
    {
      id: '1',
      content: (
        <ShareDataStep
          next={progressStep}
          transfers={transfers}
          privateKey={privateKey}
          showStepLabel={!isPrivateKeyPreloaded}
          title={intl.formatMessage({ id: 'shareData.shareDataStep.title' })}
        />
      ),
    },
    {
      id: '2',
      content: <FinishStep />,
    },
  ];

  const backToLocations = () => history.push(BASE_DATA_TRANSFER_ROUTE);

  const getHeaderActions = () => (
    <StyledSecondaryButton onClick={backToLocations}>
      {intl.formatMessage({ id: 'shareData.backToLocations' })}
    </StyledSecondaryButton>
  );

  return (
    <>
      <Helmet>
        <title>{intl.formatMessage({ id: 'shareData.site.title' })}</title>
        <meta
          name="description"
          content={intl.formatMessage({ id: 'shareData.site.meta' })}
        />
      </Helmet>
      <Main style={{ backgroundColor: 'black' }}>
        <Header
          title={intl.formatMessage({ id: 'shareData.header.title' })}
          actions={getHeaderActions()}
        />
        {error?.status === 410 && (
          <Alert
            style={{ textAlign: 'center', marginTop: 48 }}
            type="success"
            message={intl.formatMessage({ id: 'shareData.completed' })}
          />
        )}
        {error?.status > 400 && error?.status !== 410 && (
          <Alert
            style={{ textAlign: 'center', marginTop: 48 }}
            type="error"
            message={intl.formatMessage({ id: 'shareData.noData' })}
          />
        )}
        <Content>
          {!error && transfers && (
            <RequestWrapper>
              <>{steps[currentStep].content}</>
            </RequestWrapper>
          )}
        </Content>
        <LocationFooter color="#fff" />
      </Main>
    </>
  );
};
