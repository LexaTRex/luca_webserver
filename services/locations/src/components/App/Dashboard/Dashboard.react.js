import React, { useEffect } from 'react';

import { Layout } from 'antd';
import { useIntl } from 'react-intl';
import { useQuery } from 'react-query';
import { Redirect, Route, Switch, useHistory } from 'react-router';

import {
  AUTHENTICATION_ROUTE,
  BASE_GROUP_ROUTE,
  GROUP_ROUTE,
  LOCATION_ROUTE,
} from 'constants/routes';
import { getPrivateKeySecret } from 'network/api';
import {
  hasSeenPrivateKeyModal,
  setHasSeenPrivateKeyModal,
} from 'utils/storage';
import { usePrivateKey } from 'utils/privateKey';

import { useModal } from 'components/hooks/useModal';
import { PrivateKeyLoader } from 'components/PrivateKeyLoader';
import { RegisterOperatorModal } from 'components/App/modals/RegisterOperatorModal';

import { Location } from './Location';
import { EmptyGroup } from './EmptyGroup';
import { LocationList } from './LocationList';
import { LinkButton, LocationSider, MainContent } from './Dashboard.styled';

export const Dashboard = ({ operator }) => {
  const intl = useIntl();
  const history = useHistory();
  const [openModal, closeModal] = useModal();
  const { data: privateKeySecret, isLoading: isPrivateKeyLoading } = useQuery(
    'privateKeySecret',
    getPrivateKeySecret
  );

  const [privateKey] = usePrivateKey(privateKeySecret);

  useEffect(() => {
    if (!operator) {
      history.push(AUTHENTICATION_ROUTE);
    }
    if (operator && !operator.publicKey) {
      openModal({
        title: intl.formatMessage({
          id: 'modal.registerOperator.title',
        }),
        content: (
          <RegisterOperatorModal onClose={closeModal} operator={operator} />
        ),
        closable: false,
      });
    } else if (
      !privateKey &&
      !isPrivateKeyLoading &&
      !hasSeenPrivateKeyModal()
    ) {
      setHasSeenPrivateKeyModal(true);
      openModal({
        title: intl.formatMessage({
          id: 'privateKey.modal.title',
        }),
        content: (
          <PrivateKeyLoader
            publicKey={operator.publicKey}
            onSuccess={() => setTimeout(closeModal, 750)}
            footerItem={
              <LinkButton
                type="link"
                onClick={closeModal}
                data-cy="skipPrivateKeyUpload"
              >
                {intl.formatMessage({ id: 'privateKey.modal.skip' })}
              </LinkButton>
            }
          />
        ),
        closable: true,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPrivateKeyLoading]);

  return (
    <Layout>
      <LocationSider width={300}>
        <LocationList />
      </LocationSider>
      <Layout>
        <MainContent>
          <Switch>
            <Route path={LOCATION_ROUTE}>
              <Location />
            </Route>
            <Route path={GROUP_ROUTE}>
              <EmptyGroup />
            </Route>
            <Route path={BASE_GROUP_ROUTE}>
              <EmptyGroup />
            </Route>
            <Redirect to={BASE_GROUP_ROUTE} />
          </Switch>
        </MainContent>
      </Layout>
    </Layout>
  );
};
