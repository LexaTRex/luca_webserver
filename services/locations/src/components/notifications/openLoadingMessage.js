import React from 'react';
import styled from 'styled-components';
import { message, Progress } from 'antd';

const MessageProgressWrapper = styled.div`
  display: inline-block;

  width: 600px;
`;

export const LOADING_MESSAGE = 'loadingMessage';

export const openLoadingMessage = (progress, messageText) =>
  message.loading({
    content: (
      <MessageProgressWrapper>
        {messageText}
        <Progress percent={progress} strokeColor="#303d4b" />
      </MessageProgressWrapper>
    ),
    duration: 0,
    key: 'loadingMessage',
  });
