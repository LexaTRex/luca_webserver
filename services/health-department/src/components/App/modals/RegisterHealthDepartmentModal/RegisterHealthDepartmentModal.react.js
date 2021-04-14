import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useIntl } from 'react-intl';
import { Steps } from 'antd';

import { EC_KEYPAIR_GENERATE, hexToBase64 } from '@lucaapp/crypto';
import { getPrivateKeySecret, storeKeys } from 'network/api';

// Hooks
import { useModal } from 'components/hooks/useModal';

// Components
import { storeHealthDepartmentPrivateKeys } from 'utils/cryptoKeyOperations';
import { GenerateKeysStep } from './GenerateKeysStep';
import { CompleteStep } from './CompleteStep';

export const RegisterHealthDepartmentModal = ({ onFinish }) => {
  const intl = useIntl();
  const [, closeModal] = useModal();
  const [currentStep, setCurrentStep] = useState(0);
  const [HDEKP, setHDEKP] = useState(null);
  const [HDSKP, setHDSKP] = useState(null);

  const {
    isError,
    isLoading,
    data: privateKeySecret,
  } = useQuery('privateKeySecret', () => getPrivateKeySecret());

  const proceed = () => {
    return storeKeys({
      publicHDEKP: hexToBase64(HDEKP.publicKey),
      publicHDSKP: hexToBase64(HDSKP.publicKey),
    })
      .then(() => {
        setCurrentStep(currentStep + 1);
        storeHealthDepartmentPrivateKeys(HDEKP.privateKey, HDSKP.privateKey);
      })
      .catch(error => console.error(error));
  };

  useEffect(() => {
    setHDEKP(EC_KEYPAIR_GENERATE());
    setHDSKP(EC_KEYPAIR_GENERATE());
  }, []);

  const steps = [
    {
      title: intl.formatMessage({
        id: 'modal.registerHealthDepartment.step0.title',
      }),
      content: (
        <GenerateKeysStep
          proceed={() => {
            proceed();
          }}
          hdekp={HDEKP}
          hdskp={HDSKP}
          privateKeySecret={privateKeySecret}
        />
      ),
    },
    {
      title: intl.formatMessage({
        id: 'modal.registerHealthDepartment.step1.title',
      }),
      content: (
        <CompleteStep
          closeModal={() => {
            closeModal();
            onFinish();
          }}
        />
      ),
    },
  ];

  if (!HDEKP || !HDSKP || isError || isLoading) return null;

  return (
    <>
      <Steps
        progressDot
        current={currentStep}
        style={{
          marginTop: 16,
          marginBottom: 48,
        }}
      >
        {steps.map(step => (
          <Steps.Step key={step.title} title={step.title} />
        ))}
      </Steps>
      {steps[currentStep].content}
    </>
  );
};
