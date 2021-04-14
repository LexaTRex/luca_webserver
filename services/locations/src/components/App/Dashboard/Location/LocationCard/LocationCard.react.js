import React, { useState } from 'react';
import { Collapse } from 'antd';
import { UpOutlined } from '@ant-design/icons';
import {
  StyledTitle,
  StyledContainer,
  StyledPlaceholder,
} from './LocationCard.styled';

const { Panel } = Collapse;
const CONTENT_KEY = 'CONTENT';

export const LocationCard = ({
  title,
  testId,
  children,
  open = false,
  isCollapse = false,
}) => {
  const [isOpen, setIsOpen] = useState(open);
  if (!isCollapse) {
    return (
      <StyledContainer>
        <StyledTitle showBorder>{title}</StyledTitle>
        {children}
        <StyledPlaceholder />
      </StyledContainer>
    );
  }

  return (
    <StyledContainer data-cy={`locationCard-${testId}`}>
      <Collapse
        bordered={false}
        className={`locationCard ${isOpen ? 'locationCard-open' : ''}`}
        defaultActiveKey={open ? [CONTENT_KEY] : []}
        expandIconPosition="right"
        style={{
          background: 'transparent',
        }}
        onChange={key => setIsOpen(key.length > 0)}
        expandIcon={({ isActive }) => (
          <UpOutlined
            rotate={isActive ? 0 : 180}
            style={{ top: 32, fontSize: 14 }}
          />
        )}
      >
        <Panel key={CONTENT_KEY} header={<StyledTitle>{title}</StyledTitle>}>
          {children}
          <StyledPlaceholder />
        </Panel>
      </Collapse>
    </StyledContainer>
  );
};
