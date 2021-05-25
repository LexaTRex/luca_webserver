import React from 'react';
import { useIntl } from 'react-intl';
import moment from 'moment';
import { RedoOutlined } from '@ant-design/icons';

import { Wrapper, Content, Time } from './Update.styled';

export const Update = ({ latestUpdate, cam = true, callback }) => {
  const intl = useIntl();

  return (
    <Wrapper>
      <Content>
        {!cam && intl.formatMessage({ id: 'countdown.info' })}
        <Time>
          {`${intl.formatMessage({ id: 'countdown.text' })} ${moment
            .unix(latestUpdate)
            .format('DD.MM.YYYY HH:mm:ss')}`}
          {!cam && (
            <RedoOutlined
              style={{
                marginLeft: 16,
                fontSize: 20,
                transform: 'rotate(-90deg)',
              }}
              onClick={callback}
            />
          )}
        </Time>
      </Content>
    </Wrapper>
  );
};
