import React from 'react';
import { Checkbox } from 'antd';
import { useIntl } from 'react-intl';
import { truncateString } from 'utils/string';

import {
  StyledContainer,
  StyledFilterTitle,
  StyledOptionTitle,
  StyledOptionContainer,
  StyledSelect,
  StyledTag,
} from './Filter.styled';

const { Option } = StyledSelect;

function FilterTagRender({ label, closable, onClose }) {
  const onPreventMouseDown = event => {
    event.preventDefault();
    event.stopPropagation();
  };
  return (
    <StyledTag
      color="#4e6180"
      onMouseDown={onPreventMouseDown}
      closable={closable}
      onClose={onClose}
    >
      {label}
    </StyledTag>
  );
}
export const Filter = ({
  title = '',
  options = [],
  active,
  onChange,
  showSearch = false,
  optionFilterProp,
  filterOption,
  mode,
}) => {
  const intl = useIntl();
  return (
    <StyledContainer>
      <StyledFilterTitle>{title}</StyledFilterTitle>
      <StyledSelect
        showArrow
        value={active}
        onChange={onChange}
        showSearch={showSearch}
        optionFilterProp={optionFilterProp}
        filterOption={filterOption}
        mode={mode}
        maxTagCount={3}
        className="filter"
        maxTagPlaceholder="..."
        dropdownClassName="filter"
        tagRender={FilterTagRender}
        getPopupContainer={trigger => trigger.parentNode}
        autoClearSearchValue
        notFoundContent={intl.formatMessage({
          id: 'processTable.selectAssignee.notFound',
        })}
      >
        {options.map(option => (
          <Option value={option.value} key={option.name}>
            <StyledOptionContainer>
              {mode === 'multiple' && (
                <Checkbox checked={active.includes(option.value)} />
              )}
              <StyledOptionTitle title={option.name}>
                {truncateString(option.name, 20)}
              </StyledOptionTitle>
            </StyledOptionContainer>
          </Option>
        ))}
      </StyledSelect>
    </StyledContainer>
  );
};
