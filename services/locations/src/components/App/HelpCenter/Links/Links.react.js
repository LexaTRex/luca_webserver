import React from 'react';
import { useIntl } from 'react-intl';
import { LICENSES_ROUTE } from 'constants/routes';
import { FAQ_LINK, VIDEOS_LINK, TOOLKIT_LINK } from 'constants/links';

import { ReactComponent as ExternalSvg } from 'assets/external.svg';
import { Wrapper, LinkWrapper, LinkText, StyledIcon } from './Links.styled';

export const Links = () => {
  const intl = useIntl();
  const links = [
    {
      url: VIDEOS_LINK,
      intlId: 'profile.services.videos',
      testId: 'supportVideoLink',
    },
    { url: FAQ_LINK, intlId: 'profile.services.faq', testId: 'faqLink' },
    {
      url: TOOLKIT_LINK,
      intlId: 'profile.services.toolkit',
      testId: 'toolkitLink',
    },
    { url: LICENSES_ROUTE, intlId: 'license.license', testId: 'licenseLink' },
  ];

  return (
    <Wrapper data-cy="helpCenterLinks">
      {links.map(link => (
        <LinkWrapper key={link.intlId}>
          <LinkText
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            data-cy={link.testId}
          >
            {intl.formatMessage({ id: link.intlId })}
            <StyledIcon component={ExternalSvg} />
          </LinkText>
        </LinkWrapper>
      ))}
    </Wrapper>
  );
};
