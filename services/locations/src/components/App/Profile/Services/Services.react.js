import React from 'react';
import { useIntl } from 'react-intl';
import { Tooltip } from 'antd';

import { TERMS_CONDITIONS_LINK } from 'constants/links';
import { LICENSES_ROUTE } from 'constants/routes';
import AVV from 'assets/documents/luca_AVV.pdf';
import PRIVACY_MANDATORY from 'assets/documents/DSE_Luca_mandatory.pdf';
import PRIVACY_OPTIONAL from 'assets/documents/DSE_Luca_optional.pdf';

import { Content, Heading, Wrapper, Link, Text } from './Services.styled';

export const Services = ({ supportCode }) => {
  const intl = useIntl();

  return (
    <Content>
      <Heading>
        {intl.formatMessage({ id: 'profile.services.overview' })}
      </Heading>
      <Wrapper>
        <Link
          data-cy="privacyLinkMandatory"
          download={intl.formatMessage({
            id: 'downloadFile.profile.privacy',
          })}
          href={PRIVACY_MANDATORY}
        >
          {intl.formatMessage({
            id: 'profile.services.download.dataPrivacyMandatory',
          })}
        </Link>
        <Link
          data-cy="privacyLinkOptional"
          download={intl.formatMessage({
            id: 'downloadFile.profile.privacy',
          })}
          href={PRIVACY_OPTIONAL}
        >
          {intl.formatMessage({
            id: 'profile.services.download.dataPrivacyOptional',
          })}
        </Link>
        <Link
          download={intl.formatMessage({ id: 'downloadFile.profile.avv' })}
          href={AVV}
          data-cy="dpaLink"
        >
          {intl.formatMessage({ id: 'profile.services.download.avv' })}
        </Link>
        <Link
          data-cy="termsLink"
          target="_blank"
          rel="noopener noreferrer"
          href={TERMS_CONDITIONS_LINK}
        >
          {intl.formatMessage({ id: 'profile.services.agb' })}
        </Link>
        <Link target="_blank" rel="noopener noreferrer" href={LICENSES_ROUTE}>
          {intl.formatMessage({ id: 'license.license' })}
        </Link>
        <Tooltip placement="topLeft" title={supportCode}>
          <Text>
            {intl.formatMessage({ id: 'profile.services.supportCode' })}
          </Text>
        </Tooltip>
      </Wrapper>
    </Content>
  );
};
