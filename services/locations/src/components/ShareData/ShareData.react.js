import React, { useEffect, useState } from 'react';

import { Alert } from 'antd';
import { useIntl } from 'react-intl';
import { Helmet } from 'react-helmet';
import { useQuery } from 'react-query';
import { useHistory } from 'react-router';
import { useParams } from 'react-router-dom';

import { usePrivateKey } from 'utils/privateKey';
import { BASE_GROUP_ROUTE } from 'constants/routes';
import {
  getAllUncompletedTransfers,
  getLocationTransfer,
  getPrivateKeySecret,
} from 'network/api';

// Components
import { Header } from 'components/Header';

import { Content, Main, RequestWrapper } from './ShareData.styled';
import { PrivateKeyStep } from './PrivateKeyStep';
import { ShareDataStep } from './ShareDataStep';
import { FinishStep } from './FinishStep';

export const ShareData = () => {
  const intl = useIntl();
  const history = useHistory();
  const { transferId } = useParams();
  const [privateKey, setPrivateKey] = useState();
  const [isPrivateKeyPreloaded, setIsPrivateKeyPreloaded] = useState(false);
  const { data: privateKeySecret } = useQuery(
    'privateKeySecret',
    getPrivateKeySecret,
    {
      retry: false,
    }
  );
  const [existingPrivateKey] = usePrivateKey(privateKeySecret);
  const [currentStep, setCurrentStep] = useState(0);

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

  const title = intl.formatMessage({ id: 'shareData.site.title' });
  const meta = intl.formatMessage({ id: 'shareData.site.meta' });

  const { isLoading, error, data: transfers } = useQuery(
    `uncompletedTransfers/${transferId}`,
    () => {
      if (transferId) {
        return getLocationTransfer(transferId).then(async response => {
          if (response.status > 400) {
            return { status: response.status };
          }
          return [await response.json()];
        });
      }

      return getAllUncompletedTransfers().then(response => {
        if (response.status > 400) {
          return { status: response.status };
        }

        return response.json();
      });
    }
  );

  const progressStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const setKey = key => {
    setPrivateKey(key);
  };

  const onDone = () => {
    history.push(BASE_GROUP_ROUTE);
  };

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
      content: <FinishStep done={onDone} />,
    },
  ];

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={meta} />
      </Helmet>
      <Main style={{ backgroundColor: 'black' }}>
        <Header title={intl.formatMessage({ id: 'shareData.header.title' })} />
        {transfers[0]?.status === 410 && (
          <Alert
            style={{ textAlign: 'center', marginTop: 48 }}
            type="success"
            message={intl.formatMessage({ id: 'shareData.completed' })}
          />
        )}
        {transfers[0]?.status > 400 && transfers[0]?.status !== 410 && (
          <Alert
            style={{ textAlign: 'center', marginTop: 48 }}
            type="error"
            message={intl.formatMessage({ id: 'shareData.noData' })}
          />
        )}
        <Content>
          {transfers && transfers[0] && !transfers[0].status && (
            <RequestWrapper>
              <>{steps[currentStep].content}</>
            </RequestWrapper>
          )}
        </Content>
      </Main>
    </>
  );
};
