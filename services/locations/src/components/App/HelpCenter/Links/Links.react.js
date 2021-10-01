import React from 'react';
import { useIntl } from 'react-intl';
import { FAQ_LINK, VIDEOS_LINK, TOOLKIT_LINK } from 'constants/links';

import { ReactComponent as ExternalSvg } from 'assets/external.svg';
import { Wrapper, LinkWrapper, LinkText, StyledIcon } from './Links.styled';

export const Links = () => {
  const intl = useIntl();
  const links = [
    { url: VIDEOS_LINK, intlId: 'profile.services.videos' },
    { url: FAQ_LINK, intlId: 'profile.services.faq' },
    { url: TOOLKIT_LINK, intlId: 'profile.services.toolkit' },
  ];

  const openInNewTab = url => {
    window.open(url, '_blank').focus();
  };
  return (
    <Wrapper>
      {links.map(link => (
        <LinkWrapper key={link.intlId}>
          <LinkText onClick={() => openInNewTab(link.url)}>
            {intl.formatMessage({ id: link.intlId })}
            <StyledIcon component={ExternalSvg} />
          </LinkText>
        </LinkWrapper>
      ))}
    </Wrapper>
  );
};
