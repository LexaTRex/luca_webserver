import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Steps, Alert } from 'antd';
import { useHistory } from 'react-router';
import { useIntl } from 'react-intl';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';

import { getLocationTransferGroup, getLocationTransfer } from 'network/api';
import { BASE_GROUP_ROUTE } from 'constants/routes';
// Components
import { Header } from 'components/Header';
import { RequestWrapper, RequestTitle, Main } from './GroupShareData.styled';
import { PrivateKeyStep } from './PrivateKeyStep';
import { ShareDataStep } from './ShareDataStep';
import { FinishStep } from './FinishStep';

export const GroupShareData = () => {
  const intl = useIntl();
  const history = useHistory();
  const [currentStep, setCurrentStep] = useState(0);
  const [privateKey, setPrivateKey] = useState(null);

  const { transferGroupId } = useParams();

  const title = intl.formatMessage({ id: 'shareData.site.title' });
  const meta = intl.formatMessage({ id: 'shareData.site.meta' });

  const { isLoading, error, data: transfers } = useQuery(
    `locationTransferGroup/${transferGroupId}`,
    async () => {
      const response = await getLocationTransferGroup(transferGroupId);
      if (response.status >= 400) {
        return { status: response.status };
      }
      const { transfers: transferIds } = await response.json();

      return Promise.all(
        transferIds.map(transferId =>
          getLocationTransfer(transferId).then(transferResponse =>
            transferResponse.json()
          )
        )
      );
    }
  );

  const progressStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const onPrivateKeyStepFinish = key => {
    setPrivateKey(key);
    progressStep();
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
          onFinish={onPrivateKeyStepFinish}
          publicKey={transfers && transfers[0]?.location?.publicKey}
          title={intl.formatMessage({ id: 'shareData.privateKeyStep.title' })}
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
        {(transfers?.status > 400 || transfers?.length === 0) && (
          <Alert
            style={{ textAlign: 'center', marginTop: 48 }}
            type="error"
            message={intl.formatMessage({ id: 'shareData.noData' })}
          />
        )}
        {transfers && !transfers.status && (
          <RequestWrapper>
            <RequestTitle>
              {intl.formatMessage(
                { id: 'shareData.mainTitle' },
                { healthDepartment: transfers[0].department.name }
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
