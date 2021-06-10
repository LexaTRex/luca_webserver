import React from 'react';
import { Select, Checkbox, Tag } from 'antd';
import { useIntl } from 'react-intl';
import { truncateString } from 'utils/string';

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

function FilterTagRender({ label, closable, onClose }) {
  const onPreventMouseDown = event => {
    event.preventDefault();
    event.stopPropagation();
  };
  return (
    <Tag
      color="#4e6180"
      onMouseDown={onPreventMouseDown}
      closable={closable}
      onClose={onClose}
      style={{ display: 'inline-flex', alignItems: 'center', marginRight: 3 }}
    >
      {label}
    </Tag>
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
      <Select
        showArrow
        value={active}
        onChange={onChange}
        style={SelectStyles}
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
      </Select>
    </StyledContainer>
  );
};
