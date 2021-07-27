import React from 'react';

import { useIntl } from 'react-intl';
import { GITLAB_LINK } from 'constants/links';

import { GitlabWrapper, GitLabLink } from './GitlabLink.styled';

export const GitlabLink = () => {
  const intl = useIntl();
  return (
    <GitlabWrapper>
      <GitLabLink href={GITLAB_LINK} target="_blank" rel="noopener noreferrer">
        {intl.formatMessage({
          id: 'commitHashVersionDisplay.gitlab',
        })}
      </GitLabLink>
    </GitlabWrapper>
  );
};
