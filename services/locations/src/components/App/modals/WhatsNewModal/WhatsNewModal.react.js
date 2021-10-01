import React from 'react';
import { useIntl } from 'react-intl';
import NewsSVG from 'assets/News.svg';
import { PrimaryButton } from 'components/general';
import {
  Wrapper,
  StyledImage,
  Headline,
  Content,
} from './WhatsNewModal.styled';

export const WhatsNewModal = ({ headline, content, onAccept }) => {
  const intl = useIntl();

  return (
    <Wrapper>
      <StyledImage src={NewsSVG} />
      <Headline>{headline}</Headline>
      <Content>{content}</Content>
      <PrimaryButton
        $isButtonWhite
        style={{ float: 'right' }}
        onClick={onAccept}
      >
        {intl.formatMessage({ id: 'whatsNew.accept' })}
      </PrimaryButton>
    </Wrapper>
  );
};
