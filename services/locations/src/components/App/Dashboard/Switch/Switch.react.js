import React from 'react';
import { Switch as UISwitch } from 'antd';
import { useIntl } from 'react-intl';
import { StyledContainer, StyledInfo } from './Switch.styled';

export function Switch({ checked, onChange, ...properties }) {
  const intl = useIntl();

  /* eslint-disable react/jsx-props-no-spreading */
  return (
    <StyledContainer>
      <StyledInfo>
        {checked
          ? intl.formatMessage({ id: 'switch.active' })
          : intl.formatMessage({ id: 'switch.inactive' })}
      </StyledInfo>
      <UISwitch
        {...properties}
        checked={checked}
        onChange={(value, event) => {
          // eslint-disable-next-line no-unused-expressions
          onChange && onChange(value, event);
        }}
      />
    </StyledContainer>
  );
}
