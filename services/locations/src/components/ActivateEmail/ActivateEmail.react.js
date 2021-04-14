import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { push } from 'connected-react-router';
import { Alert } from 'antd';
import { useIntl } from 'react-intl';

import { confirmEmail } from 'network/api';
import { AUTHENTICATION_ROUTE } from 'constants/routes';
import { Header } from 'components/Header';

import { Main, Wrapper } from './ActivateEmail.styled';

const REDIRECT_TIMEOUT = 1000 * 5;

const ActivateEmailRaw = () => {
  const { activationId } = useParams();
  const dispatch = useDispatch();
  const intl = useIntl();

  const [status, setStatus] = useState(null);
  const [remainingTime, setRemainingTime] = useState(5);

  useEffect(() => {
    confirmEmail(activationId)
      .then(response => {
        setStatus(response.status);

        setTimeout(() => {
          dispatch(push(AUTHENTICATION_ROUTE));
        }, REDIRECT_TIMEOUT);

        setInterval(() => {
          setRemainingTime(oldTime => oldTime - 1);
        }, 1000);
      })
      .catch(setStatus);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Main>
      <Header title={intl.formatMessage({ id: 'activation' })} />
      <Wrapper>
        {status && (
          <Alert
            type={status >= 400 ? 'error' : 'success'}
            message={intl.formatMessage(
              {
                id:
                  status >= 400
                    ? `changeMail.alert.${status}`
                    : 'changeMail.alert.200',
              },
              { seconds: remainingTime }
            )}
          />
        )}
      </Wrapper>
    </Main>
  );
};

export const ActivateEmail = React.memo(ActivateEmailRaw);
