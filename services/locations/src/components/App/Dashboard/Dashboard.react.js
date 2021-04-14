import React, { useEffect } from 'react';
import { Route, Switch, Redirect, useHistory } from 'react-router';
import { useIntl } from 'react-intl';
import { Layout } from 'antd';

import { useModal } from 'components/hooks/useModal';

import {
  GROUP_ROUTE,
  LOCATION_ROUTE,
  BASE_GROUP_ROUTE,
  AUTHENTICATION_ROUTE,
} from 'constants/routes';

import { RegisterOperatorModal } from 'components/App/modals/RegisterOperatorModal';
import { Location } from './Location';
import { LocationList } from './LocationList';
import { EmptyGroup } from './EmptyGroup';
import { contentStyles, sliderStyles } from './Dashboard.styled';

const { Content, Sider } = Layout;

export const Dashboard = ({ operator }) => {
  const intl = useIntl();
  const history = useHistory();
  const [openModal, closeModal] = useModal();

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
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Layout>
      <Sider style={sliderStyles} width={300}>
        <LocationList />
      </Sider>
      <Layout>
        <Content style={contentStyles}>
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
        </Content>
      </Layout>
    </Layout>
  );
};
