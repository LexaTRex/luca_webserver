import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';

import { getProcess } from 'network/api';
import { useKeyLoader } from 'components/hooks/useKeyLoader';

// Components
import { BackButton } from './BackButton';
import { HeaderRow } from './HeaderRow';
import { InfoRow } from './InfoRow';
import { History } from './History';
import { PageWrapper, ContentWrapper } from './ProcessDetails.styled';

export const ProcessDetails = () => {
  const { processId } = useParams();
  const { isLoading: isLoadingKey, error: keyError } = useKeyLoader();

  const {
    isLoading: isLoadingProcess,
    error: processError,
    data: process,
    refetch,
  } = useQuery(`process${processId}`, () => getProcess(processId), {
    cacheTime: 0,
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
        <History process={process} refetch={refetch} />
      </ContentWrapper>
    </PageWrapper>
  );
};
