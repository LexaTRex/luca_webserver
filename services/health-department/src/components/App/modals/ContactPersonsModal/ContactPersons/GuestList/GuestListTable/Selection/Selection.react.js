import React from 'react';
import { Checkbox } from 'antd';

import { Wrapper } from './Selection.styled';

export const Selection = ({ trace, onSelectionUpdate, checked }) => (
  <Wrapper>
    <Checkbox
      onChange={() => onSelectionUpdate(trace.traceId)}
      checked={checked}
      style={{ marginTop: 16 }}
    />
  </Wrapper>
);
