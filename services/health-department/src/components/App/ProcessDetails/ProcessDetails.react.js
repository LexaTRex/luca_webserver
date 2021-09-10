import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';

import { getProcess } from 'network/api';
import { useKeyLoader } from 'components/hooks/useKeyLoader';

// Components
import { BackButton } from './BackButton';
import { HeaderRow } from './HeaderRow';
import { InfoRow } from './InfoRow';
import { Note } from './Note';
import { History } from './History';
import { PageWrapper, ContentWrapper } from './ProcessDetails.styled';

export const ProcessDetails = () => {
  const { processId } = useParams();
  const { keysData, isLoading: isLoadingKey, error: keyError } = useKeyLoader();
  const {
    isLoading: isLoadingProcess,
    error: processError,
    data: process,
  } = useQuery(`process${processId}`, () => getProcess(processId), {
    cacheTime: 0,
    staleTime: 60000,
    refetchInterval: 60000,
    retry: false,
  });

  if (processError || keyError) return null;
  if (isLoadingProcess || isLoadingKey) return null;

  return (
    <PageWrapper>
      <ContentWrapper>
        <BackButton />
        <HeaderRow process={process} />
        <InfoRow process={process} />
        <Note process={process} keysData={keysData} processId={processId} />
        <History process={process} />
      </ContentWrapper>
    </PageWrapper>
  );
};
