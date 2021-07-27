import React from 'react';
import { useQuery } from 'react-query';
import { useIntl } from 'react-intl';
import { GITLAB_LINK } from 'constants/links';
import { getVersion } from 'network/static';

import { FooterWrapper, GitlabLink, InfoWrapper } from './Footer.styled';

export const Footer = () => {
  const intl = useIntl();
  const { isSuccess: loaded, data: info } = useQuery('version', getVersion, {
    refetchOnWindowFocus: false,
  });

  return (
    <FooterWrapper>
      <GitlabLink href={GITLAB_LINK} target="_blank">
        {intl.formatMessage({
          id: 'commitHashVersionDisplay.gitlab',
        })}
      </GitlabLink>
      <wbr />
      {loaded && (
        <InfoWrapper>
          {intl.formatMessage({
            id: 'commitHashVersionDisplay.lucaHealthDepartment',
          })}
          <br />
          {`(${info?.version}-${info?.commit})`}
        </InfoWrapper>
      )}
    </FooterWrapper>
  );
};
