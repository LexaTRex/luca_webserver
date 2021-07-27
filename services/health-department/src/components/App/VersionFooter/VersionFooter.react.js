import React from 'react';
import { useQuery } from 'react-query';
import { useIntl } from 'react-intl';
import { GITLAB_LINK } from 'constants/links';
import { getVersion } from 'network/static';

import { FooterWrapper, GitlabLink, InfoWrapper } from './VersionFooter.styled';

export const VersionFooter = () => {
  const intl = useIntl();
  const { isSuccess: loaded, data: info } = useQuery('version', getVersion, {
    refetchOnWindowFocus: false,
  });

  const nameVersionCommitHash = `${intl.formatMessage({
    id: 'commitHashVersionDisplay.lucaHealthDepartment',
  })} (${info?.version}-${info?.commit})`;

  return (
    <FooterWrapper>
      {loaded && <InfoWrapper>{nameVersionCommitHash}</InfoWrapper>}
      <wbr />
      <GitlabLink href={GITLAB_LINK} target="_blank">
        {intl.formatMessage({
          id: 'commitHashVersionDisplay.gitlab',
        })}
      </GitlabLink>
    </FooterWrapper>
  );
};
