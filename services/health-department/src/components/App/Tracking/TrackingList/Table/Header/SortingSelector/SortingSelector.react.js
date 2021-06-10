import React from 'react';
import { CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons';

import { IconStyle, SortingButton } from './SortingSelector.styled';

export const SortingSelector = ({ onClick }) => {
  return (
    <SortingButton
      onClick={onClick}
      onKeyDown={event => {
        if (event.key === 'Enter') {
          onClick();
        }
      }}
      role="button"
      tabIndex={0}
    >
      <CaretUpOutlined style={IconStyle} />
      <CaretDownOutlined style={IconStyle} />
    </SortingButton>
  );
};
