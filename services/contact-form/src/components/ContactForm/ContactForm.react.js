import React from 'react';
import { useIntl } from 'react-intl';
import { Helmet } from 'react-helmet';

// Components
import { InputForm } from 'components/InputForm';
import {
  RegistrationWrapper,
  RegistrationCard,
  Headline,
} from './ContactForm.styled';

export const ContactForm = ({ scanner }) => {
  const intl = useIntl();

  const title = intl.formatMessage({ id: 'contactForm.site.title' });
  const meta = intl.formatMessage({ id: 'contactForm.site.meta' });
  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={meta} />
      </Helmet>
      <RegistrationWrapper>
        <RegistrationCard>
          <Headline>{scanner.name}</Headline>
          <InputForm scanner={scanner} />
        </RegistrationCard>
      </RegistrationWrapper>
    </>
  );
};
