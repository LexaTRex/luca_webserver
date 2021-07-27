import React, { useCallback, useEffect, useState } from 'react';

import { notification } from 'antd';
import { useIntl } from 'react-intl';
import { v1 as generateUUID } from 'uuid';

import { getSormasClient } from 'network/sormas';
import { getSORMASCaseUIURL } from 'utils/sormas';
import { useModal } from 'components/hooks/useModal';

import { CaseWrapper } from './SormasModal.styled';

import { SelectCaseStep } from './SelectCaseStep';
import { CredentialsStep } from './CredentialsStep';
import { ExportProgressStep } from './ExportProgressStep';

export function SormasModal({ traces, location }) {
  const intl = useIntl();
  const [, closeModal] = useModal();
  const [sormasClient, setSORMASClient] = useState();
  const [currentStep, setCurrentStep] = useState(0);
  const [clientInformation, setClientInformation] = useState({});

  useEffect(() => {
    if (Object.keys(clientInformation || {}).length > 0) {
      setSORMASClient(
        getSormasClient(
          clientInformation.host,
          clientInformation.username,
          clientInformation.password
        )
      );
      setCurrentStep(1);
      return;
    }

    setCurrentStep(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Object.keys(clientInformation || {}).length, setCurrentStep]);

  const onSelectCase = useCallback(
    async sormasCase => {
      try {
        setCurrentStep(2);
        const {
          reportingUser: { uuid },
        } = await sormasClient.getCaseByUUID(sormasCase);

        const newTraces = traces.map(trace => ({
          uuid: generateUUID().toUpperCase(),
          ...trace,
        }));

        await sormasClient.personsPush(newTraces);
        await sormasClient.contactsPush(
          sormasCase,
          uuid,
          location.name,
          newTraces
        );
        notification.open({
          type: 'success',
          message: (
            <>
              <p>
                {intl.formatMessage({
                  id: 'modal.sormas.successfulExport',
                })}
              </p>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={getSORMASCaseUIURL(clientInformation.host, sormasCase)}
              >
                {intl.formatMessage({
                  id: 'modal.sormas.toCase',
                })}
              </a>
            </>
          ),
        });
        closeModal();
      } catch {
        setCurrentStep(1);
        notification.open({
          type: 'error',
          message: intl.formatMessage({
            id: 'modal.sormas.failedExport.headline',
          }),
          description: intl.formatMessage({
            id: 'modal.sormas.failedExport.description',
          }),
        });
      }
    },
    [
      intl,
      traces,
      closeModal,
      sormasClient,
      location.name,
      clientInformation.host,
    ]
  );

  const steps = [
    <CredentialsStep key="0" onFinish={setClientInformation} />,
    <SelectCaseStep
      key="1"
      client={sormasClient}
      onSelectCase={onSelectCase}
    />,
    <ExportProgressStep key="2" />,
  ];

  return <CaseWrapper>{steps[currentStep]}</CaseWrapper>;
}
