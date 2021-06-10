import React from 'react';
import { useIntl } from 'react-intl';
import NewsSVG from 'assets/News.svg';
import { Button } from 'antd';
import {
  Wrapper,
  StyledImage,
  Headline,
  Content,
  buttonStyles,
} from './WhatsNewModal.styled';

export const WhatsNewModal = ({ headline, content, onAccept }) => {
  const intl = useIntl();

  return (
    <Wrapper>
      <StyledImage src={NewsSVG} />
      <Headline>{headline}</Headline>
      <Content>{content}</Content>
      <Button style={buttonStyles} onClick={onAccept}>
        {intl.formatMessage({ id: 'whatsNew.accept' })}
      </Button>
    </Wrapper>
  );
};
