import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useIntl } from 'react-intl';
import { push } from 'connected-react-router';
import { Alert } from 'antd';

// Components
import { Header } from 'components/Header';

// Constants
import { LOGIN_ROUTE } from 'constants/routes';

// Api
import { activateAccount } from 'network/api';
import { Main, Wrapper } from './Activation.styled';

const REDIRECT_TIMEOUT = 1000 * 5;

const ActivationRaw = () => {
  const intl = useIntl();
  const noRedirect = new URLSearchParams(useLocation().search).get(
    'noRedirect'
  );
  const { activationId } = useParams();
  const dispatch = useDispatch();

  const [status, setStatus] = useState(null);
  const [remainingTime, setRemainingTime] = useState(5);

  useEffect(() => {
    activateAccount({ activationId, lang: intl.locale })
      .then(response => {
        setStatus(response.status);
        // luca private events shall not redirect to login
        if (noRedirect !== null) {
          setStatus('simple');
          return;
        }
        // luca locations shall redirect to login
        setTimeout(() => {
          dispatch(push(LOGIN_ROUTE));
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
              { id: `activation.alert.${status}` },
              { seconds: remainingTime }
            )}
          />
        )}
      </Wrapper>
    </Main>
  );
};

export const Activation = React.memo(ActivationRaw);
