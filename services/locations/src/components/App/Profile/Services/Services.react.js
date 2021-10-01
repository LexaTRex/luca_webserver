import React from 'react';
import { useIntl } from 'react-intl';
import { Tooltip } from 'antd';

import { getDownloadLinks, getExternalLinks } from './Services.helper';
import { Content, Heading, Wrapper, Link, Text } from './Services.styled';

export const Services = ({ supportCode }) => {
  const intl = useIntl();

  const downloadLinks = getDownloadLinks(intl);

  const externalLinks = getExternalLinks(intl);

  return (
    <Content>
      <Heading>
        {intl.formatMessage({ id: 'profile.services.overview' })}
      </Heading>
      <Wrapper>
        {downloadLinks.map(downloadLink => (
          <Link
            key={downloadLink.intlId}
            data-cy={downloadLink.dataCy}
            download={downloadLink.download}
            href={downloadLink.href}
          >
            {downloadLink.intlId}
          </Link>
        ))}
        {externalLinks.map(externalLink => (
          <Link
            key={externalLink.intlId}
            data-cy={externalLink.dataCy}
            target="_blank"
            rel="noopener noreferrer"
            href={externalLink.href}
          >
            {externalLink.intlId}
          </Link>
        ))}
        <Tooltip placement="topLeft" title={supportCode}>
          <Text>
            {intl.formatMessage({ id: 'profile.services.supportCode' })}
          </Text>
        </Tooltip>
      </Wrapper>
    </Content>
  );
};
