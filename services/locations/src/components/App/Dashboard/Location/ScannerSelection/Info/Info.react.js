import React from 'react';
import { useIntl } from 'react-intl';
import { Tooltip } from 'antd';

import { Description, InfoComp } from './Info.styled';

export const Info = () => {
  const intl = useIntl();

  return (
    <Description>
      {intl.formatMessage({
        id: 'modal.checkInOptions.description',
      })}
      <Tooltip
        title={intl.formatMessage({
          id: 'modal.checkInOptions.info.tooltip',
        })}
        color="#b8cad3"
        trigger={['hover']}
      >
        <InfoComp>
          {intl.formatMessage({
            id: 'general.information',
          })}
        </InfoComp>
      </Tooltip>
    </Description>
  );
};
