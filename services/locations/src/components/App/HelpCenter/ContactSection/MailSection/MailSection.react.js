import React from 'react';
import { useIntl } from 'react-intl';

import { useModal } from 'components/hooks/useModal';

import { ContactFormModal } from 'components/App/modals/ContactFormModal';
import { SecondaryButton } from 'components/general';
import { ArrowRightOutlined } from '@ant-design/icons';

import {
  Wrapper,
  Heading,
  Text,
  StyledMailOutlined,
} from './MailSection.styled';

export const MailSection = ({ operator }) => {
  const intl = useIntl();
  const [openModal] = useModal();

  const openContactForm = () => {
    openModal({
      content: <ContactFormModal operator={operator} />,
    });
  };
  return (
    <Wrapper>
      <StyledMailOutlined />
      <Heading>{intl.formatMessage({ id: 'helpCenter.mail.heading' })}</Heading>
      <Text>{intl.formatMessage({ id: 'helpCenter.mail.text' })}</Text>
      <SecondaryButton onClick={openContactForm}>
        {intl.formatMessage({ id: 'helpCenter.mail.buttonText' })}
        <ArrowRightOutlined />
      </SecondaryButton>
    </Wrapper>
  );
};
