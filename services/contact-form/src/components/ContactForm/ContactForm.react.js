import React from 'react';
import { useIntl } from 'react-intl';
import { Helmet } from 'react-helmet-async';

import { InputForm } from 'components/InputForm';

import {
  RegistrationWrapper,
  RegistrationCard,
  Headline,
} from './ContactForm.styled';

export const ContactForm = ({ scanner, formId }) => {
  const intl = useIntl();

  return (
    <>
      <Helmet>
        <title>{intl.formatMessage({ id: 'contactForm.site.title' })}</title>
        <meta
          name="description"
          content={intl.formatMessage({ id: 'contactForm.site.meta' })}
        />
      </Helmet>
      <RegistrationWrapper>
        <RegistrationCard>
          <Headline>{scanner.name}</Headline>
          <InputForm scanner={scanner} formId={formId} />
        </RegistrationCard>
      </RegistrationWrapper>
    </>
  );
};
