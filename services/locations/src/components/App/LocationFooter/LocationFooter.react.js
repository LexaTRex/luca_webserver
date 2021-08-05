import React from 'react';
import { useIntl } from 'react-intl';
import { useQuery } from 'react-query';

import { getVersion } from 'network/static';

import {
  FAQ_LINK,
  GITLAB_LINK,
  REGISTER_BADGE_PRIVACY_LINK,
} from 'constants/links';
import { Link, Version, Wrapper } from './LocationFooter.styled';

export function LocationFooter({
  color = '#000',
  title = 'Locations',
  showBadgePrivacy = false,
}) {
  const intl = useIntl();
  const { isSuccess, data: info } = useQuery('version', getVersion, {
    refetchOnWindowFocus: false,
  });

  return (
    <Wrapper>
      <Version color={color}>
        {isSuccess ? `luca ${title} (${info.version}#${info.commit})` : ''}
      </Version>
      {showBadgePrivacy && (
        <Link
          color={color}
          target="_blank"
          href={REGISTER_BADGE_PRIVACY_LINK}
          rel="noopener noreferrer"
        >
          {intl.formatMessage({ id: 'location.footer.privacy' })}
        </Link>
      )}
      <Link
        color={color}
        target="_blank"
        href={FAQ_LINK}
        rel="noopener noreferrer"
      >
        {intl.formatMessage({ id: 'location.footer.faq' })}
      </Link>
      <Link
        color={color}
        target="_blank"
        href={GITLAB_LINK}
        rel="noopener noreferrer"
      >
        {intl.formatMessage({ id: 'location.footer.repository' })}
      </Link>
    </Wrapper>
  );
}
