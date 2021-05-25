import React from 'react';
import { Select } from 'antd';

import { useIntl } from 'react-intl';
import {
  StyledContainer,
  StyledOptionTitle,
  StyledOptionContainer,
} from './DurationFilter.styled';

const SelectStyles = {
  marginBottom: 24,
};

const { Option } = Select;

export const ALL_OPTION = 'all';
export const TODAY_OPTION = 'today';
export const LAST_WEEK_OPTION = 'week';

export function DurationFilter({ active = 'today', onChange }) {
  const intl = useIntl();
  const options = [
    {
      value: TODAY_OPTION,
      intl: intl.formatMessage({ id: 'duration.today' }),
    },
    {
      value: LAST_WEEK_OPTION,
      intl: intl.formatMessage({ id: 'duration.week' }),
    },
    {
      intl: intl.formatMessage({ id: 'duration.all' }),
      value: ALL_OPTION,
    },
  ];

  return (
    <StyledContainer>
      <Select
        showArrow
        mode="single"
        value={active}
        showSearch={false}
        className="filter"
        onChange={onChange}
        style={SelectStyles}
        maxTagPlaceholder="..."
        dropdownClassName="filter"
      >
        {options.map(filterOption => {
          return (
            <Option value={filterOption.value} key={filterOption.value}>
              <StyledOptionContainer>
                <StyledOptionTitle>{filterOption.intl}</StyledOptionTitle>
              </StyledOptionContainer>
            </Option>
          );
        })}
      </Select>
    </StyledContainer>
  );
}
