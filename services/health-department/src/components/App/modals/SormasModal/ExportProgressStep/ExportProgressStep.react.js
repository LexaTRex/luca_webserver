import React from 'react';

import { Spin } from 'antd';
import { useIntl } from 'react-intl';
import { LoadingOutlined } from '@ant-design/icons';

import { Headline, SpinnerWrapper } from './ExportProgressStep.styled';

export function ExportProgressStep() {
  const intl = useIntl();

  return (
    <>
      <Headline>
        {intl.formatMessage({ id: 'modal.sormas.exportProgressStep.wait' })}
      </Headline>
      <SpinnerWrapper>
        <Spin indicator={<LoadingOutlined style={{ fontSize: 56 }} spin />} />
      </SpinnerWrapper>
    </>
  );
}
