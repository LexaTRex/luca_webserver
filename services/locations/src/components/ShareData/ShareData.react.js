import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Steps, Alert } from 'antd';
import { useHistory } from 'react-router';
import { useIntl } from 'react-intl';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';

import { getLocationTransfer } from 'network/api';
import { BASE_GROUP_ROUTE } from 'constants/routes';
// Components
import { Header } from 'components/Header';
import { RequestWrapper, RequestTitle, Main } from './ShareData.styled';
import { PrivateKeyStep } from './PrivateKeyStep';
import { ShareDataStep } from './ShareDataStep';
import { FinishStep } from './FinishStep';

export const ShareData = () => {
  const intl = useIntl();
  const history = useHistory();
  const [currentStep, setCurrentStep] = useState(0);
  const [privateKey, setPrivateKey] = useState('');

  const { transferId } = useParams();

  const title = intl.formatMessage({ id: 'shareData.site.title' });
  const meta = intl.formatMessage({ id: 'shareData.site.meta' });

  const { isLoading, error, data: locationTransfer } = useQuery(
    `locationTransfer/${transferId}`,
    () =>
      getLocationTransfer(transferId).then(response => {
        if (response.status > 400) {
          return { status: response.status };
        }
        return response.json();
      })
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
          publicKey={locationTransfer?.location?.publicKey}
        />
      ),
    },
    {
      id: '1',
      content: (
        <ShareDataStep
          next={progressStep}
          privateKey={privateKey}
          locationTransfer={locationTransfer}
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
        {locationTransfer?.status === 410 && (
          <Alert
            style={{ textAlign: 'center', marginTop: 48 }}
            type="success"
            message={intl.formatMessage({ id: 'shareData.completed' })}
          />
        )}
        {locationTransfer?.status > 400 && locationTransfer?.status !== 410 && (
          <Alert
            style={{ textAlign: 'center', marginTop: 48 }}
            type="error"
            message={intl.formatMessage({ id: 'shareData.noData' })}
          />
        )}
        {locationTransfer && !locationTransfer.status && (
          <RequestWrapper>
            <RequestTitle>
              {intl.formatMessage(
                { id: 'shareData.mainTitle' },
                { healthDepartment: locationTransfer.department.name }
              )}
            </RequestTitle>
            <Steps
              progressDot
              current={currentStep}
              style={{
                marginTop: 16,
                marginBottom: 48,
              }}
            >
              {steps.map(step => (
                <Steps.Step key={step.id} />
              ))}
            </Steps>
            {steps[currentStep].content}
          </RequestWrapper>
        )}
      </Main>
    </>
  );
};
