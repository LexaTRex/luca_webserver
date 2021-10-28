import React from 'react';
import { useIntl } from 'react-intl';
import {
  FAQ_LINK,
  INTELIGENT_CONTACT_TRACING_VIDEO,
  INTELIGENT_CONTACT_TRACING_PRESENTATION,
  HEALTH_DEPARTMENT_HANDOUT,
  SHARE_HISTORY_HELP_LINK,
  LUCA_LOCATIONS_HANDOUT,
} from 'constants/links';

import { ReactComponent as ExternalSvg } from 'assets/external.svg';
import { Wrapper, LinkWrapper, LinkText, StyledIcon } from './Links.styled';

export const Links = () => {
  const intl = useIntl();
  const links = [
    { url: FAQ_LINK, intlId: 'helpCenter.services.faq' },
    {
      url: INTELIGENT_CONTACT_TRACING_VIDEO,
      intlId: 'helpCenter.services.contactTracingVideo',
    },
    {
      url: INTELIGENT_CONTACT_TRACING_PRESENTATION,
      intlId: 'helpCenter.services.contactTracingPresentation',
    },
    {
      url: HEALTH_DEPARTMENT_HANDOUT,
      intlId: 'helpCenter.services.hdHandout',
    },
    {
      url: SHARE_HISTORY_HELP_LINK,
      intlId: 'helpCenter.services.shareHistoryHelpLink',
    },
    {
      url: LUCA_LOCATIONS_HANDOUT,
      intlId: 'helpCenter.services.locationsHandout',
    },
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
