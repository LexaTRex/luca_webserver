import React from 'react';
import { useIntl } from 'react-intl';

import { VersionFooter } from 'components/App/VersionFooter';

import { NavigationButton } from './NavigationButton';
import { Links } from './Links';
import { ContactSection } from './ContactSection';

import {
  ContentWrapper,
  Wrapper,
  Header,
  CardWrapper,
} from './HelpCenter.styled';

export const HelpCenter = ({ profileData }) => {
  const intl = useIntl();
  return (
    <Wrapper>
      <ContentWrapper>
        <CardWrapper>
          <NavigationButton />
          <Header>{intl.formatMessage({ id: 'helpCenter.title' })}</Header>
          <Links />
          <ContactSection profileData={profileData} />
        </CardWrapper>
      </ContentWrapper>
      <VersionFooter />
    </Wrapper>
  );
};
