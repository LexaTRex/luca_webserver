import React from 'react';
import { Checkbox, Select } from 'antd';

import {
  StyledContainer,
  StyledFilterTitle,
  StyledOptionTitle,
  StyledOptionContainer,
} from './Filter.styled';

const SelectStyles = {
  marginBottom: 24,
};

const { Option } = Select;

function FilterTagRender({ label }) {
  return label;
}

export function Filter({
  active,
  onChange,
  title = '',
  options = [],
  multiple = false,
}) {
  return (
    <StyledContainer>
      <StyledFilterTitle>{title}</StyledFilterTitle>
      <Select
        showArrow
        value={active}
        maxTagCount={1}
        showSearch={false}
        className="filter"
        onChange={onChange}
        style={SelectStyles}
        maxTagPlaceholder="..."
        dropdownClassName="filter"
        tagRender={FilterTagRender}
        mode={multiple ? 'multiple' : 'single'}
      >
        {options.map(filterOption => {
          return (
            <Option value={filterOption.value} key={filterOption.value}>
              <StyledOptionContainer>
                {multiple && (
                  <Checkbox checked={active.includes(filterOption.value)} />
                )}
                <StyledOptionTitle>{filterOption.intl}</StyledOptionTitle>
              </StyledOptionContainer>
            </Option>
          );
        })}
      </Select>
    </StyledContainer>
  );
}
